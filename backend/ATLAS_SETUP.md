# MongoDB Atlas Setup Instructions

## 1. Create Atlas Account & Cluster
1. Go to https://www.mongodb.com/atlas
2. Create account or login
3. Create a new cluster (M0 free tier is fine)
4. Wait for cluster to be created

## 2. Create Database User
1. In your cluster, go to "Database Access"
2. Click "Add New Database User"
3. Username: `cloudnotes_user`
4. Password: Generate a strong password
5. Click "Create User"

## 3. Whitelist IP Address
1. Go to "Network Access"
2. Click "Add IP Address"
3. Select "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

## 4. Get Connection String
1. Go to "Clusters" → "Connect"
2. Select "Drivers"
3. Copy the connection string
4. Replace `<password>` with your actual password
5. Replace `<dbname>` with `cloudnotes`

## Final Connection String Format:
```
mongodb+srv://cloudnotes_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/cloudnotes?retryWrites=true&w=majority
```

## 5. Update Environment Variables
Update the `.env` file with:
```
MONGO_URI=mongodb+srv://cloudnotes_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/cloudnotes?retryWrites=true&w=majority
```
