# 🇻🇳 Hướng dẫn sử dụng tính năng tiếng Việt

## Tổng quan

Hệ thống AI Travel Planner đã được tích hợp đầy đủ hỗ trợ tiếng Việt, bao gồm:

- **AI Response**: Tất cả phản hồi từ AI đều bằng tiếng Việt
- **Localization**: Dịch thuật các thuật ngữ du lịch
- **Currency**: Hiển thị tiền tệ VND
- **Date Format**: Định dạng ngày tháng Việt Nam
- **System Messages**: Thông báo hệ thống bằng tiếng Việt

## Cấu hình

### Environment Variables

```env
# Ngôn ngữ mặc định
DEFAULT_LANGUAGE=vi

# Các ngôn ngữ được hỗ trợ
SUPPORTED_LANGUAGES=vi,en
```

## API Usage

### 1. Tạo lịch trình du lịch bằng tiếng Việt

```bash
curl -X POST "http://localhost:8000/api/travel-planner" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "destination": "Hà Nội, Việt Nam",
    "start_date": "2024-03-15",
    "end_date": "2024-03-19",
    "people": 2,
    "budget": "medium",
    "travel_style": "culture",
    "interests": ["food", "culture", "history"],
    "language": "vi"
  }'
```

### 2. Lấy danh sách ngôn ngữ được hỗ trợ

```bash
curl -X GET "http://localhost:8000/api/languages"
```

Response:
```json
{
  "default_language": "vi",
  "supported_languages": ["vi", "en"],
  "language_names": {
    "vi": "Tiếng Việt",
    "en": "English"
  }
}
```

### 3. Dịch dữ liệu sang tiếng Việt

```bash
curl -X POST "http://localhost:8000/api/languages/translate" \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "budget": "medium",
      "travel_style": "adventure",
      "activities": [
        {
          "type": "attraction",
          "name": "Temple Visit"
        }
      ]
    },
    "target_language": "vi"
  }'
```

Response:
```json
{
  "original_data": {
    "budget": "medium",
    "travel_style": "adventure",
    "activities": [
      {
        "type": "attraction",
        "name": "Temple Visit"
      }
    ]
  },
  "translated_data": {
    "budget": "trung bình",
    "travel_style": "phiêu lưu",
    "activities": [
      {
        "type": "Điểm tham quan",
        "name": "Temple Visit"
      }
    ]
  },
  "target_language": "vi"
}
```

### 4. Lấy các loại hoạt động bằng tiếng Việt

```bash
curl -X GET "http://localhost:8000/api/languages/vi/activity-types"
```

Response:
```json
{
  "attraction": "Điểm tham quan",
  "restaurant": "Nhà hàng",
  "hotel": "Khách sạn",
  "transport": "Phương tiện",
  "shopping": "Mua sắm",
  "entertainment": "Giải trí"
}
```

### 5. Định dạng tiền tệ VND

```bash
curl -X POST "http://localhost:8000/api/languages/format-currency" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 1500000,
    "language": "vi"
  }'
```

Response:
```json
{
  "amount": 1500000,
  "formatted_amount": "1,500,000 VND",
  "language": "vi"
}
```

## Ví dụ Response từ AI

Khi tạo lịch trình du lịch bằng tiếng Việt, AI sẽ trả về:

```json
{
  "days": [
    {
      "day": 1,
      "date": "2024-03-15",
      "estimatedCost": 2500000,
      "activities": [
        {
          "id": "1",
          "name": "Tham quan Văn Miếu - Quốc Tử Giám",
          "type": "attraction",
          "time": "08:00",
          "duration": "2h",
          "cost": 300000,
          "description": "Khám phá trường đại học đầu tiên của Việt Nam, tìm hiểu về nền giáo dục cổ truyền",
          "location": "Văn Miếu, Hà Nội",
          "rating": 4.8,
          "coordinates": {"lat": 21.0285, "lng": 105.8362}
        },
        {
          "id": "2",
          "name": "Thưởng thức phở bò tại Phở Gia Truyền",
          "type": "restaurant",
          "time": "12:00",
          "duration": "1h",
          "cost": 150000,
          "description": "Thưởng thức món phở bò truyền thống nổi tiếng của Hà Nội",
          "location": "Phố Hàng Trống, Hà Nội",
          "rating": 4.6,
          "coordinates": {"lat": 21.0308, "lng": 105.8322}
        }
      ]
    }
  ],
  "summary": {
    "totalAttractions": 8,
    "totalRestaurants": 6,
    "totalHotels": 1,
    "averageRating": 4.7
  }
}
```

## Tính năng nổi bật

### 1. **AI Prompt tiếng Việt**
- System prompt được tối ưu cho tiếng Việt
- Sử dụng GPT-4 cho chất lượng dịch thuật tốt hơn
- Prompt chi tiết với các thuật ngữ du lịch Việt Nam

### 2. **Localization hoàn chỉnh**
- Dịch thuật tất cả thuật ngữ du lịch
- Định dạng tiền tệ VND
- Định dạng ngày tháng Việt Nam (dd/mm/yyyy)

### 3. **Mock Data tiếng Việt**
- Dữ liệu mẫu hoàn toàn bằng tiếng Việt
- Các hoạt động phù hợp với văn hóa Việt Nam
- Mô tả chi tiết bằng tiếng Việt

### 4. **API Endpoints**
- `/api/languages` - Quản lý ngôn ngữ
- `/api/languages/translate` - Dịch thuật dữ liệu
- `/api/languages/{language}/messages` - Thông báo hệ thống

## Cách sử dụng trong Frontend

### 1. Thiết lập ngôn ngữ mặc định

```javascript
// Trong frontend, thiết lập ngôn ngữ mặc định
const defaultLanguage = 'vi';

// Gửi request với language parameter
const createTrip = async (tripData) => {
  const response = await fetch('/api/travel-planner', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      ...tripData,
      language: defaultLanguage
    })
  });
  return response.json();
};
```

### 2. Dịch thuật động

```javascript
// Dịch thuật dữ liệu trước khi hiển thị
const translateData = async (data, targetLanguage) => {
  const response = await fetch('/api/languages/translate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      data: data,
      target_language: targetLanguage
    })
  });
  return response.json();
};
```

### 3. Định dạng tiền tệ

```javascript
// Định dạng tiền tệ theo ngôn ngữ
const formatCurrency = async (amount, language) => {
  const response = await fetch('/api/languages/format-currency', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      amount: amount,
      language: language
    })
  });
  const result = await response.json();
  return result.formatted_amount;
};
```

## Lưu ý quan trọng

1. **OpenAI API Key**: Cần có API key hợp lệ để sử dụng tính năng AI tiếng Việt
2. **Model Selection**: Hệ thống tự động chọn GPT-4 cho tiếng Việt để có chất lượng tốt nhất
3. **Fallback**: Nếu AI không khả dụng, hệ thống sẽ sử dụng mock data tiếng Việt
4. **Performance**: Các bản dịch được cache để tối ưu hiệu suất

## Troubleshooting

### Lỗi thường gặp

1. **AI không trả về tiếng Việt**
   - Kiểm tra OPENAI_API_KEY
   - Đảm bảo language parameter được gửi đúng

2. **Dịch thuật không chính xác**
   - Sử dụng GPT-4 thay vì GPT-3.5
   - Kiểm tra prompt template

3. **Mock data không hiển thị**
   - Kiểm tra DEFAULT_LANGUAGE trong .env
   - Đảm bảo language service được khởi tạo đúng

---

**🇻🇳 Hệ thống đã sẵn sàng phục vụ người dùng Việt Nam với trải nghiệm hoàn toàn bằng tiếng Việt!**
