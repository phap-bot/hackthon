# 🗄️ Hướng dẫn kết nối MongoDB Compass

## 📋 Tổng quan

Hướng dẫn chi tiết cách kết nối MongoDB Compass với database của dự án Travel Planner.

## 🔧 Cài đặt MongoDB Compass

### 1. Tải và cài đặt MongoDB Compass

**Windows:**
1. Truy cập: https://www.mongodb.com/try/download/compass
2. Tải phiên bản Community Server
3. Chạy file installer và làm theo hướng dẫn

**macOS:**
```bash
# Sử dụng Homebrew
brew install --cask mongodb-compass

# Hoặc tải từ website
# https://www.mongodb.com/try/download/compass
```

**Linux:**
```bash
# Ubuntu/Debian
wget https://downloads.mongodb.com/compass/mongodb-compass_1.40.2_amd64.deb
sudo dpkg -i mongodb-compass_1.40.2_amd64.deb

# CentOS/RHEL
wget https://downloads.mongodb.com/compass/mongodb-compass-1.40.2-1.x86_64.rpm
sudo rpm -i mongodb-compass-1.40.2-1.x86_64.rpm
```

## 🐳 Kết nối với Docker MongoDB

### 1. Kiểm tra container MongoDB

```bash
# Kiểm tra container đang chạy
docker ps | grep mongodb

# Nếu chưa chạy, khởi động
cd backend
docker-compose up -d mongodb
```

### 2. Thông tin kết nối Docker

**Connection String:**
```
mongodb://admin:password123@localhost:27017/travel_planner?authSource=admin
```

**Chi tiết:**
- **Host:** localhost
- **Port:** 27017
- **Username:** admin
- **Password:** password123
- **Database:** travel_planner
- **Auth Source:** admin

### 3. Kết nối trong MongoDB Compass

1. **Mở MongoDB Compass**
2. **Click "New Connection"**
3. **Chọn "Fill in connection fields individually"**
4. **Điền thông tin:**
   - **Hostname:** localhost
   - **Port:** 27017
   - **Authentication:** Username/Password
   - **Username:** admin
   - **Password:** password123
   - **Authentication Database:** admin
5. **Click "Connect"**

## 💻 Kết nối với MongoDB Local

### 1. Cài đặt MongoDB Community Server

**Windows:**
1. Tải từ: https://www.mongodb.com/try/download/community
2. Chạy installer
3. Chọn "Complete" installation
4. Cài đặt MongoDB Compass (tùy chọn)

**macOS:**
```bash
# Sử dụng Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Khởi động MongoDB
brew services start mongodb/brew/mongodb-community
```

**Linux (Ubuntu):**
```bash
# Import public key
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -

# Add repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Install MongoDB
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

### 2. Kết nối MongoDB Local

**Connection String:**
```
mongodb://localhost:27017/travel_planner_dev
```

**Chi tiết:**
- **Host:** localhost
- **Port:** 27017
- **Database:** travel_planner_dev
- **Authentication:** None (nếu chưa bật auth)

## 🔍 Kiểm tra kết nối

### 1. Test connection từ terminal

```bash
# Kết nối với MongoDB
mongosh

# Hoặc với Docker
docker exec -it travel_planner_mongodb mongosh

# Kiểm tra databases
show dbs

# Chọn database
use travel_planner

# Kiểm tra collections
show collections

# Xem dữ liệu
db.users.find().limit(5)
db.trips.find().limit(5)
```

### 2. Test từ backend

```bash
cd backend
python -c "
from app.database import get_database
db = get_database()
print('Database name:', db.name)
print('Collections:', db.list_collection_names())
"
```

## 📊 Quản lý dữ liệu trong Compass

### 1. Xem Collections

Sau khi kết nối thành công, bạn sẽ thấy:

```
travel_planner/
├── users/          # Thông tin người dùng
├── trips/          # Chuyến đi
├── activities/     # Hoạt động trong chuyến đi
├── feedback/       # Phản hồi
└── places/         # Địa điểm (nếu có)
```

### 2. Xem dữ liệu

**Users Collection:**
```javascript
// Tìm tất cả users
db.users.find()

// Tìm user theo email
db.users.find({email: "user@example.com"})

// Đếm số users
db.users.countDocuments()
```

**Trips Collection:**
```javascript
// Tìm tất cả trips
db.trips.find()

// Tìm trips của user cụ thể
db.trips.find({user_id: ObjectId("...")})

// Tìm trips theo destination
db.trips.find({destination: /Hà Nội/i})
```

**Activities Collection:**
```javascript
// Tìm activities của trip
db.activities.find({trip_id: ObjectId("...")})

// Tìm activities theo type
db.activities.find({type: "restaurant"})
```

### 3. Tạo Index

```javascript
// Tạo index cho email (unique)
db.users.createIndex({email: 1}, {unique: true})

// Tạo index cho user_id trong trips
db.trips.createIndex({user_id: 1, created_at: -1})

// Tạo index cho trip_id trong activities
db.activities.createIndex({trip_id: 1, day: 1})
```

## 🛠️ Troubleshooting

### 1. Lỗi kết nối

**"Connection refused":**
```bash
# Kiểm tra MongoDB có chạy không
docker ps | grep mongodb

# Khởi động lại nếu cần
docker-compose restart mongodb
```

**"Authentication failed":**
```bash
# Kiểm tra credentials trong docker-compose.yml
# Username: admin
# Password: password123
# Auth Source: admin
```

**"Network error":**
```bash
# Kiểm tra port có bị chiếm không
netstat -tulpn | grep 27017

# Kiểm tra firewall
sudo ufw status
```

### 2. Lỗi database

**"Database not found":**
```bash
# Database sẽ được tạo tự động khi có dữ liệu
# Hoặc tạo thủ công
use travel_planner
db.createCollection("users")
```

**"Collection not found":**
```bash
# Collections được tạo tự động khi insert dữ liệu
# Hoặc tạo thủ công
db.createCollection("trips")
```

## 📈 Monitoring và Performance

### 1. Xem thống kê database

```javascript
// Thống kê database
db.stats()

// Thống kê collection
db.users.stats()

// Xem indexes
db.users.getIndexes()
```

### 2. Query Performance

```javascript
// Explain query
db.users.find({email: "user@example.com"}).explain("executionStats")

// Xem slow queries
db.setProfilingLevel(2, {slowms: 100})
db.system.profile.find().sort({ts: -1}).limit(5)
```

## 🔒 Security

### 1. Tạo user mới

```javascript
// Tạo user cho ứng dụng
use admin
db.createUser({
  user: "travel_app",
  pwd: "secure_password",
  roles: [
    { role: "readWrite", db: "travel_planner" }
  ]
})
```

### 2. Kết nối với user mới

**Connection String:**
```
mongodb://travel_app:secure_password@localhost:27017/travel_planner
```

## 📝 Scripts hữu ích

### 1. Backup database

```bash
# Backup toàn bộ database
mongodump --uri="mongodb://admin:password123@localhost:27017/travel_planner?authSource=admin" --out=backup/

# Backup collection cụ thể
mongodump --uri="mongodb://admin:password123@localhost:27017/travel_planner?authSource=admin" --collection=users --out=backup/
```

### 2. Restore database

```bash
# Restore toàn bộ database
mongorestore --uri="mongodb://admin:password123@localhost:27017/travel_planner?authSource=admin" backup/travel_planner/

# Restore collection cụ thể
mongorestore --uri="mongodb://admin:password123@localhost:27017/travel_planner?authSource=admin" backup/travel_planner/users.bson
```

### 3. Export/Import JSON

```bash
# Export collection to JSON
mongoexport --uri="mongodb://admin:password123@localhost:27017/travel_planner?authSource=admin" --collection=users --out=users.json

# Import JSON to collection
mongoimport --uri="mongodb://admin:password123@localhost:27017/travel_planner?authSource=admin" --collection=users --file=users.json
```

## 🎯 Kết luận

Với hướng dẫn này, bạn có thể:

- ✅ **Cài đặt MongoDB Compass**
- ✅ **Kết nối với Docker MongoDB**
- ✅ **Kết nối với MongoDB Local**
- ✅ **Quản lý dữ liệu trong Compass**
- ✅ **Troubleshoot các lỗi thường gặp**
- ✅ **Monitor performance**
- ✅ **Backup và restore dữ liệu**

Bây giờ bạn có thể dễ dàng quản lý database của dự án Travel Planner! 🗄️✨

