from fastapi import APIRouter, HTTPException, Depends, status
from typing import Dict, Any, List

from app.services.language_service import LanguageService
from app.utils.auth import get_current_user_optional

router = APIRouter()

@router.get("/languages", response_model=Dict[str, Any])
async def get_supported_languages():
    """Get list of supported languages"""
    try:
        language_service = LanguageService()
        return language_service.get_language_info()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get language info: {str(e)}"
        )

@router.get("/languages/{language}/messages", response_model=Dict[str, str])
async def get_language_messages(language: str):
    """Get system messages for a specific language"""
    try:
        language_service = LanguageService()
        
        if not language_service.is_language_supported(language):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Language '{language}' is not supported"
            )
        
        return language_service.system_messages.get(language, {})
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get language messages: {str(e)}"
        )

@router.post("/languages/translate", response_model=Dict[str, Any])
async def translate_data(
    data: Dict[str, Any],
    target_language: str,
    current_user: dict = Depends(get_current_user_optional)
):
    """Translate data to target language"""
    try:
        language_service = LanguageService()
        
        if not language_service.is_language_supported(target_language):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Language '{target_language}' is not supported"
            )
        
        translated_data = language_service.get_localized_response(data, target_language)
        
        return {
            "original_data": data,
            "translated_data": translated_data,
            "target_language": target_language
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to translate data: {str(e)}"
        )

@router.get("/languages/{language}/activity-types", response_model=Dict[str, str])
async def get_activity_types(language: str):
    """Get activity types in specific language"""
    try:
        language_service = LanguageService()
        
        if not language_service.is_language_supported(language):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Language '{language}' is not supported"
            )
        
        return language_service.activity_types.get(language, {})
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get activity types: {str(e)}"
        )

@router.get("/languages/{language}/budget-types", response_model=Dict[str, str])
async def get_budget_types(language: str):
    """Get budget types in specific language"""
    try:
        language_service = LanguageService()
        
        if not language_service.is_language_supported(language):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Language '{language}' is not supported"
            )
        
        return language_service.budget_types.get(language, {})
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get budget types: {str(e)}"
        )

@router.get("/languages/{language}/travel-styles", response_model=Dict[str, str])
async def get_travel_styles(language: str):
    """Get travel styles in specific language"""
    try:
        language_service = LanguageService()
        
        if not language_service.is_language_supported(language):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Language '{language}' is not supported"
            )
        
        return language_service.travel_styles.get(language, {})
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get travel styles: {str(e)}"
        )

@router.post("/languages/format-currency", response_model=Dict[str, str])
async def format_currency(
    amount: float,
    language: str = "vi",
    current_user: dict = Depends(get_current_user_optional)
):
    """Format currency based on language"""
    try:
        language_service = LanguageService()
        
        if not language_service.is_language_supported(language):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Language '{language}' is not supported"
            )
        
        formatted_amount = language_service.format_currency(amount, language)
        
        return {
            "amount": amount,
            "formatted_amount": formatted_amount,
            "language": language
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to format currency: {str(e)}"
        )
