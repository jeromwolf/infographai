#!/usr/bin/env node

// Script to auto-center all templates in the 1920x1080 canvas
const fs = require('fs');
const path = require('path');

const CANVAS_WIDTH = 1920;
const CANVAS_HEIGHT = 1080;

function analyzeBounds(commands) {
  let minX = Infinity, minY = Infinity;
  let maxX = -Infinity, maxY = -Infinity;

  commands.forEach(cmd => {
    if (!cmd || cmd.type === 'clear' || cmd.type === 'wait' || cmd.type === 'parallel') return;

    // Handle parallel commands
    if (cmd.type === 'parallel' && cmd.commands) {
      const parallelBounds = analyzeBounds(cmd.commands);
      minX = Math.min(minX, parallelBounds.minX);
      minY = Math.min(minY, parallelBounds.minY);
      maxX = Math.max(maxX, parallelBounds.maxX);
      maxY = Math.max(maxY, parallelBounds.maxY);
      return;
    }

    // Calculate bounds for different command types
    if (cmd.x !== undefined && cmd.y !== undefined) {
      let leftX = cmd.x;
      let rightX = cmd.x;
      let topY = cmd.y;
      let bottomY = cmd.y;

      if (cmd.type === 'rect') {
        rightX = cmd.x + (cmd.width || 0);
        bottomY = cmd.y + (cmd.height || 0);
      } else if (cmd.type === 'circle') {
        const radius = cmd.radius || 0;
        leftX = cmd.x - radius;
        rightX = cmd.x + radius;
        topY = cmd.y - radius;
        bottomY = cmd.y + radius;
      } else if (cmd.type === 'text') {
        // Estimate text width (rough approximation)
        const textWidth = (cmd.text?.length || 0) * (cmd.size || 20) * 0.6;
        leftX = cmd.x - textWidth / 2;
        rightX = cmd.x + textWidth / 2;
        topY = cmd.y - (cmd.size || 20) / 2;
        bottomY = cmd.y + (cmd.size || 20) / 2;
      } else if (cmd.type === 'highlight') {
        rightX = cmd.x + (cmd.width || 0);
        bottomY = cmd.y + (cmd.height || 0);
      }

      minX = Math.min(minX, leftX);
      minY = Math.min(minY, topY);
      maxX = Math.max(maxX, rightX);
      maxY = Math.max(maxY, bottomY);
    }

    // Handle line and arrow commands
    if (cmd.x1 !== undefined && cmd.y1 !== undefined) {
      minX = Math.min(minX, cmd.x1, cmd.x2 || cmd.x1);
      minY = Math.min(minY, cmd.y1, cmd.y2 || cmd.y1);
      maxX = Math.max(maxX, cmd.x1, cmd.x2 || cmd.x1);
      maxY = Math.max(maxY, cmd.y1, cmd.y2 || cmd.y1);
    }

    // Handle path commands
    if (cmd.type === 'path' && cmd.points) {
      cmd.points.forEach(point => {
        minX = Math.min(minX, point.x);
        minY = Math.min(minY, point.y);
        maxX = Math.max(maxX, point.x);
        maxY = Math.max(maxY, point.y);
      });
    }
  });

  return {
    minX: minX === Infinity ? 0 : minX,
    minY: minY === Infinity ? 0 : minY,
    maxX: maxX === -Infinity ? CANVAS_WIDTH : maxX,
    maxY: maxY === -Infinity ? CANVAS_HEIGHT : maxY,
    width: maxX - minX,
    height: maxY - minY,
    centerX: (minX + maxX) / 2,
    centerY: (minY + maxY) / 2
  };
}

function centerCommands(commands) {
  const bounds = analyzeBounds(commands);

  // Calculate offset to center the content
  const targetCenterX = CANVAS_WIDTH / 2;
  const targetCenterY = CANVAS_HEIGHT / 2;
  const offsetX = targetCenterX - bounds.centerX;
  const offsetY = targetCenterY - bounds.centerY;

  console.log(`  Bounds: ${Math.round(bounds.width)}x${Math.round(bounds.height)}`);
  console.log(`  Current center: (${Math.round(bounds.centerX)}, ${Math.round(bounds.centerY)})`);
  console.log(`  Offset: (${Math.round(offsetX)}, ${Math.round(offsetY)})`);

  // Apply offset to all commands
  return commands.map(cmd => {
    const newCmd = { ...cmd };

    // Handle parallel commands recursively
    if (cmd.type === 'parallel' && cmd.commands) {
      // For parallel commands, apply the same offset (don't recalculate)
      newCmd.commands = cmd.commands.map(subCmd => applyOffset(subCmd, offsetX, offsetY));
      return newCmd;
    }

    return applyOffset(newCmd, offsetX, offsetY);
  });
}

function applyOffset(cmd, offsetX, offsetY) {
  const newCmd = { ...cmd };

  // Apply offset to x,y coordinates
  if (cmd.x !== undefined && cmd.y !== undefined) {
    newCmd.x = Math.round(cmd.x + offsetX);
    newCmd.y = Math.round(cmd.y + offsetY);
  }

  // Apply offset to line/arrow coordinates
  if (cmd.x1 !== undefined && cmd.y1 !== undefined) {
    newCmd.x1 = Math.round(cmd.x1 + offsetX);
    newCmd.y1 = Math.round(cmd.y1 + offsetY);
  }
  if (cmd.x2 !== undefined && cmd.y2 !== undefined) {
    newCmd.x2 = Math.round(cmd.x2 + offsetX);
    newCmd.y2 = Math.round(cmd.y2 + offsetY);
  }

  // Apply offset to path points
  if (cmd.type === 'path' && cmd.points) {
    newCmd.points = cmd.points.map(point => ({
      x: Math.round(point.x + offsetX),
      y: Math.round(point.y + offsetY)
    }));
  }

  return newCmd;
}

// Read the template file
const templatePath = path.join(__dirname, '../apps/web/lib/preset-templates.ts');
const templateContent = fs.readFileSync(templatePath, 'utf-8');

// Parse templates
const templateRegex = /{\s*name:\s*['"`]([^'"`]+)['"`],[\s\S]*?commands:\s*\[([\s\S]*?)\](?:\s*}\s*,|\s*}\s*\])/g;
let match;
let updatedContent = templateContent;
let processedCount = 0;

console.log('Starting template centering process...\n');

// Process each template
const matches = [...templateContent.matchAll(templateRegex)];

matches.forEach((match) => {
  const templateName = match[1];
  const commandsStr = match[2];

  console.log(`Processing: ${templateName}`);

  try {
    // Remove comments first
    let cleanStr = commandsStr.replace(/\/\/[^\n]*/g, '');

    // Convert TypeScript syntax to valid JSON for parsing
    const jsonStr = cleanStr
      .replace(/type:\s*'([^']+)'/g, '"type": "$1"')
      .replace(/text:\s*'([^']+)'/g, '"text": "$1"')
      .replace(/x:\s*(-?\d+)/g, '"x": $1')
      .replace(/y:\s*(-?\d+)/g, '"y": $1')
      .replace(/x1:\s*(-?\d+)/g, '"x1": $1')
      .replace(/y1:\s*(-?\d+)/g, '"y1": $1')
      .replace(/x2:\s*(-?\d+)/g, '"x2": $1')
      .replace(/y2:\s*(-?\d+)/g, '"y2": $1')
      .replace(/width:\s*(-?\d+)/g, '"width": $1')
      .replace(/height:\s*(-?\d+)/g, '"height": $1')
      .replace(/radius:\s*(-?\d+)/g, '"radius": $1')
      .replace(/size:\s*(-?\d+)/g, '"size": $1')
      .replace(/duration:\s*(-?\d+)/g, '"duration": $1')
      .replace(/color:\s*'([^']+)'/g, '"color": "$1"')
      .replace(/filled:\s*(true|false)/g, '"filled": $1')
      .replace(/closed:\s*(true|false)/g, '"closed": $1')
      .replace(/points:\s*\[/g, '"points": [')
      .replace(/commands:\s*\[/g, '"commands": [')
      .replace(/}\s*,\s*{/g, '}, {')
      .replace(/,(\s*[\]}])/g, '$1')  // Remove trailing commas
      .trim();

    const commands = JSON.parse(`[${jsonStr}]`);
    const centeredCommands = centerCommands(commands);

    // Convert back to TypeScript syntax
    const newCommandsStr = JSON.stringify(centeredCommands, null, 2)
      .replace(/"type":\s*"([^"]+)"/g, "type: '$1'")
      .replace(/"text":\s*"([^"]+)"/g, "text: '$1'")
      .replace(/"x":\s*(-?\d+)/g, 'x: $1')
      .replace(/"y":\s*(-?\d+)/g, 'y: $1')
      .replace(/"x1":\s*(-?\d+)/g, 'x1: $1')
      .replace(/"y1":\s*(-?\d+)/g, 'y1: $1')
      .replace(/"x2":\s*(-?\d+)/g, 'x2: $1')
      .replace(/"y2":\s*(-?\d+)/g, 'y2: $1')
      .replace(/"width":\s*(-?\d+)/g, 'width: $1')
      .replace(/"height":\s*(-?\d+)/g, 'height: $1')
      .replace(/"radius":\s*(-?\d+)/g, 'radius: $1')
      .replace(/"size":\s*(-?\d+)/g, 'size: $1')
      .replace(/"duration":\s*(-?\d+)/g, 'duration: $1')
      .replace(/"color":\s*"([^"]+)"/g, "color: '$1'")
      .replace(/"filled":\s*(true|false)/g, 'filled: $1')
      .replace(/"closed":\s*(true|false)/g, 'closed: $1')
      .replace(/"points":\s*\[/g, 'points: [')
      .replace(/"commands":\s*\[/g, 'commands: [')
      .replace(/\n/g, '\n      ')
      .replace(/^\s*\[/, '')
      .replace(/\]\s*$/, '');

    // Replace in the content
    const originalMatch = match[0];
    const newMatch = originalMatch.replace(commandsStr, '\n      ' + newCommandsStr + '\n    ');
    updatedContent = updatedContent.replace(originalMatch, newMatch);

    processedCount++;
    console.log(`  ✓ Centered successfully\n`);

  } catch (error) {
    console.log(`  ✗ Error processing template: ${error.message}\n`);
  }
});

// Write the updated content back
fs.writeFileSync(templatePath, updatedContent);

console.log(`\nComplete! Processed ${processedCount} templates.`);
console.log('All templates have been auto-centered to 960x540 (canvas center).');