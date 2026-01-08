[![Discord](https://img.shields.io/discord/1365632860756901909?label=discord&logo=discord&color=5865F2)](https://discord.gg/z5t5fHQvG)

## rbx-catalogid-to-assetid

A small API that converts Roblox **catalog IDs** into real
`rbxassetid://` animation IDs.

Basically, you give it a catalog ID and it grabs the actual animation
asset ID from Roblox’s asset delivery.

---

## Endpoints

### GET /convert/:assetId
Returns:
```json
{ "assetId": "rbxassetid://123" }

Returns 404 if the animation ID can’t be found.
```

## Example Code

```lua
-- uses syn.request so it works in executors
local API_URL = "https://idtessahg.vercel.app/api/convert/"
local HttpService = game:GetService("HttpService")

local function converttoassetid(toconvert)
    local res = request({
        Url = API_URL .. tostring(toconvert),
        Method = "GET"
    })

    if not res or not res.Body then
        warn("Request failed")
        return nil
    end

    local data = HttpService:JSONDecode(res.Body)
    return data.assetId
end

-- example catalog page:
-- https://www.roblox.com/catalog/104525707242142/Flying-Ghost-Halloween

local assetId = converttoassetid(104525707242142)
print(assetId)
```
