# Deployment Guide (Render)

This guide explains how to deploy the **ShareBoard Server** to Render (Free Tier).

## 1. Production Behavior
When running in production logic changes slightly:

*   **Port binding**: The app will bind to the port assigned by Render (via `process.env.PORT`), not 4000.
*   **Database**: It will connect to the Production MongoDB Atlas instance (provided via `MONGO_URI` env var).
*   **Logs**: `console.log` statements appear in the Render Dashboard logs.
*   **CORS**: Currently configured to allow ALL origins (`app.use(cors())`). This means your Expo app can talk to it from your phone, emulator, or anywhere.

## 2. Prerequisites
1.  **GitHub Repo**: Your code must be pushed to a GitHub repository.
2.  **Render Account**: Create one at [render.com](https://render.com).
3.  **MongoDB Atlas**: Have your connection string ready (the one you use in `.env`).

## 3. Step-by-Step Deployment

1.  **New Web Service**:
    *   Go to Render Dashboard -> New -> Web Service.
    *   Connect your GitHub repository.

2.  **Configuration**:
    *   **Name**: `shareboard-server` (or similar).
    *   **Region**: Choose closest to you (e.g., Singapore, Frankfurt).
    *   **Branch**: `main` (or your working branch).
    *   **Root Directory**: `server` (IMPORTANT: The backend is in a subfolder).
    *   **Runtime**: `Node`.
    *   **Build Command**: `npm install && npm run build`
        *   *Explanation*: Installs dependencies and runs `tsc` to compile TypeScript to JavaScript in `dist/`.
    *   **Start Command**: `npm start`
        *   *Explanation*: runs `node dist/index.js`.

3.  **Environment Variables** (Advanced):
    *   Scroll down to "Environment Variables".
    *   Add Key: `MONGO_URI`
    *   Value: `mongodb+srv://...` (Paste your full connection string).
    *   *Note*: `PORT` is added automatically by Render.

4.  **Deploy**:
    *   Click "Create Web Service".
    *   Wait for the build to finish. You should see "Server running on port 10000" (or similar) in the logs.

## 4. Updates & Maintenance

*   **Auto-Deploy**: Every time you push to your GitHub branch, Render will automatically rebuild and deploy.
*   **Node Version**: We have set `"engines": { "node": ">=18" }` in `package.json` to ensure Render uses a compatible Node version.

## 5. Potential Issues & Fixes

*   **"Build Failed"**: Check if `tsc` (TypeScript Compiler) threw errors. Run `npm run build` locally to verify before pushing.
*   **"Connection Error" (Mongo)**: Ensure your MongoDB Atlas IP Access List is set to "Allow Access from Anywhere" (0.0.0.0/0) since Render IPs change dynamically.

## 6. Connecting the Frontend

Once your server is live (e.g., `https://shareboard-xyz.onrender.com`), you need to tell the App to use it.

1.  Create a file named `.env` in the `app/` folder (same level as `package.json`).
2.  Add the following line:
    ```
    EXPO_PUBLIC_API_URL=https://shareboard-xyz.onrender.com
    ```
    *(Note: Do not add a trailing slash)*

3.  Restart your Expo app (`npx expo start -c`).
    *   *Why `-c`?* to clear the cache so it picks up the new `.env` file.

You are now connected to the production server! 🚀
