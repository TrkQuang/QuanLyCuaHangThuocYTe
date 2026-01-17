# JavaScript (Frontend)

Chứa các file JavaScript để tương tác với backend và xử lý giao diện người dùng.

## Chức năng:

- Gọi API từ backend (Servlet)
- Hiển thị dữ liệu động
- Xử lý sự kiện người dùng
- Validate input phía client

---

## Ví dụ: Gọi API và Hiển Thị Dữ Liệu

### 1. **Lấy danh sách thuốc** (GET)

```javascript
// Gọi API để lấy tất cả thuốc
function layDanhSachThuoc() {
  fetch("/QuanLyCuaHangThuocYTe/thuoc?action=getAll")
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
  fetch("/QuanLyCuaHangThuocYTe/thuoc?action=add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // Quan trọng!
    },
    body: JSON.stringify(thuoc), // Chuyển object thành JSON string
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.success) {
        alert("Thêm thuốc thành công!");
        layDanhSachThuoc(); // Refresh danh sách
        document.getElementById("formThuoc").reset(); // Clear form
      } else {
        alert("Lỗi: " + result.message);
      }
    })
    .catch((error) => {
      console.error("Lỗi:", error);
      alert("Có lỗi xảy ra!");
    });
}
```

---

### 3. **Xem chi tiết thuốc** (GET với parameter)

```javascript
function xemChiTiet(maThuoc) {
  fetch(`/QuanLyCuaHangThuocYTe/thuoc?action=getById&id=${maThuoc}`)
    .then((response) => response.json())
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
    });
}
```

---

### 4. **Cập nhật thuốc** (POST)

```javascript
function capNhatThuoc(maThuoc) {
  const thuoc = {
    maThuoc: maThuoc,
    tenThuoc: document.getElementById("editTenThuoc").value,
    gia: parseFloat(document.getElementById("editGia").value),
    soLuong: parseInt(document.getElementById("editSoLuong").value),
  };

  fetch("/QuanLyCuaHangThuocYTe/thuoc?action=update", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(thuoc),
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.success) {
        alert("Cập nhật thành công!");
        layDanhSachThuoc();
      }
    });
}
```

---

### 5. **Xóa thuốc** (POST)

```javascript
function xoa(maThuoc) {
  if (!confirm("Bạn có chắc muốn xóa thuốc này?")) return;

  fetch(`/QuanLyCuaHangThuocYTe/thuoc?action=delete&id=${maThuoc}`, {
    method: "POST",
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.success) {
        alert("Xóa thành công!");
        layDanhSachThuoc(); // Refresh danh sách
      } else {
        alert("Lỗi: " + result.message);
      }
    });
}
```

---

### 6. **Tìm kiếm thuốc**

```javascript
function timKiem() {
  const keyword = document.getElementById("searchInput").value;

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
```

---

## Giải Thích Chi Tiết

### **fetch()** - Hàm gọi API

```javascript
fetch(url, options);
```

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

```javascript
if (!tenThuoc || gia <= 0) {
  alert("Vui lòng nhập đầy đủ thông tin!");
  return;
}
```

✅ **URL phải đúng format**

```javascript
// Đúng
"/QuanLyCuaHangThuocYTe/thuoc?action=getAll";

// Sai
"QuanLyCuaHangThuocYTe/thuoc?action=getAll"; // Thiếu dấu /
```
