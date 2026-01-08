# rbx-catalogid-to-assetid

Small API that wraps Roblox asset delivery responses and extracts an `rbxassetid://` animation id.

Endpoints

- `GET /convert/:assetId` - returns `{ "assetId": "rbxassetid://..." }` or 404.
- `POST /convert` - body `{ "assetId": "12345" }` returns same.


```lua
-- i used syn.request so it work for exploits
local API_URL = "https://idtessahg.vercel.app/api/convert/"

local function converttoassetid(toconvert)
    local res = request({
        Url = API_URL .. tostring(toconvert),
        Method = "GET"
    })

    if not res or not res.Body then
        warn("Request failed")
        return nil
    end

    local data = game:GetService("HttpService"):JSONDecode(res.Body)
    return data.assetId
end

--https://www.roblox.com/catalog/104525707242142/Flying-Ghost-Halloween
-- we gonna get the catalogid and put it on the toconvert
local toconvert = converttoassetid(104525707242142)
print(toconvert)
```

The Api must return valid json
`{ "assetId": "rbxassetid://123" }`
