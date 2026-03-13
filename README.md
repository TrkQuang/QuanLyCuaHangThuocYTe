# QuanLyCuaHangThuocYTe

Ung dung quan ly cua hang thuoc y te xay dung bang Spring Boot + JDBC + MySQL, giao dien frontend thuần HTML/CSS/JS.

## 1. Cong nghe

- Java 17
- Spring Boot 3.3.5 (`spring-boot-starter-web`, `spring-boot-starter-jdbc`)
- MySQL 8+ (`mysql-connector-j 8.3.0`)
- Maven

## 2. Cau truc chinh

- `src/main/java/com/quanlycuahangthuoc/controller`: REST API controllers
- `src/main/java/com/quanlycuahangthuoc/bus`: business logic
- `src/main/java/com/quanlycuahangthuoc/dao`: truy cap DB (JDBC)
- `src/main/java/com/quanlycuahangthuoc/dto`: data objects
- `src/main/java/com/quanlycuahangthuoc/db`: DB connection + SQL scripts
- `src/main/java/com/quanlycuahangthuoc/resources/static/frontend`: giao dien frontend
- `src/main/resources/application.properties`: cau hinh runtime

## 3. Chuan bi moi truong

Yeu cau:

- JDK 17
- Maven 3.9+
- MySQL 8+

Kiem tra nhanh:

```bash
java -version
mvn -version
```

## 4. Cau hinh database

1. Tao database MySQL (ten DB tuy chon).
2. Chay script khoi tao schema + du lieu mau:

- `src/main/java/com/quanlycuahangthuoc/db/reset_schema_and_seed.sql`

Hoac dung script tao co ban:

- `src/main/java/com/quanlycuahangthuoc/db/taodb_script.sql`

Cac script bo sung migration nam trong cung thu muc `db/`, vi du:

- `add_thuoc_hinhanh_url.sql`
- `add_lichlam_trangthai.sql`
- `add_phieunhap_trangthai.sql`
- `add_taikhoan_banned_role.sql`

## 5. Cau hinh ung dung

Copy file mau:

```bash
cp src/main/resources/application.properties.example src/main/resources/application.properties
```

Cap nhat thong tin DB trong `application.properties`:

```properties
db.url=jdbc:mysql://localhost:3306/<ten_database>
db.username=<username>
db.password=<password>
db.driver=com.mysql.cj.jdbc.Driver
server.port=8080
```

## 6. Chay du an

Chay local:

```bash
mvn spring-boot:run
```

Build jar:

```bash
mvn clean package
java -jar target/QuanLyCuaHangThuocYTe-1.0.0.jar
```

## 7. Duong dan truy cap

- Login: `http://localhost:8080/frontend/html/login.html`
- Trang admin: `http://localhost:8080/frontend/html/idx_admin.html`
- Trang nhan vien: `http://localhost:8080/frontend/html/idx_nv.html`
- Trang user: `http://localhost:8080/frontend/html/index.html`

## 8. API tong hop

Tai lieu API tong hop:

- `TongHopAPI.md`

Base URL mac dinh:

- `http://localhost:8080`

## 9. Ghi chu phat trien

- Frontend static duoc dat trong `resources/static/frontend`.
- Neu dang chay app tu `target/classes` va thay doi frontend khong cap nhat, can rebuild hoac copy lai tai nguyen static.
- Kien truc hien tai la Controller -> BUS -> DAO -> MySQL (JDBC thuan).

## 10. Tac gia

Do an/du an hoc tap Quan Ly Cua Hang Thuoc Y Te.
