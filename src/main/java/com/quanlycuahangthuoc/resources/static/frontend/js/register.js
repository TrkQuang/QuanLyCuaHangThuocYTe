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

  const tenDangNhap = document.getElementById("username").value.trim();
  const matKhau = document.getElementById("password").value.trim();
  const confirmPassword = document
    .getElementById("confirmPassword")
    .value.trim();
  const email = document.getElementById("email").value.trim();

  if (!tenDangNhap || !matKhau || !confirmPassword || !email) {
    showError("Vui long nhap day du thong tin");
    return;
  }
  if (matKhau !== confirmPassword) {
    showError("Mat khau nhap lai khong khop");
    return;
  }

  try {
    await apiFetch("/taikhoan/dangky", {
      method: "POST",
      body: JSON.stringify({ tenDangNhap, matKhau, email }),
    });
    showSuccess("Dang ky thanh cong, dang chuyen sang trang dang nhap...");
    registerForm.reset();
    setTimeout(() => {
      window.location.href = "login.html";
    }, 1200);
  } catch (e2) {
    showError(e2.message || "Dang ky that bai");
  }
});
