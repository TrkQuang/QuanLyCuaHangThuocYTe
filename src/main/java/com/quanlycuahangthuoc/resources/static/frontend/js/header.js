(function () {
  const loginLink = document.getElementById("loginLink");
  if (!loginLink) return;

  const currentUser = getCurrentUser();
  if (!currentUser || !currentUser.tenDangNhap) {
    loginLink.textContent = "👤 Đăng nhập";
    loginLink.href = "login.html";
    return;
  }

  loginLink.textContent = `👋 ${currentUser.tenDangNhap}`;
  loginLink.href = "#";

  loginLink.addEventListener("click", (e) => {
    e.preventDefault();
    const existing = document.querySelector(".user-dropdown-menu");
    if (existing) {
      existing.remove();
      return;
    }

    const menu = document.createElement("div");
    menu.className = "user-dropdown-menu";
    menu.style.cssText =
      "position:absolute;top:100%;right:0;background:#fff;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,.15);padding:8px 0;min-width:160px;z-index:1000;margin-top:8px;";

    menu.innerHTML =
      '<a href="profile.html" style="display:block;padding:8px 14px;color:#333;text-decoration:none;">👤 Tài khoản</a>' +
      '<a href="order-history.html" style="display:block;padding:8px 14px;color:#333;text-decoration:none;">📋 Đơn hàng</a>' +
      '<hr style="margin:6px 0;border:none;border-top:1px solid #eee;">' +
      '<a href="#" id="logoutBtnHeader" style="display:block;padding:8px 14px;color:#d00;text-decoration:none;">🚪 Dang xuat</a>';

    loginLink.parentElement.style.position = "relative";
    loginLink.parentElement.appendChild(menu);

    const logoutBtn = document.getElementById("logoutBtnHeader");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", async (ev) => {
        ev.preventDefault();
        await logoutSession();
        window.location.href = "login.html";
      });
    }

    setTimeout(() => {
      document.addEventListener("click", function closeMenu(evt) {
        if (!menu.contains(evt.target) && evt.target !== loginLink) {
          menu.remove();
          document.removeEventListener("click", closeMenu);
        }
      });
    }, 0);
  });
})();
