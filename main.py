import os
import base64
from datetime import datetime, timedelta
from dotenv import load_dotenv
import logging

load_dotenv()

import google.generativeai as genai
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
import time

from colorama import init, Fore, Style
from config.config import settings
from app.azure_openai_service import AzureOpenAIService

logging.basicConfig(level=settings.LOG_LEVEL, format='%(asctime)s %(levelname)s %(name)s: %(message)s')
logger = logging.getLogger(__name__)

GEMINI_API_KEY = os.getenv('GOOGLE_API_KEY')

SCOPES = ['https://www.googleapis.com/auth/gmail.readonly']

TOKEN_FILE = 'token.json'
CREDENTIALS_FILE = 'credentials.json'

def setup_gemini():

    if not GEMINI_API_KEY:
        raise ValueError("GOOGLE_API_KEY environment variable not set!")
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-2.0-flash-latest')
    return model

def get_gmail_service():

    creds = None
    if os.path.exists(TOKEN_FILE):
        creds = Credentials.from_authorized_user_file(TOKEN_FILE, SCOPES)

    if not creds or not creds.valid:
        if creds and creds .expired and creds.refresh_token:
            creds.refresh(Request())

        else:
            import webbrowser

            # Force Brave or Chrome browser
            browsers_to_try = [
                '/usr/bin/brave-browser',
                '/usr/bin/brave',
                '/usr/bin/google-chrome',
                '/usr/bin/chromium-browser',
                '/usr/bin/chromium'
            ]

            browser_cmd = None
            for browser_path in browsers_to_try:
                if os.path.exists(browser_path):
                    browser_cmd = browser_path
                    break

            flow = InstalledAppFlow.from_client_secrets_file(CREDENTIALS_FILE, SCOPES)
            print(f"\n{Fore.YELLOW}Please visit this URL to authorize the application:{Style.RESET_ALL}")

            if browser_cmd:
                # Set environment variable to force the browser
                os.environ['BROWSER'] = browser_cmd
                webbrowser.register('preferred', None, webbrowser.BackgroundBrowser(browser_cmd))

            creds = flow.run_local_server(port=0, open_browser=True)

        with open(TOKEN_FILE, 'w') as token:
            token.write(creds.to_json())

    return build('gmail', 'v1', credentials=creds)

def fetch_emails(service, hours=24):

    time_delta = datetime.now() - timedelta(hours=hours)
    after_timestamp = int(time_delta.timestamp())

    query = f"is:unread in:inbox after:{after_timestamp}"
    print(f"Searching for emails with query: '{query}'")

    # Get a list of messages
    results = service.users().messages().list(userId='me', q=query).execute()
    messages = results.get('messages', [])

    emails = []
    if not messages:
        print("No new emails found.")
    else:
        for message in messages:
            msg = service.users().messages().get(userId='me', id=message['id'], format='full').execute()

            headers = msg['payload']['headers']
            subject = next(header['value'] for header in headers if header['name'] == 'Subject')
            sender = next(header['value'] for header in headers if header['name'] == 'From')

            body = ""
            if 'parts' in msg['payload']:
                for part in msg['payload']['parts']:
                    if part['mimeType'] == 'text/plain':
                        encoded_body = part['body'].get('data', '')
                        body = base64.urlsafe_b64decode(encoded_body).decode('utf-8')
                        break

            if not body and 'data' in msg['payload']['body']:
                encoded_body = msg['payload']['body']['data']
                body = base64.urlsafe_b64decode(encoded_body).decode('utf-8')

            emails.append({'sender': sender, 'subject': subject, 'body': body})
    return emails

def summarize_email_with_provider(email_content: str):
    provider = settings.provider()
    if provider == 'gemini':
        model = setup_gemini()
        prompt = f"""
        Please summarize the following email into a few concise points.
        Identify the main topic, key takeaways, and any required actions.
        Format the output as follows:
        **Topic:** [Main topic of the email]
        **Key Points:**\n- [Point 1]\n- [Point 2]\n...\n        **Action Required:** [Yes/No/Specific Action]
        Email:\n{email_content[:settings.SUMMARY_MAX_CHARS]}
        """
        try:
            response = model.generate_content(prompt)
            return response.text
        except Exception as e:
            return f"Could not summarize: {e}"
    else:  # azure
        azure = AzureOpenAIService()
        return azure.summarize(email_content[:settings.SUMMARY_MAX_CHARS])

if __name__ == '__main__':

    init(autoreset=True)

    print(f"{Fore.YELLOW}🚀 Starting Daily Email Summarizer Agent...{Style.RESET_ALL}")

    try:
        gmail_service = get_gmail_service()
        emails_to_summarize = fetch_emails(gmail_service, hours=24)

        if not emails_to_summarize:
            print(f"\n{Fore.GREEN}✅ Inbox is clear. No unread emails to summarize!{Style.RESET_ALL}")
        else:
            total_emails = len(emails_to_summarize)
            print(f"\n{Fore.YELLOW}✨ Found {total_emails} new emails. Summarizing now... ✨{Style.RESET_ALL}")

            for i, email in enumerate(emails_to_summarize):

                print(f"\n{Style.BRIGHT}EMAIL [{i+1}/{total_emails}]{Style.NORMAL}")
                print(f"{Fore.CYAN}From:    {Style.RESET_ALL}{email['sender']}")
                print(f"{Fore.CYAN}Subject: {Style.RESET_ALL}{email['subject']}")
                print("─" * 40)

                summary = summarize_email_with_provider(email['body'])

                indented_summary = "\n".join(["\t" + line for line in summary.splitlines()])
                print(indented_summary)

                if i < total_emails - 1: # Don't sleep after the last email
                    time.sleep(1)

            print(f"\n{Fore.GREEN}✅ Summary complete.{Style.RESET_ALL}\n")

    except Exception as e:
        logger.exception("Fatal error running summarizer")
        print(f"\n{Fore.RED}🚨 An error occurred: {e}{Style.RESET_ALL}")
