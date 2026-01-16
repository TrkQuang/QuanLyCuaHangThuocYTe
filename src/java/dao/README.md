# DAO (Data Access Object)

Chứa các class tương tác trực tiếp với database.

## Chức năng:
- Kết nối database
- Thực thi SQL (SELECT, INSERT, UPDATE, DELETE)
- Map ResultSet sang Object
- Đóng connection

## Ví dụ:
```java
public class ThuocDAO {
    public List<Thuoc> selectAll() {
        String sql = "SELECT * FROM thuoc";
        // Execute query...
        return danhSach;
    }
    
    public boolean insert(Thuoc thuoc) {
        String sql = "INSERT INTO thuoc VALUES (?,?,?)";
        // PreparedStatement...
        return true;
    }
}
```
