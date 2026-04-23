# Production Debugging Guide

## Current Status
User is still getting 500 and 404 errors after all fixes.

## Debugging Steps

### 1. Check Backend Health
Open in browser: https://notes-summary.onrender.com/api/health
Expected: {"status":"ok"}
If this fails → Backend deployment issue

### 2. Check Render Logs
In Render dashboard → Backend service → Logs tab:
- Look for MongoDB connection errors
- Check for startup errors
- Look for specific 500 error messages

### 3. Test API Directly
Test with curl or Postman:
```bash
curl -X GET https://notes-summary.onrender.com/api/documents \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 4. Check Environment Variables
Verify these are set in Render backend:
```
MONGO_URI=mongodb+srv://cloudnotes_user:Hello_notes@cluster0.heljibz.mongodb.net/cloudnotes?retryWrites=true&w=majority
JWT_SECRET=supersecretjwtkey_change_me_later
PORT=5000
```

### 5. Check Frontend Environment
Verify this is set in Render frontend:
```
VITE_API_URL=https://notes-summary.onrender.com/api
```

## Common Production Issues

### MongoDB Atlas Issues
- Network access not configured
- Connection string has wrong password
- Atlas cluster not running

### Render Issues
- Environment variables not set
- Build process failing
- Service not starting properly

### File Upload Issues
- Base64 encoding failing
- File size too large for MongoDB
- Memory limits exceeded

## Quick Fixes to Try

### 1. Simplify Upload (Temporary)
Remove base64 conversion, just store metadata:
```javascript
const document = new Document({
  title: title || req.file.originalname,
  filename: req.file.filename,
  originalName: req.file.originalname,
  fileSize: req.file.size,
  mimeType: req.file.mimetype,
  user: req.user.userId
});
```

### 2. Add More Logging
Add detailed logging to every step:
```javascript
console.log('Step 1: Request received');
console.log('Step 2: User authenticated:', req.user);
console.log('Step 3: MongoDB query executed');
```

### 3. Test with Simple Endpoint
Create a test endpoint to verify everything works:
```javascript
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!', timestamp: new Date() });
});
```

## What to Check First

1. **Backend Health**: Is the service actually running?
2. **API Call**: Is the frontend calling the right URL?
3. **Authentication**: Is the token being passed correctly?
4. **Database**: Is MongoDB connection working?

## Next Steps

1. Test backend health endpoint
2. Check Render logs for specific errors
3. Test API calls directly
4. If all else fails, simplify the upload process
