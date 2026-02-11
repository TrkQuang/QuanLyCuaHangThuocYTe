// API Configuration
const API_URL = "http://localhost:8080/api";

// Lấy element
const registerForm = document.getElementById("registerForm");
const errorMessage = document.getElementById("errorMessage");
const successMessage = document.getElementById("successMessage");

// Submit form đăng ký
registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const confirmPassword = document
    .getElementById("confirmPassword")
    .value.trim();
  const fullName =
    document.getElementById("fullName")?.value.trim() || username;
  const phone = document.getElementById("phone")?.value.trim() || "";
  const email = document.getElementById("email")?.value.trim() || "";

  // Validate
  if (!username || !password || !confirmPassword) {
    showError("Vui lòng nhập đầy đủ thông tin!");
    return;
  }

  if (password !== confirmPassword) {
    showError("Mật khẩu nhập lại không khớp!");
    return;
  }

  if (password.length < 6) {
    showError("Mật khẩu phải có ít nhất 6 ký tự!");
    return;
  }

  await registerUser(username, password, fullName, phone, email);
});

// Đăng ký user qua API
async function registerUser(username, password, fullName, phone, email) {
  try {
    // Tạo tài khoản
    const taiKhoanData = {
      tenDangNhap: username,
      matKhau: password,
      loaiTaiKhoan: "KhachHang",
    };

    const taiKhoanResponse = await fetch(`${API_URL}/taikhoan/dangky`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taiKhoanData),
    });

    if (!taiKhoanResponse.ok) {
      showError("Tên đăng nhập đã tồn tại! Vui lòng chọn tên khác.");
      return;
    }

    // Tạo thông tin khách hàng
    const khachHangData = {
      tenKhachHang: fullName,
      soDienThoai: phone,
      email: email,
      diaChi: "",
      ngayTao: new Date().toISOString(),
    };

    await fetch(`${API_URL}/khachhang`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(khachHangData),
    });

    showSuccess("Đăng ký thành công! Bạn có thể đăng nhập.");

    // Reset form
    registerForm.reset();

    // Tự động chuyển sang login sau 2s
    setTimeout(() => {
      window.location.href = "login.html";
    }, 2000);
  } catch (error) {
    console.error("Lỗi khi đăng ký:", error);
    showError("Không thể kết nối đến server. Vui lòng thử lại sau!");
  }
}

// Hiển thị lỗi
function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.add("show");
  successMessage.classList.remove("show");

  setTimeout(() => {
    errorMessage.classList.remove("show");
  }, 5000);
}

// Hiển thị thành công
function showSuccess(message) {
  successMessage.textContent = message;
  successMessage.classList.add("show");
  errorMessage.classList.remove("show");
}
