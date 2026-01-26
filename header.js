const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const loginLink = document.getElementById("loginLink");

  if (currentUser && currentUser.tenDangNhap) {
    // Đã đăng nhập
    loginLink.textContent = `👋 ${currentUser.tenDangNhap}`;
    loginLink.href = "#";

    // Click để logout
    loginLink.addEventListener("click", () => {
      window.location.href = "profile.html"
    });
  }