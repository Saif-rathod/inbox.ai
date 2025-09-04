#!/usr/bin/env python3
"""
InboxPrism - Production Email Processing Service
Usage: python run_processor.py [--hours 24] [--no-summarize]
"""

import argparse
import asyncio
import sys
import os

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

from database.manager import DatabaseManager
from services.gmail_service import GmailService
from services.ai_service import AIService
from config.config import settings
import logging

logging.basicConfig(level=settings.LOG_LEVEL, format='%(asctime)s %(levelname)s %(name)s: %(message)s')
logger = logging.getLogger(__name__)

def main():
    parser = argparse.ArgumentParser(description='Process emails with AI summarization')
    parser.add_argument('--hours', type=int, default=24, help='Hours to look back for emails')
    parser.add_argument('--no-summarize', action='store_true', help='Skip AI summarization')
    parser.add_argument('--force-provider', choices=['gemini', 'azure'], help='Force specific AI provider')

    args = parser.parse_args()

    logger.info(f"🚀 Starting InboxPrism processor...")
    logger.info(f"📧 Fetching emails from last {args.hours} hours")
    logger.info(f"🤖 AI Provider: {settings.provider()}")

    try:
        # Initialize services
        db = DatabaseManager()
        gmail_service = GmailService()
        ai_service = AIService()

        # Override provider if specified
        if args.force_provider:
            ai_service.provider = args.force_provider
            ai_service._init_client()

        # Fetch emails
        emails = gmail_service.fetch_emails(hours=args.hours)

        if not emails:
            logger.info("✅ No new emails found")
            return

        logger.info(f"📨 Processing {len(emails)} emails...")

        processed = 0
        summarized = 0

        for email in emails:
            try:
                # Save email
                email_id = db.save_email(
                    message_id=email['message_id'],
                    sender=email['sender'],
                    subject=email['subject'],
                    body=email['body'],
                    received_at=email['received_at']
                )
                processed += 1

                # Summarize if enabled and has content
                if not args.no_summarize and email['body'].strip():
                    logger.info(f"🧠 Summarizing: {email['subject'][:50]}...")

                    summary = ai_service.summarize_email(email['body'])

                    db.save_summary(
                        email_id=email_id,
                        topic=summary['topic'],
                        key_points=summary['key_points'],
                        action_required=summary['action_required'],
                        raw_summary=summary['raw_summary'],
                        provider=summary['provider']
                    )
                    summarized += 1

            except Exception as e:
                logger.error(f"❌ Error processing email: {e}")
                continue

        # Show results
        logger.info(f"✅ Processed {processed} emails")
        logger.info(f"🧠 Summarized {summarized} emails")

        # Show stats
        stats = db.get_stats()
        logger.info(f"📊 Total emails: {stats['total_emails']}")
        logger.info(f"📊 Total summaries: {stats['total_summaries']}")
        logger.info(f"📊 Summary rate: {stats['summary_rate']:.1f}%")

    except Exception as e:
        logger.error(f"💥 Fatal error: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()
