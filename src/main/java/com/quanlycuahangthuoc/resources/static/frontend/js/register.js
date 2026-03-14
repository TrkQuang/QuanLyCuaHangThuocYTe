const registerForm = document.getElementById("registerForm");
const errorMessage = document.getElementById("errorMessage");
const successMessage = document.getElementById("successMessage");

function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.add("show");
  successMessage.classList.remove("show");
  setTimeout(() => errorMessage.classList.remove("show"), 5000);
}

function showSuccess(message) {
  successMessage.textContent = message;
  successMessage.classList.add("show");
  errorMessage.classList.remove("show");
}

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const hoTen = document.getElementById("fullName").value.trim();
  const tenDangNhap = document.getElementById("username").value.trim();
  const matKhau = document.getElementById("password").value.trim();
  const confirmPassword = document
    .getElementById("confirmPassword")
    .value.trim();
  const email = document.getElementById("email").value.trim();
  const soDienThoai = document.getElementById("phone").value.trim();
  const ngaySinh = document.getElementById("birthDate").value;
  const gioiTinh = document.getElementById("gender").value;
  const diaChi = document.getElementById("address").value.trim();
  const tienSuBenhLy = document.getElementById("medicalHistory").value.trim();

  if (
    !hoTen ||
    !tenDangNhap ||
    !matKhau ||
    !confirmPassword ||
    !email ||
    !soDienThoai ||
    !ngaySinh ||
    !gioiTinh ||
    !diaChi ||
    !tienSuBenhLy
  ) {
    showError("Vui lòng nhap day du thong tin");
    return;
  }

  if (!/^[0-9]{10,15}$/.test(soDienThoai)) {
    showError("So dien thoai phai gom 10-15 chu so");
    return;
  }

  if (new Date(ngaySinh) > new Date()) {
    showError("Ngày sinh không được lon hon ngay hien tai");
    return;
  }

  if (matKhau !== confirmPassword) {
    showError("Mật khẩu nhap lai không khop");
    return;
  }

  try {
    await apiFetch("/taikhoan/dangky", {
      method: "POST",
      body: JSON.stringify({
        hoTen,
        tenDangNhap,
        matKhau,
        email,
        soDienThoai,
        ngaySinh,
        gioiTinh,
        diaChi,
        tienSuBenhLy,
      }),
    });
    showSuccess("Đăng ký thành công, dang chuyen sang trang đăng nhập...");
    registerForm.reset();
    setTimeout(() => {
      window.location.href = "login.html";
    }, 1200);
  } catch (e2) {
    showError(e2.message || "Đăng ký thất bại");
  }
});
