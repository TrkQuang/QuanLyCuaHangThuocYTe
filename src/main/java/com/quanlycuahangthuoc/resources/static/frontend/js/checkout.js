// ============================================================
// checkout.js — Trang thanh toán: xem giỏ, nhập thông tin, đặt hàng
// Yêu cầu: config.js được nhúng trước
// ============================================================

// Lấy danh sách giỏ hàng
async function getCart() {
  try {
    const response = await fetch(`${API_URL}/cart`, {
      headers: { "Session-Id": getSessionId() },
    });
    if (!response.ok) throw new Error("Lấy giỏ hàng thất bại");
    return await response.json();
  } catch (error) {
    console.error("Lỗi khi lấy giỏ hàng:", error);
    return [];
  }
}

// Xóa toàn bộ giỏ hàng sau khi đặt hàng thành công
async function clearCart() {
  try {
    await fetch(`${API_URL}/cart`, {
      method: "DELETE",
      headers: { "Session-Id": getSessionId() },
    });
  } catch (error) {
    console.error("Lỗi khi xóa giỏ hàng:", error);
  }
}

// Render danh sách sản phẩm trên trang checkout
async function renderCheckout() {
  const cart = await getCart();
  const checkoutItems = document.getElementById("checkoutItems");
  const totalPriceEl = document.getElementById("totalPrice");

  if (!checkoutItems || !totalPriceEl) return;

  checkoutItems.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    checkoutItems.innerHTML = "<p>🛒 Giỏ hàng trống</p>";
    totalPriceEl.textContent = "0";
    return;
  }

  cart.forEach((item) => {
    total += item.price * item.quantity;
    const safeTitle = escapeHtml(item.title || item.name);
    const safeId = escapeHtml(String(item.id));

    checkoutItems.innerHTML += `
      <div class="checkout-item">
        <div class="checkout-info">
          <h4>${safeTitle}</h4>
          <p>${item.quantity} × ${item.price.toLocaleString()}đ</p>
        </div>
        <button class="btn-remove" onclick="removeCheckoutItem('${safeId}')">❌ Bỏ</button>
      </div>
    `;
  });

  totalPriceEl.textContent = total.toLocaleString();
}

// Xóa 1 sản phẩm khỏi giỏ ngay trên trang checkout
async function removeCheckoutItem(productId) {
  try {
    await fetch(`${API_URL}/cart/${productId}`, {
      method: "DELETE",
      headers: { "Session-Id": getSessionId() },
    });
    renderCheckout();
  } catch (error) {
    console.error("Lỗi khi xóa sản phẩm:", error);
  }
}

// Xử lý thanh toán
async function handleCheckout() {
  const fullName = document.getElementById("fullName")?.value.trim();
  const phone = document.getElementById("phone")?.value.trim();
  const address = document.getElementById("address")?.value.trim();
  const paymentMethod = document.getElementById("paymentMethod")?.value;

  // Validate thông tin
  if (!fullName || !phone || !address || !paymentMethod) {
    alert("❌ Vui lòng nhập đầy đủ thông tin thanh toán!");
    return;
  }

  // Validate định dạng số điện thoại Việt Nam
  const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
  if (!phoneRegex.test(phone)) {
    alert("❌ Số điện thoại không hợp lệ! (VD: 0912345678)");
    return;
  }

  const cart = await getCart();
  if (cart.length === 0) {
    alert("❌ Giỏ hàng trống!");
    return;
  }

  // Lấy thông tin user từ localStorage
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  // Tạo đơn hàng
  const order = {
    maKhachHang: currentUser?.maKhachHang || null,
    tenNguoiNhan: fullName,
    soDienThoai: phone,
    diaChi: address,
    phuongThucThanhToan: paymentMethod,
    tongTien: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    trangThai: "Đang xử lý",
    ngayTao: new Date().toISOString(),
  };

  try {
    const response = await fetch(`${API_URL}/hoadon`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    });

    if (response.ok) {
      alert("✅ Đặt hàng thành công!\nĐơn hàng đang được xử lý.");
      await clearCart();
      window.location.href = "order-history.html";
    } else {
      const errText = await response.text();
      alert("❌ Đặt hàng thất bại! " + errText);
    }
  } catch (error) {
    console.error("Lỗi khi đặt hàng:", error);
    alert("❌ Không thể kết nối đến server!");
  }
}

// ===== KHỞI TẠO =====
document.addEventListener("DOMContentLoaded", () => {
  // Kiểm tra đăng nhập trước khi làm gì
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) {
    alert("Vui lòng đăng nhập để thanh toán!");
    window.location.href = "login.html";
    return;
  }

  renderCheckout();
});