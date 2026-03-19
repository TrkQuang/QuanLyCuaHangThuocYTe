# Hệ Thống Quản Lý Cửa Hàng Thuốc Y Tế

## 1. Giới thiệu dự án

Đây là hệ thống quản lý cửa hàng thuốc y tế, hỗ trợ bán hàng, quản lý kho thuốc, quản lý phiếu nhập và theo dõi hóa đơn trên cùng một nền tảng.

Hệ thống được xây dựng theo kiến trúc nhiều lớp DTO - DAO - BUS, backend Java Spring Boot + JDBC và cơ sở dữ liệu MySQL. Giao diện người dùng hiện tại là web tĩnh (HTML/CSS/JavaScript) phục vụ các vai trò người dùng khác nhau.

### Mục tiêu của hệ thống

- Số hóa quy trình bán thuốc và nhập hàng.
- Quản lý tập trung thông tin thuốc, khách hàng, nhân viên, tài khoản.
- Giảm sai sót trong thao tác thủ công nhờ ràng buộc nghiệp vụ và transaction.
- Dễ mở rộng cho các chức năng nâng cao trong tương lai.

### Đối tượng sử dụng

- Guest/Khách hàng: xem thuốc, thêm vào giỏ hàng, đặt đơn, theo dõi lịch sử đơn hàng.
- Nhân viên: xử lý hóa đơn, quản lý thuốc, nhập hàng, làm việc với phiếu nhập.
- Quản trị (Admin): quản trị tài khoản, nhân sự, nhà cung cấp, báo cáo thống kê dashboard.
---

## 2. Chức năng chính

### 👤 Người dùng (Guest)

- Đăng ký tài khoản khách hàng.
- Đăng nhập/đăng xuất bằng session.
- Xem danh sách thuốc, xem chi tiết thuốc.
- Thêm thuốc vào giỏ hàng, cập nhật số lượng, xóa giỏ hàng.
- Đặt hàng từ giỏ (tạo hóa đơn + chi tiết hóa đơn).
- Chọn phương thức thanh toán ở giao diện: thanh toán khi nhận hàng, chuyển khoản ngân hàng, ví điện tử.
- Theo dõi lịch sử đơn hàng và trạng thái đơn.

### 👨‍⚕️ Nhân viên

- Quản lý thông tin thuốc: thêm/sửa/xóa.
- Tạo phiếu nhập và chi tiết phiếu nhập.
- Chỉnh sửa chi tiết phiếu nhập khi còn ở trạng thái chờ xác nhận.
- Xác nhận/hủy phiếu nhập theo trạng thái nghiệp vụ.
- Tạo hóa đơn bán hàng và chi tiết hóa đơn.
- Thanh toán/hủy hóa đơn theo trạng thái đơn hàng.
- Quản lý lịch làm việc (đăng ký, duyệt, từ chối, xem theo nhân viên).

### 🛠 Quản trị

- Quản lý tài khoản: tạo, xóa, reset mật khẩu, ban/unban.
- Quản lý nhân viên và khách hàng.
- Quản lý nhà cung cấp, cập nhật trạng thái hợp tác.
- Xem dashboard thống kê tổng quan hệ thống.

### Nghiệp vụ kho và nhập hàng

- Nhập hàng từ nhà cung cấp bằng phiếu nhập và chi tiết dòng hàng.
- Cộng tồn kho khi phiếu nhập được xác nhận.
- Trừ tồn kho khi hóa đơn được xác nhận thanh toán.
- Tính toán tổng tiền tự động dựa trên chi tiết giao dịch.

### Nghiệp vụ thanh toán

- Hóa đơn khởi tạo ở trạng thái chờ xác nhận.
- Khi xác nhận thanh toán: kiểm tra trạng thái, kiểm tra tồn kho, trừ kho và cập nhật trạng thái trong cùng transaction.
- Khi hủy hóa đơn: chỉ cho phép với hóa đơn đang chờ xác nhận.

---

## 3. Kiến trúc hệ thống

## Mô hình lớp DTO - DAO - BUS

- DTO (Data Transfer Object): biểu diễn dữ liệu trung gian giữa các tầng.
- DAO (Data Access Object): truy cập dữ liệu MySQL bằng JDBC, ánh xạ ResultSet.
- BUS (Business Layer): kiểm tra nghiệp vụ, điều phối transaction, gọi DAO.
- Controller: REST API nhận/trả JSON, gọi BUS.
- UI: frontend web gọi API bằng fetch/AJAX.

### Luồng xử lý dữ liệu

1. Người dùng thao tác trên giao diện.
2. Frontend gửi request đến REST API.
3. Controller nhận request và validate cơ bản.
4. BUS xử lý quy tắc nghiệp vụ (trạng thái, số lượng, điều kiện giao dịch).
5. DAO thao tác DB qua JDBC/HikariCP.
6. Kết quả trả ngược về frontend theo JSON.

### Giao tiếp UI với backend

- UI hiện tại: HTML/CSS/JS trong static resources.
- Giao tiếp qua endpoint REST dạng JSON.
- Session được dùng cho đăng nhập và giỏ hàng.

Ví dụ endpoint:

- /api/taikhoan/\*: đăng ký, đăng nhập, quản lý tài khoản.
- /api/thuoc/\*: quản lý thuốc.
- /api/hoadon/\*: tạo, xác nhận thanh toán, hủy, lấy danh sách hóa đơn.
- /api/phieunhap/\*: tạo, cập nhật, xác nhận, hủy phiếu nhập.
- /api/cart/\*: giỏ hàng theo session.

---

## 4. Công nghệ sử dụng

- Java 17
- Spring Boot 3.3.5
- Spring Boot Web (REST API)
- JDBC thuần (thông qua các lớp DAO)
- HikariCP (connection pooling)
- MySQL 8+
- Maven (build tool)
- HTML/CSS/JavaScript (frontend)

Thư viện chính từ pom:

- spring-boot-starter-web
- spring-boot-starter-jdbc
- mysql-connector-j 8.3.0
- spring-boot-devtools

Ghi chú: trong mã nguồn hiện tại chưa sử dụng Java Swing/FlatLaf.

---

## 5. Cấu trúc thư mục

```text
QuanLyCuaHangThuocYTe/
├─ pom.xml
├─ src/
│  ├─ main/
│  │  ├─ java/com/quanlycuahangthuoc/
│  │  │  ├─ Application.java
│  │  │  ├─ controller/      # REST API controllers
│  │  │  ├─ bus/             # Business logic
│  │  │  ├─ dao/             # JDBC data access
│  │  │  ├─ dto/             # DTO + request models
│  │  │  ├─ db/              # DB connection + SQL scripts
│  │  │  ├─ config/          # Web config/CORS
│  │  │  ├─ exception/       # Custom exceptions
│  │  │  ├─ resources/static/frontend/
│  │  │  │  ├─ html/         # Trang login, admin, user, nv
│  │  │  │  ├─ css/          # Giao diện
│  │  │  │  └─ js/           # Logic frontend
│  │  │  └─ util/            # Tiện ích hỗ trợ
│  │  └─ resources/
│  │     ├─ application.properties
│  │     └─ application.properties.example
└─ target/
```

Giải thích nhanh package chính:

- controller/: định nghĩa API cho tài khoản, thuốc, hóa đơn, phiếu nhập, lịch làm, dashboard, giỏ hàng.
- bus/: nghiệp vụ giao dịch có transaction (xác nhận hóa đơn, xác nhận phiếu nhập, trừ/cộng tồn).
- dao/: SQL CRUD, truy vấn danh sách, truy vấn theo khóa, cập nhật trạng thái.
- dto/: đối tượng dữ liệu trao đổi giữa UI/API/BUS/DAO.
- db/: DBConnection (HikariCP), script tạo schema và seed dữ liệu.

---

## 6. Cơ sở dữ liệu

Hệ thống dùng MySQL, schema chính có các bảng:

- TaiKhoan: thông tin đăng nhập, loại tài khoản (ADMIN, NHANVIEN, KHACHHANG, BANNED).
- NhanVien: hồ sơ nhân viên, liên kết TaiKhoan.
- KhachHang: hồ sơ khách hàng, liên kết TaiKhoan.
- Thuoc: danh mục thuốc, giá bán, tồn kho, hạn dùng, hình ảnh.
- NhaCungCap: nhà cung cấp và trạng thái hợp tác.
- PhieuNhap, CT_PhieuNhap: phiếu nhập và các dòng nhập.
- HoaDon, CT_HoaDon: hóa đơn bán và các dòng bán.
- LichLamViec: lịch làm việc nhân viên.

### Quan hệ dữ liệu chính

- TaiKhoan 1-1 NhanVien (qua MaTK).
- TaiKhoan 1-1 KhachHang (qua MaTK).
- HoaDon n-1 KhachHang, n-1 NhanVien.
- CT_HoaDon n-1 HoaDon, n-1 Thuoc.
- PhieuNhap n-1 NhanVien, n-1 NhaCungCap.
- CT_PhieuNhap n-1 PhieuNhap, n-1 Thuoc.
- LichLamViec n-1 NhanVien.

### Script SQL

- create_schema.sql: tạo schema đầy đủ.
- insert_data.sql: nạp dữ liệu mẫu.

---

## 7. Hướng dẫn cài đặt (chi tiết)

### 7.1 Yêu cầu môi trường

- JDK 17
- Maven 3.8+
- MySQL 8+
- IDE: IntelliJ IDEA hoặc Eclipse hoặc NetBeans

Kiểm tra nhanh:

```bash
java -version
mvn -version
mysql --version
```

### 7.2 Clone dự án

```bash
git clone <URL_REPOSITORY>
cd QuanLyCuaHangThuocYTe
```

### 7.3 Tạo database

1. Mở MySQL client (MySQL Workbench hoặc CLI).
2. Tạo database:

```sql
CREATE DATABASE QuanLyNhaThuoc CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

3. Chạy script tạo bảng:

- src/main/java/com/quanlycuahangthuoc/db/create_schema.sql

4. Chạy script dữ liệu mẫu:

- src/main/java/com/quanlycuahangthuoc/db/insert_data.sql

### 7.4 Cấu hình kết nối DB

Tạo file cấu hình từ mẫu:

- Copy src/main/resources/application.properties.example thành src/main/resources/application.properties

Ví dụ cấu hình:

```properties
spring.application.name=Application

# Hoặc dùng db.url/db.username/db.password theo DBConnection
# DBConnection hỗ trợ cả key db.* và spring.datasource.*
db.url=jdbc:mysql://localhost:3306/QuanLyNhaThuoc?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
db.username=root
db.password=your_password
db.driver=com.mysql.cj.jdbc.Driver

# HikariCP
 db.hikari.maximum-pool-size=8
 db.hikari.minimum-idle=2
 db.hikari.connection-timeout=30000
 db.hikari.idle-timeout=600000
 db.hikari.max-lifetime=1800000

server.port=8080
spring.web.resources.static-locations=file:src/main/java/com/quanlycuahangthuoc/resources/static/
```

Lưu ý: có thể dùng key spring.datasource.url/username/password nếu muốn; lớp DBConnection đã hỗ trợ fallback.

### 7.5 Import vào IDE

- IntelliJ: File -> Open -> chọn thư mục project -> Trust Project -> chờ Maven sync.
- Eclipse: Import -> Existing Maven Projects -> chọn thư mục project -> Finish.
- NetBeans: Open Project -> chọn thư mục có pom.xml.

---

## 8. Cách chạy chương trình

### Chạy bằng Maven

```bash
mvn clean package
mvn spring-boot:run
```

Hoặc chạy file JAR:

```bash
mvn clean package
java -jar target/QuanLyCuaHangThuocYTe-1.0.0.jar
```

### Truy cập hệ thống

- Trang đăng nhập: http://localhost:8080/frontend/html/login.html
- Trang người dùng: http://localhost:8080/frontend/html/user.html
- Trang nhân viên: http://localhost:8080/frontend/html/idx_nv.html
- Trang quản trị: http://localhost:8080/frontend/html/idx_admin.html

### Tài khoản test

Dữ liệu mẫu trong insert_data.sql có các tài khoản như:

- admin / 123456
- nv01 / 123456
- kh01 / 123456

(Chi tiết đầy đủ xem bảng TaiKhoan trong script seed.)

### Các bước demo đề xuất

1. Đăng nhập admin, xem dashboard thống kê.
2. Thêm/sửa thuốc và nhà cung cấp.
3. Đăng nhập nhân viên, tạo phiếu nhập đầy đủ chi tiết.
4. Xác nhận phiếu nhập để cộng tồn kho.
5. Đăng nhập user, thêm giỏ hàng và tạo đơn.
6. Xác nhận thanh toán hóa đơn để trừ tồn kho.
7. Kiểm tra lịch sử đơn hàng và trạng thái.

---

## 9. Hình ảnh minh họa (nếu có)

Có thể chèn screenshot vào thư mục docs/images rồi nhúng Markdown như sau:

```md
![Màn hình đăng nhập](docs/images/login.png)
![Dashboard admin](docs/images/admin-dashboard.png)
![Quản lý phiếu nhập](docs/images/phieu-nhap.png)
![Màn hình user](docs/images/user-checkout.png)
```

Gợi ý tối thiểu 5 ảnh:

- Login
- Dashboard admin
- Danh sách thuốc
- Form tạo phiếu nhập/hóa đơn
- Lịch sử mua hàng user

---

## 10. Hạn chế

- Chưa có phân quyền mạnh theo token/JWT; hiện dùng session và kiểm tra nghiệp vụ trong backend.
- Chưa tích hợp cổng thanh toán thật (VNPay/MoMo/Stripe); phương thức thanh toán mới lưu ở mô tả đơn.
- Chưa có module kiểm kê kho chuyên sâu (lô thuốc, hạn dùng theo lô, cảnh báo tồn tối thiểu).
- Chưa có test tự động đầy đủ (unit test/integration test).
- Chưa có CI/CD pipeline hoàn chỉnh cho triển khai production.

---

## 11. Hướng phát triển

- Tách frontend thành SPA (React/Vue) hoặc phát triển mobile app.
- Tích hợp thanh toán online và webhook đối soát giao dịch.
- Bổ sung RBAC chi tiết và bảo mật mật khẩu tốt hơn (hash + salt).
- Triển khai báo cáo BI (doanh thu theo thời gian, top thuốc bán chạy, vòng quay tồn kho).
- Tối ưu hiệu năng truy vấn và bổ sung cache cho các danh mục truy cập nhiều.
- Bổ sung module kiểm kê định kỳ, quản lý lô - hạn dùng và cảnh báo hết hàng.

---

## 12. Tác giả

- Nhóm thực hiện: [Điền tên nhóm]
- Thành viên:
  - [Họ tên - MSSV - Vai trò]
  - [Họ tên - MSSV - Vai trò]
  - [Họ tên - MSSV - Vai trò]
- Giảng viên hướng dẫn: [Điền thông tin]
- Trường/Khoa: [Điền thông tin]
- Năm thực hiện: 2026

---

## Phụ lục: API tiêu biểu

- Tài khoản: /api/taikhoan/dangky, /api/taikhoan/login-khach, /api/taikhoan/login-nhanvien
- Thuốc: /api/thuoc, /api/thuoc/them-thuoc, /api/thuoc/{maThuoc}
- Hóa đơn: /api/hoadon/full, /api/hoadon/thanhtoan, /api/hoadon/huy
- Phiếu nhập: /api/phieunhap/full, /api/phieunhap/{maPhieuNhap}/xacnhan
- Giỏ hàng: /api/cart/add, /api/cart/update, /api/cart/count

README này được biên soạn từ cấu trúc và mã nguồn hiện tại của dự án để phục vụ nộp đồ án học phần.
