# Luồng Hoạt Động Hệ Thống (LuongHD.md)

## Tổng Quan Kiến Trúc

```
HTML / CSS / JS (Frontend)
        ↓
Servlet (Controller)
        ↓
BUS (Business Logic)
        ↓
DAO (Data Access Object)
        ↓
Database (MySQL)
```

---

## Chi Tiết Từng Lớp

### 1. **HTML / CSS / JS** (Presentation Layer)
**Vai trò:** Giao diện người dùng, hiển thị dữ liệu và thu thập input từ người dùng

**Chức năng:**
- Hiển thị form nhập liệu
- Hiển thị danh sách dữ liệu (bảng, card, ...)
- Validate input phía client
- Gọi API tới Servlet bằng AJAX/Fetch

**Ví dụ:**
```javascript
// File: static/assets/js/thuoc.js
function layDanhSachThuoc() {
    fetch('/QuanLyCuaHangThuocYTe/thuoc?action=getAll')
        .then(response => response.json())
        .then(data => {
            hienThiDanhSach(data);
        })
        .catch(error => console.error('Lỗi:', error));
}

function themThuoc() {
    const data = {
        tenThuoc: document.getElementById('tenThuoc').value,
        gia: document.getElementById('gia').value
    };
    
    fetch('/QuanLyCuaHangThuocYTe/thuoc?action=add', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        if(result.success) {
            alert('Thêm thuốc thành công!');
            layDanhSachThuoc(); // Refresh danh sách
        }
    });
}
```

---

### 2. **Servlet** (Controller Layer)
**Vai trò:** Điều khiển luồng xử lý, nhận request từ frontend và trả response

**Chức năng:**
- Nhận HTTP Request (GET, POST, PUT, DELETE)
- Parse parameters từ request
- Gọi BUS layer để xử lý logic
- Trả về JSON response cho frontend
- Xử lý session & authentication

**Ví dụ:**
```java
// File: servlets/ThuocServlet.java
@WebServlet("/thuoc")
public class ThuocServlet extends HttpServlet {
    
    private ThuocBUS thuocBUS = new ThuocBUS();
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        String action = request.getParameter("action");
        
        if ("getAll".equals(action)) {
            List<Thuoc> danhSach = thuocBUS.layDanhSachThuoc();
            String json = new Gson().toJson(danhSach);
            response.getWriter().write(json);
        } 
        else if ("getById".equals(action)) {
            int id = Integer.parseInt(request.getParameter("id"));
            Thuoc thuoc = thuocBUS.layThuocTheoId(id);
            String json = new Gson().toJson(thuoc);
            response.getWriter().write(json);
        }
    }
    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        String action = request.getParameter("action");
        
        if ("add".equals(action)) {
            // Parse JSON từ request body
            BufferedReader reader = request.getReader();
            Thuoc thuoc = new Gson().fromJson(reader, Thuoc.class);
            
            boolean ketQua = thuocBUS.themThuoc(thuoc);
            
            JsonObject jsonResponse = new JsonObject();
            jsonResponse.addProperty("success", ketQua);
            response.getWriter().write(jsonResponse.toString());
        }
    }
}
```

---

### 3. **BUS** (Business Logic Layer)
**Vai trò:** Xử lý logic nghiệp vụ, validate dữ liệu, tính toán

**Chức năng:**
- Validate dữ liệu từ Servlet
- Xử lý các quy tắc nghiệp vụ
- Gọi DAO để thao tác với database
- Xử lý exception và trả kết quả về Servlet

**Ví dụ:**
```java
// File: bus/ThuocBUS.java
public class ThuocBUS {
    
    private ThuocDAO thuocDAO = new ThuocDAO();
    
    public List<Thuoc> layDanhSachThuoc() {
        return thuocDAO.selectAll();
    }
    
    public Thuoc layThuocTheoId(int maThuoc) {
        return thuocDAO.selectById(maThuoc);
    }
    
    public boolean themThuoc(Thuoc thuoc) {
        // Validate dữ liệu
        if (thuoc.getTenThuoc() == null || thuoc.getTenThuoc().trim().isEmpty()) {
            throw new IllegalArgumentException("Tên thuốc không được để trống!");
        }
        
        if (thuoc.getGia() <= 0) {
            throw new IllegalArgumentException("Giá thuốc phải lớn hơn 0!");
        }
        
        // Kiểm tra trùng tên
        if (kiemTraTrungTen(thuoc.getTenThuoc())) {
            throw new IllegalArgumentException("Tên thuốc đã tồn tại!");
        }
        
        // Xử lý logic nghiệp vụ (ví dụ: tính giá bán từ giá nhập)
        double giaBan = thuoc.getGiaNhap() * 1.2; // Lãi 20%
        thuoc.setGiaBan(giaBan);
        
        // Gọi DAO để insert vào database
        return thuocDAO.insert(thuoc);
    }
    
    public boolean capNhatThuoc(Thuoc thuoc) {
        // Validate và xử lý logic tương tự
        if (!thuocDAO.selectById(thuoc.getMaThuoc()).exists()) {
            throw new IllegalArgumentException("Thuốc không tồn tại!");
        }
        
        return thuocDAO.update(thuoc);
    }
    
    public boolean xoaThuoc(int maThuoc) {
        // Kiểm tra xem thuốc có đang được sử dụng trong hóa đơn không
        if (kiemTraThuocDangSuDung(maThuoc)) {
            throw new IllegalArgumentException("Không thể xóa thuốc đang có trong hóa đơn!");
        }
        
        return thuocDAO.delete(maThuoc);
    }
    
    private boolean kiemTraTrungTen(String tenThuoc) {
        List<Thuoc> danhSach = thuocDAO.selectAll();
        return danhSach.stream().anyMatch(t -> t.getTenThuoc().equalsIgnoreCase(tenThuoc));
    }
    
    private boolean kiemTraThuocDangSuDung(int maThuoc) {
        // Logic kiểm tra trong bảng chi tiết hóa đơn
        return false; // Simplified
    }
}
```

---

### 4. **DAO** (Data Access Object Layer)
**Vai trò:** Tương tác trực tiếp với database, thực hiện CRUD operations

**Chức năng:**
- Kết nối database
- Thực thi SQL queries (SELECT, INSERT, UPDATE, DELETE)
- Map ResultSet sang Object
- Đóng connection

**Ví dụ:**
```java
// File: dao/ThuocDAO.java
public class ThuocDAO {
    
    public List<Thuoc> selectAll() {
        List<Thuoc> danhSach = new ArrayList<>();
        String sql = "SELECT * FROM thuoc";
        
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {
            
            while (rs.next()) {
                Thuoc thuoc = new Thuoc();
                thuoc.setMaThuoc(rs.getInt("maThuoc"));
                thuoc.setTenThuoc(rs.getString("tenThuoc"));
                thuoc.setGia(rs.getDouble("gia"));
                thuoc.setSoLuong(rs.getInt("soLuong"));
                danhSach.add(thuoc);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        
        return danhSach;
    }
    
    public Thuoc selectById(int maThuoc) {
        String sql = "SELECT * FROM thuoc WHERE maThuoc = ?";
        
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, maThuoc);
            ResultSet rs = stmt.executeQuery();
            
            if (rs.next()) {
                Thuoc thuoc = new Thuoc();
                thuoc.setMaThuoc(rs.getInt("maThuoc"));
                thuoc.setTenThuoc(rs.getString("tenThuoc"));
                thuoc.setGia(rs.getDouble("gia"));
                thuoc.setSoLuong(rs.getInt("soLuong"));
                return thuoc;
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        
        return null;
    }
    
    public boolean insert(Thuoc thuoc) {
        String sql = "INSERT INTO thuoc (tenThuoc, gia, soLuong) VALUES (?, ?, ?)";
        
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setString(1, thuoc.getTenThuoc());
            stmt.setDouble(2, thuoc.getGia());
            stmt.setInt(3, thuoc.getSoLuong());
            
            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }
    
    public boolean update(Thuoc thuoc) {
        String sql = "UPDATE thuoc SET tenThuoc=?, gia=?, soLuong=? WHERE maThuoc=?";
        
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setString(1, thuoc.getTenThuoc());
            stmt.setDouble(2, thuoc.getGia());
            stmt.setInt(3, thuoc.getSoLuong());
            stmt.setInt(4, thuoc.getMaThuoc());
            
            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }
    
    public boolean delete(int maThuoc) {
        String sql = "DELETE FROM thuoc WHERE maThuoc=?";
        
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, maThuoc);
            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }
}
```

---

### 5. **Database** (MySQL)
**Vai trò:** Lưu trữ dữ liệu

**Ví dụ schema:**
```sql
CREATE DATABASE quanlythuoc;
USE quanlythuoc;

CREATE TABLE thuoc (
    maThuoc INT PRIMARY KEY AUTO_INCREMENT,
    tenThuoc VARCHAR(255) NOT NULL,
    gia DOUBLE NOT NULL,
    soLuong INT NOT NULL DEFAULT 0,
    ngayHetHan DATE,
    moTa TEXT
);
```

---

## Luồng Hoạt Động Chi Tiết

### Ví Dụ: Thêm Thuốc Mới

#### **Bước 1: Frontend (HTML/JS)**
```javascript
// User nhập thông tin và click nút "Thêm"
function themThuoc() {
    const thuoc = {
        tenThuoc: document.getElementById('tenThuoc').value,
        gia: document.getElementById('gia').value,
        soLuong: document.getElementById('soLuong').value
    };
    
    // Gửi request tới Servlet
    fetch('/QuanLyCuaHangThuocYTe/thuoc?action=add', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(thuoc)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Thêm thuốc thành công!');
        } else {
            alert('Lỗi: ' + data.message);
        }
    });
}
```

#### **Bước 2: Servlet (ThuocServlet)**
```java
@Override
protected void doPost(HttpServletRequest request, HttpServletResponse response) {
    // 1. Nhận request từ frontend
    BufferedReader reader = request.getReader();
    Thuoc thuoc = new Gson().fromJson(reader, Thuoc.class);
    
    // 2. Gọi BUS layer
    ThuocBUS bus = new ThuocBUS();
    boolean ketQua = bus.themThuoc(thuoc);
    
    // 3. Trả response về frontend
    JsonObject json = new JsonObject();
    json.addProperty("success", ketQua);
    response.getWriter().write(json.toString());
}
```

#### **Bước 3: BUS (ThuocBUS)**
```java
public boolean themThuoc(Thuoc thuoc) {
    // 1. Validate dữ liệu
    if (thuoc.getTenThuoc() == null || thuoc.getTenThuoc().trim().isEmpty()) {
        throw new IllegalArgumentException("Tên thuốc không được để trống!");
    }
    
    // 2. Xử lý logic nghiệp vụ
    if (kiemTraTrungTen(thuoc.getTenThuoc())) {
        throw new IllegalArgumentException("Tên thuốc đã tồn tại!");
    }
    
    // 3. Gọi DAO layer
    ThuocDAO dao = new ThuocDAO();
    return dao.insert(thuoc);
}
```

#### **Bước 4: DAO (ThuocDAO)**
```java
public boolean insert(Thuoc thuoc) {
    String sql = "INSERT INTO thuoc (tenThuoc, gia, soLuong) VALUES (?, ?, ?)";
    
    // 1. Kết nối database
    Connection conn = DatabaseConnection.getConnection();
    PreparedStatement stmt = conn.prepareStatement(sql);
    
    // 2. Set parameters
    stmt.setString(1, thuoc.getTenThuoc());
    stmt.setDouble(2, thuoc.getGia());
    stmt.setInt(3, thuoc.getSoLuong());
    
    // 3. Thực thi SQL
    return stmt.executeUpdate() > 0;
}
```

#### **Bước 5: Database**
```sql
-- SQL được execute
INSERT INTO thuoc (tenThuoc, gia, soLuong) VALUES ('Paracetamol', 5000, 100);
```

---

## Ưu Điểm Của Kiến Trúc Này

### ✅ **Separation of Concerns**
- Mỗi layer có trách nhiệm riêng biệt
- Dễ maintain và debug

### ✅ **Reusability**
- BUS và DAO có thể tái sử dụng cho nhiều Servlet
- Giảm code trùng lặp

### ✅ **Testability**
- Có thể test từng layer độc lập
- Mock data dễ dàng

### ✅ **Scalability**
- Dễ mở rộng thêm chức năng
- Thay đổi một layer không ảnh hưởng layer khác

### ✅ **Security**
- SQL Injection prevention (PreparedStatement)
- Session management tập trung
- Validate dữ liệu ở nhiều tầng

---

## Best Practices

### 1. **Frontend**
- ✅ Validate input trước khi gửi request
- ✅ Hiển thị loading spinner khi đang xử lý
- ✅ Xử lý error gracefully
- ✅ Không hardcode URL

### 2. **Servlet**
- ✅ Luôn set Content-Type và Encoding
- ✅ Sử dụng try-catch để bắt exception
- ✅ Log các request/response quan trọng
- ✅ Validate session trước khi xử lý

### 3. **BUS**
- ✅ Validate tất cả input
- ✅ Throw exception với message rõ ràng
- ✅ Không xử lý database trực tiếp
- ✅ Tách các method nhỏ, dễ hiểu

### 4. **DAO**
- ✅ Luôn sử dụng PreparedStatement (tránh SQL Injection)
- ✅ Close connection trong finally hoặc try-with-resources
- ✅ Không xử lý business logic
- ✅ Return null hoặc empty list khi không tìm thấy

### 5. **Database**
- ✅ Đặt tên bảng, cột rõ ràng
- ✅ Sử dụng khóa chính, khóa ngoại
- ✅ Tạo index cho các cột thường query
- ✅ Backup dữ liệu định kỳ

---

## Tóm Tắt

```
User Action (Click button)
    ↓
JavaScript gửi HTTP Request (AJAX/Fetch)
    ↓
Servlet nhận request (doGet/doPost)
    ↓
Servlet gọi BUS.method()
    ↓
BUS validate + xử lý logic
    ↓
BUS gọi DAO.method()
    ↓
DAO execute SQL
    ↓
Database trả kết quả
    ↓
DAO map ResultSet → Object
    ↓
BUS nhận kết quả từ DAO
    ↓
Servlet nhận kết quả từ BUS
    ↓
Servlet trả JSON response
    ↓
JavaScript nhận response
    ↓
Update UI (hiển thị kết quả)
```

---

**Lưu ý:** Đây là mô hình 3-layer architecture chuẩn, phù hợp cho đồ án quản lý cửa hàng thuốc y tế. Tuân thủ luồng này sẽ giúp code dễ đọc, dễ maintain và dễ mở rộng.
