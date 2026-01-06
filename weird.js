const fs = require("fs");
const fetch = require("node-fetch");

const CHIPS = process.env.DOOKIE;

async function getAnimationId(assetId) {
  try {
    const res = await fetch(`https://assetdelivery.roblox.com/v1/asset/?id=${assetId}`, {
      headers: {
        // This tells Roblox we are a logged-in user
        Cookie: `.ROBLOSECURITY=${CHIPS}`
      }
    });

    const text = await res.text();


    console.log(`--- Response for Asset ID: ${assetId} ---`);
    console.log(text);
    console.log(`------------------------------------------`);

    const match = text.match(/AnimationId.*?rbxassetid:\/\/(\d+)/);
    if (match) return `rbxassetid://${match[1]}`;
    return null;
  } catch (err) {
    console.error("Error fetching asset:", assetId, err);
    return null;
  }
}
