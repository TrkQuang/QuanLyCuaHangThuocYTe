# JavaScript (Frontend)

Chứa các file JavaScript để tương tác với backend và xử lý giao diện người dùng.

## Chức năng:

- Gọi REST API từ Spring Boot Controller
- Hiển thị dữ liệu động
- Xử lý sự kiện người dùng
- Validate input phía client

---

## Ví dụ: Gọi API và Hiển Thị Dữ Liệu

### 1. **Lấy danh sách thuốc** (GET)

```javascript
// Gọi API để lấy tất cả thuốc
function layDanhSachThuoc() {
  fetch("/api/thuoc")
    .then((response) => response.json()) // Parse JSON từ backend
    .then((data) => {
      // data là array của các thuốc
      hienThiDanhSach(data);
    })
    .catch((error) => {
      console.error("Lỗi:", error);
      alert("Không thể tải danh sách thuốc!");
    });
}

// Hiển thị dữ liệu lên bảng
function hienThiDanhSach(danhSach) {
  const tbody = document.querySelector("#tableThuoc tbody");
  tbody.innerHTML = ""; // Xóa dữ liệu cũ

  danhSach.forEach((thuoc) => {
    const row = `
            <tr>
                <td>${thuoc.maThuoc}</td>
                <td>${thuoc.tenThuoc}</td>
                <td>${thuoc.gia.toLocaleString()} VNĐ</td>
                <td>
                    <button onclick="xemChiTiet(${thuoc.maThuoc})">Xem</button>
                    <button onclick="xoa(${thuoc.maThuoc})">Xóa</button>
                </td>
            </tr>
        `;
    tbody.innerHTML += row;
  });
}
```

---

### 2. **Thêm thuốc mới** (POST)

```javascript
function themThuoc() {
  // Lấy dữ liệu từ form
  const thuoc = {
    tenThuoc: document.getElementById("tenThuoc").value,
    gia: parseFloat(document.getElementById("gia").value),
    soLuong: parseInt(document.getElementById("soLuong").value),
  };

  // Gửi request POST với JSON body
  fetch("/api/thuoc", {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // Quan trọng!
    },
    body: JSON.stringify(thuoc), // Chuyển object thành JSON string
  })
    .then((response) => {
      if (!response.ok) throw new Error("HTTP error " + response.status);
      return response.json();
    })
    .then((result) => {
      alert("Thêm thuốc thành công!");
      layDanhSachThuoc(); // Refresh danh sách
      document.getElementById("formThuoc").reset(); // Clear form
    })
    .catch((error) => {
      console.error("Lỗi:", error);
      alert("Có lỗi xảy ra!");
    });
}
```

---

### 3. **Xem chi tiết thuốc** (GET với path variable)

````javascript
function xemChiTiet(maThuoc) {
  fetch(`/api/thuoc/${maThuoc}`)
    .then((response) => {
      if (!response.ok) throw new Error('Không tìm thấy thuốc');
      return response.json();
    })
    .then((thuoc) => {
      // Hiển thị trong modal hoặc form
      document.getElementById("modalTenThuoc").textContent = thuoc.tenThuoc;
      document.getElementById("modalGia").textContent = thuoc.gia;
      document.getElementById("modalSoLuong").textContent = thuoc.soLuong;
      // Mở modal
      document.getElementById("modalChiTiet").style.display = "block";
    })
    .catch((error) => {
      console.error("Lỗi:", error);
      alert("Không thể xem chi tiết thuốc!");
    });
}
```UT)

```javascript
function capNhatThuoc(maThuoc) {
  const thuoc = {
    tenThuoc: document.getElementById("editTenThuoc").value,
    gia: parseFloat(document.getElementById("editGia").value),
    soLuong: parseInt(document.getElementById("editSoLuong").value),
  };

  fetch(`/api/thuoc/${maThuoc}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(thuoc),
  })
    .then((response) => {
      if (!response.ok) throw new Error('HTTP error ' + response.status);
      return response.json();
    })
    .then((result) => {
      alert("Cập nhật thành công!");
      layDanhSachThuoc();
    })
    .catch((error) => {
      console.error("Lỗi:", error);
      alert("Có lỗi xảy ra khi cập nhật!");en((result) => {
      if (result.success) {
        alert("Cập nhật thành công!");
        layDanhSachThuoc();
      }
    });
}
```DELETE)

```javascript
function xoa(maThuoc) {
  if (!confirm("Bạn có chắc muốn xóa thuốc này?")) return;

  fetch(`/api/thuoc/${maThuoc}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (!response.ok) throw new Error('HTTP error ' + response.status);
      alert("Xóa thành công!");
      layDanhSachThuoc(); // Refresh danh sách
    })
    .catch((error) => {
      console.error("Lỗi:", error);
      alert("Không thể xóa thuốc!"); alert("Xóa thành công!");
        layDanhSachThuoc(); // Refresh danh sách
      } else {
        alert("Lỗi: " + result.message);
      }
    });
}
````

---

### 6. **Tìm kiếm thuốc**

```javascrapi/thuoc/search?keyword=${encodeURIComponent(keyword)}`)
.then((response) => response.json())
.then((data) => {
hienThiDanhSach(data);
})
.catch((error) => {
console.error("Lỗi:", error
fetch(`/QuanLyCuaHangThuocYTe/thuoc?action=search&keyword=${keyword}`)
.then((response) => response.json())
.then((data) => {
hienThiDanhSach(data);
});
}

// Tìm kiếm realtime khi gõ
document.getElementById("searchInput").addEventListener("input", function () {
timKiem();
});

````

---

## Giải Thích Chi Tiết

### **fetch()** - Hàm gọi API

```javascript
fetch(url, options);
````

- `url`: Đường dẫn API (ví dụ: `/thuoc?action=getAll`)
- `options`: Cấu hình (method, headers, body)

### **Promise Chain**

```javascript
fetch(url)
  .then((response) => response.json()) // Bước 1: Parse JSON
  .then((data) => {
    /* Xử lý data */
  }) // Bước 2: Sử dụng data
  .catch((error) => {
    /* Xử lý lỗi */
  }); // Bước 3: Bắt lỗi
```

### **Headers**

```javascript
headers: {
    'Content-Type': 'application/json'  // Báo server là đang gửi JSON
}
```

### **JSON.stringify()**

Chuyển JavaScript object thành JSON string để gửi lên server:

```javascript
const obj = { name: "Paracetamol", price: 5000 };
const json = JSON.stringify(obj);
// Kết quả: '{"name":"Paracetamol","price":5000}'
```

### **response.json()**

Parse JSON string từ server thành JavaScript object:

```javascript
fetch(url)
  .then((response) => response.json()) // Parse JSON
  .then((data) => {
    console.log(data.tenThuoc); // Truy cập như object bình thường
  });
```

---

## Lưu Ý Quan Trọng

✅ **Luôn kiểm tra response**

```javascript
.then(response => {
    if (!response.ok) throw new Error('HTTP error ' + response.status);
    return response.json();
})
```

✅ **Xử lý lỗi đúng cách**

```javascript
.catch(error => {
    console.error('Lỗi:', error);
    alert('Có lỗi xảy ra!');
})
```

✅ **Validate input trước khi gửi**

````javascript
if (!tenThuoc || gia <= 0) {
  alert("Vui lòng nhập đầy đủ thông tin!");
  return;
} (RESTful API)**

```javascript
// Đúng - Spring Boot REST API
"/api/thuoc";                    // GET all, POST new
"/api/thuoc/{id}";               // GET by id, PUT update, DELETE
"/api/thuoc/search?keyword=abc"; // Search with query param

// Sai
"api/thuoc";                     // Thiếu dấu /
"/api/thuoc?action=getAll";      // Không dùng action parameter nữa
````

---

## Spring Boot REST API Pattern

### **HTTP Methods chuẩn REST:**

- **GET** `/api/thuoc` - Lấy tất cả
- **GET** `/api/thuoc/{id}` - Lấy theo ID
- **POST** `/api/thuoc` - Thêm mới
- **PUT** `/api/thuoc/{id}` - Cập nhật
- **DELETE** `/api/thuoc/{id}` - Xóa
- **GET** `/api/thuoc/search?keyword=...` - Tìm kiếm

### **Response format từ Spring Boot:**

```javascript
// Success response
{
  "maThuoc": 1,
  "tenThuoc": "Paracetamol",
  "gia": 5000,
  "soLuong": 100
}

// Error response (tùy cấu hình exception handler)
{
  "timestamp": "2026-01-17T20:30:00",
  "status": 404,
  "error": "Not Found",
  "message": "Thuốc không tồn tại"
}

// Sai
"QuanLyCuaHangThuocYTe/thuoc?action=getAll"; // Thiếu dấu /
```
