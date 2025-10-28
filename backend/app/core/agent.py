"""
AI Agent using Ollama for itinerary generation
"""
from __future__ import annotations
import json
from typing import Any, Dict, List
import os

# Try to use Ollama, fallback to simple template if not available
try:
    from langchain_community.llms import Ollama
    from langchain_core.prompts import PromptTemplate
    
    # Initialize Ollama (running on localhost:11434)
    OLLAMA_HOST = os.getenv("OLLAMA_HOST", "http://localhost:11434")
    llm = Ollama(model="mistral", base_url=OLLAMA_HOST, temperature=0.7)
    OLLAMA_AVAILABLE = True
except ImportError:
    print("⚠️ Ollama not available, using template-based generation")
    OLLAMA_AVAILABLE = False
    llm = None

PROMPT_TMPL = """
Bạn là chuyên gia du lịch Việt Nam 🇻🇳.
Hãy tạo lịch trình {days} ngày tại {region}, ngân sách {budget},
phong cách {theme}, phương tiện {transport}, dành cho {people} người.

Dữ liệu địa điểm gần đây (đã lọc theo khoảng cách & loại hình):
{nearby_places}

YÊU CẦU:
- Lập lịch trình theo từng ngày, mỗi ngày 5–8 hoạt động (thời gian, địa điểm, mô tả ngắn).
- Ưu tiên các địa điểm phù hợp theme và ngân sách.
- Di chuyển hợp lý theo khoảng cách (tránh zigzag).
- Trả về JSON **hợp lệ** theo đúng schema sau:

{{
  "overview": "Tóm tắt chuyến đi trong 1–2 dòng",
  "schedule": [
    {{
      "day": 1,
      "title": "Tên ngày/điểm nhấn",
      "activities": [
        {{"time": "08:00", "place": "Tên địa điểm", "desc": "Mô tả ngắn"}}
      ]
    }}
  ],
  "total_cost_estimate": "ước lượng chi phí (VND)"
}}
"""


def _extract_json(text: str) -> Dict[str, Any]:
    """Extract JSON from model output"""
    start = text.find("{")
    if start == -1:
        raise ValueError("Không tìm thấy JSON trong output")
    snippet = text[start:]
    end = snippet.rfind("}")
    if end != -1:
        snippet = snippet[:end + 1]
    return json.loads(snippet)


def generate_itinerary_template(user_prefs: Dict[str, Any], nearby_places: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Generate itinerary using template-based approach (fallback)
    """
    days = user_prefs.get("days", 3)
    region = user_prefs.get("region", "Unknown")
    
    # Build simple schedule
    schedule = []
    for day in range(1, days + 1):
        activities = [
            {"time": "08:00", "place": f"Hoạt động buổi sáng ngày {day}", "desc": "Khám phá buổi sáng"},
            {"time": "12:00", "place": f"Ăn trưa ngày {day}", "desc": "Thưởng thức ẩm thực địa phương"},
            {"time": "14:00", "place": f"Hoạt động buổi chiều ngày {day}", "desc": "Tham quan chiều"},
            {"time": "18:00", "place": f"Ăn tối ngày {day}", "desc": "Dùng bữa tối"},
        ]
        schedule.append({
            "day": day,
            "title": f"Ngày {day} - {region}",
            "activities": activities
        })
    
    return {
        "overview": f"Chuyến đi {days} ngày tại {region} với ngân sách {user_prefs.get('budget', 'Trung bình')}",
        "schedule": schedule,
        "total_cost_estimate": "2.000.000đ"
    }


def generate_itinerary(user_prefs: Dict[str, Any], nearby_places: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Generate itinerary using AI (Ollama if available, otherwise template)
    """
    if not OLLAMA_AVAILABLE:
        return generate_itinerary_template(user_prefs, nearby_places)
    
    try:
        from langchain_core.prompts import PromptTemplate as LangPromptTemplate
        prompt = LangPromptTemplate(
            template=PROMPT_TMPL,
            input_variables=["days", "region", "budget", "theme", "transport", "people", "nearby_places"],
        )
        
        full_prompt = prompt.format(
            days=user_prefs.get("days"),
            region=user_prefs.get("region"),
            budget=user_prefs.get("budget"),
            theme=user_prefs.get("theme"),
            transport=user_prefs.get("transport"),
            people=user_prefs.get("people"),
            nearby_places=json.dumps(nearby_places, ensure_ascii=False, indent=2),
        )

        raw = llm.invoke(full_prompt)
        return _extract_json(raw)
    except Exception as e:
        print(f"Error using Ollama: {e}")
        return generate_itinerary_template(user_prefs, nearby_places)

