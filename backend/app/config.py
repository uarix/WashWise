import os

# Fetch interval in seconds (default to 10 if not set in environment)
FETCH_INTERVAL = int(os.getenv("FETCH_INTERVAL", 10))

# Debug mode flag (default to False, enable if DEBUG is set to 'true')
DEBUG = os.getenv("DEBUG", "False").lower() == "true"