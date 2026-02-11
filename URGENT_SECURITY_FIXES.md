# ⚠️ CẢI THIỆN BẢO MẬT - CẦN THỰC HIỆN NGAY

## ✅ ĐÃ SỬA (trong commit này)

### 1. **Backend Validation** ✅

- ✅ Thêm validation đầy đủ cho TaiKhoanBUS:
  - Kiểm tra null
  - Validate độ dài username (3-50 ký tự)
  - Validate format username (chỉ chữ, số, \_)
  - Validate độ dài password (6-100 ký tự)
  - Validate format email
  - Auto-generate mã tài khoản

### 2. **Thread Safety** ✅

- ✅ Đổi HashMap thành ConcurrentHashMap trong CartController
- ✅ Sử dụng compute() để thread-safe khi thêm giỏ hàng

### 3. **Cart Validation** ✅

- ✅ Validate request không null
- ✅ Validate ID sản phẩm
- ✅ Validate giá > 0
- ✅ Validate số lượng 1-1000
- ✅ Kiểm tra giới hạn tổng số lượng

### 4. **XSS Protection** ✅

- ✅ Thêm hàm escapeHtml() trong khachhang.js
- ✅ Sanitize tất cả output: name, description, image, id
- ✅ Thêm onerror handler cho ảnh

---

## 🚨 VẪN CẦN SỬA (ƯU TIÊN CAO)

### 1. **MẬT KHẨU KHÔNG MÃ HÓA** 🔴 CRITICAL

**PHẢI LÀM:**

#### Bước 1: Thêm dependency vào pom.xml

```xml
<dependency>
    <groupId>org.springframework.security</groupId>
    <artifactId>spring-security-crypto</artifactId>
    <version>6.0.3</version>
</dependency>
<dependency>
    <groupId>org.bouncycastle</groupId>
    <artifactId>bcprov-jdk15on</artifactId>
    <version>1.70</version>
</dependency>
```

#### Bước 2: Tạo PasswordUtil.java

```java
package com.quanlycuahangthuoc.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordUtil {
    private static final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public static String hashPassword(String plainPassword) {
        return encoder.encode(plainPassword);
    }

    public static boolean verifyPassword(String plainPassword, String hashedPassword) {
        return encoder.matches(plainPassword, hashedPassword);
    }
}
```

#### Bước 3: Sửa TaiKhoanBUS.java

```java
// Trong dangKyKhach() và taoNhanVien():
tk.setMatKhau(PasswordUtil.hashPassword(tk.getMatKhau()));

// Trong dangNhap():
if (tk == null || !PasswordUtil.verifyPassword(password, tk.getMatKhau())) {
    throw new RuntimeException("Sai tài khoản hoặc mật khẩu");
}
```

#### Bước 4: Migration dữ liệu cũ

```sql
-- Backup trước khi migrate
CREATE TABLE TaiKhoan_Backup AS SELECT * FROM TaiKhoan;

-- Sau khi deploy code mới, cần reset tất cả password
-- Hoặc chạy script để hash password hiện tại
```

**⚠️ LƯU Ý:** Sau khi apply, TẤT CẢ user cũ sẽ không đăng nhập được. Cần:

- Thông báo user reset password, HOẶC
- Viết script migration để hash password cũ (nhưng không an toàn), HOẶC
- Tạo lại tất cả tài khoản

---

### 2. **JWT Authentication** 🔴 CRITICAL

**PHẢI LÀM:**

#### Bước 1: Thêm dependency

```xml
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.11.5</version>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-impl</artifactId>
    <version>0.11.5</version>
    <scope>runtime</scope>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-jackson</artifactId>
    <version>0.11.5</version>
    <scope>runtime</scope>
</dependency>
```

#### Bước 2: Tạo JwtUtil.java

```java
package com.quanlycuahangthuoc.util;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import java.security.Key;
import java.util.Date;

public class JwtUtil {
    private static final String SECRET_KEY = "Your-256-bit-Secret-Key-Change-This-In-Production-Min-32-chars";
    private static final Key key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
    private static final long EXPIRATION_TIME = 86400000; // 24 hours

    public static String generateToken(String username, String role) {
        return Jwts.builder()
            .setSubject(username)
            .claim("role", role)
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
            .signWith(key, SignatureAlgorithm.HS256)
            .compact();
    }

    public static Claims validateToken(String token) {
        try {
            return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
        } catch (JwtException e) {
            throw new RuntimeException("Token không hợp lệ");
        }
    }

    public static String getUsernameFromToken(String token) {
        return validateToken(token).getSubject();
    }

    public static String getRoleFromToken(String token) {
        return validateToken(token).get("role", String.class);
    }
}
```

#### Bước 3: Sửa TaiKhoanController

```java
@PostMapping("/login-khach")
public ResponseEntity<?> loginKhach(@RequestBody TaiKhoanDTO tk) {
    try {
        TaiKhoanDTO user = taikhoanBUS.dangNhapWebKhach(
            tk.getTenDangNhap(),
            tk.getMatKhau()
        );

        String token = JwtUtil.generateToken(
            user.getTenDangNhap(),
            user.getLoaiTaiKhoan()
        );

        Map<String, Object> response = new HashMap<>();
        response.put("user", user);
        response.put("token", token);
        response.put("message", "Đăng nhập thành công");

        return ResponseEntity.ok(response);
    } catch (Exception e) {
        return ResponseEntity.status(401)
            .body(Map.of("error", e.getMessage()));
    }
}
```

#### Bước 4: Tạo AuthFilter.java (kiểm tra token)

```java
package com.quanlycuahangthuoc.filter;

import com.quanlycuahangthuoc.util.JwtUtil;
import javax.servlet.*;
import javax.servlet.http.*;
import java.io.IOException;

public class AuthFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        String path = httpRequest.getRequestURI();

        // Skip authentication cho login/register/public endpoints
        if (path.contains("/login") || path.contains("/dangky") ||
            path.contains("/thuoc") || path.equals("/api/cart")) {
            chain.doFilter(request, response);
            return;
        }

        String authHeader = httpRequest.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            try {
                Claims claims = JwtUtil.validateToken(token);
                // Lưu user info vào request
                httpRequest.setAttribute("username", claims.getSubject());
                httpRequest.setAttribute("role", claims.get("role"));
                chain.doFilter(request, response);
                return;
            } catch (Exception e) {
                httpResponse.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                httpResponse.getWriter().write("Token không hợp lệ");
                return;
            }
        }

        httpResponse.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        httpResponse.getWriter().write("Chưa đăng nhập");
    }
}
```

#### Bước 5: Đăng ký filter trong WebConfig.java

```java
@Configuration
public class WebConfig {
    @Bean
    public FilterRegistrationBean<AuthFilter> authFilter() {
        FilterRegistrationBean<AuthFilter> registrationBean = new FilterRegistrationBean<>();
        registrationBean.setFilter(new AuthFilter());
        registrationBean.addUrlPatterns("/api/*");
        return registrationBean;
    }
}
```

#### Bước 6: Sửa frontend để gửi token

```javascript
// login.js - Sau khi đăng nhập thành công:
const result = await response.json();
localStorage.setItem("token", result.token);
localStorage.setItem("currentUser", JSON.stringify(result.user));

// Tất cả API calls - Thêm token vào header:
const response = await fetch(`${API_URL}/hoadon`, {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/json",
  },
});
```

---

### 3. **CORS Policy** 🟠 MEDIUM

**Sửa tất cả @CrossOrigin:**

```java
@CrossOrigin(
    origins = {"http://localhost:3000", "http://localhost:8080"},
    methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE},
    allowedHeaders = {"Authorization", "Content-Type", "Session-Id"},
    exposedHeaders = {"Authorization"},
    allowCredentials = "true",
    maxAge = 3600
)
```

---

### 4. **HoaDonBUS - Tính lại tổng tiền** 🟠 MEDIUM

```java
// Cần thêm dependency injection:
@Autowired
private CTHoaDonDAO ctHoaDonDAO;

@Autowired
private ThuocDAO thuocDAO;

public boolean thanhToanHoaDon(String maHoaDon) {
    HoaDonDTO hd = hoaDonDAO.getById(maHoaDon);
    if (hd == null) {
        throw new RuntimeException("Hóa đơn không tồn tại");
    }
    if (!hd.getTrangThai().equals("CHOXACNHAN")) {
        throw new RuntimeException("Không thể thanh toán hóa đơn này");
    }

    // QUAN TRỌNG: Tính lại tổng tiền từ chi tiết
    List<CTHoaDonDTO> chiTiet = ctHoaDonDAO.getByMaHoaDon(maHoaDon);
    if (chiTiet.isEmpty()) {
        throw new RuntimeException("Hóa đơn không có sản phẩm");
    }

    float tongTien = 0;
    for (CTHoaDonDTO ct : chiTiet) {
        ThuocDTO thuoc = thuocDAO.getById(ct.getMaThuoc());
        if (thuoc == null) {
            throw new RuntimeException("Thuốc " + ct.getMaThuoc() + " không tồn tại");
        }
        tongTien += thuoc.getDonGia() * ct.getSoLuong();
    }

    if (tongTien <= 0) {
        throw new RuntimeException("Tổng tiền không hợp lệ");
    }

    hd.setTongTien(tongTien);
    hd.setTrangThai("DATHANHTOAN");

    return hoaDonDAO.updateHoaDon(hd);
}
```

---

### 5. **Migrate Cart sang Database** 🟡 HIGH

**Tạo table:**

```sql
CREATE TABLE GioHang (
    MaGioHang VARCHAR(50) PRIMARY KEY,
    SessionId VARCHAR(100),
    MaThuoc VARCHAR(50),
    SoLuong INT,
    NgayThem DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (MaThuoc) REFERENCES Thuoc(MaThuoc)
);

CREATE INDEX idx_session ON GioHang(SessionId);
```

**Tạo CartDAO, CartBUS và refactor CartController**

---

### 6. **Logging System** 🟡 HIGH

Thêm vào pom.xml:

```xml
<dependency>
    <groupId>org.slf4j</groupId>
    <artifactId>slf4j-api</artifactId>
</dependency>
```

Trong mỗi class:

```java
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class TaiKhoanBUS {
    private static final Logger logger = LoggerFactory.getLogger(TaiKhoanBUS.class);

    public boolean dangKyKhach(TaiKhoanDTO tk) {
        logger.info("Đăng ký khách hàng: {}", tk.getTenDangNhap());
        try {
            // ...
        } catch (Exception e) {
            logger.error("Lỗi đăng ký khách hàng: {}", e.getMessage(), e);
            throw e;
        }
    }
}
```

---

## 📝 CHECKLIST TRIỂN KHAI

### Trước khi deploy Production:

- [ ] Hash tất cả password
- [ ] Implement JWT authentication
- [ ] Fix CORS policy
- [ ] Migrate cart sang database
- [ ] Thêm logging
- [ ] Test tất cả API endpoints
- [ ] Security audit
- [ ] Load testing
- [ ] Backup database

### Development:

- [ ] Thêm unit tests
- [ ] Integration tests
- [ ] API documentation (Swagger)
- [ ] Error handling standardization
- [ ] Input validation cho tất cả endpoints

---

## ⏱️ ƯỚC TÍNH THỜI GIAN

1. **Mã hóa password + JWT:** 4-6 giờ
2. **Fix CORS + Validation:** 2-3 giờ
3. **Migrate cart to DB:** 4-6 giờ
4. **Logging system:** 2-3 giờ
5. **Testing + Bug fixes:** 4-6 giờ

**Tổng:** ~16-24 giờ làm việc

---

## 🎯 ƯU TIÊN NGAY LẬP TỨC

**Tuần 1:**

1. Password hashing (CRITICAL)
2. JWT Authentication (CRITICAL)
3. Input validation (HIGH)

**Tuần 2:** 4. CORS policy (MEDIUM) 5. Cart to database (HIGH) 6. Tính lại tổng tiền (MEDIUM)

**Tuần 3:** 7. Logging (HIGH) 8. Testing (HIGH) 9. Documentation (MEDIUM)

---

⚠️ **CHÚ Ý:** Không deploy lên production trước khi fix ít nhất các vấn đề CRITICAL!
