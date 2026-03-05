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
    const response = await fetch(`${API_URL}/cart/add`, {
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

// Thêm vào giỏ
async function addToCart(productID) {
  let button = event.target;
  let productItem = button.closest(".product-item");

  // Lấy thông tin từ HTML
  let id = productID;
  let title = productItem.querySelector("h3").innerText;
  let image = productItem.querySelector("img").src;
  let priceText = productItem.querySelector(".product-price").innerText;
  let price = parseInt(priceText.replace(/[^0-9]/g, '')) || 0;

  try {
    const response = await fetch(`${API_URL}/cart/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Session-Id": getSessionId(),
      },
      body: JSON.stringify({
        id: id,
        title: title,
        price: price,
        image: image,
        quantity: 1,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log("Lỗi server:", errorText);
      throw new Error(`Server error ${response.status}: ${errorText}`);
    }

    const result = await response.json();

    if (result.success) {
      updateCartCount();
      alert(`✅ Đã thêm "${title}" vào giỏ hàng`);
    } else {
      alert("⚠️ " + (result.message || "Thêm thất bại"));
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

// Search
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const searchForm = document.getElementById('searchForm');

    if (!searchInput || !searchForm) return;

    // Xử lý khi bấm Enter trong input
    searchInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault(); // Ngăn submit mặc định (để kiểm soát)

        const keyword = this.value.trim();
        if (keyword.length > 0) {
          // Chuyển hướng đến search.html?q=...
          window.location.href = `search.html?q=${encodeURIComponent(keyword)}`;
        }
        // Nếu rỗng thì không làm gì (hoặc có thể reload trang hiện tại nếu muốn)
      }
    });

    // Vẫn hỗ trợ submit bằng nút tìm kiếm (nếu người dùng bấm nút thay vì Enter)
    searchForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const keyword = searchInput.value.trim();
      if (keyword.length > 0) {
        window.location.href = `search.html?q=${encodeURIComponent(keyword)}`;
      }
    });
  });

  async function checkout() {
  const total = document.getElementById("totalPrice").innerText.replace(/,/g,"");
  await createOrder(Number(total));
  alert("Đặt hàng thành công");
  window.location.href = "order-history.html";
}