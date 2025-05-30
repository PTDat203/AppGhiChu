# API Ghi Chú - Hướng Dẫn Sử Dụng

## Cài Đặt

1. Cài đặt dependencies:
```bash
npm install
```

2. Tạo file `.env` từ `.env.example`:
```bash
cp .env.example .env
```

3. Cập nhật thông tin trong file `.env`:
- `DB_URI`: Đường dẫn MongoDB 
- `JWT_SECRET`: Key bí mật cho JWT (nên dài và phức tạp)

4. Khởi chạy server:
```bash
npm run dev
```

## API Endpoints

### Authentication

#### Đăng ký
```
POST /api/auth/register
Content-Type: application/json

{
  "username": "myusername",
  "email": "user@example.com", 
  "password": "123456"
}
```

#### Đăng nhập
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "123456"
}
```

#### Lấy thông tin profile
```
GET /api/auth/profile
Authorization: Bearer <token>
```

### Notes (Cần token)

#### Lấy ghi chú hôm nay
```
GET /api/notes/today
Authorization: Bearer <token>
```

#### Lấy tất cả ghi chú
```
GET /api/notes?page=1&limit=10&category=personal&search=từ_khóa
Authorization: Bearer <token>
```

#### Tạo ghi chú mới
```
POST /api/notes
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Tiêu đề ghi chú",
  "content": "Nội dung ghi chú",
  "category": "personal", // personal, work, study, reminder, other
  "priority": "medium",   // low, medium, high
  "tags": ["tag1", "tag2"],
  "dueDate": "2024-12-31"
}
```

#### Cập nhật ghi chú
```
PUT /api/notes/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Tiêu đề mới",
  "content": "Nội dung mới",
  "isCompleted": true
}
```

#### Xóa ghi chú
```
DELETE /api/notes/:id
Authorization: Bearer <token>
```

#### Lưu trữ/Bỏ lưu trữ ghi chú
```
PATCH /api/notes/:id/archive
Authorization: Bearer <token>
```

## Cách sử dụng

1. **Đăng ký tài khoản** bằng POST `/api/auth/register`
2. **Đăng nhập** bằng POST `/api/auth/login` để lấy token
3. **Sử dụng token** trong header `Authorization: Bearer <token>` cho các API khác
4. **Tạo, sửa, xóa ghi chú** trong ngày hiện tại

## Ví dụ sử dụng với curl

```bash
# Đăng ký
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"123456"}'

# Đăng nhập
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456"}'

# Tạo ghi chú (thay <token> bằng token thật)
curl -X POST http://localhost:3001/api/notes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"title":"Ghi chú đầu tiên","content":"Nội dung ghi chú của tôi"}'
```
