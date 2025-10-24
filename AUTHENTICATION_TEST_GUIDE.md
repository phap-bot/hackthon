# 🔐 Hướng dẫn Test Authentication Logic

## ✅ **Các vấn đề đã được sửa:**

### **1. Backend Register API**
- ✅ Trả về đầy đủ thông tin user thay vì chỉ `user_id` và `username`
- ✅ Bao gồm `full_name`, `email`, `avatar_url`, `is_active`, `created_at`, `updated_at`

### **2. Frontend RegisterForm**
- ✅ Sử dụng `useAuth` hook thay vì gọi API trực tiếp
- ✅ Sử dụng `router.push('/dashboard')` thay vì `window.location.href = '/'`
- ✅ Tự động login user sau khi đăng ký thành công

### **3. useAuth Hook**
- ✅ Register function tự động login user và cập nhật auth state
- ✅ Extract user data đúng cách từ response
- ✅ Store token và user data vào localStorage

### **4. Authentication Logic**
- ✅ ProtectedRoute chỉ cho phép truy cập khi đã đăng nhập
- ✅ UserMenu chỉ hiển thị khi có user data
- ✅ Dashboard chỉ hiển thị khi user đã authenticated

## 🧪 **Test Scenarios:**

### **Scenario 1: Đăng ký tài khoản mới**
1. Truy cập `/register`
2. Điền thông tin:
   - Tên: `Nguyễn Văn Test`
   - Email: `test@example.com`
   - Mật khẩu: `123456`
3. Click "Đăng ký"
4. **Expected:** Tự động redirect đến `/dashboard` và hiển thị tên "Nguyễn Văn Test"

### **Scenario 2: Đăng nhập với tài khoản có sẵn**
1. Truy cập `/login`
2. Đăng nhập với:
   - Username: `user_an` / Password: `123456`
   - **Expected:** Hiển thị "Nguyễn Văn An"
3. Hoặc:
   - Username: `user_linh` / Password: `123456`
   - **Expected:** Hiển thị "Trần Thị Linh"

### **Scenario 3: Kiểm tra UserMenu**
1. Sau khi đăng nhập, kiểm tra góc phải trên
2. **Expected:** Hiển thị avatar với initials từ tên đầy đủ
3. **Expected:** Hiển thị tên đầy đủ thay vì "User"
4. **Expected:** Role "Nhà thám hiểm"

### **Scenario 4: Kiểm tra Dashboard**
1. Sau khi đăng nhập, kiểm tra dashboard
2. **Expected:** Welcome message hiển thị đúng tên
3. **Expected:** Không hiển thị user info khi chưa đăng nhập

## 🔍 **Test Accounts Available:**

| Username | Password | Full Name | Expected Display |
|----------|----------|-----------|------------------|
| `user_an` | `123456` | Nguyễn Văn An | **Nguyễn Văn An** |
| `user_linh` | `123456` | Trần Thị Linh | **Trần Thị Linh** |
| `user_phap` | `123456` | Lê Tấn Pháp | **Lê Tấn Pháp** |
| `user_hoa` | `123456` | Phạm Thị Hoa | **Phạm Thị Hoa** |
| `testprefs` | `123456` | Test Preferences User | **Test Preferences User** |

## 🚀 **Cách Test:**

### **Test 1: Register Flow**
```bash
# 1. Truy cập http://localhost:3000/register
# 2. Điền form với tên mới
# 3. Submit form
# 4. Kiểm tra redirect đến dashboard
# 5. Kiểm tra tên hiển thị đúng
```

### **Test 2: Login Flow**
```bash
# 1. Truy cập http://localhost:3000/login
# 2. Đăng nhập với user_an / 123456
# 3. Kiểm tra hiển thị "Nguyễn Văn An"
# 4. Logout và thử user_linh / 123456
# 5. Kiểm tra hiển thị "Trần Thị Linh"
```

### **Test 3: Authentication State**
```bash
# 1. Truy cập http://localhost:3000/dashboard khi chưa đăng nhập
# 2. Expected: Redirect đến /login
# 3. Đăng nhập và truy cập dashboard
# 4. Expected: Hiển thị đúng tên user
```

## 📊 **Expected Results:**

### **✅ Khi đã đăng nhập:**
- UserMenu hiển thị tên đầy đủ
- Avatar initials từ tên đầy đủ
- Dashboard welcome message đúng tên
- Không hiển thị "User" generic

### **✅ Khi chưa đăng nhập:**
- Redirect đến login page
- Không hiển thị user info
- ProtectedRoute hoạt động đúng

### **✅ Register Flow:**
- Đăng ký thành công → Tự động login → Redirect dashboard
- Hiển thị đúng tên ngay sau khi đăng ký
- Không cần đăng nhập lại

## 🎯 **Kết quả mong đợi:**

**Tất cả các vấn đề logic authentication đã được sửa:**
- ✅ Đăng ký xong tự động redirect đến dashboard
- ✅ Hiển thị đúng tên đăng ký thay vì "User"
- ✅ Logic authentication state đúng
- ✅ Không hiển thị user info khi chưa đăng nhập
- ✅ Tất cả trường hợp đều hoạt động đúng
