# Static Frontend Deployment on Render

## Step 1: Build Frontend for Production

```bash
cd frontend
npm run build
```

This creates a `dist/` folder with your production React app.

## Step 2: Deploy to Render

### Option A: Static Site Service (Recommended)

1. **Go to Render Dashboard**
2. **Click "New +" → "Static Site"**
3. **Connect GitHub Repository**
4. **Configure Settings:**
   - **Name**: `cloudnotes-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
   - **Environment Variables**:
     ```
     VITE_API_URL=https://your-backend-url.onrender.com/api
     ```

### Option B: Web Service (Alternative)

1. **Go to Render Dashboard**
2. **Click "New +" → "Web Service"**
3. **Connect GitHub Repository**
4. **Configure Settings:**
   - **Name**: `cloudnotes-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm install -g serve && serve -s dist`
   - **Publish Directory**: `dist`
   - **Environment Variables**:
     ```
     VITE_API_URL=https://your-backend-url.onrender.com/api
     ```

## Step 3: Update API URL in Code

Before deploying, update `frontend/src/services/api.js`:

```javascript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://your-backend-url.onrender.com/api',
});
```

## Step 4: Deploy

1. **Push changes to GitHub**
2. **Render will auto-deploy**
3. **Wait for build to complete**
4. **Get your frontend URL**

## Step 5: Final Configuration

After deployment, your app will be available at:
- Backend: `https://your-backend-name.onrender.com`
- Frontend: `https://your-frontend-name.onrender.com`

## Important Notes:

- **CORS**: Your backend already allows all origins with `cors()`
- **Environment Variables**: Make sure to set `VITE_API_URL` in Render
- **Build Errors**: Check Render logs if build fails
- **API Connection**: Test that frontend can reach backend API

## Troubleshooting:

If frontend can't reach backend:
1. Check `VITE_API_URL` environment variable
2. Verify backend is deployed and running
3. Check CORS settings in backend
4. Check Render deployment logs

## Production URLs Example:
```
Backend: https://cloudnotes-api.onrender.com
Frontend: https://cloudnotes-frontend.onrender.com
```
