// ============================================================
// add-cart.js — Trang giỏ hàng: render, sửa số lượng, xóa
// Yêu cầu: config.js được nhúng trước
// ============================================================

// Lấy danh sách giỏ hàng từ API
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

// Render toàn bộ giỏ hàng ra bảng
async function renderCart() {
  const cart = await getCart();
  const cartItems = document.getElementById("cart-items");
  const totalPriceEl = document.getElementById("total-price");

  if (!cartItems || !totalPriceEl) return;

  cartItems.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <tr>
        <td colspan="5" style="text-align:center;padding:40px;">
          🛒 Giỏ hàng trống
          <br><br>
          <a href="shop.html" class="btn-primary">Tiếp tục mua sắm</a>
        </td>
      </tr>
    `;
    totalPriceEl.innerText = "0";
    return;
  }

  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    // Dùng escapeHtml để tránh XSS
    const safeTitle = escapeHtml(item.title || item.name);
    const safeImage = escapeHtml(item.image);
    const safeId = escapeHtml(String(item.id));

    cartItems.innerHTML += `
      <tr>
        <td>
          <div style="display:flex;align-items:center;gap:10px;">
            <img src="${safeImage}" style="width:50px;height:50px;object-fit:cover;border-radius:8px;"
                 onerror="this.src='https://via.placeholder.com/50'">
            <strong>${safeTitle}</strong>
          </div>
        </td>
        <td>${item.price.toLocaleString()} đ</td>
        <td>
          <div style="display:flex;align-items:center;gap:5px;justify-content:center;">
            <button class="quantity-btn" onclick="changeQuantity('${safeId}', -1)">-</button>
            <span style="padding:0 10px;font-weight:bold;">${item.quantity}</span>
            <button class="quantity-btn" onclick="changeQuantity('${safeId}', 1)">+</button>
          </div>
        </td>
        <td style="font-weight:bold;color:#667eea;">${itemTotal.toLocaleString()} đ</td>
        <td>
          <span class="remove-btn" onclick="removeItem('${safeId}')"
                style="cursor:pointer;color:#dc3545;font-size:20px;">✖</span>
        </td>
      </tr>
    `;
  });

  totalPriceEl.innerText = total.toLocaleString();
}

// Tăng / giảm số lượng sản phẩm
async function changeQuantity(productId, change) {
  try {
    const cart = await getCart();
    const item = cart.find((i) => String(i.id) === String(productId));
    if (!item) return;

    const newQuantity = item.quantity + change;

    if (newQuantity <= 0) {
      await removeItem(productId);
      return;
    }

    await fetch(`${API_URL}/cart/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Session-Id": getSessionId(),
      },
      body: JSON.stringify({ id: productId, quantity: newQuantity }),
    });

    renderCart();
  } catch (error) {
    console.error("Lỗi khi thay đổi số lượng:", error);
  }
}

// Xóa sản phẩm khỏi giỏ
async function removeItem(productId) {
  try {
    await fetch(`${API_URL}/cart/${productId}`, {
      method: "DELETE",
      headers: { "Session-Id": getSessionId() },
    });
    renderCart();
  } catch (error) {
    console.error("Lỗi khi xóa sản phẩm:", error);
  }
}

// Load khi mở trang giỏ hàng
document.addEventListener("DOMContentLoaded", () => {
  renderCart();
});