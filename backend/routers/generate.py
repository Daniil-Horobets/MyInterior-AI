import logging
import base64
from fastapi import APIRouter, File, UploadFile, Form, HTTPException
from fastapi.responses import JSONResponse
from services.replicate_service import call_replicate

router = APIRouter()


@router.post("/generate")
async def generate_image(
        positivePrompt: str = Form(...),
        negativePrompt: str = Form(...),
        image: UploadFile = File(...)
):
    """
    Endpoint to generate an interior design image using the Replicate API.

    :param positivePrompt: Positive prompt (style, color, etc.)
    :param negativePrompt: Negative prompt (undesired features)
    :param image: The sketch image (uploaded by user)
    :return: JSON with 'status' and 'output_url' (image URL).
    """
    logging.info("Received request to generate image.")
    logging.info(f"Positive Prompt: {positivePrompt}")
    logging.info(f"Negative Prompt: {negativePrompt}")

    try:
        # Read uploaded image
        image_bytes = await image.read()
        base64_input_image = base64.b64encode(image_bytes).decode('utf-8')

        # Create input data for Replicate
        input_data = {
            "image": f"data:image/png;base64,{base64_input_image}",
            "prompt": "a photo of a " + positivePrompt,
            "negative_prompt": negativePrompt,
            "structure": "canny",
            "image_resolution": 512,
            "scheduler": "DDIM",
            "steps": 30,
            "scale": 10,
            "seed": 20
        }

        # Call Replicate API
        logging.info("Sending request to Replicate API...")
        output_url = call_replicate(input_data)  # Image URL from Replicate

        logging.info(f"Output URL: {output_url}")

        logging.info("Image generation successful.")
        return JSONResponse(content={"status": "success", "output_url": output_url})

    except Exception as e:
        logging.error(f"Error during image generation:\n{str(e)}")
        raise HTTPException(status_code=500, detail=f"SERVER FAULT! - Image generation failed: \n{str(e)}")
