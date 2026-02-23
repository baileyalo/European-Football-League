# Netlify Deployment Guide

## 🚀 Deployment Setup Complete!

Your European Football League app is now ready for Netlify deployment.

### 🔧 Netlify Settings:

#### **Build Settings:**
- **Build Command:** `npm run build`
- **Publish Directory:** `build`
- **Node Version:** `18.x` (recommended)

#### **Environment Variables (in Netlify Dashboard):**
Add these in Site Settings > Environment Variables:

**Required for Netlify functions (standings, team detail, top scorers):**
- `FOOTBALL_API_TOKEN` – Your [Football Data API](https://www.football-data.org/) token
- `FOOTBALL_API_URL` – Optional; default is `https://api.football-data.org/v4`

**Optional (app display):**
- `REACT_APP_APP_NAME` – e.g. European Football League
- `REACT_APP_CURRENT_SEASON` – e.g. 2024

### 📋 Deployment Steps:

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "deployment"
   git push origin main
   ```

2. **Connect to Netlify:**
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub repository
   - Select the `my-app` folder as the base directory

3. **Configure Build Settings:**
   - Base directory: `my-app`
   - Build command: `npm run build`
   - Publish directory: `build`

4. **Add Environment Variables:**
   - Go to Site Settings > Environment Variables
   - Add the variables listed above (at least `FOOTBALL_API_TOKEN` for standings, team detail, and top scorers)

5. **Deploy:**
   - Click "Deploy site"
   - Wait for build to complete

### 🧪 Testing (optional before deploy):

From `my-app`, run tests once (e.g. in CI or before pushing):

```bash
npm test -- --watchAll=false
```

See the root **README.md** → **Testing** for full test documentation (setup, test cases, mocks for `useTheme`, `useStandings`, and `footballApi`).

### ✅ Features Included:

- **SPA Routing:** All routes redirect to index.html
- **Security Headers:** XSS protection, frame options, etc.
- **Caching:** Optimized cache headers for static assets
- **Environment Variables:** Secure API configuration
- **Production Build:** Optimized and minified
- **Tests:** Jest + React Testing Library; 11 App tests (see README)
- **Team detail:** `netlify/functions/team.js` fetches team data (stadium, coach, squad, website). `netlify/functions/scorers.js` fetches top scorers per league/season for the “top scorer” line. Team detail is a centered modal (smaller on mobile), with Escape to close and body scroll locked when open.

