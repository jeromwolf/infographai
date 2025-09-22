#!/usr/bin/env node

const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

// Create meme-style images locally
const memes = [
  {
    id: 'meme-drake',
    name: 'Drake Meme',
    create: (ctx, canvas) => {
      // Background
      ctx.fillStyle = '#f0f0f0';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Top panel (no)
      ctx.fillStyle = '#ffcccc';
      ctx.fillRect(0, 0, canvas.width, canvas.height/2);

      // Bottom panel (yes)
      ctx.fillStyle = '#ccffcc';
      ctx.fillRect(0, canvas.height/2, canvas.width, canvas.height/2);

      // Person on left
      ctx.fillStyle = '#8B4513';
      ctx.beginPath();
      ctx.arc(40, canvas.height/4, 20, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(40, 3*canvas.height/4, 20, 0, Math.PI * 2);
      ctx.fill();

      // Hand gestures
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 3;

      // No gesture (top)
      ctx.beginPath();
      ctx.moveTo(60, canvas.height/4);
      ctx.lineTo(80, canvas.height/4);
      ctx.moveTo(60, canvas.height/4 - 10);
      ctx.lineTo(60, canvas.height/4 + 10);
      ctx.stroke();

      // Yes gesture (bottom)
      ctx.beginPath();
      ctx.moveTo(60, 3*canvas.height/4);
      ctx.lineTo(75, 3*canvas.height/4 - 10);
      ctx.moveTo(75, 3*canvas.height/4 - 10);
      ctx.lineTo(80, 3*canvas.height/4 + 5);
      ctx.stroke();
    }
  },
  {
    id: 'meme-expanding-brain',
    name: 'Expanding Brain',
    create: (ctx, canvas) => {
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw brains getting bigger
      const brainSizes = [15, 25, 35, 45];
      const colors = ['#666', '#888', '#aaa', '#fff'];

      brainSizes.forEach((size, i) => {
        const y = (i + 1) * (canvas.height / 5);

        // Brain
        ctx.fillStyle = colors[i];
        ctx.beginPath();
        ctx.arc(canvas.width/2, y, size, 0, Math.PI * 2);
        ctx.fill();

        // Add some brain texture
        ctx.strokeStyle = colors[i];
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(canvas.width/2 - size/2, y);
        ctx.quadraticCurveTo(canvas.width/2, y - size/3, canvas.width/2 + size/2, y);
        ctx.stroke();

        // Glow effect for larger brains
        if (i > 1) {
          ctx.strokeStyle = colors[i];
          ctx.globalAlpha = 0.3;
          ctx.lineWidth = 10;
          ctx.beginPath();
          ctx.arc(canvas.width/2, y, size + 10, 0, Math.PI * 2);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      });
    }
  },
  {
    id: 'meme-distracted-boyfriend',
    name: 'Distracted Boyfriend',
    create: (ctx, canvas) => {
      ctx.fillStyle = '#87CEEB';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw simplified figures
      // Boyfriend
      ctx.fillStyle = '#4169E1';
      ctx.beginPath();
      ctx.arc(canvas.width/2, canvas.height/2, 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(canvas.width/2 - 10, canvas.height/2 + 15, 20, 30);

      // Current girlfriend
      ctx.fillStyle = '#FF69B4';
      ctx.beginPath();
      ctx.arc(canvas.width/2 - 40, canvas.height/2, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(canvas.width/2 - 48, canvas.height/2 + 12, 16, 25);

      // Other girl
      ctx.fillStyle = '#FF1493';
      ctx.beginPath();
      ctx.arc(canvas.width/2 + 40, canvas.height/2, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(canvas.width/2 + 32, canvas.height/2 + 12, 16, 25);

      // Looking direction
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(canvas.width/2, canvas.height/2);
      ctx.lineTo(canvas.width/2 + 40, canvas.height/2);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  },
  {
    id: 'meme-woman-cat',
    name: 'Woman Yelling at Cat',
    create: (ctx, canvas) => {
      ctx.fillStyle = '#f5f5f5';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Divider
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(canvas.width/2, 0);
      ctx.lineTo(canvas.width/2, canvas.height);
      ctx.stroke();

      // Woman (left side)
      ctx.fillStyle = '#FFB6C1';
      ctx.beginPath();
      ctx.arc(canvas.width/4, canvas.height/2, 20, 0, Math.PI * 2);
      ctx.fill();

      // Mouth open
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.arc(canvas.width/4, canvas.height/2 + 5, 8, 0, Math.PI);
      ctx.fill();

      // Pointing
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(canvas.width/4 + 20, canvas.height/2);
      ctx.lineTo(canvas.width/2 - 10, canvas.height/2);
      ctx.stroke();

      // Cat (right side)
      ctx.fillStyle = '#FFA500';
      ctx.beginPath();
      ctx.arc(3*canvas.width/4, canvas.height/2, 18, 0, Math.PI * 2);
      ctx.fill();

      // Cat ears
      ctx.beginPath();
      ctx.moveTo(3*canvas.width/4 - 15, canvas.height/2 - 15);
      ctx.lineTo(3*canvas.width/4 - 10, canvas.height/2 - 25);
      ctx.lineTo(3*canvas.width/4 - 5, canvas.height/2 - 15);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(3*canvas.width/4 + 5, canvas.height/2 - 15);
      ctx.lineTo(3*canvas.width/4 + 10, canvas.height/2 - 25);
      ctx.lineTo(3*canvas.width/4 + 15, canvas.height/2 - 15);
      ctx.fill();

      // Confused cat expression
      ctx.fillStyle = '#000';
      ctx.fillRect(3*canvas.width/4 - 5, canvas.height/2 + 5, 10, 2);
    }
  },
  {
    id: 'meme-this-is-fine',
    name: 'This Is Fine',
    create: (ctx, canvas) => {
      // Fire background
      ctx.fillStyle = '#FF4500';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Flames
      ctx.fillStyle = '#FFD700';
      for (let i = 0; i < 5; i++) {
        const x = i * (canvas.width / 5) + 20;
        ctx.beginPath();
        ctx.moveTo(x, canvas.height);
        ctx.quadraticCurveTo(x - 10, canvas.height - 30, x, canvas.height - 50);
        ctx.quadraticCurveTo(x + 10, canvas.height - 30, x, canvas.height);
        ctx.fill();
      }

      // Dog figure
      ctx.fillStyle = '#F4A460';
      ctx.beginPath();
      ctx.arc(canvas.width/2, canvas.height/2, 20, 0, Math.PI * 2);
      ctx.fill();

      // Dog ears
      ctx.beginPath();
      ctx.ellipse(canvas.width/2 - 15, canvas.height/2 - 15, 8, 12, -0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(canvas.width/2 + 15, canvas.height/2 - 15, 8, 12, 0.5, 0, Math.PI * 2);
      ctx.fill();

      // Smile
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(canvas.width/2, canvas.height/2 + 5, 10, 0, Math.PI);
      ctx.stroke();

      // Text
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('THIS IS FINE', canvas.width/2, canvas.height - 20);
    }
  },
  {
    id: 'meme-surprised-pikachu',
    name: 'Surprised Pikachu',
    create: (ctx, canvas) => {
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Pikachu body
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.ellipse(canvas.width/2, canvas.height/2, 35, 40, 0, 0, Math.PI * 2);
      ctx.fill();

      // Ears
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.moveTo(canvas.width/2 - 25, canvas.height/2 - 30);
      ctx.lineTo(canvas.width/2 - 20, canvas.height/2 - 50);
      ctx.lineTo(canvas.width/2 - 15, canvas.height/2 - 30);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(canvas.width/2 + 15, canvas.height/2 - 30);
      ctx.lineTo(canvas.width/2 + 20, canvas.height/2 - 50);
      ctx.lineTo(canvas.width/2 + 25, canvas.height/2 - 30);
      ctx.fill();

      // Black ear tips
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.moveTo(canvas.width/2 - 20, canvas.height/2 - 50);
      ctx.lineTo(canvas.width/2 - 18, canvas.height/2 - 45);
      ctx.lineTo(canvas.width/2 - 22, canvas.height/2 - 45);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(canvas.width/2 + 20, canvas.height/2 - 50);
      ctx.lineTo(canvas.width/2 + 18, canvas.height/2 - 45);
      ctx.lineTo(canvas.width/2 + 22, canvas.height/2 - 45);
      ctx.fill();

      // Eyes
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.arc(canvas.width/2 - 12, canvas.height/2 - 5, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(canvas.width/2 + 12, canvas.height/2 - 5, 4, 0, Math.PI * 2);
      ctx.fill();

      // Surprised mouth
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(canvas.width/2, canvas.height/2 + 15, 8, 12, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Red cheeks
      ctx.fillStyle = '#FF69B4';
      ctx.globalAlpha = 0.6;
      ctx.beginPath();
      ctx.arc(canvas.width/2 - 25, canvas.height/2 + 5, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(canvas.width/2 + 25, canvas.height/2 + 5, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }
];

function createMemeAssets() {
  const results = [];

  console.log('Creating meme assets...');

  memes.forEach(meme => {
    const canvas = createCanvas(200, 200);
    const ctx = canvas.getContext('2d');

    // Create the meme
    meme.create(ctx, canvas);

    // Convert to base64
    const dataUri = canvas.toDataURL();

    results.push({
      id: meme.id,
      name: meme.name,
      type: 'image',
      path: dataUri
    });

    console.log(`✅ Created ${meme.name}`);
  });

  // Save the assets
  const outputPath = path.join(__dirname, '../data/meme-assets.json');
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));

  console.log(`\n✅ Created ${results.length} meme assets`);
  console.log(`📁 Saved to: ${outputPath}`);

  // Also generate the code to add to AssetsLibrary
  console.log('\n📋 Add this to AssetsLibrary.tsx:\n');
  results.forEach(meme => {
    console.log(`{ id: '${meme.id}', name: '${meme.name}', type: 'image', path: '${meme.path.substring(0, 50)}...' },`);
  });
}

createMemeAssets();