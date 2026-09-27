# Ali Cool Point Mobile App & Backend

A comprehensive HVAC, maintenance, and renovation management app with Admin, Technician, and Customer panels.

## Tech Stack
- **Frontend:** React Native (Expo), React Navigation
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas
- **Authentication:** JWT & Google OAuth 2.0 Native Sign-In
- **Notifications:** Expo Push Notifications

## Project layout

```
server/   Express API (MongoDB Atlas + JWT + Google sign-in verification)
app/      Expo React Native app (customer / technician / admin)
```

---

## Backend setup (local)

```bash
cd server
npm install
cp .env.example .env      # then fill in real values
npm run seed              # creates the admin account + starter services
npm run dev               # → http://localhost:5000
```

Check it is alive:

```bash
curl http://localhost:5000/health
# {"status":"ok","database":"connected",...}
```

### Required environment variables (`server/.env`)

| Key | Notes |
| --- | --- |
| `PORT` | `5000` locally. Render injects its own value - never hard-code it. |
| `MONGODB_URI` | Atlas connection string, database name `acp_app`. |
| `JWT_SECRET` | Long random string. **The API cannot sign tokens without it.** |
| `GOOGLE_CLIENT_ID` | The Google OAuth **Web** client ID used to verify ID tokens. |
| `CORS_ORIGIN` | `*` (default) or a comma separated allow-list. |
| `ADMIN_NAME` / `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Used by `npm run seed`. |
| `ADMIN_RESET_PASSWORD` | `true` makes `npm run seed` overwrite the existing admin's password (recovery); otherwise it is left untouched. |

---

## MongoDB Atlas - "could not connect to any servers" / not whitelisted

This is the single most common cause of **`server is not reachable`** in the app,
and of this deploy log line:

```
Error connecting to MongoDB Atlas: Could not connect to any servers in your
MongoDB Atlas cluster ... your current IP address is on your Atlas cluster's IP whitelist
```

It is a **dashboard setting, not a code problem**:

1. Open <https://cloud.mongodb.com> → your project → **Network Access** (left menu).
2. **Add IP Address**:
   - **Local development:** click *Add Current IP Address* (repeat whenever your
     ISP changes your public IP - a mobile hotspot changes it constantly).
   - **Render:** the free plan has no static outbound IP, so add
     **`0.0.0.0/0`** ("Allow access from anywhere"). On a paid plan you can use
     Render's static outbound IPs instead.
3. Wait for the entry to show **Active** (~1 minute), then restart the server /
   redeploy.

The backend now retries Atlas with backoff and keeps the HTTP server online, so
a whitelist problem shows up as clear log lines instead of a crashed process.

---

## Deploying the backend to Render

| Setting | Value |
| --- | --- |
| Root directory | `server` |
| Build command | `npm install` |
| Start command | `npm start` |
| Health check path | `/health` (optional) |

Environment variables (Render dashboard → your service → *Environment*):

```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=<long random string>
NODE_ENV=production
GOOGLE_CLIENT_ID=<google web client id>
CORS_ORIGIN=*
```

Do **not** set `PORT` yourself - Render provides it and `server.js` reads it.

After the first deploy, verify: `https://<your-service>.onrender.com/health`
must return `{"status":"ok","database":"connected"}`. If `database` says
`connecting`/`disconnected`, the Atlas IP access list is almost always the cause.

---

## Pointing the app at the right server

Expo inlines `EXPO_PUBLIC_*` variables **at build time**, so changing them
requires a new build (hot reload alone will not pick them up).

`app/.env`:

```bash
# Local development (same Wi-Fi as your PC):
EXPO_PUBLIC_API_URL=http://192.168.1.10:5000/api

# Real builds - use the deployed API:
EXPO_PUBLIC_API_URL=https://<your-service>.onrender.com/api
```

Local dev checklist when the app says **"Server is not reachable"**:

1. The backend is running (`npm run dev` inside `server/`) and
   `http://localhost:5000/health` responds on your PC.
2. `EXPO_PUBLIC_API_URL` uses your PC's **LAN IP**, not `localhost`
   (find it with `ipconfig` in Git Bash) - a phone cannot reach `localhost`.
3. Phone and PC are on the **same Wi-Fi** (not a guest network / mobile data).
4. Windows Firewall allows inbound TCP on port 5000:
   ```bash
   # Run in an Administrator PowerShell once:
   New-NetFirewallRule -DisplayName "ACP API 5000" -Direction Inbound -LocalPort 5000 -Protocol TCP -Action Allow
   ```
5. Android emulators reach the host through `http://10.0.2.2:5000/api` instead.

---

## Building the app

```bash
cd app
npm install
npx expo run:android          # local debug build
npx eas build -p android --profile preview   # shareable APK
```

For **Google Sign-In** to work, the Google Cloud OAuth *Android* client must use
the package name `com.bhattibhi71.app` and the SHA-1 of the keystore that signed
the build - otherwise Google returns no `idToken` and sign-in fails before the
API is even called.
