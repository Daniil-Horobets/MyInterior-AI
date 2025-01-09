import logging
import replicate

def call_replicate(input_data: dict) -> list:
    """
    Call the Replicate model with given input_data and return list of image URLs.

    :param input_data: Dict containing image path, prompts, etc.
    :return: List of URLs pointing to generated images.
    """
    try:
        # Execute the model
        output = replicate.run(
            "rossjillian/controlnet:795433b19458d0f4fa172a7ccf93178d2adb1cb8ab2ad6c8fdc33fdbcd49f477",
            input=input_data
        )
        logging.info("Replicate model call succeeded.")

        # Return URL directly from the output
        return output[0].url

    except Exception as e:
        logging.error(f"Error calling Replicate model:\n{str(e)}")
        raise e
