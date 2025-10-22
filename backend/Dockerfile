# Use Python 3.11 with Playwright support
FROM mcr.microsoft.com/playwright/python:v1.55.0-jammy

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Install Playwright browsers (only chromium for smaller size)
RUN playwright install chromium
RUN playwright install-deps chromium

# Copy application code
COPY . .

# Create necessary directories
RUN mkdir -p uploads cookies

# Set permissions
RUN chmod -R 755 /app

# Expose port
EXPOSE 5001

# Set environment variables
ENV FLASK_ENV=production
ENV FLASK_DEBUG=false
ENV LINKEDIN_HEADLESS=true
ENV PYTHONUNBUFFERED=1

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:5001/ || exit 1

# Run the application
CMD ["python", "app.py"]