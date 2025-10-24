# 🧪 Integrated Test Suite

Thư mục này chứa các test tích hợp và tối ưu cho dự án Wanderlust Travel Explorer.

## 📁 Cấu trúc Test

### 🔐 `test_auth_integration.py`
- **Chức năng**: Test toàn bộ hệ thống authentication
- **Bao gồm**: 
  - Registration flow
  - Login flow
  - /me endpoint
  - Token validation

### 🎯 `test_preferences_integration.py`
- **Chức năng**: Test preferences và recommendations system
- **Bao gồm**:
  - Preferences submission
  - Recommendations generation
  - Survey options
  - User preferences validation

### 🗺️ `test_maps_integration.py`
- **Chức năng**: Test maps và travel planner functionality
- **Bao gồm**:
  - Maps attractions
  - Maps restaurants
  - Maps hotels
  - Travel planner generation

### 🚀 `run_all_tests.py`
- **Chức năng**: Test runner chính chạy tất cả test suites
- **Tính năng**:
  - Chạy tuần tự tất cả test suites
  - Báo cáo chi tiết kết quả
  - Tổng kết success rate

## 🚀 Cách sử dụng

### Chạy tất cả tests:
```bash
cd tests
python run_all_tests.py
```

### Chạy test riêng lẻ:
```bash
cd tests
python test_auth_integration.py
python test_preferences_integration.py
python test_maps_integration.py
```

## 📋 Yêu cầu

- Python 3.11+
- Backend server đang chạy trên `http://localhost:8000`
- MongoDB đang hoạt động
- Tất cả dependencies đã được cài đặt

## 🔧 Cấu hình

Các test sẽ tự động:
- Tạo test users nếu cần
- Setup authentication tokens
- Cleanup sau khi test xong

## 📊 Kết quả Test

Test runner sẽ hiển thị:
- ✅ Status của từng test suite
- 📊 Tổng kết số lượng passed/failed
- 🎯 Success rate tổng thể
- ⚠️ Chi tiết lỗi nếu có

## 🧹 Cleanup

Sau khi tích hợp các test này, các file test cũ đã được:
- ✅ Tích hợp vào các test suite chính
- ✅ Loại bỏ duplicate code
- ✅ Tối ưu cấu trúc và performance
- ✅ Chuẩn hóa error handling

---

**Lưu ý**: Đảm bảo backend server đang chạy trước khi chạy tests!
