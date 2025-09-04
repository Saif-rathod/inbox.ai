#!/bin/bash

# InboxPrism Setup Script

echo "🔧 Setting up InboxPrism..."

# Check if Python 3.8+ is available
python_version=$(python3 --version 2>&1 | grep -o '[0-9]\+\.[0-9]\+' | head -1)
if [ -z "$python_version" ]; then
    echo "❌ Python 3.8+ is required but not found."
    exit 1
fi

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required but not found."
    exit 1
fi

# Create virtual environment
echo "🐍 Creating Python virtual environment..."
python3 -m venv .venv

# Activate virtual environment
source .venv/bin/activate

# Install backend dependencies
echo "📦 Installing backend dependencies..."
pip install -r backend/requirements.txt

# Install frontend dependencies
echo "🎨 Installing frontend dependencies..."
cd frontend
npm install
cd ..

# Copy environment template
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit .env file with your API keys and configuration."
fi

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env file with your API keys"
echo "2. Place your Gmail credentials.json file in the project root"
echo "3. Run './start.sh' to start the application"
echo ""
echo "For more details, see README.md"
