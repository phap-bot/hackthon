import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { imageData } = await request.json()

    if (!imageData || typeof imageData !== 'string') {
      return NextResponse.json({ error: 'Thiếu ảnh đầu vào' }, { status: 400 })
    }

    const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434'
    const MODEL_NAME = process.env.OLLAMA_VISION_MODEL || process.env.OLLAMA_MODEL || 'llama3.2-vision'

    const prompt = `Bạn là hướng dẫn viên du lịch. Dựa trên bức ảnh (không dùng GPS), hãy nhận diện địa danh hoặc gợi ý tên vùng gần đúng. Trả về CHỈ MỖI JSON theo cấu trúc:
{
  "name": "Tên địa danh hoặc vùng (ước lượng nếu cần)",
  "description": "Mô tả ngắn gọn (2-3 câu, tiếng Việt)",
  "history": "Tóm tắt lịch sử (3-4 câu, tiếng Việt, nếu có thể)",
  "activities": [ {"name":"...","time":"...","cost":"...","note":"..."} ],
  "info": {"địa_chỉ":"...","giờ_mở_cửa":"...","giá_vé":"...","lưu_ý":"..."},
  "image_suggestion": "từ khóa ảnh"
}
Yêu cầu: chỉ JSON hợp lệ, không kèm chữ bên ngoài.`

    // Strip data URL prefix to pass pure base64 if provided
    const base64 = imageData.includes(',') ? imageData.split(',')[1] : imageData

    const resp = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: MODEL_NAME,
        prompt,
        images: [base64],
        stream: false,
        options: { temperature: 0.4, top_p: 0.9, max_tokens: 1500 }
      })
    })

    if (!resp.ok) {
      // If Ollama vision model not available (404), fallback to text-based research
      if (resp.status === 404) {
        console.log('Vision model not available, falling back to text research')
        return NextResponse.json({
          success: true,
          data: {
            name: 'Địa danh từ ảnh',
            description: 'Mô tả địa điểm sẽ được cập nhật khi có thông tin từ AI.',
            history: 'Thông tin lịch sử sẽ được cập nhật.',
            activities: [
              { name: 'Chụp ảnh lưu niệm', time: '15-30 phút', cost: 'Miễn phí', note: 'Ghi lại khoảnh khắc đẹp' },
              { name: 'Khám phá khu vực', time: '1-2 giờ', cost: 'Tùy thuộc', note: 'Tìm hiểu thêm về địa điểm' }
            ],
            info: {
              địa_chỉ: 'Sẽ được cập nhật',
              giờ_mở_cửa: 'Sẽ được cập nhật',
              giá_vé: 'Sẽ được cập nhật',
              lưu_ý: 'Dịch vụ AI vision tạm thời không khả dụng. Vui lòng thử lại sau.'
            },
            image: '',
            image_suggestion: 'landmark'
          }
        })
      }
      throw new Error(`Ollama error ${resp.status}: ${resp.statusText}`)
    }

    const data = await resp.json()
    const responseText = data?.response || ''
    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return NextResponse.json({
        success: true,
        data: {
          name: 'Địa danh từ ảnh',
          description: responseText || 'Không trích xuất được JSON từ AI.',
          image: '',
          activities: [],
          info: {}
        }
      })
    }

    let parsed
    try {
      parsed = JSON.parse(jsonMatch[0])
    } catch {
      parsed = { name: 'Địa danh từ ảnh', description: responseText }
    }

    return NextResponse.json({ success: true, data: parsed })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Lỗi xử lý ảnh' }, { status: 500 })
  }
}


