// Lấy giỏ hàng
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

// Lưu giỏ hàng
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Thêm vào giỏ (được gọi từ onclick)
function addToCart(name, price) {
  let cart = getCart();

  // Tìm button vừa bấm
  let button = event.target;
  let productItem = button.closest(".product-item");

  // Lấy thông tin từ HTML
  let id = button.dataset.id;
  let title = productItem.querySelector("h3").innerText;
  let image = productItem.querySelector("img").src;

  // Kiểm tra sản phẩm đã có chưa
  let product = cart.find(item => item.id === id);

  if (product) {
    product.quantity += 1;
  } else {
    cart.push({
      id: id,
      name: name,
      title: title,
      price: price,
      image: image,
      quantity: 1
    });
  }

  saveCart(cart);
  updateCartCount();

  alert(`✅ Đã thêm "${title}" vào giỏ hàng`);
}

// Cập nhật số lượng giỏ
function updateCartCount() {
  let cart = getCart();
  let total = cart.reduce((sum, item) => sum + item.quantity, 0);

  let cartCount = document.getElementById("cart-count");
  if (cartCount) {
    cartCount.innerText = total;
  }
}

// Load khi refresh
document.addEventListener("DOMContentLoaded", updateCartCount);
