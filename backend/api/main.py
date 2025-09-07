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
        "https://inboxai-tech.netlify.app",  # Primary Netlify deployment
        "https://*.netlify.app",   # Netlify staging/preview deployments
        "https://*.vercel.app",    # Vercel deployments
        "https://inbox-ai-eight.vercel.app",  # Specific Vercel deployment
        "https://inboxprism-frontend.vercel.app",  # Primary Vercel deployment
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

@app.post("/api/populate-test-data")
async def populate_test_data():
    """Populate database with test emails for frontend testing"""
    try:
        import uuid
        from datetime import datetime, timedelta
        
        # Sample test emails
        test_emails = [
            {
                "message_id": str(uuid.uuid4()),
                "sender": "team@company.com",
                "subject": "Weekly Team Meeting Notes",
                "body": "Hi team, Here are the key points from our weekly meeting: 1. Project Alpha is on track for Q4 delivery 2. Need to review budget allocation for next quarter 3. Sarah will lead the new initiative. Please review and let me know if you have any questions.",
                "received_at": datetime.now() - timedelta(hours=2)
            },
            {
                "message_id": str(uuid.uuid4()),
                "sender": "noreply@service.com",
                "subject": "Your monthly report is ready",
                "body": "Your monthly analytics report is now available. This month you received 150 emails, with an 85% open rate. Click here to view your detailed report and insights.",
                "received_at": datetime.now() - timedelta(hours=5)
            },
            {
                "message_id": str(uuid.uuid4()),
                "sender": "client@business.com",
                "subject": "Urgent: Project deadline extension request",
                "body": "Hi, We need to discuss extending the project deadline by 2 weeks due to unexpected requirements changes. Can we schedule a call tomorrow? This is quite urgent as it affects our launch timeline.",
                "received_at": datetime.now() - timedelta(hours=1)
            }
        ]
        
        processed_count = 0
        for email in test_emails:
            # Save email to database
            email_id = db.save_email(
                message_id=email['message_id'],
                sender=email['sender'],
                subject=email['subject'],
                body=email['body'],
                received_at=email['received_at']
            )
            
            # Add AI summary
            try:
                if email['subject'] == "Weekly Team Meeting Notes":
                    summary_data = {
                        "topic": "Team Meeting Summary",
                        "key_points": "Project Alpha on track, budget review needed, new initiative assignment",
                        "action_required": "Review budget allocation, follow up on new initiative"
                    }
                elif email['subject'] == "Your monthly report is ready":
                    summary_data = {
                        "topic": "Monthly Analytics Report",
                        "key_points": "150 emails received, 85% open rate, detailed report available",
                        "action_required": "Review monthly report and insights"
                    }
                elif "Urgent" in email['subject']:
                    summary_data = {
                        "topic": "Project Deadline Extension",
                        "key_points": "2-week extension request, requirements changes, affects launch timeline",
                        "action_required": "Schedule call tomorrow, urgent response needed"
                    }
                
                db.save_summary(email_id, **summary_data)
                processed_count += 1
                
            except Exception as e:
                logger.error(f"Error creating summary for test email {email_id}: {e}")
        
        return JSONResponse(content={
            "message": "Test data populated successfully",
            "emails_created": len(test_emails),
            "summaries_created": processed_count
        })
        
    except Exception as e:
        logger.error(f"Error populating test data: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
