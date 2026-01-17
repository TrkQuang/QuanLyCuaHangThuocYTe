# Utils (Utilities)

Chứa các class tiện ích dùng chung cho toàn hệ thống.

## Chức năng:
- Kết nối database
- Mã hóa mật khẩu
- Quản lý session
- Format date, currency
- Các helper methods

## Ví dụ:
```java
public class DatabaseConnection {
    public static Connection getConnection() {
        String url = "jdbc:mysql://localhost:3306/quanlythuoc";
        return DriverManager.getConnection(url, "root", "pass");
    }
}
```
