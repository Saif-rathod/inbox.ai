# InboxPrism 🔮

**AI-Powered Email Intelligence Platform**

Transform your inbox chaos into actionable insights with cutting-edge AI summarization and smart categorization.

## 🚀 Features

- **Smart Email Summarization**: Powered by Azure OpenAI & Google Gemini
- **Real-time Dashboard**: Beautiful TypeScript + Tailwind UI
- **Production Ready**: Docker, FastAPI, SQLite
- **Multi-Provider AI**: Support for both Azure OpenAI and Google Gemini
- **Automatic Processing**: Background email fetching and summarization
- **Action Detection**: Identifies emails requiring immediate attention

## 🛠 Tech Stack

**Backend:**

- FastAPI (Python)
- SQLite Database
- Azure OpenAI + LangChain
- Google Gmail API
- Pydantic validation

**Frontend:**

- React 18 + TypeScript
- Tailwind CSS
- Vite build system
- Lucide React icons
- Axios HTTP client

**Infrastructure:**

- Docker & Docker Compose
- Environment-based configuration
- Health checks & monitoring

## 🏃‍♂️ Quick Start

### Prerequisites

- Node.js 18+
- Python 3.11+
- Docker (optional)
- Gmail API credentials
- Azure OpenAI or Google Gemini API key

### 1. Automated Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd InboxPrism

# Run automated setup
./setup.sh
```

### 2. Configure Environment

Edit `.env` file with your API keys:

```bash
# AI Provider Settings
GOOGLE_API_KEY=your_gemini_api_key_here
DEFAULT_PROVIDER=gemini

# Azure OpenAI Settings (if using Azure)
AZURE_OPENAI_API_KEY="your_azure_openai_key_here"
AZURE_OPENAI_ENDPOINT="your_azure_endpoint_here"
```

### 3. Gmail Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Gmail API
4. Create OAuth 2.0 credentials
5. Download the `credentials.json` file to project root

### 4. Start the Application

```bash
# Start both frontend and backend
./start.sh
```

The application will be available at:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

### 5. Manual Setup (Alternative)

If you prefer manual setup:

```bash
# Backend setup
python3 -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt

# Frontend setup
cd frontend
npm install
cd ..

# Start backend
python -m uvicorn backend.api.main:app --reload --port 8000

# Start frontend (in another terminal)
cd frontend && npm run dev

\`\`\`bash
git clone <your-repo>
cd InboxPrism
cp .env.example .env
\`\`\`

### 2. Configure Environment

Edit `.env` with your API keys:

\`\`\`env
GOOGLE_API_KEY=your_gemini_api_key
AZURE_OPENAI_API_KEY=your_azure_key
AZURE_OPENAI_ENDPOINT=your_azure_endpoint
AZURE_OPENAI_CHAT_DEPLOYMENT_NAME=gpt-4o
DEFAULT_PROVIDER=azure # or gemini
\`\`\`

### 3. Gmail API Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create project & enable Gmail API
3. Create OAuth 2.0 credentials
4. Download as `credentials.json`

### 4. Run with Docker (Recommended)

\`\`\`bash
docker-compose up --build
\`\`\`

### 5. Or Run Manually

**Backend:**
\`\`\`bash
cd backend
pip install -r requirements.txt
python -m uvicorn api.main:app --reload
\`\`\`

**Frontend:**
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`

Visit: http://localhost:3000

## 📊 API Endpoints

- `GET /api/stats` - Email statistics
- `GET /api/emails` - Get emails with summaries
- `POST /api/fetch-emails` - Fetch & summarize new emails
- `POST /api/summarize/{email_id}` - Summarize specific email

## 🧠 AI Features

### Structured Summarization

Every email gets processed into:

- **Topic**: Main subject (10 words max)
- **Key Points**: Bullet-pointed insights
- **Action Required**: Yes/No/Specific action

### Multi-Provider Support

- **Azure OpenAI**: GPT-4o for production workloads
- **Google Gemini**: Fast & cost-effective processing
- **Automatic Fallback**: Switches providers on rate limits

## 🏗 Architecture

\`\`\`
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ React UI │────│ FastAPI │────│ Gmail API │
│ (TypeScript) │ │ Backend │ │ │
└─────────────────┘ └─────────────────┘ └─────────────────┘
│
┌─────────────────┐ ┌─────────────────┐
│ SQLite DB │ │ AI Services │
│ (Emails & │ │ (Azure/Gemini)│
│ Summaries) │ │ │
└─────────────────┘ └─────────────────┘
\`\`\`

## 🚢 Deployment

### Docker Production

\`\`\`bash
docker build -t inboxprism .
docker run -p 8000:8000 --env-file .env inboxprism
\`\`\`

### Cloud Deployment

Ready for:

- **Vercel/Netlify** (Frontend)
- **Railway/Render** (Backend)
- **AWS/GCP/Azure** (Full stack)

## 🔧 Development

### Project Structure

\`\`\`
InboxPrism/
├── backend/
│ ├── api/main.py # FastAPI app
│ ├── services/ # Gmail, AI services
│ ├── database/manager.py # SQLite operations
│ └── requirements.txt
├── frontend/
│ ├── src/App.tsx # Main React component
│ ├── tailwind.config.js # Tailwind setup
│ └── package.json
├── config/config.py # Environment management
├── Dockerfile # Production container
└── docker-compose.yml # Local development
\`\`\`

### Add New Features

1. **Backend**: Add endpoints in `backend/api/main.py`
2. **Frontend**: Add components in `frontend/src/`
3. **AI**: Extend `backend/services/ai_service.py`
4. **Database**: Modify `backend/database/manager.py`

## 📈 Monitoring

- Health checks on `/health`
- Structured logging with levels
- Database statistics dashboard
- AI provider usage metrics

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Add tests for new features
4. Submit pull request

## 📄 License

MIT License - see LICENSE file for details.

---

**Built for Y Combinator-level scale** 🚀

Ready to transform how teams handle email communication with AI-powered intelligence.
```
