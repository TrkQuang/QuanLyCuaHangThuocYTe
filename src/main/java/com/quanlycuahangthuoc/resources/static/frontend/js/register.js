const USER_KEY = "users";

// Lấy element
const registerForm = document.getElementById("registerForm");
const errorMessage = document.getElementById("errorMessage");
const successMessage = document.getElementById("successMessage");

// Submit form đăng ký
registerForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const confirmPassword = document.getElementById("confirmPassword").value.trim();

  // Validate
  if (!username || !password || !confirmPassword) {
    showError("Vui lòng nhập đầy đủ thông tin!");
    return;
  }

  if (password !== confirmPassword) {
    showError("Mật khẩu nhập lại không khớp!");
    return;
  }

  registerUser(username, password);
});

// Đăng ký user
function registerUser(username, password) {
  // Lấy danh sách user hiện có
  let users = JSON.parse(localStorage.getItem(USER_KEY)) || [];

  // Kiểm tra trùng tên đăng nhập
  const isExist = users.some(
    (user) => user.tenDangNhap === username
  );

  if (isExist) {
    showError("Tên đăng ký đã tồn tại! Vui lòng chọn tên khác.");
    return;
  }

  // Tạo user mới
  const newUser = {
    maTaiKhoan: Date.now(),
    tenDangNhap: username,
    matKhau: password,
    loaiTaiKhoan: "User",
    ngayTao: new Date().toISOString(),
  };

  // Lưu
  users.push(newUser);
  localStorage.setItem(USER_KEY, JSON.stringify(users));

  showSuccess("Đăng ký thành công! Bạn có thể đăng nhập.");

  // Reset form
  registerForm.reset();

  // Tự động chuyển sang login sau 2s
  setTimeout(() => {
    window.location.href = "login.html";
  }, 2000);
}

// Hiển thị lỗi
function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.add("show");
  successMessage.classList.remove("show");
}

// Hiển thị thành công
function showSuccess(message) {
  successMessage.textContent = message;
  successMessage.classList.add("show");
  errorMessage.classList.remove("show");
}
