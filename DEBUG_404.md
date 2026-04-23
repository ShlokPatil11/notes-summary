# 404 Error Debugging Checklist

## Step 1: Test Backend Directly
Open these URLs in your browser to test if backend is working:

1. **Health Check**: https://notes-summary-1.onrender.com/api/health
   - Should return: `{"status":"ok"}`

2. **Auth Routes Test**: https://notes-summary-1.onrender.com/api/auth
   - Should return: 404 (expected since it's a POST route)

## Step 2: Check Render Environment Variables
In your Render dashboard, verify these environment variables are set for the backend:

```
MONGO_URI=mongodb+srv://cloudnotes_user:Hello_notes@cluster0.heljibz.mongodb.net/cloudnotes?retryWrites=true&w=majority
JWT_SECRET=supersecretjwtkey_change_me_later
PORT=5000
```

## Step 3: Check Render Build Logs
In Render dashboard:
1. Go to your backend service
2. Click "Logs" tab
3. Look for any errors during startup
4. Check if MongoDB connection is successful

## Step 4: Test API with curl/Postman
Test the login endpoint directly:

```bash
curl -X POST https://notes-summary-1.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## Step 5: Check Frontend Network Requests
In browser:
1. Open https://notes-summary-1.onrender.com/login
2. Open Developer Tools (F12)
3. Go to Network tab
4. Try to login
5. Check what URL the frontend is calling
6. Check the exact error message

## Common Issues:

### Backend Not Deployed Correctly
- Check if backend service is "Live" in Render
- Verify build completed successfully
- Check for startup errors in logs

### Wrong API URL
- Frontend might be calling wrong URL
- Check browser network tab for exact request URL

### CORS Issues
- Though we allow all origins, sometimes Render needs specific config
- Check if CORS preflight requests are failing

### Database Connection Issues
- Atlas connection string might be wrong
- Network access not configured properly

## Quick Fixes:

1. **If backend health check fails**: Check Render logs and redeploy backend
2. **If frontend calls wrong URL**: Update VITE_API_URL environment variable in Render
3. **If database connection fails**: Verify Atlas connection string and network access

## Expected URLs:
- Backend API: https://notes-summary-1.onrender.com/api/health
- Frontend: https://notes-summary-1.onrender.com/login
- Login API call: POST https://notes-summary-1.onrender.com/api/auth/login
