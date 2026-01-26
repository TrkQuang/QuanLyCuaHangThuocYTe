// ===== KIỂM TRA ĐĂNG NHẬP =====
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
if (!currentUser) {
  alert("Vui lòng đăng nhập để thanh toán!");
  window.location.href = "login.html";
}

// ===== CART STORAGE =====
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// ===== RENDER CHECKOUT =====
function renderCheckout() {
  const cart = getCart();
  const checkoutItems = document.getElementById("checkoutItems");
  const totalPriceEl = document.getElementById("totalPrice");

  checkoutItems.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    checkoutItems.innerHTML = "<p>🛒 Giỏ hàng trống</p>";
    totalPriceEl.textContent = 0;
    return;
  }

  cart.forEach((item, index) => {
    total += item.price * item.quantity;

    checkoutItems.innerHTML += `
      <div class="checkout-item">
        <div class="checkout-info">
          <h4>${item.name}</h4>
          <p>${item.quantity} × ${item.price.toLocaleString()}đ</p>
        </div>
        <button class="btn-remove" onclick="removeItem(${index})">❌ Bỏ</button>
      </div>
    `;
  });

  totalPriceEl.textContent = total.toLocaleString();
}

// ===== XOÁ SẢN PHẨM =====
function removeItem(index) {
  const cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  renderCheckout();
}

// ===== THANH TOÁN =====
function handleCheckout() {
  const fullName = document.getElementById("fullName").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const address = document.getElementById("address").value.trim();
  const paymentMethod = document.getElementById("paymentMethod").value;

  if (!fullName || !phone || !address || !paymentMethod) {
    alert("❌ Vui lòng nhập đầy đủ thông tin thanh toán!");
    return;
  }

  if (getCart().length === 0) {
    alert("❌ Giỏ hàng trống!");
    return;
  }

  // Demo lưu đơn hàng
  const order = {
    user: currentUser.tenDangNhap,
    items: getCart(),
    total: document.getElementById("totalPrice").innerText,
    paymentMethod,
    address,
    status: "Đang xử lý",
    createdAt: new Date().toLocaleString()
  };

  console.log("ORDER:", order);

  alert("✅ Đặt hàng thành công!\nĐơn hàng đang được xử lý.");

  localStorage.removeItem("cart");
  window.location.href = "index.html";
}

// INIT
renderCheckout();
