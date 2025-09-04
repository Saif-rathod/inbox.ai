# 🚀 InboxPrism - Clean & Simple Deployment

AI-powered email management and response system. Clean architecture, no Docker complexity.

## 📋 Quick Deploy

### Backend (Render)
1. **[Deploy on Render](https://dashboard.render.com/new/web)**
2. **Connect**: `Saif-rathod/inbox.ai` 
3. **Settings**:
   ```
   Runtime: Python 3
   Build: pip install -r backend/requirements.txt && pip install -r requirements.txt
   Start: cd backend && python -m uvicorn api.main:app --host 0.0.0.0 --port $PORT
   ```
4. **Add your API keys** as environment variables
5. **Deploy!** 🎉

### Frontend (Vercel)
1. **[Deploy on Vercel](https://vercel.com/new)**
2. **Connect**: `Saif-rathod/inbox.ai`
3. **Settings**:
   ```
   Framework: Next.js
   Root Directory: frontend
   ```
4. **Environment**: `NEXT_PUBLIC_API_URL=https://your-backend.onrender.com`
5. **Deploy!** 🎉

## 🛠 Local Development

```bash
# Clone and setup
git clone https://github.com/Saif-rathod/inbox.ai
cd inbox.ai
cp .env.example .env
# Add your API keys to .env

# Backend
python -m venv .venv
source .venv/bin/activate  # Linux/Mac
pip install -r backend/requirements.txt
pip install -r requirements.txt
python -m uvicorn backend.api.main:app --reload --port 8000

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

## 🔑 Required API Keys

- **Google API Key**: [Get here](https://console.cloud.google.com/)
- **Azure OpenAI**: [Get here](https://portal.azure.com/)

## 📁 Clean Project Structure

```
inbox.ai/
├── backend/           # Python FastAPI backend
├── frontend/          # Next.js frontend  
├── .env.example       # Environment template
└── requirements.txt   # Python dependencies
```

## ✅ What's Removed

- ❌ Docker complexity
- ❌ Unnecessary setup scripts  
- ❌ Build artifacts
- ❌ Cache files
- ✅ Clean, simple deployment

**Ready to deploy! 🚀**
