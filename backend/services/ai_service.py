import logging
from langchain_openai import AzureChatOpenAI
import google.generativeai as genai
from backend.config import settings
from typing import Dict
import time
import re

logger = logging.getLogger(__name__)

class AIService:
    def __init__(self):
        self.provider = settings.default_provider
        self._init_client()

    def _init_client(self):
        """Initialize AI client based on provider"""
        if self.provider == 'gemini':
            genai.configure(api_key=settings.google_api_key)
            self.client = genai.GenerativeModel('gemini-1.5-flash-latest')
        elif self.provider == 'azure':
            self.client = AzureChatOpenAI(
                openai_api_key=settings.azure_openai_api_key,
                azure_endpoint=settings.azure_openai_endpoint,
                deployment_name=settings.azure_openai_chat_deployment_name,
                openai_api_version=settings.azure_openai_api_version,
                openai_api_type=settings.openai_api_type,
            )

    def summarize_email(self, email_body: str, max_retries: int = 3) -> Dict[str, str]:
        """Summarize email with retry logic and structured output"""

        prompt = f"""
        Analyze the following email and provide a structured summary:

        **Instructions:**
        1. Identify the main topic (max 10 words)
        2. Extract 2-4 key points as bullet points
        3. Determine if action is required (Yes/No/Specific Action)

        **Format your response exactly as:**
        TOPIC: [Brief main topic]
        KEY_POINTS:
        • [Point 1]
        • [Point 2]
        • [Point 3]
        ACTION: [Yes/No/Specific action needed]

        **Email Content:**
        {email_body[:4000]}
        """

        for attempt in range(max_retries):
            try:
                if self.provider == 'gemini':
                    response = self.client.generate_content(prompt)
                    raw_summary = response.text
                elif self.provider == 'azure':
                    response = self.client.invoke([("user", prompt)])
                    raw_summary = getattr(response, 'content', str(response))

                # Parse structured response
                parsed = self._parse_summary(raw_summary)
                parsed['raw_summary'] = raw_summary
                parsed['provider'] = self.provider

                return parsed

            except Exception as e:
                logger.warning(f"Attempt {attempt + 1} failed: {e}")
                if "rate limit" in str(e).lower() or "quota" in str(e).lower():
                    wait_time = 2 ** attempt  # Exponential backoff
                    logger.info(f"Rate limited, waiting {wait_time} seconds...")
                    time.sleep(wait_time)
                elif attempt == max_retries - 1:
                    return {
                        'topic': 'Error summarizing email',
                        'key_points': f'Failed to summarize: {str(e)}',
                        'action_required': 'No',
                        'raw_summary': f'Error: {str(e)}',
                        'provider': self.provider
                    }

        return {
            'topic': 'Summary failed',
            'key_points': 'Unable to generate summary after retries',
            'action_required': 'No',
            'raw_summary': 'Max retries exceeded',
            'provider': self.provider
        }

    def _parse_summary(self, raw_summary: str) -> Dict[str, str]:
        """Parse AI response into structured format"""
        try:
            # Extract topic
            topic_match = re.search(r'TOPIC:\s*(.+)', raw_summary, re.IGNORECASE)
            topic = topic_match.group(1).strip() if topic_match else 'No topic identified'

            # Extract key points
            key_points_section = re.search(r'KEY_POINTS:\s*(.*?)ACTION:', raw_summary, re.DOTALL | re.IGNORECASE)
            if key_points_section:
                key_points = key_points_section.group(1).strip()
            else:
                # Fallback: look for bullet points
                bullet_points = re.findall(r'[•\-\*]\s*(.+)', raw_summary)
                key_points = '\n'.join([f"• {point.strip()}" for point in bullet_points[:4]])

            # Extract action required
            action_match = re.search(r'ACTION:\s*(.+)', raw_summary, re.IGNORECASE)
            action_required = action_match.group(1).strip() if action_match else 'No'

            return {
                'topic': topic[:100],  # Limit length
                'key_points': key_points[:500],
                'action_required': action_required[:100]
            }

        except Exception as e:
            logger.error(f"Error parsing summary: {e}")
            return {
                'topic': 'Parse error',
                'key_points': raw_summary[:500],
                'action_required': 'No'
            }
