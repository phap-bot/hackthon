import logging
import sys
from datetime import datetime
import os

def setup_logger(name: str) -> logging.Logger:
    """Setup logger with file and console handlers"""
    
    # Create logger
    logger = logging.getLogger(name)
    logger.setLevel(logging.INFO)
    
    # Avoid duplicate handlers
    if logger.handlers:
        return logger
    
    # Create formatter
    formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )
    
    # Console handler
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(logging.INFO)
    console_handler.setFormatter(formatter)
    logger.addHandler(console_handler)
    
    # File handler
    log_dir = "logs"
    if not os.path.exists(log_dir):
        os.makedirs(log_dir)
    
    file_handler = logging.FileHandler(
        f"{log_dir}/app_{datetime.now().strftime('%Y%m%d')}.log"
    )
    file_handler.setLevel(logging.INFO)
    file_handler.setFormatter(formatter)
    logger.addHandler(file_handler)
    
    return logger

def log_api_call(endpoint: str, method: str, user_id: str = None, duration: float = None):
    """Log API call details"""
    logger = logging.getLogger(__name__)
    
    message = f"API Call: {method} {endpoint}"
    if user_id:
        message += f" | User: {user_id}"
    if duration:
        message += f" | Duration: {duration:.3f}s"
    
    logger.info(message)

def log_error(error: Exception, context: str = None):
    """Log error with context"""
    logger = logging.getLogger(__name__)
    
    message = f"Error: {str(error)}"
    if context:
        message += f" | Context: {context}"
    
    logger.error(message, exc_info=True)

def log_database_operation(operation: str, collection: str, document_id: str = None):
    """Log database operation"""
    logger = logging.getLogger(__name__)
    
    message = f"Database: {operation} on {collection}"
    if document_id:
        message += f" | ID: {document_id}"
    
    logger.info(message)
