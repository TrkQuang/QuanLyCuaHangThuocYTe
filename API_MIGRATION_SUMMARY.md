# Tóm tắt chuyển đổi sang API

## ✅ Đã hoàn thành

### 1. **CartController.java** (MỚI)

API quản lý giỏ hàng với các endpoint:

- `GET /api/cart` - Lấy giỏ hàng
- `POST /api/cart/add` - Thêm sản phẩm vào giỏ
- `PUT /api/cart/update` - Cập nhật số lượng
- `DELETE /api/cart/{productId}` - Xóa sản phẩm
- `DELETE /api/cart` - Xóa toàn bộ giỏ hàng
- `GET /api/cart/count` - Đếm số lượng item

### 2. **Các file JS đã cập nhật:**

#### cart.js ✅

- Sử dụng API `/api/cart` thay vì localStorage
- Session-based cart với session ID
- Hỗ trợ thêm, xóa, cập nhật giỏ hàng qua API

#### checkout.js ✅

- Lấy giỏ hàng từ API
- Tạo đơn hàng qua API `/api/hoadon`
- Xóa giỏ hàng sau khi đặt hàng thành công

#### register.js ✅

- Đăng ký tài khoản qua API `/api/taikhoan/dangky`
- Tạo thông tin khách hàng qua API `/api/khachhang`

#### login.js ✅

- Hỗ trợ đăng nhập cả khách hàng và nhân viên/admin
- Sử dụng API `/api/taikhoan/login-khach` và `/api/taikhoan/login-nhanvien`
- Lưu thông tin user vào localStorage
- Tự động chuyển hướng theo loại tài khoản

#### khachhang.js ✅

- Load sản phẩm từ API `/api/thuoc`
- Quản lý giỏ hàng qua API
- Load lịch sử đơn hàng từ API `/api/hoadon`
- Lọc đơn hàng theo khách hàng hiện tại
- Hiển thị empty state khi chưa đăng nhập hoặc chưa có đơn hàng

#### add-cart.js ✅

- Render giỏ hàng từ API
- Cập nhật số lượng qua API
- Xóa sản phẩm qua API

#### header.js ✅

- Hiển thị thông tin user đã đăng nhập
- Dropdown menu với các tùy chọn:
  - Tài khoản
  - Đơn hàng
  - Đăng xuất
- Clear session khi đăng xuất

### 3. **CSS Enhancements** ✅

Đã thêm styles cho:

- Cart rows với hover effects
- Button variants (btn-sm, btn-danger-sm)
- Quantity buttons
- Remove buttons
- Checkout items
- Empty states

---

## 🔍 API đã có sẵn (Backend)

### TaiKhoanController

- ✅ `POST /api/taikhoan/dangky` - Đăng ký khách hàng
- ✅ `POST /api/taikhoan/dangky-nhanvien` - Tạo tài khoản nhân viên
- ✅ `POST /api/taikhoan/login-khach` - Đăng nhập khách
- ✅ `POST /api/taikhoan/login-nhanvien` - Đăng nhập nhân viên
- ✅ `DELETE /api/taikhoan/{maTK}` - Xóa tài khoản
- ✅ `GET /api/taikhoan` - Lấy tất cả tài khoản

### ThuocController

- ✅ `GET /api/thuoc` - Lấy tất cả thuốc
- ✅ `GET /api/thuoc/{maThuoc}` - Lấy thuốc theo ID
- ✅ `POST /api/thuoc/them-thuoc` - Thêm thuốc

### HoaDonController

- ✅ `POST /api/hoadon` - Tạo hóa đơn mới
- ✅ `PUT /api/hoadon/thanhtoan` - Thanh toán hóa đơn
- ✅ `PUT /api/hoadon/huy` - Hủy hóa đơn
- ✅ `GET /api/hoadon` - Lấy tất cả hóa đơn

### KhachHangController

- ✅ `GET /api/khachhang` - Lấy tất cả khách hàng
- ✅ `POST /api/khachhang` - Thêm khách hàng
- ✅ `PUT /api/khachhang` - Sửa thông tin khách hàng
- ✅ `DELETE /api/khachhang/{maKH}` - Xóa khách hàng

---

## 📝 Cần bổ sung (Tùy chọn)

### 1. Chi tiết hóa đơn (CTHoaDonController)

Nếu muốn hiển thị chi tiết sản phẩm trong đơn hàng:

```java
@GetMapping("/hoadon/{maHoaDon}/chitiet")
public List<CTHoaDonDTO> getChiTietHoaDon(@PathVariable String maHoaDon) {
    return ctHoaDonBUS.getByMaHoaDon(maHoaDon);
}
```

### 2. Lọc hóa đơn theo khách hàng

Thêm endpoint vào HoaDonController:

```java
@GetMapping("/khachhang/{maKH}")
public List<HoaDonDTO> getHoaDonByKhachHang(@PathVariable String maKH) {
    return hoaDonBUS.getHoaDonByKhachHang(maKH);
}
```

### 3. Tìm kiếm thuốc

Thêm vào ThuocController:

```java
@GetMapping("/search")
public List<ThuocDTO> searchThuoc(@RequestParam String keyword) {
    return thuocDAO.searchByName(keyword);
}
```

### 4. Profile API

Nếu có trang profile, có thể thêm:

```java
@GetMapping("/khachhang/profile/{maTK}")
public KhachHangDTO getProfile(@PathVariable String maTK) {
    return khachHangBUS.getByMaTaiKhoan(maTK);
}

@PutMapping("/khachhang/profile")
public boolean updateProfile(@RequestBody KhachHangDTO kh) {
    return khachHangBUS.suaKhachHang(kh);
}
```

---

## 🚀 Cách sử dụng

### 1. Session Management

Mỗi user có một session ID được tạo tự động và lưu trong localStorage:

```javascript
function getSessionId() {
  let sessionId = localStorage.getItem("sessionId");
  if (!sessionId) {
    sessionId =
      "session-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9);
    localStorage.setItem("sessionId", sessionId);
  }
  return sessionId;
}
```

### 2. API Call Pattern

```javascript
// Lấy giỏ hàng
const response = await fetch(`${API_URL}/cart`, {
  headers: {
    "Session-Id": getSessionId()
  }
});

// Thêm vào giỏ
await fetch(`${API_URL}/cart/add`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Session-Id": getSessionId()
  },
  body: JSON.stringify({
    id: productId,
    name: productName,
    price: price,
    ...
  })
});
```

### 3. User Authentication

```javascript
// Lưu user sau khi login
localStorage.setItem("currentUser", JSON.stringify(userData));

// Lấy user hiện tại
const currentUser = JSON.parse(localStorage.getItem("currentUser"));

// Đăng xuất
localStorage.removeItem("currentUser");
localStorage.removeItem("sessionId");
```

---

## ⚠️ Lưu ý

1. **CORS**: Đảm bảo tất cả controller có `@CrossOrigin` annotation
2. **Session**: Cart hiện tại dùng in-memory storage, production nên dùng database hoặc Redis
3. **Authentication**: Nên implement JWT token thay vì lưu toàn bộ user info trong localStorage
4. **Validation**: Backend nên validate dữ liệu đầu vào
5. **Error Handling**: Frontend cần xử lý tốt các trường hợp lỗi API

---

## 🎉 Kết quả

Tất cả các file JS phía user giờ đã kết nối với API backend:

- ✅ Không còn dùng localStorage cho dữ liệu nghiệp vụ
- ✅ Giỏ hàng được quản lý qua API
- ✅ Đăng ký/đăng nhập qua API
- ✅ Đơn hàng được lưu vào database
- ✅ Sản phẩm được load từ database
- ✅ UI/UX được cải thiện với CSS mới
