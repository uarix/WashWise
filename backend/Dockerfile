
FROM python:3.9

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Create a volume for the SQLite database
VOLUME /app/data

# Set the database path to use the volume
ENV DB_PATH=/app/data/laundry_usage.db

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
