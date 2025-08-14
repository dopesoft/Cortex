FROM python:3.11-slim

LABEL org.opencontainers.image.name="staffingbrain/cortex"

WORKDIR /app

# Install system dependencies including PostgreSQL client libraries
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies for Cortex API + jean-memory
RUN pip install --no-cache-dir \
    fastapi==0.104.1 \
    uvicorn[standard]==0.24.0 \
    pydantic==2.5.0 \
    httpx==0.25.2 \
    python-multipart==0.0.6 \
    psycopg2-binary==2.9.9 \
    sqlalchemy \
    python-dotenv \
    qdrant-client \
    openai \
    numpy \
    tiktoken

# Copy the entire openmemory directory structure
COPY openmemory/ /app/openmemory/
COPY cortex_api.py .

# Set environment variables
ENV PYTHONPATH=/app
ENV CORTEX_PORT=8765

EXPOSE 8765

# Run the Cortex API
CMD ["python", "cortex_api.py"]