FROM node:18 as frontend-build

# Build frontend
WORKDIR /app/frontend

# Copy package files first for better caching
COPY frontend/package*.json ./

# Install dependencies with verbose logging
RUN npm install --verbose

# Copy all frontend files
COPY frontend/ ./

# Set build-time environment variables
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV NEXT_PUBLIC_API_URL=http://localhost:8000

# Build with error handling
RUN npm run build || (echo "Build failed, listing files:" && ls -la && cat package.json && exit 1)

# Python backend
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy backend requirements and install
COPY backend/requirements.txt ./backend_requirements.txt
COPY requirements.txt ./
RUN pip install --no-cache-dir -r backend_requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/ ./
COPY main.py ./
COPY run_processor.py ./

# Copy built frontend
COPY --from=frontend-build /app/frontend/dist ./static

# Create necessary directories
RUN mkdir -p /app/data

# Set environment variables
ENV PYTHONPATH=/app
ENV PORT=8000

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Start application
CMD ["python", "-m", "uvicorn", "backend.api.main:app", "--host", "0.0.0.0", "--port", "8000"]
