import base64
from datetime import datetime, timedelta
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
from typing import List, Dict
import os
import logging

logger = logging.getLogger(__name__)

class GmailService:
    def __init__(self, credentials_file: str = 'credentials.json', token_file: str = 'token.json'):
        self.credentials_file = credentials_file
        self.token_file = token_file
        self.scopes = ['https://www.googleapis.com/auth/gmail.readonly']
        self.service = None

    def authenticate(self):
        """Handle Gmail OAuth authentication"""
        creds = None
        if os.path.exists(self.token_file):
            creds = Credentials.from_authorized_user_file(self.token_file, self.scopes)

        if not creds or not creds.valid:
            if creds and creds.expired and creds.refresh_token:
                creds.refresh(Request())
            else:
                flow = InstalledAppFlow.from_client_secrets_file(self.credentials_file, self.scopes)
                creds = flow.run_local_server(port=0)

            with open(self.token_file, 'w') as token:
                token.write(creds.to_json())

        self.service = build('gmail', 'v1', credentials=creds)
        return self.service

    def fetch_emails(self, hours: int = 24, query_filter: str = "is:unread in:inbox") -> List[Dict]:
        """Fetch emails from Gmail"""
        if not self.service:
            self.authenticate()

        time_delta = datetime.now() - timedelta(hours=hours)
        after_timestamp = int(time_delta.timestamp())

        query = f"{query_filter} after:{after_timestamp}"
        logger.info(f"Searching emails with query: {query}")

        try:
            results = self.service.users().messages().list(userId='me', q=query).execute()
            messages = results.get('messages', [])

            emails = []
            for message in messages:
                email_data = self._parse_message(message['id'])
                if email_data:
                    emails.append(email_data)

            logger.info(f"Fetched {len(emails)} emails")
            return emails

        except Exception as e:
            logger.error(f"Error fetching emails: {e}")
            return []

    def _parse_message(self, message_id: str) -> Dict:
        """Parse Gmail message and extract relevant information"""
        try:
            msg = self.service.users().messages().get(userId='me', id=message_id, format='full').execute()

            headers = msg['payload']['headers']
            subject = next((h['value'] for h in headers if h['name'] == 'Subject'), '')
            sender = next((h['value'] for h in headers if h['name'] == 'From'), '')
            date = next((h['value'] for h in headers if h['name'] == 'Date'), '')

            # Parse email body
            body = self._extract_body(msg['payload'])

            # Parse received date
            received_at = datetime.fromtimestamp(int(msg['internalDate']) / 1000)

            return {
                'message_id': message_id,
                'sender': sender,
                'subject': subject,
                'body': body,
                'received_at': received_at
            }

        except Exception as e:
            logger.error(f"Error parsing message {message_id}: {e}")
            return None

    def _extract_body(self, payload) -> str:
        """Extract text body from email payload"""
        body = ""

        if 'parts' in payload:
            for part in payload['parts']:
                if part.get('mimeType') == 'text/plain':
                    encoded_body = part['body'].get('data', '')
                    if encoded_body:
                        body = base64.urlsafe_b64decode(encoded_body).decode('utf-8', errors='ignore')
                        break

        if not body and 'data' in payload.get('body', {}):
            encoded_body = payload['body'].get('data', '')
            if encoded_body:
                body = base64.urlsafe_b64decode(encoded_body).decode('utf-8', errors='ignore')

        return body[:5000]  # Limit body length
