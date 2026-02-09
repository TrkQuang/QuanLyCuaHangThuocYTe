// Lấy giỏ hàng từ LocalStorage
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

// Lưu giỏ hàng
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Render giỏ hàng
function renderCart() {
  const cart = getCart();
  const cartItems = document.getElementById("cart-items");
  const totalPriceEl = document.getElementById("total-price");

  cartItems.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <tr>
        <td colspan="5">🛒 Giỏ hàng trống</td>
      </tr>
    `;
    totalPriceEl.innerText = "0";
    return;
  }

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    cartItems.innerHTML += `
      <tr>
        <td>${item.name}</td>
        <td>${item.price.toLocaleString()} VNĐ</td>
        <td>
          <button class="quantity-btn" onclick="changeQuantity(${index}, -1)">-</button>
          ${item.quantity}
          <button class="quantity-btn" onclick="changeQuantity(${index}, 1)">+</button>
        </td>
        <td>${itemTotal.toLocaleString()} VNĐ</td>
        <td>
          <span class="remove-btn" onclick="removeItem(${index})">✖</span>
        </td>
      </tr>
    `;
  });

  totalPriceEl.innerText = total.toLocaleString();
}

// Tăng / giảm số lượng
function changeQuantity(index, change) {
  const cart = getCart();

  cart[index].quantity += change;

  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }

  saveCart(cart);
  renderCart();
}

// Xóa sản phẩm
function removeItem(index) {
  const cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  renderCart();
}

// Load khi mở trang
renderCart();
