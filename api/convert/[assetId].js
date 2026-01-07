const fetch = require("node-fetch");

// Simple in-memory cache
const CACHE = new Map();
const DEFAULT_TTL = 5 * 60 * 1000;
const NEGATIVE_TTL = 60 * 1000;
const MAX_CACHE = 1000;

function getCached(key) {
  const entry = CACHE.get(key);
  if (!entry) return null;
  if (entry.expires < Date.now()) {
    CACHE.delete(key);
    return null;
  }
  return entry.value;
}

function setCached(key, value, ttl = DEFAULT_TTL) {
  if (CACHE.size >= MAX_CACHE && !CACHE.has(key)) {
    const firstKey = CACHE.keys().next().value;
    if (firstKey) CACHE.delete(firstKey);
  }
  CACHE.set(key, { value, expires: Date.now() + ttl });
}

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  const DOOKIE = process.env.DOOKIE;

  let assetId = req.query && req.query.assetId;
  if (!assetId && req.method === "POST") {
    assetId = (req.body && (req.body.assetId || req.body.id)) || null;
  }

  if (!assetId) {
    return res.status(400).json({ error: "missing assetId" });
  }

  const cached = getCached(assetId);
  if (cached !== null) {
    return res.json({ assetId: cached });
  }

  try {
    const r = await fetch(
      `https://assetdelivery.roblox.com/v1/asset/?id=${assetId}`,
      {
        headers: {
          Cookie: `.ROBLOSECURITY=${DOOKIE}`,
          Accept: "application/xml",
          "User-Agent": "Roblox/WinInet",
          "Roblox-Browser-Asset-Request": "true"
        }
      }
    );

    if (!r.ok) {
      setCached(assetId, null, NEGATIVE_TTL);
      return res.status(r.status).json({ error: "asset fetch failed" });
    }

    const text = await r.text();

    const match = text.match(/(?:rbxassetid:\/\/|asset\/\?id=)(\d+)/i);

    if (match) {
      const result = `rbxassetid://${match[1]}`;
      setCached(assetId, result, DEFAULT_TTL);
      return res.json({ assetId: result });
    }

    setCached(assetId, null, NEGATIVE_TTL);
    return res.status(404).json({ error: "AnimationId not found" });
  } catch (err) {
    console.error("Error fetching asset:", assetId, err);
    return res.status(500).json({ error: "fetch error" });
  }
};
