# 📚 TỔNG HỢP API - HỆ THỐNG QUẢN LÝ CỬA HÀNG THUỐC Y TẾ

## 📋 Mục Lục

1. [Tổng Quan](#tổng-quan)
2. [API Tài Khoản](#1-api-tài-khoản)
3. [API Khách Hàng](#2-api-khách-hàng)
4. [API Nhân Viên](#3-api-nhân-viên)
5. [API Thuốc](#4-api-thuốc)
6. [API Nhà Cung Cấp](#5-api-nhà-cung-cấp)
7. [API Phiếu Nhập](#6-api-phiếu-nhập)
8. [API Chi Tiết Phiếu Nhập](#7-api-chi-tiết-phiếu-nhập)
9. [API Hóa Đơn](#8-api-hóa-đơn)
10. [API Chi Tiết Hóa Đơn](#9-api-chi-tiết-hóa-đơn)
11. [API Giỏ Hàng](#10-api-giỏ-hàng)
12. [API Lịch Làm](#11-api-lịch-làm)

---

## Tổng Quan

**Base URL**: `http://localhost:8080`

**Định dạng dữ liệu**: JSON

**CORS**: Được bật cho tất cả origins (`*`)

**Authentication**: Session-based (Session-Id header cho giỏ hàng)

---

## 1. API Tài Khoản

**Base Path**: `/api/taikhoan`

### 1.1 Đăng Ký Khách Hàng

```http
POST /api/taikhoan/dangky
```

**Request Body**:

```json
{
  "tenDangNhap": "string",
  "matKhau": "string"
}
```

**Response**: `boolean` (true/false)

---

### 1.2 Đăng Ký Nhân Viên

```http
POST /api/taikhoan/dangky-nhanvien
```

**Request Body**:

```json
{
  "tenDangNhap": "string",
  "matKhau": "string"
}
```

**Response**: `boolean` (true/false)

---

### 1.3 Đăng Nhập Khách Hàng

```http
POST /api/taikhoan/login-khach
```

**Request Body**:

```json
{
  "tenDangNhap": "string",
  "matKhau": "string"
}
```

**Response**:

```json
{
  "maTaiKhoan": "string",
  "tenDangNhap": "string",
  "matKhau": "string",
  "maQuyen": "string",
  "trangThai": "number"
}
```

---

### 1.4 Đăng Nhập Nhân Viên

```http
POST /api/taikhoan/login-nhanvien
```

**Request Body**:

```json
{
  "tenDangNhap": "string",
  "matKhau": "string"
}
```

**Response**: Tương tự đăng nhập khách hàng

---

### 1.5 Lấy Tất Cả Tài Khoản

```http
GET /api/taikhoan
```

**Response**: Array of TaiKhoanDTO

---

### 1.6 Xóa Tài Khoản

```http
DELETE /api/taikhoan/{maTK}
```

**Response**: `boolean` (true/false)

---

## 2. API Khách Hàng

**Base Path**: `/api/khachhang`

### 2.1 Lấy Tất Cả Khách Hàng

```http
GET /api/khachhang
```

**Response**:

```json
[
  {
    "maKhachHang": "string",
    "hoTen": "string",
    "sdt": "string",
    "diaChi": "string",
    "ngayThamGia": "date"
  }
]
```

---

### 2.2 Thêm Khách Hàng

```http
POST /api/khachhang
```

**Request Body**:

```json
{
  "hoTen": "string",
  "sdt": "string",
  "diaChi": "string"
}
```

**Response**: KhachHangDTO hoặc error object

---

### 2.3 Sửa Khách Hàng

```http
PUT /api/khachhang
```

**Request Body**:

```json
{
  "maKhachHang": "string",
  "hoTen": "string",
  "sdt": "string",
  "diaChi": "string"
}
```

**Response**: KhachHangDTO hoặc error object

---

### 2.4 Xóa Khách Hàng

```http
DELETE /api/khachhang/{maKH}
```

**Response**: Success message hoặc error object

---

## 3. API Nhân Viên

**Base Path**: `/api/nhanvien`

### 3.1 Lấy Tất Cả Nhân Viên

```http
GET /api/nhanvien
```

**Response**:

```json
[
  {
    "maNhanVien": "string",
    "hoTen": "string",
    "sdt": "string",
    "email": "string",
    "gioiTinh": "string",
    "ngayVaoLam": "date",
    "trangThai": "number"
  }
]
```

---

### 3.2 Tạo Nhân Viên Kèm Tài Khoản

```http
POST /api/nhanvien/create-with-account
```

**Request Body**:

```json
{
  "nhanVien": {
    "hoTen": "string",
    "sdt": "string",
    "email": "string",
    "gioiTinh": "string"
  },
  "tenDangNhap": "string",
  "matKhau": "string",
  "maQuyen": "string"
}
```

**Response**: Success/error message

---

### 3.3 Thêm Nhân Viên (Cách Cũ)

```http
POST /api/nhanvien
```

**Request Body**: NhanVienDTO
**Response**: Success/error message

---

### 3.4 Cập Nhật Nhân Viên

```http
PUT /api/nhanvien
```

**Request Body**: NhanVienDTO
**Response**: Success/error message

---

### 3.5 Xóa Nhân Viên

```http
DELETE /api/nhanvien/{maNhanVien}
```

**Response**: Success/error message

---

## 4. API Thuốc

**Base Path**: `/api/thuoc`

### 4.1 Lấy Tất Cả Thuốc

```http
GET /api/thuoc
```

**Response**:

```json
[
  {
    "maThuoc": "string",
    "tenThuoc": "string",
    "donViTinh": "string",
    "moTa": "string",
    "giaBan": "number",
    "soLuong": "number",
    "hinhAnh": "string"
  }
]
```

---

### 4.2 Lấy Thuốc Theo ID

```http
GET /api/thuoc/{maThuoc}
```

**Response**: ThuocDTO hoặc 404 Not Found

---

### 4.3 Thêm Thuốc

```http
POST /api/thuoc/them-thuoc
```

**Request Body**:

```json
{
  "tenThuoc": "string",
  "donViTinh": "string",
  "moTa": "string",
  "giaBan": "number",
  "soLuong": "number",
  "hinhAnh": "string"
}
```

**Response**: Success/error message

---

### 4.4 Cập Nhật Thuốc

```http
PUT /api/thuoc
```

**Request Body**: ThuocDTO
**Response**: Success/error message

---

### 4.5 Xóa Thuốc

```http
DELETE /api/thuoc/{maThuoc}
```

**Response**: Success/error message

---

## 5. API Nhà Cung Cấp

**Base Path**: `/api/nhacungcap`

### 5.1 Lấy Tất Cả Nhà Cung Cấp

```http
GET /api/nhacungcap
```

**Response**:

```json
[
  {
    "maNhaCungCap": "string",
    "tenNhaCungCap": "string",
    "sdt": "string",
    "email": "string",
    "diaChi": "string",
    "trangThai": "number"
  }
]
```

---

### 5.2 Thêm Nhà Cung Cấp

```http
POST /api/nhacungcap
```

**Request Body**: NhaCungCapDTO
**Response**: Success/error message

---

### 5.3 Sửa Nhà Cung Cấp

```http
PUT /api/nhacungcap
```

**Request Body**: NhaCungCapDTO
**Response**: Success/error message

---

### 5.4 Ngừng Hợp Tác / Xóa

```http
DELETE /api/nhacungcap/{maNCC}
```

**Response**: Success/error message

---

## 6. API Phiếu Nhập

**Base Path**: `/api/phieunhap`

### 6.1 Lấy Tất Cả Phiếu Nhập

```http
GET /api/phieunhap
```

**Response**:

```json
[
  {
    "maPhieuNhap": "string",
    "maNhanVien": "string",
    "maNhaCungCap": "string",
    "ngayNhap": "date",
    "tongTien": "number",
    "trangThai": "number"
  }
]
```

---

### 6.2 Lấy Phiếu Nhập Theo ID

```http
GET /api/phieunhap/{maPhieuNhap}
```

**Response**: PhieuNhapDTO hoặc 404 Not Found

---

### 6.3 Thêm Phiếu Nhập

```http
POST /api/phieunhap
```

**Request Body**: PhieuNhapDTO
**Response**: Success/error message

---

### 6.4 Xóa Phiếu Nhập

```http
DELETE /api/phieunhap/{maPhieuNhap}
```

**Response**: Success/error message

---

## 7. API Chi Tiết Phiếu Nhập

**Base Path**: `/api/ctphieunhap`

### 7.1 Lấy Chi Tiết Theo Phiếu Nhập

```http
GET /api/ctphieunhap/phieunhap/{maPhieuNhap}
```

**Response**:

```json
[
  {
    "maPhieuNhap": "string",
    "maThuoc": "string",
    "soLuong": "number",
    "donGia": "number",
    "thanhTien": "number"
  }
]
```

---

### 7.2 Thêm Chi Tiết Phiếu Nhập

```http
POST /api/ctphieunhap
```

**Request Body**: CTPhieuNhapDTO
**Response**: Success/error message

---

## 8. API Hóa Đơn

**Base Path**: `/api/hoadon`

### 8.1 Lấy Tất Cả Hóa Đơn

```http
GET /api/hoadon
```

**Response**:

```json
[
  {
    "maHoaDon": "string",
    "maKhachHang": "string",
    "maNhanVien": "string",
    "ngayLap": "date",
    "tongTien": "number",
    "trangThai": "number"
  }
]
```

---

### 8.2 Tạo Hóa Đơn Mới

```http
POST /api/hoadon
```

**Request Body**: HoaDonDTO
**Response**: `boolean` (true/false)

---

### 8.3 Thanh Toán Hóa Đơn

```http
PUT /api/hoadon/thanhtoan
```

**Request Body**: HoaDonDTO
**Response**: `boolean` (true/false)

---

### 8.4 Hủy Hóa Đơn

```http
PUT /api/hoadon/huy
```

**Request Body**: HoaDonDTO
**Response**: `boolean` (true/false)

---

## 9. API Chi Tiết Hóa Đơn

**Base Path**: `/api/cthoadon`

### 9.1 Lấy Chi Tiết Theo Hóa Đơn

```http
GET /api/cthoadon/{maHoaDon}
```

**Response**:

```json
[
  {
    "maHoaDon": "string",
    "maThuoc": "string",
    "soLuong": "number",
    "donGia": "number",
    "thanhTien": "number"
  }
]
```

---

### 9.2 Thêm Chi Tiết Hóa Đơn

```http
POST /api/cthoadon
```

**Request Body**:

```json
{
  "ctHoaDon": {
    "maHoaDon": "string",
    "maThuoc": "string",
    "soLuong": "number"
  },
  "hoaDon": {
    "maHoaDon": "string",
    "tongTien": "number"
  },
  "giaBan": "number"
}
```

**Response**: `boolean` (true/false)

---

## 10. API Giỏ Hàng

**Base Path**: `/api/cart`

**Header Required**: `Session-Id` (optional, default: "default-session")

### 10.1 Lấy Giỏ Hàng

```http
GET /api/cart
Header: Session-Id: {sessionId}
```

**Response**:

```json
[
  {
    "id": "string",
    "name": "string",
    "title": "string",
    "price": "number",
    "image": "string",
    "quantity": "number"
  }
]
```

---

### 10.2 Thêm Vào Giỏ Hàng

```http
POST /api/cart/add
Header: Session-Id: {sessionId}
```

**Request Body**:

```json
{
  "id": "string",
  "name": "string",
  "title": "string",
  "price": "number",
  "image": "string",
  "quantity": "number"
}
```

**Validation**:

- ID không được trống
- Giá phải > 0
- Số lượng: 1-1000

**Response**:

```json
{
  "success": true,
  "message": "Đã thêm vào giỏ hàng",
  "cartCount": 5
}
```

---

### 10.3 Cập Nhật Số Lượng

```http
PUT /api/cart/update
Header: Session-Id: {sessionId}
```

**Request Body**:

```json
{
  "id": "string",
  "quantity": "number"
}
```

**Note**: Nếu quantity <= 0 => Xóa sản phẩm khỏi giỏ

**Response**:

```json
{
  "success": true
}
```

---

### 10.4 Xóa Sản Phẩm

```http
DELETE /api/cart/{productId}
Header: Session-Id: {sessionId}
```

**Response**:

```json
{
  "success": true
}
```

---

### 10.5 Xóa Toàn Bộ Giỏ Hàng

```http
DELETE /api/cart
Header: Session-Id: {sessionId}
```

**Response**:

```json
{
  "success": true,
  "message": "Đã xóa giỏ hàng"
}
```

---

### 10.6 Đếm Số Lượng Item

```http
GET /api/cart/count
Header: Session-Id: {sessionId}
```

**Response**:

```json
{
  "count": 10
}
```

---

## 11. API Lịch Làm

**Base Path**: `/api/lichlam`

### 11.1 Lấy Tất Cả Lịch Làm

```http
GET /api/lichlam
```

**Response**:

```json
[
  {
    "maLich": "string",
    "maNhanVien": "string",
    "ngayLam": "date",
    "caLam": "string",
    "trangThai": "number"
  }
]
```

---

### 11.2 Lấy Lịch Làm Theo Nhân Viên

```http
GET /api/lichlam/nhanvien/{maNhanVien}
```

**Response**: Array of LichLamDTO

---

### 11.3 Lấy Lịch Làm Theo ID

```http
GET /api/lichlam/{maLich}
```

**Response**: LichLamDTO hoặc 404 Not Found

---

### 11.4 Thêm Lịch Làm

```http
POST /api/lichlam
```

**Request Body**: LichLamDTO
**Response**: Success/error message

---

### 11.5 Sửa Lịch Làm

```http
PUT /api/lichlam
```

**Request Body**: LichLamDTO
**Response**: Success/error message

---

### 11.6 Xóa Lịch Làm

```http
DELETE /api/lichlam/{maLL}
```

**Response**: Success/error message

---

## 📝 Ghi Chú

### Error Handling

Hầu hết các API trả về response dạng:

- **Success**: Status 200 với message hoặc data
- **Error**: Status 400/500 với error message hoặc object `{ "error": "message" }`

### Security Notes

1. **Mật khẩu**: Nên được hash trước khi lưu database
2. **Session Management**: Giỏ hàng sử dụng Session-Id header
3. **Input Validation**: Có validation cơ bản cho Cart API
4. **Database Credentials**: Đã được di chuyển sang `application.properties`

### Best Practices

1. Luôn kiểm tra response status trước khi xử lý data
2. Sử dụng try-catch khi gọi API
3. Validate input ở phía client trước khi gửi request
4. Sử dụng Session-Id nhất quán cho Cart operations
5. Xử lý timeout và network errors

---

## 🔗 Liên Hệ & Hỗ Trợ

**Server Port**: 8080  
**Environment**: Development  
**Database**: MySQL  
**Framework**: Spring Boot

---

**Last Updated**: February 11, 2026  
**Version**: 1.0.0
