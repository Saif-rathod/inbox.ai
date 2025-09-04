import sqlite3
import os
from datetime import datetime
from typing import List, Dict, Optional

class DatabaseManager:
    def __init__(self, db_path: str = "emails.db"):
        self.db_path = db_path
        self.init_database()

    def init_database(self):
        """Initialize database with required tables"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        # Create emails table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS emails (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                message_id TEXT UNIQUE NOT NULL,
                sender TEXT NOT NULL,
                subject TEXT,
                body TEXT,
                received_at DATETIME,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ''')

        # Create summaries table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS summaries (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email_id INTEGER,
                topic TEXT,
                key_points TEXT,
                action_required TEXT,
                raw_summary TEXT,
                provider TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (email_id) REFERENCES emails (id)
            )
        ''')

        # Create user preferences table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS user_preferences (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                provider TEXT DEFAULT 'gemini',
                hours_to_fetch INTEGER DEFAULT 24,
                auto_summarize BOOLEAN DEFAULT TRUE,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ''')

        conn.commit()
        conn.close()

    def save_email(self, message_id: str, sender: str, subject: str, body: str, received_at: datetime) -> int:
        """Save email to database, return email ID"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        try:
            cursor.execute('''
                INSERT OR REPLACE INTO emails (message_id, sender, subject, body, received_at)
                VALUES (?, ?, ?, ?, ?)
            ''', (message_id, sender, subject, body, received_at))

            email_id = cursor.lastrowid
            conn.commit()
            return email_id
        except Exception as e:
            conn.rollback()
            raise e
        finally:
            conn.close()

    def save_summary(self, email_id: int, topic: str, key_points: str, action_required: str, raw_summary: str, provider: str):
        """Save email summary to database"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        try:
            cursor.execute('''
                INSERT OR REPLACE INTO summaries (email_id, topic, key_points, action_required, raw_summary, provider)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (email_id, topic, key_points, action_required, raw_summary, provider))

            conn.commit()
        except Exception as e:
            conn.rollback()
            raise e
        finally:
            conn.close()

    def get_emails_with_summaries(self, limit: int = 50) -> List[Dict]:
        """Get emails with their summaries"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        cursor.execute('''
            SELECT
                e.id, e.message_id, e.sender, e.subject, e.body, e.received_at, e.created_at,
                s.topic, s.key_points, s.action_required, s.raw_summary, s.provider
            FROM emails e
            LEFT JOIN summaries s ON e.id = s.email_id
            ORDER BY e.received_at DESC
            LIMIT ?
        ''', (limit,))

        rows = cursor.fetchall()
        conn.close()

        emails = []
        for row in rows:
            emails.append({
                'id': row[0],
                'message_id': row[1],
                'sender': row[2],
                'subject': row[3],
                'body': row[4],
                'received_at': row[5],
                'created_at': row[6],
                'summary': {
                    'topic': row[7],
                    'key_points': row[8],
                    'action_required': row[9],
                    'raw_summary': row[10],
                    'provider': row[11]
                } if row[7] else None
            })

        return emails

    def get_stats(self) -> Dict:
        """Get email statistics"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        cursor.execute('SELECT COUNT(*) FROM emails')
        total_emails = cursor.fetchone()[0]

        cursor.execute('SELECT COUNT(*) FROM summaries')
        total_summaries = cursor.fetchone()[0]

        cursor.execute('''
            SELECT COUNT(*) FROM emails
            WHERE DATE(received_at) = DATE('now')
        ''')
        today_emails = cursor.fetchone()[0]

        conn.close()

        return {
            'total_emails': total_emails,
            'total_summaries': total_summaries,
            'today_emails': today_emails,
            'summary_rate': round((total_summaries / total_emails * 100) if total_emails > 0 else 0, 2)
        }
