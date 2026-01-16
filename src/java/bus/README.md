# BUS (Business Logic Layer)

Chứa các class xử lý logic nghiệp vụ của hệ thống.

## Chức năng:
- Validate dữ liệu từ Controller
- Xử lý các quy tắc nghiệp vụ
- Gọi DAO để thao tác database
- Xử lý exception

## Ví dụ:
```java
public class ThuocBUS {
    private ThuocDAO dao = new ThuocDAO();
    
    public boolean themThuoc(Thuoc thuoc) {
        // Validate
        if (thuoc.getTenThuoc().isEmpty()) 
            throw new Exception("Tên thuốc không được rỗng");
        // Gọi DAO
        return dao.insert(thuoc);
    }
}
```
