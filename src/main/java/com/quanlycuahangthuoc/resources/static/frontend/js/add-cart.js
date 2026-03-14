async function getCart() {
  try {
    return await apiFetch("/cart");
  } catch (e) {
    return [];
  }
}

async function renderCart() {
  const cart = await getCart();
  const cartItems = document.getElementById("cart-items");
  const totalPriceEl = document.getElementById("total-price");
  if (!cartItems || !totalPriceEl) return;

  cartItems.innerHTML = "";
  let total = 0;

  if (!cart.length) {
    cartItems.innerHTML =
      '<tr><td colspan="5" style="text-align:center;padding:30px;">Giỏ hàng trống</td></tr>';
    totalPriceEl.innerText = "0";
    return;
  }

  cart.forEach((item) => {
    const itemTotal = Number(item.price || 0) * Number(item.quantity || 0);
    total += itemTotal;
    cartItems.innerHTML += `
      <tr>
        <td>${escapeHtml(item.title || item.name || "")}</td>
        <td>${Number(item.price || 0).toLocaleString("vi-VN")} đ</td>
        <td>
          <button class="quantity-btn" onclick="changeQuantity('${escapeHtml(String(item.id))}', -1)">-</button>
          <span style="padding:0 10px;">${item.quantity}</span>
          <button class="quantity-btn" onclick="changeQuantity('${escapeHtml(String(item.id))}', 1)">+</button>
        </td>
        <td>${itemTotal.toLocaleString("vi-VN")} đ</td>
        <td><span class="remove-btn" onclick="removeItem('${escapeHtml(String(item.id))}')">✖</span></td>
      </tr>
    `;
  });

  totalPriceEl.innerText = total.toLocaleString("vi-VN");
}

async function changeQuantity(productId, change) {
  const cart = await getCart();
  const found = cart.find((x) => String(x.id) === String(productId));
  if (!found) return;

  const newQuantity = Number(found.quantity) + Number(change);
  if (newQuantity <= 0) {
    await removeItem(productId);
    return;
  }

  await apiFetch("/cart/update", {
    method: "PUT",
    body: JSON.stringify({ id: productId, quantity: newQuantity }),
  });

  await renderCart();
  await updateCartCount();
}

async function removeItem(productId) {
  await apiFetch(`/cart/${productId}`, { method: "DELETE" });
  await renderCart();
  await updateCartCount();
}

document.addEventListener("DOMContentLoaded", async () => {
  await renderCart();
  await updateCartCount();
});
