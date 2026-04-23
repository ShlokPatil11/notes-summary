# Render Backend Deployment Instructions

## 1. Connect GitHub Repository
1. Go to https://render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Select the `backend` folder or root repository

## 2. Configure Build Settings
```
Build Command: npm install
Start Command: npm start
```

## 3. Environment Variables
Add these environment variables in Render:
```
MONGO_URI=mongodb+srv://cloudnotes_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/cloudnotes?retryWrites=true&w=majority
JWT_SECRET=supersecretjwtkey_change_me_later
PORT=5000
```

## 4. Deployment Settings
- Name: `cloudnotes-api`
- Region: Choose nearest to your users
- Instance: Free tier is fine

## 5. Health Check
Render will automatically detect the `/api/health` endpoint

## 6. Get Your URL
After deployment, your backend URL will be:
```
https://cloudnotes-api.onrender.com
```
