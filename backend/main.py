import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import the router from 'routers/generate.py'
from routers.generate import router as generate_router

# Configure basic logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s     %(levelname)s     %(message)s")

# Create the FastAPI application
app = FastAPI()

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production for your specific domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the router for generating images
# All endpoints in 'generate.py' will be prefixed with /api
app.include_router(generate_router, prefix="/api")

@app.get("/")
def read_root():
    """
    Basic health-check or greeting endpoint.
    """
    return {"message": "Welcome to the AI Interior Design Backend!"}
