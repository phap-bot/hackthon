# 🔍 Khảo sát Flow Debug Guide

## Vấn đề
Người dùng đăng nhập nhưng không được chuyển đến trang khảo sát.

## Cách Debug

### 1. Mở Chrome DevTools
- Nhấn `F12` hoặc `Ctrl+Shift+I`
- Chuyển đến tab **Console**

### 2. Kiểm tra Login Flow
Khi đăng nhập, bạn sẽ thấy các log messages:

```
Login: Checking user preferences...
Login: Preferences response status: 404
Login: Người dùng chưa hoàn thành khảo sát, chuyển đến trang khảo sát
```

**Nếu thấy status 200 thay vì 404:**
- Người dùng đã có preferences
- Sẽ chuyển trực tiếp đến dashboard

### 3. Kiểm tra Dashboard
Khi vào dashboard, console sẽ hiển thị:

```
SurveyCheck: Checking token... true
SurveyCheck: Calling /api/preferences
SurveyCheck: Response status: 404
SurveyCheck: No preferences found, redirecting to survey
```

### 4. Kiểm tra Network Tab
- Mở tab **Network**
- Tìm request đến `/api/preferences`
- Kiểm tra response status:
  - `200 OK` = Có preferences
  - `404 Not Found` = Không có preferences
  - `401 Unauthorized` = Token không hợp lệ

## Quy trình Test

### Test 1: User Mới (Chưa khảo sát)
```bash
# 1. Clear localStorage
localStorage.clear()

# 2. Login với tài khoản mới
# 3. Kiểm tra console
# Expected: Redirect to /preferences

# 4. Hoàn thành khảo sát
# 5. Submit
# Expected: Redirect to /dashboard
```

### Test 2: User Cũ (Đã khảo sát)
```bash
# 1. Login với tài khoản đã có preferences
# 2. Kiểm tra console
# Expected: 
# - Login: User has preferences
# - Redirect to /dashboard
```

### Test 3: Truy cập Dashboard trực tiếp
```bash
# 1. Trong khi logged in
# 2. Truy cập trực tiếp: localhost:3000/dashboard
# 3. Kiểm tra console
# Expected:
# - SurveyCheck: No preferences found
# - Redirect to /preferences
```

## Các File Cần Kiểm Tra

### 1. Login Flow
**File:** `app/login/components/LoginForm.tsx`
**Function:** `handleSubmit`
**Lines:** 66-90

### 2. Survey Check Component
**File:** `app/components/SurveyCheckRoute.tsx`
**Function:** `checkSurveyStatus`
**Lines:** 14-55

### 3. Dashboard Page
**File:** `app/dashboard/page.tsx`
**Lines:** 145 (Bọc với SurveyCheckRoute)

## Backend Endpoints

### GET /api/preferences
- **Purpose:** Kiểm tra user có preferences không
- **Response 200:** User có preferences
- **Response 404:** User chưa có preferences
- **Response 401:** Unauthorized

### POST /api/survey/submit
- **Purpose:** Submit khảo sát
- **Payload:** Survey data
- **Response:** Success message

## Console Commands

### Debug Login
```javascript
// Check token
localStorage.getItem('access_token')

// Check preferences
fetch('/api/preferences', {
  headers: {'Authorization': 'Bearer ' + localStorage.getItem('access_token')}
}).then(r => console.log(r.status))
```

### Clear và Reset
```javascript
// Clear all
localStorage.clear()

// Remove specific
localStorage.removeItem('access_token')
localStorage.removeItem('refresh_token')
```

## Troubleshooting

### Vấn đề: Không chuyển đến /preferences
**Giải pháp:**
1. Kiểm tra console có log "Login:" không
2. Kiểm tra response status của /api/preferences
3. Nếu status 200, user đã có preferences

### Vấn đề: Chuyển vòng lặp
**Giải pháp:**
1. Clear localStorage
2. Kiểm tra network tab
3. Xem có redirect loop không

### Vấn đề: Dashboard không redirect
**Giải pháp:**
1. Kiểm tra SurveyCheckRoute có được wrap không
2. Kiểm tra console logs
3. Kiểm tra token có hợp lệ không

## Expected Flow

```
┌─────────────────┐
│   Login Page    │
└────────┬────────┘
         │
         ↓
    Login Success
         │
         ↓
┌──────────────────┐
│ Check Preferences │
└────────┬──────────┘
         │
    ┌────┴────┐
    │         │
  404       200
    │         │
    ↓         ↓
Preferences Dashboard
```

## Contact
Nếu vẫn gặp vấn đề, kiểm tra:
1. Backend có đang chạy không
2. CORS configuration
3. Token expiration
4. Network connectivity

