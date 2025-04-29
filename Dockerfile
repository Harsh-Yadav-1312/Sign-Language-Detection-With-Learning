# Use Python 3.10
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copy the rest of the project
COPY . .

# Set environment variables (optional)
ENV PYTHONUNBUFFERED=1

# Default command (change if needed)
CMD ["python", "app.py"]


