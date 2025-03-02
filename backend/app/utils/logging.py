import logging
import sys

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    handlers=[
        logging.FileHandler("app.log"),  # Log to a file
        logging.StreamHandler(sys.stdout)  # Log to console
    ]
)

logger = logging.getLogger("legal_aid_logger")

def log_info(message: str):
    """Logs an info message."""
    logger.info(message)

def log_error(message: str):
    """Logs an error message."""
    logger.error(message)

def log_debug(message: str):
    """Logs a debug message."""
    logger.debug(message)
