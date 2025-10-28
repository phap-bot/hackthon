# 🔍 Khảo sát Flow - Hướng dẫn Debug

## Quy trình đúng

```
1. User Login → Kiểm tra preferences
   ↓
2. Không có preferences → Redirect to /preferences ✅
   ↓
3. User điền khảo sát (3 steps)
   ↓
4. Submit → Call /api/survey/submit
   ↓
5. Backend lưu data → Response OK
   ↓
6. Redirect to /dashboard ✅
   ↓
7. Lần login sau → Có preferences → Vào thẳng /dashboard
```

## Files quan trọng

### 1. Login Flow
**File:** `app/login/components/LoginForm.tsx`
**Function:** `handleSubmit` (Lines 51-96)

**Logic:**
```typescript
Login Success → Check /api/preferences
  ├─ 404 (no preferences) → window.location.href = '/preferences'
  └─ 200 (has preferences) → window.location.href = '/dashboard'
```

### 2. Survey Check Component
**File:** `app/components/SurveyCheckRoute.tsx`

**Logic:**
```typescript
Component Mount → Check /api/preferences
  ├─ 404 → window.location.href = '/preferences'
  └─ 200 → Render children (dashboard content)
```

### 3. Preferences Page
**File:** `app/preferences/page.tsx`
**Function:** `handleSubmit` (Lines 150-211)

**Logic:**
```typescript
Submit Survey → Call /api/survey/submit
  ├─ Success → window.location.href = '/dashboard'
  └─ Error → Show error message
```

## Cách Debug

### Bước 1: Clear tất cả
```javascript
// Mở Console (F12)
localStorage.clear()
console.log('Cleared localStorage')
```

### Bước 2: Login
1. Đi đến `/login`
2. Nhập credentials
3. Xem Console:
   ```
   Login: Checking user preferences...
   Login: Preferences response status: 404
   Login: Người dùng chưa hoàn thành khảo sát
   ```
4. Should redirect to `/preferences`

### Bước 3: Check Preferences Page
1. URL should be `http://localhost:3000/preferences`
2. See survey form with 3 steps
3. Progress bar showing 33% → 66% → 100%

### Bước 4: Submit Survey
1. Fill all 3 steps
2. Click "Hoàn thành"
3. Check Console:
   ```
   Preferences Submit: Starting...
   Preferences Submit: Sending data to backend: {...}
   Preferences Submit: Response status: 200
   Preferences Submit: Redirecting to dashboard...
   ```
4. Should redirect to `/dashboard`

### Bước 5: Check Dashboard
1. URL should be `http://localhost:3000/dashboard`
2. Check Console:
   ```
   SurveyCheck: Checking token... true
   SurveyCheck: Calling /api/preferences
   SurveyCheck: Response status: 200
   SurveyCheck: User has preferences
   ```
3. Dashboard should render

## Console Commands để Debug

### Check Current State
```javascript
// Check token
console.log('Token:', localStorage.getItem('access_token'))

// Check if has preferences
fetch('/api/preferences', {
  headers: {'Authorization': 'Bearer ' + localStorage.getItem('access_token')}
}).then(r => {
  console.log('Status:', r.status)
  return r.json()
}).then(data => console.log('Data:', data))
```

### Test Manual Redirect
```javascript
// Test to preferences
window.location.href = '/preferences'

// Test to dashboard
window.location.href = '/dashboard'
```

### Clear và Reset
```javascript
// Clear all
localStorage.clear()
window.location.reload()
```

## Troubleshooting

### ❌ Vấn đề 1: Login không redirect
**Symptoms:**
- Login thành công nhưng không redirect
- Không thấy console log "Login: Checking..."

**Giải pháp:**
1. Check LoginForm.tsx line 67-89
2. Đảm bảo code không bị skip
3. Check network tab xem có call /api/preferences không

### ❌ Vấn đề 2: Redirect loop
**Symptoms:**
- Page refresh liên tục
- Console log liên tục

**Giải pháp:**
1. Check SurveyCheckRoute.tsx
2. Đảm bảo không có infinite loop
3. Add more console.logs

### ❌ Vấn đề 3: Không có preferences nhưng vẫn vào dashboard
**Symptoms:**
- User mới vào thẳng dashboard
- Không thấy khảo sát

**Giải pháp:**
1. Check LoginForm handleSubmit
2. Check có import đúng không
3. Check /api/preferences endpoint

### ❌ Vấn đề 4: Submit không lưu
**Symptoms:**
- Submit survey nhưng không redirect
- Error message hiển thị

**Giải pháp:**
1. Check /api/survey/submit exists
2. Check network tab
3. Check backend có running không

## Expected Console Logs

### Scenario 1: User mới login
```
Login: Checking user preferences...
Login: Preferences response status: 404
Login: Người dùng chưa hoàn thành khảo sát, chuyển đến trang khảo sát
→ Redirect to /preferences
```

### Scenario 2: User submit survey
```
Preferences Submit: Starting...
Preferences Submit: Sending data to backend: {...}
Preferences Submit: Response status: 200
Preferences Submit: Redirecting to dashboard...
→ Redirect to /dashboard
```

### Scenario 3: User có preferences vào dashboard
```
SurveyCheck: Checking token... true
SurveyCheck: Calling /api/preferences
SurveyCheck: Response status: 200
SurveyCheck: User has preferences
→ Render dashboard
```

## Files Checklist

- ✅ `app/login/components/LoginForm.tsx` - Check preferences after login
- ✅ `app/components/SurveyCheckRoute.tsx` - Protect dashboard
- ✅ `app/preferences/page.tsx` - Survey form
- ✅ `app/api/survey/submit/route.ts` - Submit endpoint
- ✅ `app/dashboard/page.tsx` - Wrap with SurveyCheckRoute

## Test Checklist

- [ ] Clear localStorage
- [ ] Login với user mới
- [ ] Thấy "Login: Checking..." log
- [ ] Redirect to /preferences
- [ ] Survey form hiển thị
- [ ] Điền 3 steps
- [ ] Submit survey
- [ ] Thấy "Preferences Submit: Sending..." log
- [ ] Redirect to /dashboard
- [ ] Dashboard hiển thị
- [ ] Login lại
- [ ] Vào thẳng /dashboard

## Contact

Nếu vẫn gặp vấn đề:
1. Check browser console
2. Check network tab
3. Check backend logs
4. Đảm bảo backend đang chạy

