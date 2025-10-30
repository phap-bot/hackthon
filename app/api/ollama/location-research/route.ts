import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { locationName, searchType = 'search' } = await request.json()

    if (!locationName || locationName.trim() === '') {
      return NextResponse.json(
        { error: 'Tên địa điểm không được để trống' },
        { status: 400 }
      )
    }

    // Ollama API endpoint - thay đổi URL này theo cấu hình Ollama của bạn
    const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434'
    const MODEL_NAME = process.env.OLLAMA_MODEL || 'llama3.2'
    
    console.log('Calling Ollama API:', {
      baseUrl: OLLAMA_BASE_URL,
      model: MODEL_NAME,
      location: locationName
    })

    // Tạo prompt phù hợp cho việc research địa điểm dựa trên "search query" của người dùng
    // IMPORTANT: KHÔNG sử dụng GPS hoặc vị trí thật của user. Chỉ dùng chuỗi tìm kiếm do user cung cấp
    const baseSearchPrompt = `Bạn là một chuyên gia du lịch. Người dùng cung cấp 1 chuỗi tìm kiếm vùng/địa điểm: "${locationName}".
Hãy *dựa hoàn toàn vào chuỗi tìm kiếm đó* (không sử dụng vị trí GPS thực tế) để nghiên cứu và trả về 1 JSON duy nhất (CHỈ JSON, KHÔNG TEXT KHÁC) có cấu trúc sau:

{
  "name": "Tên địa điểm chính (string)",
  "description": "Mô tả ngắn về địa điểm (2-3 câu, tiếng Việt)",
  "history": "Tóm tắt lịch sử ngắn (3-4 câu, tiếng Việt)",
  "activities": [
    {"name":"...","time":"...","cost":"...","note":"..."}
  ],
  "info": {"địa_chỉ":"...","giờ_mở_cửa":"...","giá_vé":"...","lưu_ý":"..."},
  "image_suggestion": "Từ khóa ảnh",
  "nearby_places": [
    {
      "name": "Tên địa điểm/điểm tham quan",
      "category": "ví dụ: cafe, temple, beach, park, museum",
      "approx_distance_km": 0.5,
      "short_description": "Mô tả ngắn",
      "suggested_activities": ["tham quan","chụp ảnh"]
    }
  ]
}

YÊU CẦU:
- Trả CHỈ JSON hợp lệ. KHÔNG kèm chữ giải thích bên ngoài JSON.
- nearby_places: trả 3-6 điểm gần khu vực mà chuỗi tìm kiếm đề cập (ước lượng khoảng cách bằng km từ trung tâm khu vực). Nếu không chắc, ước lượng hợp lý.
- activities: trả 4-6 hoạt động phù hợp tại địa điểm chính.
- Nếu không biết chi tiết, đưa ra ước lượng và gắn nhãn "approx" trong văn bản mô tả.
- Toàn bộ nội dung bằng tiếng Việt.
- Không dùng dữ liệu cá nhân hay GPS của user.`

    // Prompt riêng cho phần lịch sử chi tiết
    const historyOnlyPrompt = `Bạn là một nhà sử học Việt Nam. Hãy viết phần lịch sử chi tiết, dễ đọc về địa điểm "${locationName}".\n\nYÊU CẦU:\n- Chỉ trả về VĂN BẢN THUẦN (không JSON, không tiêu đề), 6-10 câu, mạch lạc.\n- Tập trung vào bối cảnh hình thành, các sự kiện quan trọng, giá trị văn hoá – kiến trúc, và vai trò hiện nay.\n- Sử dụng tiếng Việt, văn phong trang trọng, thân thiện với du khách.`

    const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL_NAME,
        prompt: searchType === 'history' ? historyOnlyPrompt : baseSearchPrompt,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.9,
          max_tokens: 2000
        }
      })
    })

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log('Ollama raw response:', data)

    // Nếu chỉ yêu cầu lịch sử, trả về văn bản thẳng
    if (searchType === 'history') {
      const rawText = (data?.response || '').trim()
      return NextResponse.json({ success: true, data: { history: rawText } })
    }

    // Parse JSON response từ Ollama
    let locationData
    try {
      // Lấy response text
      const responseText = data.response || ''
      
      // Tìm JSON trong response text (có thể có text trước và sau JSON)
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      
      if (jsonMatch) {
        const jsonStr = jsonMatch[0]
        console.log('Extracted JSON:', jsonStr)
        
        try {
          locationData = JSON.parse(jsonStr)
          console.log('Parsed location data:', locationData)
          
          // Format activities nếu là string, chuyển thành array
          if (locationData.activities && typeof locationData.activities === 'string') {
            locationData.activities = locationData.activities
              .split(/\n|\r|[,;]|-\s*/)
              .map((item: string) => item.trim())
              .filter((item: string) => item.length > 0)
          }
          
          // Parse info object nếu là string
          if (locationData.info && typeof locationData.info === 'string') {
            try {
              const infoMatch = locationData.info.match(/\{[\s\S]*\}/)
              if (infoMatch) {
                locationData.info = JSON.parse(infoMatch[0])
              }
            } catch (e) {
              console.log('Info is plain text')
            }
          }

          // Parse nearby_places nếu Ollama trả về dạng string
          if (locationData.nearby_places && typeof locationData.nearby_places === 'string') {
            try {
              const nearMatch = locationData.nearby_places.match(/\[[\s\S]*\]/)
              if (nearMatch) {
                locationData.nearby_places = JSON.parse(nearMatch[0])
              } else {
                // cố gắng tách từng dòng ra
                locationData.nearby_places = locationData.nearby_places
                  .split(/\n+/)
                  .map((line: string) => line.trim())
                  .filter((l: string) => l.length > 0)
              }
            } catch (e) {
              console.log('nearby_places parsing failed', e)
            }
          }
          
          // Set default image từ Unsplash nếu chưa có
          if (!locationData.image && locationData.image_suggestion) {
            // Tìm ảnh landscape đẹp từ Unsplash
            locationData.image = `https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800`
          }
        } catch (parseError) {
          console.error('JSON parse error:', parseError)
          throw parseError
        }
      } else {
        throw new Error('No JSON found in response')
      }
    } catch (parseError) {
      console.error('Error parsing Ollama response:', parseError)
      console.error('Raw response:', data.response)
      
      // Fallback data
      locationData = {
        name: locationName,
        description: data.response || 'Không tìm thấy thông tin chi tiết về địa điểm này.',
        history: 'Thông tin lịch sử không có sẵn.',
        activities: ['Các hoạt động du lịch sẽ được cập nhật sau.'],
        info: {
          địa_chỉ: 'Sẽ được cập nhật',
          giờ_mở_cửa: 'Sẽ được cập nhật',
          giá_vé: 'Sẽ được cập nhật',
          lưu_ý: 'Sẽ được cập nhật'
        },
        image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800',
        image_suggestion: locationName
      }
    }

    return NextResponse.json({
      success: true,
      data: locationData
    })

  } catch (error: any) {
    console.error('Ollama API error:', error)
    console.error('Error details:', error.message)
    console.error('Ollama URL:', `${process.env.OLLAMA_BASE_URL || 'http://localhost:11434'}/api/generate`)
    
    // Get locationName from request body for fallback
    let locationName = 'Địa điểm không xác định'
    try {
      const body = await request.json()
      locationName = body.locationName || locationName
    } catch {}
    
    // Fallback response khi Ollama không khả dụng
    const fallbackData = {
      name: locationName,
      description: `Xin lỗi, không thể kết nối đến dịch vụ AI. Chi tiết lỗi: ${error.message || 'Không xác định'}`,
      history: 'Thông tin lịch sử tạm thời không khả dụng.',
      activities: ['Danh sách hoạt động sẽ được cập nhật khi dịch vụ khôi phục.'],
      info: {
        địa_chỉ: 'Sẽ được cập nhật',
        giờ_mở_cửa: 'Sẽ được cập nhật',
        giá_vé: 'Sẽ được cập nhật',
        lưu_ý: 'Sẽ được cập nhật'
      },
      image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800',
      image_suggestion: locationName
    }

    return NextResponse.json({
      success: false,
      error: error.message || 'Không thể kết nối đến dịch vụ AI',
      data: fallbackData
    })
  }
}
