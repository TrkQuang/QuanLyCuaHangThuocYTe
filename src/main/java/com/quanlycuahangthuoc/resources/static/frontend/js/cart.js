// ============================================================
// cart.js — Thêm sản phẩm vào giỏ hàng & cập nhật số lượng
// Yêu cầu: config.js được nhúng trước
// ============================================================

// Thêm vào giỏ hàng
// Gọi từ HTML: onclick="addToCart(event, '${product.id}')"
async function addToCart(event, productId) {
  const button = event.target.closest("button") || event.target;
  const productItem = button.closest(".product-item");

  if (!productItem) {
    console.error("Không tìm thấy .product-item");
    return;
  }

  // Lấy thông tin sản phẩm từ DOM
  const title = productItem.querySelector("h3")?.innerText || "";
  const image = productItem.querySelector("img")?.src || "";

  // Lấy giá từ data-price attribute (ưu tiên) hoặc parse từ text
  let price = 0;
  const priceEl = productItem.querySelector(".product-price");
  if (priceEl) {
    // Ưu tiên data-price để tránh sai khi format tiền thay đổi
    price = parseInt(priceEl.getAttribute("data-price")) ||
            parseInt(priceEl.innerText.replace(/[^0-9]/g, "")) || 0;
  }

  try {
    const response = await fetch(`${API_URL}/cart/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Session-Id": getSessionId(),
      },
      body: JSON.stringify({
        id: productId,
        title: title,
        price: price,
        image: image,
        quantity: 1,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Lỗi server:", errorText);
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

// Cập nhật badge số lượng giỏ hàng trên header
async function updateCartCount() {
  try {
    const response = await fetch(`${API_URL}/cart/count`, {
      headers: { "Session-Id": getSessionId() },
    });
    const result = await response.json();
    const cartCountEl = document.getElementById("cartCount");
    if (cartCountEl) {
      cartCountEl.innerText = result.count || 0;
    }
  } catch (error) {
    console.error("Lỗi khi cập nhật số lượng giỏ:", error);
  }
}

// Xử lý Search
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();

  const searchInput = document.getElementById("searchInput");
  const searchForm = document.getElementById("searchForm");

  if (searchInput) {
    searchInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        const keyword = this.value.trim();
        if (keyword.length > 0) {
          window.location.href = `search.html?q=${encodeURIComponent(keyword)}`;
        }
      }
    });
  }

  if (searchForm) {
    searchForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const keyword = searchInput ? searchInput.value.trim() : "";
      if (keyword.length > 0) {
        window.location.href = `search.html?q=${encodeURIComponent(keyword)}`;
      }
    });
  }
});