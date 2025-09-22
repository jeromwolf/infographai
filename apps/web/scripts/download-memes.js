#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');

// Popular meme templates with their URLs
const memeTemplates = [
  {
    id: 'meme-drake',
    name: 'Drake Meme',
    url: 'https://i.imgflip.com/30b1gx.jpg'
  },
  {
    id: 'meme-distracted',
    name: 'Distracted Boyfriend',
    url: 'https://i.imgflip.com/1ur9b0.jpg'
  },
  {
    id: 'meme-this-is-fine',
    name: 'This Is Fine',
    url: 'https://i.imgflip.com/wxica.jpg'
  },
  {
    id: 'meme-woman-cat',
    name: 'Woman Yelling at Cat',
    url: 'https://i.imgflip.com/345v97.jpg'
  },
  {
    id: 'meme-expanding-brain',
    name: 'Expanding Brain',
    url: 'https://i.imgflip.com/1jwhww.jpg'
  },
  {
    id: 'meme-batman-slap',
    name: 'Batman Slapping Robin',
    url: 'https://i.imgflip.com/9ehk.jpg'
  },
  {
    id: 'meme-two-buttons',
    name: 'Two Buttons',
    url: 'https://i.imgflip.com/1g8my4.jpg'
  },
  {
    id: 'meme-success-kid',
    name: 'Success Kid',
    url: 'https://i.imgflip.com/1bhk.jpg'
  },
  {
    id: 'meme-surprised-pikachu',
    name: 'Surprised Pikachu',
    url: 'https://i.imgflip.com/2kbn1e.jpg'
  },
  {
    id: 'meme-stonks',
    name: 'Stonks',
    url: 'https://i.imgflip.com/3si4.jpg'
  },
  {
    id: 'meme-always-has-been',
    name: 'Always Has Been',
    url: 'https://i.imgflip.com/46e43q.jpg'
  },
  {
    id: 'meme-is-this',
    name: 'Is This A Pigeon',
    url: 'https://i.imgflip.com/1o00in.jpg'
  }
];

async function downloadImage(url, id) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    https.get(url, (response) => {
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', () => {
        const buffer = Buffer.concat(chunks);
        const base64 = buffer.toString('base64');
        const dataUri = `data:image/jpeg;base64,${base64}`;
        resolve({ id, dataUri });
      });
      response.on('error', reject);
    }).on('error', reject);
  });
}

async function downloadAllMemes() {
  console.log('Downloading meme templates...');
  const results = [];

  for (const meme of memeTemplates) {
    try {
      console.log(`Downloading ${meme.name}...`);
      const result = await downloadImage(meme.url, meme.id);
      results.push({
        id: meme.id,
        name: meme.name,
        dataUri: result.dataUri.substring(0, 100) + '...' // Truncate for display
      });
      console.log(`✅ Downloaded ${meme.name}`);
    } catch (error) {
      console.error(`❌ Failed to download ${meme.name}:`, error.message);
    }
  }

  // Save results to file
  const outputPath = path.join(__dirname, '../data/meme-base64.json');
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));

  console.log(`\n✅ Downloaded ${results.length} meme templates`);
  console.log(`📁 Saved to: ${outputPath}`);
}

downloadAllMemes().catch(console.error);