const ACCOUNTS = [
  {
    tenDangNhap: "admin",
    matKhau: "admin123",
    loaiTaiKhoan: "Admin",
    maTaiKhoan: 1,
  },
  {
    tenDangNhap: "nhanvien",
    matKhau: "nv123",
    loaiTaiKhoan: "NhanVien",
    maTaiKhoan: 2,
  },
];

// Key lưu user đăng ký
const USER_KEY = "users";

// Lấy element
const loginForm = document.getElementById("loginForm");
const errorMessage = document.getElementById("errorMessage");

// Submit form
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username || !password) {
    showError("Vui lòng nhập đầy đủ thông tin!");
    return;
  }

  handleLogin(username, password);
});

// Xử lý đăng nhập
function handleLogin(username, password) {
  // Kiểm tra Admin / Nhân viên
  let user = ACCOUNTS.find(
    (acc) =>
      acc.tenDangNhap === username && acc.matKhau === password
  );

  // Nếu không phải Admin / NV → kiểm tra User đăng ký
  if (!user) {
    const users = JSON.parse(localStorage.getItem(USER_KEY)) || [];

    user = users.find(
      (u) =>
        u.tenDangNhap === username && u.matKhau === password
    );
  }

  // Không tìm thấy tài khoản
  if (!user) {
    showError("Tên đăng nhập hoặc mật khẩu không đúng!");
    return;
  }

  // Lưu user đăng nhập
  localStorage.setItem("currentUser", JSON.stringify(user));
  localStorage.setItem("role", user.loaiTaiKhoan);

  // Điều hướng theo quyền
  if (user.loaiTaiKhoan === "Admin") {
    window.location.href = "idx_admin.html";
  } else if (user.loaiTaiKhoan === "NhanVien") {
    window.location.href = "idx_nv.html";
  } else if (user.loaiTaiKhoan === "User") {
    window.location.href = "index.html";
  } else {
    showError("Không xác định quyền tài khoản!");
    localStorage.clear();
  }
}

// Hiển thị lỗi
function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.add("show");

  setTimeout(() => {
    errorMessage.classList.remove("show");
  }, 5000);
}
