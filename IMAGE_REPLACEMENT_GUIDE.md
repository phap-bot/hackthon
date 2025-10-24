# 📸 HƯỚNG DẪN THAY THẾ HÌNH ẢNH CHO TRAVEL WEBSITE

## 🎯 Tổng quan
File này hướng dẫn chi tiết cách thay thế tất cả hình ảnh từ design agency thành travel-related images cho dự án báo cáo của bạn.

## 📁 Cấu trúc thư mục hình ảnh

### 1. **`public/assets/banner/`** - Hero Section Images
**Cần thay thế:**
- `dashboard.svg` → `travel-hero.svg`
- `shapes.svg` → `travel-shapes.svg`

**Gợi ý nội dung:**
- Hình ảnh du lịch, máy bay, bản đồ thế giới
- Background với gradient màu xanh dương và xanh lá
- Icons du lịch như máy bay, vali, passport

### 2. **`public/assets/buyers/`** - Statistics Icons
**Cần thay thế:**
- `happybuyers.svg` → `happy-travelers.svg`
- `ourbuyers.svg` → `our-travelers.svg`
- `projectcompleted.svg` → `trips-completed.svg`
- `teammembers.svg` → `travel-experts.svg`

**Gợi ý nội dung:**
- Icon người du lịch vui vẻ
- Icon nhóm du khách
- Icon checklist hoàn thành chuyến đi
- Icon chuyên gia du lịch với headset

### 3. **`public/assets/carousel/`** - Partner Logos
**Cần thay thế:**
- `google.svg` → `booking-com.svg`
- `garnier.png` → `airbnb.svg`
- `slack.png` → `expedia.svg`
- `udemy.png` → `tripadvisor.svg`

**Thêm mới:**
- `agoda.svg`
- `hotels-com.svg`
- `kayak.svg`
- `skyscanner.svg`

**Gợi ý:**
- Logo các trang web du lịch nổi tiếng
- Kích thước: 150x150px
- Format: SVG hoặc PNG với nền trong suốt

### 4. **`public/assets/clientsay/`** - Testimonials
**Cần thay thế:**
- `avatars.png` → `traveler-avatars.png`
- `bgimage.svg` → `travel-testimonial-bg.svg`
- `user.png` → `traveler-photo.png`

**Gợi ý nội dung:**
- Hình ảnh nhóm du khách đa dạng
- Background du lịch với màu sắc travel theme
- Ảnh chân dung du khách thực tế

### 5. **`public/assets/footer/`** - Footer Assets
**Cần thay thế:**
- `logo.svg` → `travel-logo.svg`

**Giữ nguyên:**
- `facebook.svg`, `twitter.svg`, `instagram.svg` (social media icons)
- `email.svg`, `telephone.svg`, `mask.svg` (contact icons)

**Gợi ý logo:**
- Logo với tên "Travel Explorer"
- Icon máy bay hoặc bản đồ
- Màu sắc: Primary blue (#2563EB)

### 6. **`public/assets/network/`** - World Map & Flags
**Cần thay thế:**
- `map.jpg`, `map.png` → `travel-map.png`

**Cập nhật flags:**
- `bangladesh.svg` → `vietnam.svg`
- `america.svg` → `japan.svg`
- `australia.svg` → `thailand.svg`
- `china.svg` → `singapore.svg`

**Gợi ý:**
- Bản đồ thế giới với highlight các điểm đến du lịch
- Cờ các quốc gia châu Á phổ biến
- Kích thước: 55x55px cho flags

### 7. **`public/assets/newsletter/`** - Newsletter Background
**Cần thay thế:**
- `bgImage.png` → `travel-newsletter-bg.png`
- `circel.svg` → `travel-circle.svg`
- `leaf.svg` → `travel-leaf.svg`

**Giữ nguyên:**
- `plane.svg` (phù hợp với travel theme)

**Gợi ý nội dung:**
- Background với hình ảnh du lịch
- Decorative elements với travel theme
- Màu sắc: Blue gradient

### 8. **`public/assets/provide/`** - Services Icons
**Cần thay thế:**
- `arrow.svg` → `travel-arrow.svg`
- `graphic.svg` → `travel-planning.svg`
- `heaking.svg` → `travel-booking.svg`
- `marketing.svg` → `travel-marketing.svg`
- `uidesign.svg` → `travel-experience.svg`

**Thêm mới:**
- `travel-support.svg`

**Gợi ý nội dung:**
- Icon lập kế hoạch du lịch (calendar + map)
- Icon đặt vé (airplane + hotel)
- Icon trải nghiệm (star + heart)
- Icon hỗ trợ (headset + 24/7)
- Kích thước: 64x64px

### 9. **`public/assets/why/`** - Features Section
**Cần thay thế:**
- `iPad.png` → `travel-app-mockup.png`

**Giữ nguyên:**
- `check.svg` (icon checkmark)

**Gợi ý nội dung:**
- Mockup ứng dụng du lịch trên tablet/phone
- Screenshot giao diện travel app
- Kích thước: 4000x900px

## 🎨 Yêu cầu kỹ thuật

### Format & Kích thước
- **SVG**: Cho icons và logos (scalable)
- **PNG**: Cho hình ảnh phức tạp với nền trong suốt
- **JPG**: Cho hình ảnh background (không cần nền trong suốt)

### Color Scheme
Sử dụng bảng màu travel theme:
- **Primary**: #2563EB (Ocean Blue)
- **Secondary**: #059669 (Forest Green)
- **Accent**: #F59E0B (Sunset Orange)
- **Sky**: #0EA5E9 (Sky Blue)
- **Ocean**: #1E40AF (Deep Ocean)

### Optimization
- Nén hình ảnh để tối ưu tốc độ load
- Sử dụng WebP format khi có thể
- Responsive images cho mobile

## 🔧 Cách thay thế

### Bước 1: Chuẩn bị hình ảnh
1. Tạo hoặc tải về hình ảnh phù hợp
2. Đặt tên file theo convention đã định
3. Tối ưu kích thước và chất lượng

### Bước 2: Thay thế file
1. Backup hình ảnh cũ
2. Copy hình ảnh mới vào đúng thư mục
3. Đảm bảo tên file chính xác

### Bước 3: Test
1. Chạy `npm run dev`
2. Kiểm tra website tại localhost:3000
3. Verify hình ảnh hiển thị đúng

## 📝 Checklist

- [ ] Banner images (2 files)
- [ ] Statistics icons (4 files)
- [ ] Partner logos (8 files)
- [ ] Testimonial images (3 files)
- [ ] Footer logo (1 file)
- [ ] World map & flags (5 files)
- [ ] Newsletter background (3 files)
- [ ] Service icons (6 files)
- [ ] App mockup (1 file)

## 🎯 Kết quả mong đợi

Sau khi thay thế tất cả hình ảnh, website sẽ có:
- Giao diện hoàn toàn phù hợp với travel theme
- Hình ảnh chất lượng cao và nhất quán
- Trải nghiệm người dùng tốt hơn
- Sẵn sàng cho presentation báo cáo

## 💡 Tips

1. **Consistency**: Đảm bảo tất cả hình ảnh có cùng style và màu sắc
2. **Quality**: Sử dụng hình ảnh chất lượng cao
3. **Relevance**: Chọn hình ảnh phù hợp với nội dung
4. **Performance**: Tối ưu kích thước file để load nhanh
5. **Accessibility**: Thêm alt text mô tả cho hình ảnh

---

**Lưu ý**: Đây là dự án báo cáo, hãy đảm bảo sử dụng hình ảnh có bản quyền hoặc tự tạo để tránh vấn đề pháp lý.
