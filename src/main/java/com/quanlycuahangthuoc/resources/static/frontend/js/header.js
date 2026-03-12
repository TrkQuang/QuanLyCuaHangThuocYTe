// ============================================================
// header.js — Hiển thị trạng thái đăng nhập & dropdown menu
// Yêu cầu: config.js được nhúng trước
// ============================================================

(function () {
  // Dùng IIFE để tránh conflict với biến currentUser ở các file khác
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const loginLink = document.getElementById("loginLink");

  if (!loginLink) return;

  if (currentUser && currentUser.tenDangNhap) {
    // Đã đăng nhập → hiển thị tên
    loginLink.textContent = `👋 ${currentUser.tenDangNhap}`;
    loginLink.href = "#";

    loginLink.addEventListener("click", (e) => {
      e.preventDefault();

      // Toggle dropdown
      const existingMenu = document.querySelector(".user-dropdown-menu");
      if (existingMenu) {
        existingMenu.remove();
        return;
      }

      const menu = document.createElement("div");
      menu.className = "user-dropdown-menu";
      menu.style.cssText = `
        position: absolute;
        top: 100%;
        right: 0;
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        padding: 10px 0;
        min-width: 150px;
        z-index: 1000;
        margin-top: 10px;
      `;

      menu.innerHTML = `
        <a href="profile.html" style="display:block;padding:10px 20px;color:#333;text-decoration:none;">
          👤 Tài khoản
        </a>
        <a href="order-history.html" style="display:block;padding:10px 20px;color:#333;text-decoration:none;">
          📋 Đơn hàng
        </a>
        <hr style="margin:5px 0;border:none;border-top:1px solid #eee;">
        <a href="#" id="logoutBtn" style="display:block;padding:10px 20px;color:#dc3545;text-decoration:none;">
          🚪 Đăng xuất
        </a>
      `;

      // Hover effect
      menu.querySelectorAll("a").forEach((link) => {
        link.addEventListener("mouseenter", () => (link.style.background = "#f8f9fa"));
        link.addEventListener("mouseleave", () => (link.style.background = "transparent"));
      });

      loginLink.parentElement.style.position = "relative";
      loginLink.parentElement.appendChild(menu);

      // Đăng xuất
      document.getElementById("logoutBtn").addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem("currentUser");
        localStorage.removeItem("sessionId");
        alert("Đã đăng xuất!");
        window.location.href = "index.html";
      });

      // Click bên ngoài để đóng
      setTimeout(() => {
        document.addEventListener("click", function closeMenu(e) {
          if (!menu.contains(e.target) && e.target !== loginLink) {
            menu.remove();
            document.removeEventListener("click", closeMenu);
          }
        });
      }, 0);
    });
  } else {
    // Chưa đăng nhập
    loginLink.textContent = "👤 Đăng nhập";
    loginLink.href = "login.html";
  }
})();