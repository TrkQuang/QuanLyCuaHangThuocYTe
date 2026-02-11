// URL API backend
const API_URL = "http://localhost:8080/api";

// Lấy các element từ form
const loginForm = document.getElementById("loginForm");
const errorMessage = document.getElementById("errorMessage");

// Xử lý sự kiện submit form đăng nhập
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault(); // Ngăn form reload trang

  // Lấy giá trị từ input
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  // Validate đơn giản
  if (!username || !password) {
    showError("Vui lòng nhập đầy đủ thông tin!");
    return;
  }

  // Gọi API đăng nhập
  await handleLogin(username, password);
});

/**
 * Hàm xử lý đăng nhập
 * @param {string} username - Tên đăng nhập
 * @param {string} password - Mật khẩu
 */
async function handleLogin(username, password) {
  try {
    // Chuẩn bị dữ liệu gửi đi
    const loginData = {
      tenDangNhap: username,
      matKhau: password,
    };

    // Thử đăng nhập với tài khoản nhân viên/admin trước
    let response = await fetch(`${API_URL}/taikhoan/login-nhanvien`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    });

    let userData = null;

    // Nếu đăng nhập nhân viên thành công
    if (response.ok) {
      userData = await response.json();

      if (userData && userData.maTaiKhoan) {
        // Lưu thông tin user vào localStorage
        localStorage.setItem("currentUser", JSON.stringify(userData));

        // Kiểm tra loại tài khoản và chuyển hướng
        if (userData.loaiTaiKhoan === "Admin") {
          window.location.href = "idx_admin.html";
          return;
        } else if (userData.loaiTaiKhoan === "NhanVien") {
          window.location.href = "idx_nv.html";
          return;
        }
      }
    }

    // Nếu không phải nhân viên, thử đăng nhập với tài khoản khách hàng
    response = await fetch(`${API_URL}/taikhoan/login-khach`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    });

    if (response.ok) {
      userData = await response.json();

      if (userData && userData.maTaiKhoan) {
        // Lưu thông tin user vào localStorage
        localStorage.setItem("currentUser", JSON.stringify(userData));

        // Chuyển về trang chủ
        window.location.href = "index.html";
        return;
      }
    }

    // Nếu cả hai đều thất bại
    showError("Tên đăng nhập hoặc mật khẩu không đúng!");
  } catch (error) {
    console.error("Lỗi khi đăng nhập:", error);
    showError("Không thể kết nối đến server. Vui lòng thử lại sau!");
  }
}

/**
 * Hàm hiển thị thông báo lỗi
 * @param {string} message - Nội dung lỗi
 */
function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.add("show");

  // Tự động ẩn sau 5 giây
  setTimeout(() => {
    errorMessage.classList.remove("show");
  }, 5000);
}
