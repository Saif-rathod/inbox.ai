# 🚀 Manual Deployment Guide (No Docker)

Deploy InboxPrism frontend and backend separately for maximum reliability.

## 📋 Quick Deployment Steps

### 1. Backend Deployment (Render)

**[Deploy Backend on Render](https://dashboard.render.com/new/web)**

1. **Connect Repository**: `Saif-rathod/inbox.ai`
2. **Service Type**: Web Service
3. **Configuration**:

   ```
   Name: inbox-ai-backend
   Runtime: Python 3
   Build Command: pip install -r backend/requirements.txt
   Start Command: uvicorn backend.api.main:app --host 0.0.0.0 --port $PORT
   ```

4. **Environment Variables**:

   ```
   GOOGLE_API_KEY=your_google_api_key
   AZURE_OPENAI_API_KEY=your_azure_openai_key
   AZURE_OPENAI_ENDPOINT=your_azure_endpoint
   AZURE_OPENAI_CHAT_DEPLOYMENT_NAME=gpt-4o
   OPENAI_API_TYPE=azure
   AZURE_OPENAI_API_VERSION=2024-12-01-preview
   AZURE_OPENAI_EMBEDDINGS_DEPLOYMENT_NAME=text-embedding-ada-002
   DEFAULT_PROVIDER=azure
   LOG_LEVEL=INFO
   DEBUG=false
   ```

5. **Deploy!** ✅

### 2. Frontend Deployment (Vercel)

**[Deploy Frontend on Vercel](https://vercel.com/new)**

1. **Connect Repository**: `Saif-rathod/inbox.ai`
2. **Framework**: Next.js (auto-detected)
3. **Root Directory**: `frontend`
4. **Build Settings**:

   ```
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

5. **Environment Variables**:

   ```
   NEXT_PUBLIC_API_URL=https://your-backend-name.onrender.com
   ```

   _(Replace with your actual Render backend URL)_

6. **Deploy!** ✅

## 🔄 After Deployment

1. **Get Backend URL**: Copy your Render backend URL (e.g., `https://inbox-ai-backend.onrender.com`)
2. **Update Frontend**: Go to Vercel → Settings → Environment Variables
3. **Update NEXT_PUBLIC_API_URL**: Set to your actual backend URL
4. **Redeploy Frontend**: Trigger a new deployment

## 📈 Benefits of Manual Deployment

✅ **Faster Deployment**: No Docker build time
✅ **Better Debugging**: Clear error messages
✅ **Platform Optimized**: Uses native platform features
✅ **Easier Updates**: Simple git push deployments
✅ **Cost Effective**: Better resource utilization

## 🎯 Final URLs

After deployment:

- **Frontend**: `https://your-frontend.vercel.app`
- **Backend API**: `https://your-backend.onrender.com`
- **API Docs**: `https://your-backend.onrender.com/docs`
- **Health Check**: `https://your-backend.onrender.com/health`

## 🔧 Troubleshooting

### Backend Issues (Render)

If backend deployment fails:

1. **Check Logs**: Go to Render dashboard → Your service → "Logs" tab
2. **Common Issues**:
   - **Module not found**: Ensure all required `__init__.py` files exist
   - **uvicorn not found**: Verify `backend/requirements.txt` has `uvicorn[standard]>=0.24.0`
   - **Import errors**: Try alternative start command: `cd backend && python -m uvicorn api.main:app --host 0.0.0.0 --port $PORT`
   - **Path issues**: Ensure the build installs from correct requirements file

3. **Alternative Configurations**:
   - **Build Command**: `cd backend && pip install -r requirements.txt`
   - **Start Command**: `cd backend && python -m uvicorn api.main:app --host 0.0.0.0 --port $PORT`

### Frontend Issues (Vercel)

If you encounter issues:

1. Check build logs in Render/Vercel dashboards
2. Verify environment variables are set correctly
3. Ensure CORS is properly configured
4. Test API endpoints individually

**Ready to deploy! 🚀**
