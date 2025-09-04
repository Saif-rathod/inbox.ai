# InboxPrism - AI Email Summarizer Frontend

A Next.js frontend for the InboxPrism backend that provides AI-powered email summarization and chat functionality.

## Features

- 📧 **Email Dashboard**: View and manage your emails with AI-generated summaries
- 💬 **Chat Interface**: Ask questions about your emails using natural language
- 📊 **Statistics**: View email analytics and summary success rates
- 🔄 **Real-time Updates**: Live data synchronization with the backend API

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- InboxPrism backend server running on port 8000

### Installation

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Environment Variables

- `NEXT_PUBLIC_API_URL`: Backend API URL (default: http://localhost:8000)

## Usage

### Email Dashboard

1. **Fetch Emails**: Use the "Fetch & Summarize" button to retrieve emails from your Gmail account
2. **View Summaries**: Each email displays an AI-generated summary with:
   - Topic overview
   - Key points
   - Action required status
3. **Email Statistics**: View total emails, summaries, and success rates

### Chat Interface

1. **Ask Questions**: Type natural language questions about your emails
2. **Examples**:
   - "How many emails do I have?"
   - "What emails need action?"
   - "Show me today's emails"
   - "Summarize emails from [sender]"

## API Integration

The frontend connects to the following backend endpoints:

- `GET /api/emails` - Retrieve emails with summaries
- `GET /api/stats` - Get email statistics
- `POST /api/fetch-emails` - Fetch new emails from Gmail
- `POST /api/summarize/{email_id}` - Summarize specific email

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS
- **State Management**: TanStack Query (React Query)
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **HTTP Client**: Fetch API
