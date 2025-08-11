#!/bin/bash

echo "🚀 Starting deployment process..."

# Check if git is clean
if [ -n "$(git status --porcelain)" ]; then
    echo "❌ Git working directory is not clean. Please commit or stash your changes."
    exit 1
fi

echo "✅ Git working directory is clean"

# Build the frontend
echo "🔨 Building frontend..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Frontend build failed"
    exit 1
fi

echo "✅ Frontend built successfully"

# Push to GitHub (this will trigger Vercel deployment)
echo "📤 Pushing to GitHub..."
git push origin main

if [ $? -ne 0 ]; then
    echo "❌ Git push failed"
    exit 1
fi

echo "✅ Code pushed to GitHub"
echo "🌐 Vercel will automatically deploy your frontend"
echo ""
echo "📋 Next steps:"
echo "1. Deploy backend to Railway:"
echo "   - Go to https://railway.app"
echo "   - Connect your GitHub repo"
echo "   - Set environment variables:"
echo "     MONGODB_URI=your_mongodb_atlas_connection_string"
echo "     JWT_SECRET=your_super_secret_jwt_key"
echo "     NODE_ENV=production"
echo "     FRONTEND_URL=https://your-app.vercel.app"
echo ""
echo "2. Update frontend environment:"
echo "   - Set NEXT_PUBLIC_API_URL to your Railway backend URL"
echo "   - Redeploy on Vercel"
echo ""
echo "🎉 Deployment process completed!" 