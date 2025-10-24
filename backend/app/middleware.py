from fastapi import Request, Response
from fastapi.responses import JSONResponse
import time
import logging
from typing import Callable
import asyncio
from collections import defaultdict, deque
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)

class LoggingMiddleware:
    def __init__(self, app):
        self.app = app
    
    async def __call__(self, scope, receive, send):
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return
        
        request = Request(scope, receive)
        start_time = time.time()
        
        # Log request
        logger.info(f"Request: {request.method} {request.url}")
        
        # Process request
        await self.app(scope, receive, send)
        
        # Log response
        process_time = time.time() - start_time
        logger.info(f"Response: {request.method} {request.url} - {process_time:.3f}s")

class RateLimitMiddleware:
    def __init__(self, app, requests_per_minute: int = 60):
        self.app = app
        self.requests_per_minute = requests_per_minute
        self.requests = defaultdict(deque)
    
    async def __call__(self, scope, receive, send):
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return
        
        request = Request(scope, receive)
        client_ip = request.client.host
        
        # Clean old requests
        now = datetime.utcnow()
        minute_ago = now - timedelta(minutes=1)
        
        while self.requests[client_ip] and self.requests[client_ip][0] < minute_ago:
            self.requests[client_ip].popleft()
        
        # Check rate limit
        if len(self.requests[client_ip]) >= self.requests_per_minute:
            response = JSONResponse(
                status_code=429,
                content={"detail": "Rate limit exceeded"}
            )
            await response(scope, receive, send)
            return
        
        # Add current request
        self.requests[client_ip].append(now)
        
        # Process request
        await self.app(scope, receive, send)
