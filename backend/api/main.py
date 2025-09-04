from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Dict, Optional
import logging
import sys
import os

import sys
import os

# Add project root to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from backend.database.manager import DatabaseManager
from backend.services.gmail_service import GmailService
from backend.services.ai_service import AIService
from backend.config import settings

logging.basicConfig(level=settings.log_level, format='%(asctime)s %(levelname)s %(name)s: %(message)s')
logger = logging.getLogger(__name__)

app = FastAPI(title="InboxPrism API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", 
        "http://localhost:5173",  # Local dev servers
        "https://*.vercel.app",   # Vercel deployments
        "https://your-app.vercel.app"  # Replace with your actual Vercel URL
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
db = DatabaseManager(settings.database_path)
gmail_service = GmailService(settings.gmail_credentials_path, settings.gmail_token_path)
ai_service = AIService()

# Health check endpoint for Render
@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "InboxPrism API"}

class FetchEmailsRequest(BaseModel):
    hours: Optional[int] = 24
    summarize: Optional[bool] = True

class EmailSummary(BaseModel):
    id: int
    sender: str
    subject: str
    received_at: str
    topic: Optional[str]
    key_points: Optional[str]
    action_required: Optional[str]

@app.get("/")
async def root():
    return {"message": "InboxPrism API", "status": "running"}

@app.get("/api/stats")
async def get_stats():
    """Get email statistics"""
    try:
        stats = db.get_stats()
        return JSONResponse(content=stats)
    except Exception as e:
        logger.error(f"Error getting stats: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/emails")
async def get_emails(limit: int = 50):
    """Get emails with summaries from database"""
    try:
        emails = db.get_emails_with_summaries(limit=limit)
        return JSONResponse(content={"emails": emails, "count": len(emails)})
    except Exception as e:
        logger.error(f"Error getting emails: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/fetch-emails")
async def fetch_emails(request: FetchEmailsRequest):
    """Fetch new emails from Gmail and optionally summarize them"""
    try:
        logger.info(f"Fetching emails for last {request.hours} hours")

        # Fetch emails from Gmail
        emails = gmail_service.fetch_emails(hours=request.hours)

        if not emails:
            return JSONResponse(content={"message": "No new emails found", "count": 0})

        processed_count = 0
        summarized_count = 0

        for email in emails:
            try:
                # Save email to database
                email_id = db.save_email(
                    message_id=email['message_id'],
                    sender=email['sender'],
                    subject=email['subject'],
                    body=email['body'],
                    received_at=email['received_at']
                )
                processed_count += 1

                # Summarize if requested
                if request.summarize and email['body'].strip():
                    summary = ai_service.summarize_email(email['body'])

                    db.save_summary(
                        email_id=email_id,
                        topic=summary['topic'],
                        key_points=summary['key_points'],
                        action_required=summary['action_required'],
                        raw_summary=summary['raw_summary'],
                        provider=summary['provider']
                    )
                    summarized_count += 1

            except Exception as e:
                logger.error(f"Error processing email {email.get('message_id', 'unknown')}: {e}")
                continue

        return JSONResponse(content={
            "message": f"Processed {processed_count} emails, summarized {summarized_count}",
            "processed": processed_count,
            "summarized": summarized_count
        })

    except Exception as e:
        logger.error(f"Error in fetch_emails: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/summarize/{email_id}")
async def summarize_email(email_id: int):
    """Summarize a specific email by ID"""
    try:
        emails = db.get_emails_with_summaries(limit=1000)  # Get all to find specific ID
        email = next((e for e in emails if e['id'] == email_id), None)

        if not email:
            raise HTTPException(status_code=404, detail="Email not found")

        if not email['body'].strip():
            raise HTTPException(status_code=400, detail="Email has no content to summarize")

        summary = ai_service.summarize_email(email['body'])

        db.save_summary(
            email_id=email_id,
            topic=summary['topic'],
            key_points=summary['key_points'],
            action_required=summary['action_required'],
            raw_summary=summary['raw_summary'],
            provider=summary['provider']
        )

        return JSONResponse(content={"message": "Email summarized successfully", "summary": summary})

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error summarizing email {email_id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
