import os, httpx
API_KEY = os.getenv("OPENWEATHER_KEY", "")

async def get_weather(lat: float, lon: float, lang="vi"):
    url = (f"https://api.openweathermap.org/data/3.0/onecall?"
           f"lat={lat}&lon={lon}&units=metric&lang={lang}&appid={API_KEY}")
    async with httpx.AsyncClient(timeout=8) as cli:
        r = await cli.get(url)
        r.raise_for_status()
        return r.json()
