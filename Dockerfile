FROM python:3.11-slim

LABEL org.opencontainers.image.name="staffingbrain/cortex"

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies for full OpenMemory stack
COPY openmemory/api/requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the full OpenMemory system for REAL semantic search
COPY openmemory/ /app/openmemory/
COPY cortex_api.py /app/

# Set environment variables
ENV PYTHONPATH=/app:/app/openmemory/api
ENV CORTEX_PORT=8765
ENV PORT=8765

EXPOSE 8765

# Health check - longer start period for complex startup
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=5 \
    CMD curl -f http://localhost:8765/health || exit 1

# Use uvicorn directly for better control and Railway compatibility
CMD ["uvicorn", "cortex_api:app", "--host", "0.0.0.0", "--port", "8765", "--log-level", "info"]