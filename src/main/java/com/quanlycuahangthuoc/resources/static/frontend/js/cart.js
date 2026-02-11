// API Configuration
const API_URL = "http://localhost:8080/api";

// Lấy hoặc tạo session ID
function getSessionId() {
  let sessionId = localStorage.getItem("sessionId");
  if (!sessionId) {
    sessionId =
      "session-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9);
    localStorage.setItem("sessionId", sessionId);
  }
  return sessionId;
}

// Lấy giỏ hàng từ API
async function getCart() {
  try {
    const response = await fetch(`${API_URL}/cart`, {
      headers: {
        "Session-Id": getSessionId(),
      },
    });
    return await response.json();
  } catch (error) {
    console.error("Lỗi khi lấy giỏ hàng:", error);
    return [];
  }
}

// Thêm vào giỏ (được gọi từ onclick)
async function addToCart(name, price) {
  let button = event.target;
  let productItem = button.closest(".product-item");

  // Lấy thông tin từ HTML
  let id = button.dataset.id;
  let title = productItem.querySelector("h3").innerText;
  let image = productItem.querySelector("img").src;

  try {
    const response = await fetch(`${API_URL}/cart/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Session-Id": getSessionId(),
      },
      body: JSON.stringify({
        id: id,
        name: name,
        title: title,
        price: price,
        image: image,
        quantity: 1,
      }),
    });

    const result = await response.json();

    if (result.success) {
      updateCartCount();
      alert(`✅ Đã thêm "${title}" vào giỏ hàng`);
    }
  } catch (error) {
    console.error("Lỗi khi thêm vào giỏ:", error);
    alert("❌ Không thể thêm vào giỏ hàng!");
  }
}

// Cập nhật số lượng giỏ
async function updateCartCount() {
  try {
    const response = await fetch(`${API_URL}/cart/count`, {
      headers: {
        "Session-Id": getSessionId(),
      },
    });
    const result = await response.json();

    let cartCount = document.getElementById("cartCount");
    if (cartCount) {
      cartCount.innerText = result.count || 0;
    }
  } catch (error) {
    console.error("Lỗi khi cập nhật số lượng giỏ:", error);
  }
}

// Load khi refresh
document.addEventListener("DOMContentLoaded", updateCartCount);
