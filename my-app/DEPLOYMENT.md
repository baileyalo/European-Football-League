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

```
REACT_APP_FOOTBALL_API_URL=https://api.football-data.org/v4
REACT_APP_FOOTBALL_API_TOKEN=b715fa41da9c4968ae82a1eafc5d5360
REACT_APP_CORS_PROXY_1=https://api.allorigins.win/raw?url=
REACT_APP_CORS_PROXY_2=https://corsproxy.io/?
REACT_APP_CORS_PROXY_3=https://thingproxy.freeboard.io/fetch/
REACT_APP_APP_NAME=European Football League
REACT_APP_VERSION=0.2.0
REACT_APP_CURRENT_SEASON=2024
REACT_APP_DEBUG_MODE=false
REACT_APP_ENABLE_MOCK_DATA=false
```

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
   - Add all the variables listed above

5. **Deploy:**
   - Click "Deploy site"
   - Wait for build to complete

### 🧪 Testing (optional before deploy):

From `my-app`, run tests once (e.g. in CI or before pushing):

```bash
npm test -- --watchAll=false
```

See the root **README.md** → **Testing** for full test documentation (setup, test cases, and how tests mock `useTheme` and `useStandings`).

### ✅ Features Included:

- **SPA Routing:** All routes redirect to index.html
- **Security Headers:** XSS protection, frame options, etc.
- **Caching:** Optimized cache headers for static assets
- **Environment Variables:** Secure API configuration
- **Production Build:** Optimized and minified
- **Tests:** Jest + React Testing Library; 10 App tests (see README)
- **Team website:** `netlify/functions/team.js` fetches team details (website) for the “Website” link per team

