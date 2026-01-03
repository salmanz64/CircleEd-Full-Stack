
from app.main import app

# Export the FastAPI app for Vercel
# This makes the app available as an ASGI application
__all__ = ["app"]