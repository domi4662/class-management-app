# 🚀 Complete Deployment Guide

This guide will walk you through deploying your Class Management App to production.

## 📋 Prerequisites

- GitHub account
- Vercel account (free)
- Railway account (free)
- MongoDB Atlas account (free)

## 🗄️ Step 1: Set Up MongoDB Atlas Database

### 1.1 Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Sign up for a free account
3. Verify your email

### 1.2 Create a Cluster
1. Click "Build a Database"
2. Choose "FREE" tier (M0)
3. Select your preferred cloud provider and region
4. Click "Create"

### 1.3 Set Up Database Access
1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Create a username and password (save these!)
5. Select "Read and write to any database"
6. Click "Add User"

### 1.4 Set Up Network Access
1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for development)
4. Click "Confirm"

### 1.5 Get Connection String
1. Go back to "Database" in the left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your actual password
6. Replace `<dbname>` with `class-management`

**Example connection string:**
```
mongodb+srv://username:password@cluster.mongodb.net/class-management?retryWrites=true&w=majority
```

## 🚂 Step 2: Deploy Backend to Railway

### 2.1 Create Railway Account
1. Go to [Railway](https://railway.app/)
2. Sign up with your GitHub account

### 2.2 Create New Project
1. Click "New Project"
2. Choose "Deploy from GitHub repo"
3. Select your `class-management-app` repository
4. Choose the `backend` directory as the source

### 2.3 Configure Environment Variables
1. Go to your project's "Variables" tab
2. Add the following environment variables:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/class-management?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
NODE_ENV=production
FRONTEND_URL=https://your-app.vercel.app
```

### 2.4 Deploy
1. Railway will automatically detect it's a Node.js app
2. It will install dependencies and start the server
3. Wait for deployment to complete
4. Copy your Railway app URL (e.g., `https://your-app.railway.app`)

## 🌐 Step 3: Deploy Frontend to Vercel

### 3.1 Connect to Vercel
1. Go to [Vercel](https://vercel.com/)
2. Sign up with your GitHub account
3. Click "New Project"
4. Import your `class-management-app` repository

### 3.2 Configure Project
1. **Framework Preset**: Next.js
2. **Root Directory**: `./` (root of repository)
3. **Build Command**: `npm run build`
4. **Output Directory**: `.next`
5. **Install Command**: `npm install`

### 3.3 Set Environment Variables
1. Go to your project's "Settings" → "Environment Variables"
2. Add:
```
NEXT_PUBLIC_API_URL=https://your-app.railway.app
```

### 3.4 Deploy
1. Click "Deploy"
2. Wait for build and deployment to complete
3. Copy your Vercel app URL (e.g., `https://your-app.vercel.app`)

## 🔄 Step 4: Update Backend CORS

### 4.1 Update Railway Environment
1. Go back to your Railway project
2. Update the `FRONTEND_URL` variable with your actual Vercel URL:
```
FRONTEND_URL=https://your-app.vercel.app
```

### 4.2 Redeploy Backend
1. Railway will automatically redeploy when you change environment variables
2. Wait for deployment to complete

## 🧪 Step 5: Test Your Deployment

### 5.1 Test Backend
1. Visit `https://your-app.railway.app/api/health`
2. Should return: `{"status":"OK","message":"Class Management API is running"}`

### 5.2 Test Frontend
1. Visit your Vercel app URL
2. Check browser console for any API connection errors
3. Test the health endpoint: `https://your-app.vercel.app/api/health`

### 5.3 Test Database Connection
1. Try to register a user through your app
2. Check MongoDB Atlas to see if the user was created

## 🔧 Troubleshooting

### Common Issues

#### Backend Won't Start
- Check Railway logs for errors
- Verify MongoDB connection string
- Ensure all environment variables are set

#### CORS Errors
- Verify `FRONTEND_URL` is set correctly in Railway
- Check that the frontend URL matches exactly

#### Database Connection Failed
- Verify MongoDB Atlas network access allows Railway IPs
- Check username/password in connection string
- Ensure database name is correct

#### Frontend Can't Connect to Backend
- Verify `NEXT_PUBLIC_API_URL` is set in Vercel
- Check that the backend URL is accessible
- Ensure HTTPS is used for production

### Useful Commands

```bash
# Check Railway logs
railway logs

# Check Railway status
railway status

# Redeploy backend
railway up

# Check Vercel deployment
vercel ls
```

## 📱 Step 6: Set Up Custom Domain (Optional)

### 6.1 Backend Domain
1. In Railway, go to your project's "Settings" → "Domains"
2. Add your custom domain
3. Update DNS records as instructed

### 6.2 Frontend Domain
1. In Vercel, go to your project's "Settings" → "Domains"
2. Add your custom domain
3. Update DNS records as instructed

### 6.3 Update Environment Variables
1. Update `FRONTEND_URL` in Railway with your custom domain
2. Update `NEXT_PUBLIC_API_URL` in Vercel with your custom backend domain

## 🔒 Security Considerations

### Production Checklist
- [ ] Strong JWT secret (32+ characters)
- [ ] MongoDB Atlas network restrictions
- [ ] HTTPS enabled on all domains
- [ ] Environment variables properly set
- [ ] No sensitive data in client-side code
- [ ] Rate limiting (consider adding to backend)
- [ ] Input validation on all endpoints

## 📊 Monitoring

### Railway Monitoring
- CPU and memory usage
- Request logs
- Error rates
- Response times

### Vercel Monitoring
- Build performance
- Page load times
- Error tracking
- Analytics

### MongoDB Atlas Monitoring
- Database performance
- Connection count
- Query performance
- Storage usage

## 🎉 Congratulations!

Your Class Management App is now deployed and running in production! 

### Next Steps
1. **Test all features** thoroughly
2. **Set up monitoring** and alerts
3. **Configure backups** for your database
4. **Set up CI/CD** for automatic deployments
5. **Add analytics** to track usage
6. **Plan scaling** strategies

### Support
- **Railway**: [Discord](https://discord.gg/railway)
- **Vercel**: [Documentation](https://vercel.com/docs)
- **MongoDB Atlas**: [Support](https://docs.atlas.mongodb.com/)

---

**Remember**: Always test in development before deploying to production! 