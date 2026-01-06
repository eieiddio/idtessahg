# rbx-animation-api

Small API that wraps Roblox asset delivery responses and extracts an `rbxassetid://` animation id.

Setup

1. Copy your Roblox .ROBLOSECURITY cookie into an `.env` file as `DOOKIE`.

```
DOOKIE=your_roblosecurity_cookie_here
PORT=3000
```

2. Install dependencies and run:

```bash
npm install
npm start
```

Endpoints

- `GET /convert/:assetId` - returns `{ "assetId": "rbxassetid://..." }` or 404.
- `POST /convert` - body `{ "assetId": "12345" }` returns same.

Luau usage example

Use this from Roblox with `HttpService` (ensure `HttpEnabled` and the URL are allowed):

```lua
local HttpService = game:GetService("HttpService")

local API_URL = "http://your-server.example/convert/"

local function converttoassetid(toconvert)
    local url = API_URL .. tostring(toconvert)
    local success, res = pcall(function()
        return HttpService:GetAsync(url)
    end)
    if not success then
        warn("HTTP failed:", res)
        return nil
    end
    local data = HttpService:JSONDecode(res)
    return data.assetId
end

-- Example
local id = converttoassetid(12345678)
print(id)
```

Security note: storing `.ROBLOSECURITY` tokens is sensitive — keep the server private and secure.

Vercel deployment

You can deploy this as a serverless function on Vercel. Add the file `api/convert/[assetId].js` (already included) and set the `DOOKIE` environment variable in your Vercel project settings.

Steps:

1. Push this repo to a Git provider (GitHub/GitLab).
2. Import the repo into Vercel and enable builds.
3. In Vercel dashboard set `DOOKIE` as a Project Environment Variable (do NOT commit this value).
4. After deployment your function will be available at `https://<your-project>.vercel.app/api/convert/<assetId>`.

Luau example (HTTPS)

Replace `API_URL` with your Vercel URL:

```lua
local API_URL = "https://<your-project>.vercel.app/api/convert/"

local function converttoassetid(toconvert)
    local HttpService = game:GetService("HttpService")
    local success, res = pcall(function()
        return HttpService:GetAsync(API_URL .. tostring(toconvert))
    end)
    if not success then
        warn("HTTP failed:", res)
        return nil
    end
    local data = HttpService:JSONDecode(res)
    return data.assetId
end
```

Notes:
- Vercel functions have execution time limits. Add caching or rate-limiting if you expect many requests.
- Keep `DOOKIE` private and avoid exposing this API publicly without protections.
