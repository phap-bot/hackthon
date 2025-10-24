# 🌍 Wanderlust - Travel Explorer

Dự án báo cáo về website du lịch thông minh với sự hỗ trợ của AI.

## 📋 Mô tả dự án

**Wanderlust** là một website du lịch hiện đại được xây dựng bằng Next.js, tích hợp công nghệ AI để giúp người dùng lập kế hoạch du lịch hoàn hảo. Website cung cấp các dịch vụ từ lập kế hoạch đến đặt vé, tìm kiếm điểm đến và hỗ trợ trong suốt chuyến đi.

## 🎨 Giao diện mới

Website đã được cập nhật với giao diện hiện đại, bao gồm:
- **Navigation Bar**: Thiết kế lớn và nổi bật với logo Wanderlust, chiều cao 64px, shadow nhẹ và các nút đăng nhập/đăng ký được tối ưu
- **Hero Section**: Khu vực chào mừng với thanh tìm kiếm và nút lập kế hoạch chuyến đi
- **Upcoming Trips**: Hiển thị các chuyến đi sắp tới với trạng thái và thông tin chi tiết
- **Explore Section**: Banner lớn với hình ảnh nền và lời kêu gọi hành động
- **Destination Suggestions**: Gợi ý các điểm đến phổ biến với hình ảnh đẹp
- **Smart Floating Chat**: Chat hỗ trợ thông minh có thể kéo thả, tự động ẩn khi cuộn và tránh che nội dung

### 🏠 User Dashboard (Mới)
Sau khi đăng nhập và hoàn thành khảo sát sở thích, người dùng sẽ được chuyển đến Dashboard cá nhân với:
- **Truy cập nhanh**: 4 chức năng chính (AI lập kế hoạch, Bản đồ thời gian thực, Khám phá địa điểm, Lịch trình AI đề xuất)
- **Chuyến đi của bạn**: Hiển thị các chuyến đi gần đây với trạng thái và chi phí
- **Gợi ý theo sở thích**: Hiển thị điểm đến, hoạt động, ngân sách và lịch trình được AI đề xuất
- **Khám phá bài viết**: Các bài viết về du lịch Việt Nam với hình ảnh và thông tin chi tiết

## ✨ Tính năng chính

### Frontend Features
- 🤖 **AI Travel Planner**: Tạo lịch trình du lịch thông minh dựa trên sở thích và ngân sách
- ✈️ **Đặt vé & khách sạn**: Tự động tìm kiếm và đặt vé máy bay, khách sạn với giá tốt nhất
- 🎯 **Trải nghiệm cá nhân**: Tùy chỉnh chuyến đi theo phong cách cá nhân
- 🛟 **Hỗ trợ 24/7**: Đội ngũ hỗ trợ chuyên nghiệp sẵn sàng giúp đỡ
- 🗺️ **Bản đồ tương tác**: Khám phá điểm đến trên bản đồ thế giới
- 📱 **Responsive Design**: Tối ưu cho mọi thiết bị
- 🔐 **Đăng ký/Đăng nhập**: Hệ thống xác thực người dùng với Google và Facebook
- ✅ **Form Validation**: Xác thực dữ liệu đầu vào với thông báo lỗi rõ ràng

### Backend Features
- 🔐 **JWT Authentication**: Hệ thống xác thực bảo mật với JWT tokens
- 📊 **Preference Survey System**: Khảo sát sở thích du lịch với gợi ý cá nhân hóa
- 🗺️ **Real-time Maps**: Tích hợp Google Maps API với tìm kiếm địa điểm và định tuyến
- 💬 **WebSocket Communication**: Giao tiếp thời gian thực cho vị trí và chat
- 🤖 **AI Integration**: Tích hợp OpenAI API để tạo lịch trình thông minh
- 📊 **Admin Dashboard**: Bảng điều khiển quản trị với thống kê và quản lý
- 🔄 **Real-time Updates**: Cập nhật vị trí và trạng thái chuyến đi theo thời gian thực
- 📝 **Feedback System**: Hệ thống đánh giá và phản hồi đa chiều
- 🚨 **Emergency Alerts**: Hệ thống cảnh báo khẩn cấp cho chuyến đi
- 🇻🇳 **Vietnamese Language Support**: Hỗ trợ tiếng Việt cho AI responses và giao diện

## 🛠️ Công nghệ sử dụng

### Frontend
- **Framework**: Next.js 13, React 18, TypeScript
- **Styling**: Tailwind CSS với Plus Jakarta Sans font
- **UI Components**: Material Symbols, Custom Components
- **Icons**: Material Symbols Outlined
- **Forms**: Tailwind CSS Forms plugin
- **Responsive**: Container Queries plugin
- **Deployment**: Vercel

### Backend
- **Framework**: FastAPI 0.104.1
- **Database**: MongoDB 7.0
- **Cache**: Redis 7.2
- **Authentication**: JWT + Passlib
- **Maps**: Google Maps API
- **AI**: OpenAI API
- **Real-time**: WebSocket
- **Containerization**: Docker + Docker Compose
- **Testing**: Pytest + TestClient

## 🚀 Cài đặt và chạy dự án

### Yêu cầu hệ thống
- Node.js 18+ 
- Python 3.11+
- MongoDB 7.0+
- Redis 7.2+ (tùy chọn)
- Docker & Docker Compose (tùy chọn)

### Cài đặt Frontend

```bash
# Clone repository
git clone <repository-url>
cd FE_AG

# Cài đặt dependencies
npm install
# hoặc
yarn install
```

### Cài đặt Backend

```bash
# Chuyển đến thư mục backend
cd backend

# Tạo virtual environment
python3 -m venv venv
source venv/bin/activate  # Linux/Mac
# hoặc
venv\Scripts\activate     # Windows

# Cài đặt dependencies
pip install -r requirements.txt

# Cấu hình environment variables
cp env.example .env
# Chỉnh sửa .env file với API keys của bạn
```

### Chạy dự án

#### Phương pháp 1: MongoDB Compass Local (Khuyến nghị)

```bash
# 1. Đảm bảo MongoDB Compass đang chạy
# Kết nối đến: mongodb://localhost:27017

# 2. Chạy Backend
cd backend
start_local.bat  # Windows
# hoặc
./start_local.sh  # Linux/Mac

# 3. Chạy Frontend
cd ..
npm run dev
```

#### Phương pháp 2: Sử dụng Docker

```bash
# Chạy tất cả services
cd backend
docker-compose up -d

# Chạy frontend
cd ..
npm run dev
```

### Truy cập ứng dụng

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:8000](http://localhost:8000)
- **API Documentation**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **Database Admin**: [http://localhost:8081](http://localhost:8081)

## 📁 Cấu trúc dự án

```
FE_AG/
├── app/                        # Next.js Frontend
│   ├── components/            # React Components
│   ├── api/                   # API Routes (Next.js)
│   ├── contexts/              # React Contexts
│   ├── globals.css            # Global Styles
│   ├── layout.tsx             # Root Layout
│   └── page.tsx              # Home Page
├── backend/                   # FastAPI Backend
│   ├── app/                   # Backend Application
│   │   ├── routers/          # API Routes
│   │   ├── services/         # Business Logic
│   │   ├── models.py         # Data Models
│   │   ├── database.py       # Database Config
│   │   └── utils/            # Utilities
│   ├── tests/                # Test Files
│   ├── main.py               # App Entry Point
│   ├── requirements.txt      # Python Dependencies
│   ├── Dockerfile            # Docker Config
│   ├── docker-compose.yml    # Docker Compose
│   └── README.md             # Backend Documentation
├── public/                    # Static Assets
│   └── assets/               # Images & Icons
├── package.json               # Frontend Dependencies
├── tailwind.config.js        # Tailwind Config
├── next.config.js            # Next.js Config
└── README.md                 # Project Documentation
```

## User Dashboard (Mới)

Sau khi người dùng đăng nhập và hoàn thành khảo sát sở thích, họ sẽ được chuyển đến trang dashboard với các tính năng:

### 🎯 Tính năng chính:
- **Truy cập nhanh**: 4 nút chức năng chính (Tạo lịch trình tự động, Bản đồ thời gian thực, Khám phá địa điểm, Lịch trình AI đề xuất)
- **Chuyến đi của bạn**: Hiển thị các chuyến đi đã lưu và tạo chuyến đi mới
- **Gợi ý theo sở thích**: Hiển thị sở thích người dùng và các đề xuất cá nhân hóa
- **Khám phá Việt Nam**: Các bài viết về du lịch Việt Nam

### 🎨 Giao diện:
- Layout responsive với sidebar navigation
- Header động hiển thị thông tin người dùng
- Cards với hover effects và animations
- Dark mode support
- Material Design icons

### 🔄 Cập nhật mới nhất:
- **Sidebar Navigation**: Menu điều hướng với các icon Material Symbols
- **Modern Design**: Giao diện được cập nhật theo thiết kế HTML mới
- **Image Integration**: Sử dụng hình ảnh thực tế cho các cards
- **Responsive Layout**: Tối ưu cho mọi kích thước màn hình
- **Floating Support Button**: Nút hỗ trợ nổi ở góc phải dưới
- **Summary Bar**: Thanh tóm tắt chức năng với nút quay lại
- **Navigation Enhancement**: Cải thiện trải nghiệm điều hướng giữa các trang

## 🎨 Customization

### Màu sắc
Website sử dụng bảng màu Wanderlust theme được định nghĩa trong `tailwind.config.js`:
- **Primary**: Wanderlust Blue (#13a4ec)
- **Background Light**: Light Gray (#f6f7f8)
- **Background Dark**: Dark Blue (#101c22)
- **Font**: Plus Jakarta Sans (400, 500, 700, 800)

### Hình ảnh
Tất cả hình ảnh được lưu trong `public/assets/` và được tổ chức theo từng section:
- `banner/`: Hình ảnh hero section
- `buyers/`: Icons thống kê
- `carousel/`: Logo đối tác
- `clientsay/`: Hình ảnh testimonials
- `network/`: Bản đồ và cờ các quốc gia
- `newsletter/`: Background newsletter
- `provide/`: Icons dịch vụ
- `why/`: Mockup ứng dụng

## 📊 Thống kê dự án

- **50,000+** khách hàng tin tưởng
- **100,000+** chuyến đi hoàn thành  
- **98%** khách hàng hài lòng
- **200+** chuyên gia du lịch

## 🌏 Điểm đến phổ biến

- 🇻🇳 **Việt Nam**: Khám phá vẻ đẹp thiên nhiên và văn hóa đa dạng
- 🇯🇵 **Nhật Bản**: Trải nghiệm văn hóa truyền thống và công nghệ hiện đại
- 🇹🇭 **Thái Lan**: Thưởng thức ẩm thực ngon và các bãi biển tuyệt đẹp
- 🇸🇬 **Singapore**: Thành phố xanh sạch với nhiều điểm tham quan thú vị

## 📞 Liên hệ

- **Địa chỉ**: 123 Đường ABC, Quận 1, TP.HCM
- **Điện thoại**: +84 123 456 789
- **Email**: info@travelexplorer.com
- **Website**: https://travelexplorer.com

## 📄 License

Dự án này được phát triển cho mục đích học tập và báo cáo. Tất cả quyền được bảo lưu.

---

**Developed with ❤️ for Travel Lovers**
