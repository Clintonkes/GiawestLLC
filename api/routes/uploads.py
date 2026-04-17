import os
import uuid
import logging
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from pathlib import Path
from api.auth import get_current_admin
from database.models import Admin

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/uploads", tags=["Uploads"])

# Ensure uploads directory exists
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

@router.post("/image")
async def upload_image(
    file: UploadFile = File(...),
    admin: Admin = Depends(get_current_admin)
):
    """Upload an image and return its public path"""
    # Validate file type
    allowed_types = ["image/jpeg", "image/png", "image/webp", "image/gif"]
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Invalid file type. Only JPG, PNG, WEBP, and GIF are allowed.")
    
    # Generate unique filename
    ext = Path(file.filename).suffix
    filename = f"{uuid.uuid4()}{ext}"
    filepath = UPLOAD_DIR / filename
    
    try:
        with open(filepath, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        # Return the public URL path
        return {
            "url": f"/api/uploads/{filename}",
            "filename": filename
        }
    except Exception as e:
        logger.error(f"Upload error: {e}")
        raise HTTPException(status_code=500, detail="Failed to save image")
