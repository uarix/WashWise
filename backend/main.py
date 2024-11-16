import asyncio

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware  
from loguru import logger

from app.core.data_fetcher import start_data_fetcher
from app.api.endpoints import router
from app.config import DEBUG

logger.add(
    "app.log", 
    rotation="10 MB", 
    retention="1 week", 
    level="DEBUG" if DEBUG else "INFO", 
    format="{time} {level} {message}"
)

logger.info("Starting Laundry Monitor API")

app = FastAPI(
    title="Laundry Monitor", 
    description="API for monitoring laundry machines"
)

origins = [  
    "http://localhost:8080"  
]  
app.add_middleware(  
    CORSMiddleware,  
    allow_origins=origins,  # Allows specific origin  
    allow_credentials=True,  
    allow_methods=["*"],    # Allows all methods  
    allow_headers=["*"],    # Allows all headers  
)  

app.include_router(router)

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(start_data_fetcher())

@app.get("/")
async def root():
    return {"message": "Welcome to Laundry Monitor API"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
