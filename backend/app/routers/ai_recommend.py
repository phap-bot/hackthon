from fastapi import APIRouter
from langchain_community.llms import Ollama
from langchain_core.prompts import PromptTemplate
import json

router = APIRouter(prefix="/api/ai", tags=["AI Recommendation"])
llm = Ollama(model="mistral", temperature=0.7)

@router.post("/recommend")
async def recommend(payload: dict):
    theme = payload.get("theme", "cà phê")
    lat, lon = payload.get("lat"), payload.get("lon")

    prompt = PromptTemplate.from_template("""
    Bạn là hướng dẫn viên tại Việt Nam. Dựa trên chủ đề {theme},
    gợi ý 3 địa điểm đáng ghé gần tọa độ lat={lat}, lon={lon}.
    Trả kết quả JSON hợp lệ:
    [
      {{"name": "...", "type": "...", "desc": "..."}},
      ...
    ]
    """)

    out = llm.invoke(prompt.format(theme=theme, lat=lat, lon=lon))
    try:
        return json.loads(out)
    except:
        return {"raw": out}
