import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { imageData } = await request.json()
    if (!imageData || typeof imageData !== 'string') {
      return NextResponse.json({ error: 'Thiếu ảnh đầu vào' }, { status: 400 })
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY
    if (!GEMINI_API_KEY) {
      return NextResponse.json({ error: 'Chưa cấu hình GEMINI_API_KEY' }, { status: 500 })
    }

    // Strip data URL prefix
    const base64 = imageData.includes(',') ? imageData.split(',')[1] : imageData

    const prompt = `Bạn là hướng dẫn viên du lịch. Dựa vào bức ảnh (không dùng GPS), hãy nhận diện địa danh hoặc gợi ý vùng gần đúng. Trả về CHỈ JSON tiếng Việt với cấu trúc:
{
  "name": "Tên địa danh hoặc vùng (ước lượng nếu cần)",
  "description": "Mô tả ngắn 2-3 câu",
  "history": "Tóm tắt lịch sử 3-4 câu nếu có",
  "activities": [ {"name":"...","time":"...","cost":"...","note":"..."} ],
  "info": {"địa_chỉ":"...","giờ_mở_cửa":"...","giá_vé":"...","lưu_ý":"..."},
  "image_suggestion": "từ khóa ảnh"
}
Yêu cầu: chỉ trả JSON hợp lệ.`

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`

    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt },
              {
                inline_data: {
                  mime_type: 'image/jpeg',
                  data: base64
                }
              }
            ]
          }
        ],
        generationConfig: { temperature: 0.4, topP: 0.9, maxOutputTokens: 1500 }
      })
    })

    if (!resp.ok) {
      const text = await resp.text()
      return NextResponse.json({ error: `Gemini error ${resp.status}: ${text}` }, { status: 500 })
    }

    const data = await resp.json()
    const textResponse: string = data?.candidates?.[0]?.content?.parts?.[0]?.text || ''
    const match = textResponse.match(/\{[\s\S]*\}/)

    let parsed
    if (match) {
      try {
        parsed = JSON.parse(match[0])
      } catch {
        parsed = { name: 'Địa danh từ ảnh', description: textResponse }
      }
    } else {
      parsed = { name: 'Địa danh từ ảnh', description: textResponse || 'Không trích xuất được JSON từ Gemini.' }
    }

    return NextResponse.json({ success: true, data: parsed })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Lỗi xử lý ảnh (Gemini)' }, { status: 500 })
  }
}


