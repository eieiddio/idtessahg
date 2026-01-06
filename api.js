const express = require('express');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const DOOKIE = process.env.DOOKIE;

app.use(express.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

async function getAnimationId(assetId) {
  try {
    const res = await fetch(`https://assetdelivery.roblox.com/v1/asset/?id=${assetId}`, {
      headers: {
        Cookie: `.ROBLOSECURITY=${DOOKIE}`
      }
    });

    const text = await res.text();

    const match = text.match(/AnimationId.*?rbxassetid:\/\/(\d+)/);
    if (match) return `rbxassetid://${match[1]}`;
    return null;
  } catch (err) {
    console.error('Error fetching asset:', assetId, err);
    return null;
  }
}

app.get('/convert/:assetId', async (req, res) => {
  const assetId = req.params.assetId;
  const result = await getAnimationId(assetId);
  if (result) return res.json({ assetId: result });
  return res.status(404).json({ error: 'AnimationId not found' });
});

app.post('/convert', async (req, res) => {
  const assetId = req.body.assetId || req.body.id;
  if (!assetId) return res.status(400).json({ error: 'missing assetId in body' });
  const result = await getAnimationId(assetId);
  if (result) return res.json({ assetId: result });
  return res.status(404).json({ error: 'AnimationId not found' });
});

app.listen(PORT, () => {
  console.log(`rbx-animation-api listening on port ${PORT}`);
});
