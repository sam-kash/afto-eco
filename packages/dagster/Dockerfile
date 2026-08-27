FROM python:3.9-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV DAGSTER_HOME=/app/

# Expose Dagster webserver port
EXPOSE 3050

# Run Dagster webserver
CMD ["dagster", "dev", "-f", "ecommerce_pipeline/jobs/ingest_pipeline.py", "-h", "0.0.0.0", "-p", "3050"]