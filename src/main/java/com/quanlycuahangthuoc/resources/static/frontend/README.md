# 🏥 Hệ Thống Quản Lý Nhà Thuốc Y Tế

## 📋 Mô tả dự án

Hệ thống quản lý nhà thuoc với 2 giao diện:

- **Admin**: Quản lý toàn bộ hệ thống (nhân viên, khách hàng, thuoc, phiếu nhập, hóa đơn, tài khoản)
- **Nhân viên**: Quản lý thuốc, nhập hàng, bán hàng, xem hóa đơn

## 🚀 Cách chạy dự án

### 1. Chạy Backend (Spring Boot)

```bash
# Từ thư mục root của project
mvn spring-boot:run

# Hoặc
mvn clean install
java -jar target/QuanLyCuaHangThuocYTe-1.0.0.jar
```

Backend sẽ chạy tại: `http://localhost:8080`

### 2. Truy cập Frontend

Sau khi backend đã chạy, mở trình duyệt và truy cập:

**Trang đăng nhập**:

```
http://localhost:8080/frontend/html/login.html
```

## 👥 Tài khoản mặc định

### Admin

- **Username**: (cần tạo trong database)
- **Password**: (cần tạo trong database)
- **Loại TK**: Admin

### Nhân Viên

- **Username**: (cần tạo trong database)
- **Password**: (cần tạo trong database)
- **Loại TK**: NhanVien

## 📁 Cấu trúc Frontend

```
frontend/
├── html/
│   ├── login.html          # Trang đăng nhập chung
│   ├── idx_admin.html      # Dashboard Admin
│   └── idx_nv.html         # Dashboard Nhân viên
├── css/
│   ├── login.css           # Style cho login
│   ├── admin.css           # Style cho admin
│   └── nhanvien.css        # Style cho nhân viên
└── js/
    ├── login.js            # Logic đăng nhập
    ├── admin.js            # Logic admin
    └── nhanvien.js         # Logic nhân viên
```

## 🎯 Tính năng

### Admin có thể:

✅ Xem dashboard thống kê tổng quan
✅ Quản lý nhân viên (thêm, sửa, xóa)
✅ Quản lý khách hàng (thêm, sửa, xóa)
✅ Quản lý thuốc (thêm, sửa, xóa)
✅ Xem và quản lý phiếu nhập
✅ Xem tất cả hóa đơn
✅ Quản lý tài khoản

### Nhân viên có thể:

✅ Xem dashboard thống kê cá nhân
✅ Quản lý thuốc (thêm, chỉnh sửa)
✅ Tạo phiếu nhập hàng
✅ Bán hàng (tạo giỏ hàng, tạo hóa đơn)
✅ Xem danh sách hóa đơn
✅ Tìm kiếm thuốc
❌ KHÔNG thể quản lý nhân viên
❌ KHÔNG thể quản lý khách hàng

## 🔧 API Endpoints

### Tài khoản

- `POST /api/taikhoan/login-nhanvien` - Đăng nhập nhân viên/admin
- `POST /api/taikhoan/login-khach` - Đăng nhập khách
- `POST /api/taikhoan/dangky` - Đăng ký khách hàng
- `POST /api/taikhoan/dangky-nhanvien` - Tạo tài khoản nhân viên (Admin)
- `GET /api/taikhoan` - Lấy tất cả tài khoản
- `DELETE /api/taikhoan/{maTK}` - Xóa tài khoản

### Nhân viên

- `GET /api/nhanvien` - Lấy danh sách nhân viên
- `POST /api/nhanvien` - Thêm nhân viên
- `PUT /api/nhanvien` - Cập nhật nhân viên
- `DELETE /api/nhanvien/{maNV}` - Xóa nhân viên

### Khách hàng

- `GET /api/khachhang` - Lấy danh sách khách hàng
- `POST /api/khachhang` - Thêm khách hàng
- `PUT /api/khachhang` - Cập nhật khách hàng
- `DELETE /api/khachhang/{maKH}` - Xóa khách hàng

### Thuoc

- `GET /api/thuoc` - Lấy danh sách thuốc
- `GET /api/thuoc/{maThuoc}` - Lấy thuoc theo ID
- `POST /api/thuoc/them-thuoc` - Thêm thuốc
- `PUT /api/thuoc` - Cập nhật thuốc
- `DELETE /api/thuoc/{maThuoc}` - Xóa thuốc

### Phiếu nhập

- `GET /api/phieunhap` - Lấy danh sách phiếu nhập
- `GET /api/phieunhap/{maPN}` - Lấy phiếu nhập theo ID
- `POST /api/phieunhap` - Tạo phiếu nhập
- `DELETE /api/phieunhap/{maPN}` - Xóa phiếu nhập

### Hóa đơn

- `GET /api/hoadon` - Lấy danh sách hóa đơn
- `POST /api/hoadon` - Tạo hóa đơn
- `PUT /api/hoadon/thanhtoan` - Thanh toán hóa đơn
- `PUT /api/hoadon/huy` - Hủy hóa đơn

## 🎨 Giao diện

### Login Page

- Form đăng nhập đơn giản
- Tự động phân quyền sau khi đăng nhập thành công
- Admin → idx_admin.html
- NhanVien → idx_nv.html

### Admin Dashboard

- Sidebar menu với đầy đủ chức năng
- Dashboard thống kê với cards số liệu
- Bảng dữ liệu với chức năng CRUD
- Modal form cho thêm/sửa dữ liệu
- Thông báo realtime

### Nhân Viên Dashboard

- Sidebar menu với các chức năng giới hạn
- Dashboard thống kê cá nhân
- Trang bán hàng với giỏ hàng
- Tìm kiếm thuốc realtime
- Tính toán tự động

## 🔐 Phân quyền

| Chức năng          | Admin | Nhân viên |
| ------------------ | ----- | --------- |
| Dashboard          | ✅    | ✅        |
| Quản lý nhân viên  | ✅    | ❌        |
| Quản lý khách hàng | ✅    | ❌        |
| Quản lý thuốc      | ✅    | ✅        |
| Phiếu nhập         | ✅    | ✅        |
| Bán hàng           | ✅    | ✅        |
| Xem hóa đơn        | ✅    | ✅        |
| Quản lý tài khoản  | ✅    | ❌        |

## 📝 Lưu ý

1. **Cơ sở dữ liệu**: Đảm bảo MySQL đã chạy và database được tạo theo file `QuanLyNhaThuoc.sql`

2. **LoaiTaiKhoan trong DB**: Phải là "Admin" hoặc "NhanVien" (viết hoa chữ đầu)

3. **CORS**: Backend đã cấu hình `@CrossOrigin` cho tất cả controllers

4. **LocalStorage**: Frontend sử dụng localStorage để lưu thông tin đăng nhập

5. **API URL**: Mặc định là `http://localhost:8080/api` - có thể thay đổi trong file JS

## 🐛 Troubleshooting

### Lỗi không đăng nhập được:

- Kiểm tra backend có đang chạy không
- Kiểm tra loại tài khoản trong DB (Admin/NhanVien)
- Mở Console (F12) để xem lỗi API

### Lỗi CORS:

- Đảm bảo `@CrossOrigin` đã được thêm vào các Controller
- Kiểm tra file `WebConfig.java`

### Không load được dữ liệu:

- Kiểm tra API endpoint có đúng không
- Xem Network tab trong DevTools
- Kiểm tra database có dữ liệu không

## 🔄 Cập nhật database

Nếu database hiện tại có LoaiTaiKhoan viết HOA (ADMIN, NHANVIEN), cần update:

```sql
UPDATE TaiKhoan SET LoaiTaiKhoan = 'Admin' WHERE LoaiTaiKhoan = 'ADMIN';
UPDATE TaiKhoan SET LoaiTaiKhoan = 'NhanVien' WHERE LoaiTaiKhoan = 'NHANVIEN';
UPDATE TaiKhoan SET LoaiTaiKhoan = 'Khach' WHERE LoaiTaiKhoan = 'KHACH';
```

## 📞 Liên hệ

Nếu có vấn đề gì, hãy kiểm tra:

1. Console log trong browser (F12)
2. Log của Spring Boot trong terminal
3. Database connection
4. FB: Tran Quang

---

**Phát triển bởi**: Team Quản Lý Nhà Thuốc
**Năm**: 2026
