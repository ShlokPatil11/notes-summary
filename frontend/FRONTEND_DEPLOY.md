# Frontend Deployment Instructions

## 1. Update API URL
Update `frontend/src/services/api.js`:
```javascript
const api = axios.create({
  baseURL: 'https://your-backend-url.onrender.com/api',
});
```

## 2. Deploy to Netlify/Vercel/Render

### Option A: Netlify
1. Go to https://netlify.com
2. Drag and drop `frontend/dist` folder
3. Set environment variables if needed

### Option B: Vercel
1. Go to https://vercel.com
2. Connect GitHub repository
3. Select `frontend` folder
4. Vercel will auto-detect React app

### Option C: Render (for frontend)
1. Go to Render dashboard
2. Click "New +" → "Static Site"
3. Connect repository
4. Set build folder to `frontend/dist`

## 3. Environment Variables
Add to your frontend hosting:
```
VITE_API_URL=https://your-backend-url.onrender.com/api
```

## 4. Final URL
Your frontend will be available at:
```
https://your-app-name.netlify.app
```
or
```
https://your-app-name.vercel.app
```
