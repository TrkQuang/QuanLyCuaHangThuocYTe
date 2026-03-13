const loginForm = document.getElementById("loginForm");
const errorMessage = document.getElementById("errorMessage");

function normalizeRole(role) {
  return String(role || "")
    .trim()
    .toUpperCase();
}

function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.add("show");
  setTimeout(() => errorMessage.classList.remove("show"), 5000);
}

async function loginNhanVien(loginData) {
  const user = await apiFetch("/taikhoan/login-nhanvien", {
    method: "POST",
    body: JSON.stringify(loginData),
  });
  setCurrentUser(user);
  if (normalizeRole(user.loaiTaiKhoan) === "ADMIN") {
    window.location.href = "idx_admin.html";
    return true;
  }
  window.location.href = "idx_nv.html";
  return true;
}

async function loginKhach(loginData) {
  const payload = await apiFetch("/taikhoan/session/login-khach", {
    method: "POST",
    body: JSON.stringify(loginData),
  });

  const user = payload.user;
  const khachHang = payload.khachHang;
  setCurrentUser({
    ...user,
    maKhachHang: khachHang?.maKhachHang || null,
    hoTenKhachHang: `${khachHang?.ho || ""} ${khachHang?.ten || ""}`.trim(),
  });
  window.location.href = "index.html";
  return true;
}

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const tenDangNhap = document.getElementById("username").value.trim();
  const matKhau = document.getElementById("password").value.trim();

  if (!tenDangNhap || !matKhau) {
    showError("Vui long nhap day du thong tin");
    return;
  }

  const payload = { tenDangNhap, matKhau };

  try {
    try {
      await loginNhanVien(payload);
      return;
    } catch (e1) {
      await loginKhach(payload);
    }
  } catch (e) {
    showError(e.message || "Dang nhap that bai");
  }
});
