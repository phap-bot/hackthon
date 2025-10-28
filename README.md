# 🌍 Wanderlust - Travel Explorer

Dự án báo cáo về website du lịch thông minh với sự hỗ trợ của AI.

## 📋 Mô tả dự án

**Wanderlust** là một website du lịch hiện đại được xây dựng bằng Next.js, tích hợp công nghệ AI để giúp người dùng lập kế hoạch du lịch hoàn hảo. Website cung cấp các dịch vụ từ lập kế hoạch đến đặt vé, tìm kiếm điểm đến và hỗ trợ trong suốt chuyến đi.

## 🎨 Giao diện mới (Cập nhật 2025-01-26)

### 🏠 Landing Page
Website đã được cập nhật với giao diện hiện đại, hiện đại và chuyên nghiệp:

- **Fixed Header**: Header cố định với logo Wanderlust, navigation menu và nút đăng nhập/đăng ký
- **Hero Section**: Banner lớn với hình ảnh nền tuyệt đẹp, gradient overlay và call-to-action buttons
- **Features Section**: Giới thiệu các tính năng chính với hình ảnh và mô tả chi tiết
- **Call-to-Action**: Phần kêu gọi đăng ký với thiết kế nổi bật
- **Footer**: Footer đầy đủ với thông tin công ty, links và social media

### 🎯 Tính năng Landing Page
- **Responsive Design**: Tối ưu cho mọi thiết bị từ mobile đến desktop
- **Modern UI/UX**: Thiết kế hiện đại với gradient, shadow và animations
- **Fixed Header**: Header cố định khi scroll, dễ dàng navigation
- **Hero Background**: Hình ảnh nền đẹp mắt với gradient overlay
- **Material Icons**: Sử dụng Material Symbols icons thống nhất
- **Smooth Animations**: Transitions mượt mà và hover effects

### 📱 Dashboard & Internal Pages
- **Navigation Bar**: Menu điều hướng với các chức năng chính
- **User Menu**: Dropdown menu với thông tin người dùng và các tùy chọn
- **Quick Actions**: Truy cập nhanh các chức năng phổ biến
- **My Trips**: Quản lý các chuyến đi của bạn
- **Recommendations**: Gợi ý cá nhân hóa dựa trên sở thích
- **Discover Posts**: Khám phá các bài viết du lịch

### 🏠 User Dashboard
Sau khi đăng nhập, người dùng sẽ được chuyển đến Dashboard cá nhân với:
- **Welcome Banner**: Banner chào mừng với hình ảnh nền và thông báo cá nhân hóa
- **Truy cập nhanh**: 4 chức năng chính (AI lập kế hoạch, Bản đồ thời gian thực, Khám phá địa điểm, Lịch trình AI đề xuất)
- **Chuyến đi của bạn**: Hiển thị các chuyến đi gần đây với trạng thái và chi phí
- **Gợi ý theo sở thích**: Hiển thị điểm đến, hoạt động, ngân sách và lịch trình được AI đề xuất
- **Khám phá bài viết**: Các bài viết về du lịch Việt Nam với hình ảnh và thông tin chi tiết

## ✨ Tính năng chính

### Frontend Features
- 🗺️ **Smart Maps (Realtime)**: Bản đồ thông minh realtime với Geoapify tiles + React Leaflet, hiển thị vị trí user và địa điểm xung quanh theo category
- 🤖 **AI Travel Planner**: Tạo lịch trình du lịch thông minh dựa trên sở thích và ngân sách
- ✈️ **Đặt vé & khách sạn**: Tự động tìm kiếm và đặt vé máy bay, khách sạn với giá tốt nhất
- 🎯 **Trải nghiệm cá nhân**: Tùy chỉnh chuyến đi theo phong cách cá nhân
- 🛟 **Hỗ trợ 24/7**: Đội ngũ hỗ trợ chuyên nghiệp sẵn sàng giúp đỡ
- 🗺️ **Bản đồ tương tác**: Khám phá điểm đến trên bản đồ thế giới
- 📱 **Responsive Design**: Tối ưu cho mọi thiết bị
- 🔐 **Đăng ký/Đăng nhập**: Hệ thống xác thực người dùng với Google và Facebook
- ✅ **Form Validation**: Xác thực dữ liệu đầu vào với thông báo lỗi rõ ràng
- 📸 **Avatar Upload**: Tải lên ảnh đại diện từ camera hoặc thư viện ảnh
- 🎛️ **Advanced Filters**: Bộ lọc nâng cao cho AI trip planner với 6 nhóm tùy chỉnh
- 🔄 **Profile Sync**: Đồng bộ hóa thông tin profile với MongoDB database

### Backend Features
- 🗺️ **Geoapify Integration**: Tích hợp Geoapify Places API để lấy dữ liệu địa điểm thực tế với categories
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

## 🧹 Project Cleanup & Optimization (2025-01-25)

### ✅ Đã dọn dẹp và tối ưu dự án:

#### **Debug Files (4 files)**
- `debug_auth_flow.py` - Debug authentication flow
- `debug_database.py` - Debug database connection
- `debug_token.py` - Debug JWT tokens
- `debug_users.py` - Debug user data

#### **Test Files Integration (40+ files)**
- **Tích hợp** tất cả test files cũ vào 3 test suites chính
- **Tạo** thư mục `tests/` với cấu trúc tối ưu:
  - `test_auth_integration.py` - Authentication tests
  - `test_preferences_integration.py` - Preferences & recommendations tests
  - `test_maps_integration.py` - Maps & travel planner tests
  - `run_all_tests.py` - Main test runner
  - `quick_test.py` - Quick test runner
  - `test_config.py` - Test configuration
- **Xóa** 40+ file test cũ và trùng lặp

#### **Outdated Guide Documents (3 files)**
- `REGISTER_FLOW_TEST_GUIDE.md` - Thay thế bằng SECURE_REGISTER_FLOW_GUIDE.md
- `FASTAPI_INTEGRATION_GUIDE.md` - Thay thế bằng COMPLETE_INTEGRATION_GUIDE.md
- `backend/FRONTEND_INTEGRATION_GUIDE.md` - Nội dung đã tích hợp vào guide chính

#### **Old Log Files (4 files)**
- Chỉ giữ lại log file mới nhất
- Xóa các log file cũ từ ngày 22-24/10/2025

#### **Utility Scripts (7 files)**
- `simple_backend.py` - Backend đơn giản không cần thiết
- `create_test_user.py` - Script tạo user test
- `create_multiple_test_users.py` - Script tạo nhiều user test
- `check_*.py` - Các script kiểm tra database

### 📊 Kết quả:
- **Giảm ~80+ files** không cần thiết
- **Tiết kiệm dung lượng** đáng kể
- **Cấu trúc project** gọn gàng và tối ưu
- **Test system** tích hợp và dễ sử dụng
- **Dễ bảo trì** và phát triển

## 📸 Avatar Upload System (Mới - 2025-01-26)

### **Tính năng:**
- **Camera Access**: Cho phép chụp ảnh trực tiếp từ camera thiết bị
- **Gallery Selection**: Chọn ảnh từ thư viện ảnh của thiết bị
- **Image Preview**: Xem trước ảnh trước khi xác nhận
- **File Validation**: Kiểm tra định dạng và kích thước file
- **Responsive Modal**: Giao diện modal responsive cho mọi thiết bị

### **Cách sử dụng:**
1. Truy cập trang Profile (`/profile`)
2. Click vào biểu tượng camera trên avatar
3. Chọn "Từ thư viện" hoặc "Chụp ảnh"
4. Xem trước và xác nhận ảnh
5. Ảnh sẽ được lưu và hiển thị ngay lập tức

### **Hỗ trợ định dạng:**
- **File types**: JPG, PNG, GIF
- **Max size**: 5MB
- **Auto resize**: Tự động điều chỉnh kích thước

### **API Endpoint:**
```
POST /api/auth/upload-avatar
Content-Type: multipart/form-data
Body: { avatar: File }
```

## 🎛️ Advanced Filters System (Mới - 2025-01-26)

### **Tính năng:**
- **6 Nhóm Filter**: Loại chuyến đi, Phương tiện, Phong cách, Mùa, Hoạt động, Ưu tiên
- **AI Logic Integration**: Mỗi filter có mục đích cụ thể để AI hiểu và tạo lịch trình phù hợp
- **Collapsible UI**: Giao diện có thể thu gọn để không làm rối UI
- **Smart Selection**: Hiển thị số lượng đã chọn và cho phép reset

### **6 Nhóm Filter:**

#### 1️⃣ **Loại chuyến đi** 🎯
- Nghỉ dưỡng 🏖️, Phiêu lưu ⛰️, Văn hoá 🏛️, Ẩm thực 🍜, Lãng mạn ❤️, Công tác 💼
- **AI Logic**: Chọn gợi ý phù hợp (văn hoá → chùa, bảo tàng; phiêu lưu → trekking)

#### 2️⃣ **Phương tiện di chuyển** 🚗
- Xe máy 🛵, Ô tô 🚗, Máy bay ✈️, Tàu hoả 🚂
- **AI Logic**: Tính quãng đường + thời gian di chuyển thực tế

#### 3️⃣ **Phong cách du lịch** 🎨
- Tự túc 🗺️, Theo tour 👥, Kết hợp 🔄
- **AI Logic**: Ảnh hưởng lịch trình chi tiết (tự túc → nhiều thời gian linh hoạt)

#### 4️⃣ **Mùa / thời gian** 🌤️
- Xuân 🌸, Hè ☀️, Thu 🍂, Đông ❄️
- **AI Logic**: Chọn địa điểm phù hợp mùa du lịch

#### 5️⃣ **Mức độ hoạt động** ⚡
- Thư giãn 😌, Trung bình ⚖️, Năng động 🏃
- **AI Logic**: Cân bằng giữa tham quan và nghỉ ngơi

#### 6️⃣ **Ưu tiên đặc biệt** ⭐
- Có biển 🏖️, Có đồ ăn địa phương 🍜, Ít đông 🤫, Phù hợp gia đình 👨‍👩‍👧‍👦
- **AI Logic**: Lọc theo preference thực tế

### **Cách sử dụng:**
1. Truy cập trang Planner (`/planner`)
2. Điền thông tin cơ bản (ngân sách, số người, số ngày)
3. Click "Bộ lọc nâng cao" để mở rộng
4. Chọn các filter phù hợp
5. AI sẽ tạo lịch trình dựa trên tất cả thông tin

## 🔄 Profile Sync System (Mới - 2025-01-26)

### **Vấn đề đã giải quyết:**
- **UI cập nhật nhưng chưa sync DB**: Trước đây chỉ cập nhật state frontend
- **Thiếu API endpoint**: Backend chưa hỗ trợ đầy đủ các trường profile
- **Không đồng bộ dữ liệu**: Thay đổi trên UI không được lưu vào database

### **Giải pháp 4 bước:**

#### 1️⃣ **Mở rộng UserUpdate Model**
```python
class UserUpdate(BaseModel):
    username: Optional[str] = Field(None, min_length=3, max_length=50)
    full_name: Optional[str] = Field(None, min_length=2, max_length=100)
    avatar_url: Optional[str] = None
    phone: Optional[str] = Field(None, min_length=10, max_length=15)
    date_of_birth: Optional[date] = None
    location: Optional[str] = Field(None, min_length=2, max_length=200)
    bio: Optional[str] = Field(None, max_length=500)
```

#### 2️⃣ **Cập nhật Backend API**
- **Endpoint**: `PUT /auth/me`
- **Validation**: Kiểm tra username trùng lặp
- **Response**: Trả về đầy đủ thông tin user đã cập nhật
- **Error Handling**: Xử lý lỗi chi tiết

#### 3️⃣ **Tạo Frontend API Route**
- **File**: `app/api/auth/update-profile/route.ts`
- **Method**: PUT
- **Authentication**: JWT token validation
- **Proxy**: Chuyển tiếp request đến backend

#### 4️⃣ **Cập nhật Profile Page**
- **Real-time sync**: Cập nhật UI ngay sau khi lưu thành công
- **Error handling**: Hiển thị thông báo lỗi chi tiết
- **Loading states**: Hiển thị trạng thái đang lưu
- **Form validation**: Kiểm tra dữ liệu trước khi gửi

### **Flow hoạt động:**
1. User click "Chỉnh sửa" → Form chuyển sang chế độ edit
2. User thay đổi thông tin → State được cập nhật
3. User click "Lưu" → Gửi PUT request đến `/api/auth/update-profile`
4. Frontend API chuyển tiếp đến backend `PUT /auth/me`
5. Backend cập nhật MongoDB → Trả về dữ liệu mới
6. Frontend nhận response → Cập nhật UI với dữ liệu mới
7. Hiển thị thông báo thành công

### **Tính năng:**
- ✅ **Đồng bộ real-time** với MongoDB
- ✅ **Validation đầy đủ** cho tất cả trường
- ✅ **Error handling** chi tiết
- ✅ **Loading states** cho UX tốt hơn
- ✅ **Token authentication** bảo mật
- ✅ **Response caching** để tối ưu performance

## 🧪 Testing System

### **Chạy tất cả tests:**
```bash
cd tests
python run_all_tests.py
```

### **Chạy test nhanh:**
```bash
cd tests
python quick_test.py
```

### **Chạy test riêng lẻ:**
```bash
cd tests
python test_auth_integration.py
python test_preferences_integration.py
python test_maps_integration.py
```

## 🎨 Design Updates (2025-01-26)

### Landing Page Redesign
Đã cập nhật giao diện landing page với thiết kế mới hiện đại và chuyên nghiệp:

**Changes:**
- ✨ Thêm header cố định với logo và navigation menu
- 🎨 Hero section với hình ảnh nền đẹp mắt và gradient overlay
- 📸 Features section giới thiệu tính năng với images
- 🎯 Call-to-action section kêu gọi đăng ký
- 🦶 Footer đầy đủ với thông tin công ty và social media links
- 📱 Responsive design tối ưu cho mọi thiết bị

**Components Created:**
- `app/page.tsx` - Landing page mới với hero, features, CTA sections
- `app/components/Footer.tsx` - Footer component với links và social media
- `app/components/SurveyCheckRoute.tsx` - 组件检查用户是否已完成调查

**Dashboard Updates:**
- Cập nhật header dashboard với Material Symbols icons
- Thêm logo Wanderlust và navigation menu
- Cập nhật UserMenu với dropdown menu style mới
- Thêm welcome banner với background image

### 🔐 Login Flow Improvements (2025-01-26)

**问题修复:**
- ✅ 修复登录后直接跳转到dashboard，跳过调查步骤的问题
- ✅ 登录后自动检查用户是否完成调查
- ✅ 未完成调查的用户自动重定向到 `/preferences`
- ✅ 已完成调查的用户直接进入 `/dashboard`

**修改的文件:**
- `app/login/components/LoginForm.tsx` - 添加调查检查逻辑
- `app/components/SurveyCheckRoute.tsx` - 新建组件用于检查调查状态
- `app/dashboard/page.tsx` - 添加 SurveyCheckRoute 保护

**流程:**
1. Người dùng đăng nhập → Kiểm tra có preferences không
2. Nếu không có preferences → Redirect đến `/preferences` 
3. Hoàn thành khảo sát → Submit đến backend → Redirect đến `/dashboard`
4. Lần đăng nhập sau → Có preferences → Vào thẳng `/dashboard`

**Debug Guide:**
- Mở Chrome DevTools (F12)
- Xem Console để kiểm tra các log messages
- Kiểm tra Network tab để xem API calls
- Tìm "Login:" và "SurveyCheck:" logs để debug

**Cách test:**
1. Clear localStorage: `localStorage.clear()`
2. Tạo tài khoản mới hoặc login
3. Xem console để debug flow
4. Kiểm tra xem có chuyển đến `/preferences` không

## 📄 License

Dự án này được phát triển cho mục đích học tập và báo cáo. Tất cả quyền được bảo lưu.

---

**Developed with ❤️ for Phapbot**
