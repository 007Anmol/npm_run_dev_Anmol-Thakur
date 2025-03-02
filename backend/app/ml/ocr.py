<<<<<<< HEAD
import pytesseract
from PIL import Image

class OCRProcessor:
    def __init__(self, tesseract_path: str = "/usr/bin/tesseract"):
        pytesseract.pytesseract.tesseract_cmd = tesseract_path

    def extract_text(self, image_path: str) -> str:
        """Extracts text from an image using Tesseract OCR."""
        try:
            image = Image.open(image_path)
            text = pytesseract.image_to_string(image)
            return text.strip()
        except Exception as e:
            return f"Error processing image: {str(e)}"

# Example usage:
if __name__ == "__main__":
    ocr = OCRProcessor()
    print(ocr.extract_text("legal_document.png"))
=======
import pytesseract
from PIL import Image

class OCRProcessor:
    def __init__(self, tesseract_path: str = "/usr/bin/tesseract"):
        pytesseract.pytesseract.tesseract_cmd = tesseract_path

    def extract_text(self, image_path: str) -> str:
        """Extracts text from an image using Tesseract OCR."""
        try:
            image = Image.open(image_path)
            text = pytesseract.image_to_string(image)
            return text.strip()
        except Exception as e:
            return f"Error processing image: {str(e)}"

# Example usage:
if __name__ == "__main__":
    ocr = OCRProcessor()
    print(ocr.extract_text("legal_document.png"))
>>>>>>> ac73e99c020b2d7bb0bc31f1d8f215e36d80d296
