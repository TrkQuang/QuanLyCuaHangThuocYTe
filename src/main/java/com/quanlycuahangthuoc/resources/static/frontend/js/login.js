// Tài khoản admin mặc định
const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "admin",
};

const API_BASE_URL = "/api";

document
  .getElementById("loginForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    const remember = document.getElementById("remember").checked;

    // Xóa thông báo cũ
    hideAlert();

    // Kiểm tra tài khoản admin mặc định trước
    if (
      username === ADMIN_CREDENTIALS.username &&
      password === ADMIN_CREDENTIALS.password
    ) {
      loginAsAdmin(remember);
      return;
    }

    // Nếu không phải admin, thử đăng nhập qua API
    try {
      const response = await fetch(`${API_BASE_URL}/taikhoan/dangnhap`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tenDangNhap: username,
          matKhau: password,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        // Kiểm tra vai trò và chuyển hướng phù hợp
        if (data.vaiTro === "admin" || data.vaiTro === "ADMIN") {
          loginAsAdmin(remember, data);
        } else {
          loginAsEmployee(remember, data);
        }
      } else {
        showAlert("Tên đăng nhập hoặc mật khẩu không đúng!", "error");
      }
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      showAlert("Không thể kết nối đến máy chủ. Vui lòng thử lại!", "error");
    }
  });

// Đăng nhập với quyền Admin
function loginAsAdmin(remember, data = null) {
  const adminUser = data || {
    maTK: "ADMIN001",
    tenDangNhap: "admin",
    vaiTro: "admin",
    hoTen: "Quản Trị Viên",
    loginTime: new Date().toISOString(),
  };

  // Lưu vào storage phù hợp
  const storage = remember ? localStorage : sessionStorage;
  storage.setItem("currentAdmin", JSON.stringify(adminUser));

  showAlert("Đăng nhập Admin thành công! Đang chuyển hướng...", "success");

  setTimeout(() => {
    window.location.href = "index_admin.html";
  }, 1000);
}

// Đăng nhập với quyền Nhân viên
function loginAsEmployee(remember, data) {
  // Lấy thông tin nhân viên từ API nếu cần
  const employeeUser = {
    maTK: data.maTK,
    maNhanVien: data.maNhanVien,
    tenDangNhap: data.tenDangNhap,
    tenNhanVien: data.tenNhanVien || data.hoTen,
    vaiTro: data.vaiTro || "nhanvien",
    loginTime: new Date().toISOString(),
  };

  // Lưu vào storage phù hợp
  const storage = remember ? localStorage : sessionStorage;
  storage.setItem("currentUser", JSON.stringify(employeeUser));

  showAlert("Đăng nhập Nhân viên thành công! Đang chuyển hướng...", "success");

  setTimeout(() => {
    window.location.href = "index_nv.html";
  }, 1000);
}

function showAlert(message, type) {
  const alertBox = document.getElementById("alertBox");
  alertBox.textContent = message;
  alertBox.className = `alert alert-${type}`;
  alertBox.style.display = "block";
}

function hideAlert() {
  const alertBox = document.getElementById("alertBox");
  alertBox.style.display = "none";
}

// Kiểm tra nếu đã đăng nhập
window.addEventListener("load", function () {
  const currentAdmin =
    localStorage.getItem("currentAdmin") ||
    sessionStorage.getItem("currentAdmin");
  const currentUser =
    localStorage.getItem("currentUser") ||
    sessionStorage.getItem("currentUser");

  if (currentAdmin) {
    // Đã đăng nhập admin, chuyển thẳng vào trang admin
    window.location.href = "index_admin.html";
  } else if (currentUser) {
    // Đã đăng nhập nhân viên, chuyển thẳng vào trang nhân viên
    window.location.href = "index_nv.html";
  }
});
