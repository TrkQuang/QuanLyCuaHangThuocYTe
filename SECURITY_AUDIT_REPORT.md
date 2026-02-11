# 🔐 BÁO CÁO KIỂM TRA BẢO MẬT & LOGIC HỆ THỐNG

## ⚠️ CÁC VẤN ĐỀ NGHIÊM TRỌNG (CRITICAL)

### 1. **MẬT KHẨU KHÔNG MÃ HÓA** 🔴 CRITICAL

**Vị trí:** `TaiKhoanDAO.java`, `TaiKhoanBUS.java`
**Vấn đề:** Mật khẩu được lưu dạng plain text trong database

```java
// HIỆN TẠI - KHÔNG AN TOÀN:
tk.setMatKhau(rs.getString("MatKhau")); // Plain text
if (!tk.getMatKhau().equals(password)) // So sánh trực tiếp
```

**Hậu quả:**

- Bất kỳ ai truy cập database đều thấy được mật khẩu
- SQL Injection có thể lộ toàn bộ mật khẩu
- Vi phạm nghiêm trọng tiêu chuẩn bảo mật

**Giải pháp:** Sử dụng BCrypt để hash mật khẩu

```java
// CẦN THÊM:
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

// Khi đăng ký/tạo mật khẩu:
BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
String hashedPassword = encoder.encode(plainPassword);

// Khi đăng nhập:
if (encoder.matches(inputPassword, storedHashedPassword)) {
    // Đăng nhập thành công
}
```

---

### 2. **GIỎ HÀNG LƯU TRONG MEMORY** 🟡 HIGH

**Vị trí:** `CartController.java`

```java
private Map<String, List<CartItem>> sessionCarts = new HashMap<>();
```

**Vấn đề:**

- Mất toàn bộ giỏ hàng khi restart server
- Không scale được (chỉ chạy 1 instance)
- Memory leak nếu không clear session cũ
- Race condition trong môi trường multi-thread

**Giải pháp:**

1. **Ngắn hạn:** Sử dụng `ConcurrentHashMap` + scheduled task để clear
2. **Dài hạn:** Lưu vào database hoặc Redis

```java
// SỬA THÀNH:
private final Map<String, List<CartItem>> sessionCarts = new ConcurrentHashMap<>();

// THÊM SCHEDULED TASK:
@Scheduled(fixedRate = 3600000) // 1 giờ
public void cleanupOldSessions() {
    // Clear sessions cũ hơn 24h
}
```

---

### 3. **THIẾU VALIDATION DỮ LIỆU ĐẦU VÀO** 🟡 HIGH

#### 3.1 TaiKhoanBUS

```java
// HIỆN TẠI:
if (tk.getTenDangNhap().isEmpty() || tk.getMatKhau().isEmpty())

// VẤN ĐỀ:
// - Không check null trước khi gọi isEmpty() -> NullPointerException
// - Không validate độ dài mật khẩu
// - Không validate format email
// - Không validate ký tự đặc biệt trong username
```

**Sửa:**

```java
public boolean dangKyKhach(TaiKhoanDTO tk) {
    // Validate null
    if (tk == null) {
        throw new IllegalArgumentException("Thông tin tài khoản không được null");
    }

    // Validate username
    if (tk.getTenDangNhap() == null || tk.getTenDangNhap().trim().isEmpty()) {
        throw new IllegalArgumentException("Tên đăng nhập không được để trống");
    }
    if (tk.getTenDangNhap().length() < 3 || tk.getTenDangNhap().length() > 50) {
        throw new IllegalArgumentException("Tên đăng nhập phải từ 3-50 ký tự");
    }
    if (!tk.getTenDangNhap().matches("^[a-zA-Z0-9_]+$")) {
        throw new IllegalArgumentException("Tên đăng nhập chỉ chứa chữ, số và _");
    }

    // Validate password
    if (tk.getMatKhau() == null || tk.getMatKhau().length() < 6) {
        throw new IllegalArgumentException("Mật khẩu phải có ít nhất 6 ký tự");
    }

    // Validate email
    if (tk.getEmail() == null || !tk.getEmail().matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
        throw new IllegalArgumentException("Email không hợp lệ");
    }

    // ... rest of code
}
```

#### 3.2 CartController - AddToCartRequest

```java
// KHÔNG CÓ VALIDATION:
public static class AddToCartRequest {
    private String id;
    private double price;
    private int quantity;
    // ...
}
```

**Thêm validation:**

```java
@PostMapping("/add")
public ResponseEntity<?> addToCart(@RequestBody AddToCartRequest request, ...) {
    // Validate
    if (request.getId() == null || request.getId().trim().isEmpty()) {
        return ResponseEntity.badRequest().body(Map.of("error", "ID sản phẩm không hợp lệ"));
    }
    if (request.getPrice() <= 0) {
        return ResponseEntity.badRequest().body(Map.of("error", "Giá phải lớn hơn 0"));
    }
    if (request.getQuantity() <= 0 || request.getQuantity() > 1000) {
        return ResponseEntity.badRequest().body(Map.of("error", "Số lượng không hợp lệ"));
    }
    // ...
}
```

---

### 4. **THIẾU AUTHORIZATION/AUTHENTICATION** 🔴 CRITICAL

**Vấn đề:** Không có cơ chế kiểm tra quyền truy cập

- Bất kỳ ai cũng có thể gọi API admin
- Không verify session/token
- Không verify user sở hữu đơn hàng trước khi xem

**Ví dụ:**

```java
// HoaDonController - BẤT KỲ AI CŨNG LẤY ĐƯỢC TẤT CẢ HÓA ĐƠN:
@GetMapping
public ArrayList<HoaDonDTO> getAll(){
    return hoaDonBUS.getAllHoaDon();
}
```

**Giải pháp:** Implement Spring Security + JWT

```java
// THÊM DEPENDENCIES:
// spring-boot-starter-security
// jjwt-api, jjwt-impl, jjwt-jackson

// TẠO JWT SERVICE:
@Service
public class JwtService {
    private String secretKey = "your-secret-key-here";

    public String generateToken(TaiKhoanDTO user) {
        return Jwts.builder()
            .setSubject(user.getTenDangNhap())
            .claim("role", user.getLoaiTaiKhoan())
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + 86400000)) // 24h
            .signWith(SignatureAlgorithm.HS256, secretKey)
            .compact();
    }

    public boolean validateToken(String token) {
        // Validate and parse JWT
    }
}

// SỬ DỤNG:
@PostMapping("/login-khach")
public ResponseEntity<?> loginKhach(@RequestBody TaiKhoanDTO tk) {
    TaiKhoanDTO user = taikhoanBUS.dangNhapWebKhach(tk.getTenDangNhap(), tk.getMatKhau());
    if (user != null) {
        String token = jwtService.generateToken(user);
        return ResponseEntity.ok(Map.of(
            "user", user,
            "token", token
        ));
    }
    return ResponseEntity.status(401).body("Đăng nhập thất bại");
}

// BẢO VỆ ENDPOINT:
@GetMapping
@PreAuthorize("hasRole('ADMIN')")
public ArrayList<HoaDonDTO> getAll(){
    return hoaDonBUS.getAllHoaDon();
}
```

---

### 5. **SQL INJECTION** 🟡 HIGH

**Vấn đề:** Đã dùng PreparedStatement (TỐT) nhưng cần kiểm tra tất cả queries

**Đã đúng:**

```java
String sql = "SELECT * FROM TaiKhoan WHERE TenDangNhap=?";
ps.setString(1, username);
```

**Cần kiểm tra:** Tất cả các DAO để đảm bảo không có string concatenation

---

### 6. **LOGIC NGHIỆP VỤ - HoaDonBUS** 🟠 MEDIUM

#### 6.1 Trạng thái không nhất quán

```java
public boolean taoHoaDon(HoaDonDTO hd){
    hd.setTrangThai("CHOXACNHAN");
    hd.setTongTien(0); // ❌ Tại sao set 0?
    return hoaDonDAO.insertHoaDon(hd);
}
```

**Vấn đề:**

- Tạo hóa đơn với tổng tiền = 0 không hợp lý
- Không validate maKhachHang tồn tại
- Không có mã hóa đơn auto-generate

**Sửa:**

```java
public boolean taoHoaDon(HoaDonDTO hd){
    // Validate
    if (hd.getMaKhachHang() == null || hd.getMaKhachHang().isEmpty()) {
        throw new IllegalArgumentException("Mã khách hàng không được rỗng");
    }

    // Kiểm tra khách hàng tồn tại
    if (!khachHangDAO.existsById(hd.getMaKhachHang())) {
        throw new IllegalArgumentException("Khách hàng không tồn tại");
    }

    // Generate mã hóa đơn
    if (hd.getMaHoaDon() == null || hd.getMaHoaDon().isEmpty()) {
        hd.setMaHoaDon("HD" + System.currentTimeMillis());
    }

    hd.setTrangThai("CHOXACNHAN");
    hd.setNgayTao(LocalDateTime.now().toString());
    // Không set tổng tiền = 0, để frontend tính

    return hoaDonDAO.insertHoaDon(hd);
}
```

#### 6.2 Thanh toán không an toàn

```java
public boolean thanhToanHoaDon(HoaDonDTO hd){
    if(!hd.getTrangThai().equals("CHOXACNHAN")) return false;
    if(hd.getTongTien() <= 0) return false;
    // ❌ Không verify lại tổng tiền từ chi tiết hóa đơn
    hd.setTrangThai("DATHANHTOAN");
    return hoaDonDAO.updateHoaDon(hd);
}
```

**Vấn đề:** Client có thể gửi tổng tiền bất kỳ

**Sửa:**

```java
public boolean thanhToanHoaDon(String maHoaDon){
    HoaDonDTO hd = hoaDonDAO.getById(maHoaDon);
    if (hd == null) return false;
    if (!hd.getTrangThai().equals("CHOXACNHAN")) return false;

    // QUAN TRỌNG: Tính lại tổng tiền từ chi tiết
    List<CTHoaDonDTO> chiTiet = ctHoaDonDAO.getByMaHoaDon(maHoaDon);
    double tongTien = 0;
    for (CTHoaDonDTO ct : chiTiet) {
        ThuocDTO thuoc = thuocDAO.getById(ct.getMaThuoc());
        if (thuoc == null) return false;
        tongTien += thuoc.getDonGia() * ct.getSoLuong();
    }

    if (tongTien <= 0) return false;

    hd.setTongTien((float) tongTien);
    hd.setTrangThai("DATHANHTOAN");
    hd.setNgayThanhToan(LocalDateTime.now().toString());

    return hoaDonDAO.updateHoaDon(hd);
}
```

---

### 7. **FRONTEND - XSS & INJECTION** 🟠 MEDIUM

#### 7.1 Không sanitize input trước khi render

```javascript
// khachhang.js - NGUY HIỂM:
html += `
    <h3>${p.name}</h3>  // ❌ Có thể chứa script tag
    <div>${item.title}</div>
`;
```

**Sửa:**

```javascript
// Tạo helper function:
function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Sử dụng:
html += `<h3>${escapeHtml(p.name)}</h3>`;
```

#### 7.2 Session ID dễ đoán

```javascript
sessionId =
  "session-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9);
```

**Vấn đề:** Chỉ dùng timestamp + random ngắn -> dễ brute force

**Sửa:**

```javascript
function generateSecureSessionId() {
  // Dùng crypto API nếu có
  if (window.crypto && window.crypto.randomUUID) {
    return window.crypto.randomUUID();
  }
  // Fallback với random mạnh hơn
  return (
    "session-" +
    Date.now() +
    "-" +
    Array.from({ length: 32 }, () =>
      Math.floor(Math.random() * 16).toString(16),
    ).join("")
  );
}
```

---

### 8. **THIẾU ERROR HANDLING** 🟠 MEDIUM

#### 8.1 Backend

```java
// HIỆN TẠI:
} catch (SQLException e) {
    e.printStackTrace(); // ❌ Chỉ print, không throw
}
return false; // Client không biết lỗi gì
```

**Sửa:**

```java
} catch (SQLException e) {
    logger.error("Lỗi khi thêm tài khoản: {}", e.getMessage());
    throw new RuntimeException("Lỗi hệ thống: " + e.getMessage());
}
```

#### 8.2 Frontend

```javascript
// HIỆN TẠI:
} catch (error) {
    console.error("Lỗi:", error); // ❌ User không thấy
}
```

**Sửa:**

```javascript
} catch (error) {
    console.error("Lỗi:", error);
    alert("❌ " + (error.message || "Đã xảy ra lỗi. Vui lòng thử lại!"));
    // Hoặc hiển thị toast/notification
}
```

---

### 9. **RACE CONDITION - CartController** 🟡 HIGH

```java
// KHÔNG AN TOÀN:
List<CartItem> cart = sessionCarts.getOrDefault(sid, new ArrayList<>());
Optional<CartItem> existingItem = cart.stream()
    .filter(item -> item.getId().equals(request.getId()))
    .findFirst();
if (existingItem.isPresent()) {
    existingItem.get().setQuantity(existingItem.get().getQuantity() + request.getQuantity());
}
sessionCarts.put(sid, cart);
```

**Vấn đề:** 2 request cùng lúc có thể ghi đè nhau

**Sửa:**

```java
// SỬ DỤNG synchronized hoặc ConcurrentHashMap + computeIfAbsent
@PostMapping("/add")
public synchronized ResponseEntity<?> addToCart(...) {
    // hoặc
    sessionCarts.compute(sid, (key, cart) -> {
        if (cart == null) cart = new ArrayList<>();
        // logic thêm
        return cart;
    });
}
```

---

### 10. **CORS SECURITY** 🟠 MEDIUM

```java
@CrossOrigin(origins = "*") // ❌ CHO PHÉP TẤT CẢ DOMAIN
```

**Vấn đề:** Bất kỳ website nào cũng có thể gọi API của bạn

**Sửa:**

```java
@CrossOrigin(
    origins = {"http://localhost:3000", "https://yourdomain.com"},
    methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE},
    allowedHeaders = "*",
    exposedHeaders = {"Authorization"},
    allowCredentials = "true",
    maxAge = 3600
)
```

---

## 📋 CHECKLIST ƯU TIÊN SỬA

### Ưu tiên 1 (Phải sửa ngay):

- [ ] Mã hóa mật khẩu bằng BCrypt
- [ ] Thêm JWT authentication
- [ ] Validate tất cả input từ user
- [ ] Fix authorization cho các API nhạy cảm
- [ ] Sử dụng ConcurrentHashMap cho cart

### Ưu tiên 2 (Sửa sớm):

- [ ] Tính lại tổng tiền server-side khi thanh toán
- [ ] XSS protection cho frontend
- [ ] Cải thiện error handling
- [ ] Fix CORS policy
- [ ] Thêm rate limiting

### Ưu tiên 3 (Cải thiện):

- [ ] Migrate cart sang database/Redis
- [ ] Thêm logging system
- [ ] Thêm unit tests
- [ ] API versioning
- [ ] Documentation (Swagger)

---

## 🔧 CÔNG CỤ ĐỀ XUẤT

1. **Security:**
   - Spring Security + JWT
   - BCrypt password hashing
   - OWASP Dependency Check

2. **Validation:**
   - Hibernate Validator
   - javax.validation annotations

3. **Logging:**
   - SLF4J + Logback
   - Structured logging

4. **Testing:**
   - JUnit 5
   - Mockito
   - Postman/Newman

---

## 📚 TÀI LIỆU THAM KHẢO

1. OWASP Top 10: https://owasp.org/www-project-top-ten/
2. Spring Security: https://spring.io/projects/spring-security
3. JWT Best Practices: https://tools.ietf.org/html/rfc8725
