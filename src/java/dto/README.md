# DTO (Data Transfer Object)

Chứa các class model đại diện cho các entity trong database.

## Chức năng:
- Chứa các thuộc tính (properties)
- Getter, Setter
- Constructor
- toString()

## Ví dụ:
```java
public class Thuoc {
    private int maThuoc;
    private String tenThuoc;
    private double gia;
    
    // Constructor, Getter, Setter
    public Thuoc() {}
    public int getMaThuoc() { return maThuoc; }
    public void setMaThuoc(int ma) { this.maThuoc = ma; }
}
```
