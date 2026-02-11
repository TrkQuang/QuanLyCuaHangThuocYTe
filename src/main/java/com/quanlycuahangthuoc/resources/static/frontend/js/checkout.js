// API Configuration
const API_URL = "http://localhost:8080/api";

// Lấy session ID
function getSessionId() {
  let sessionId = localStorage.getItem("sessionId");
  if (!sessionId) {
    sessionId =
      "session-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9);
    localStorage.setItem("sessionId", sessionId);
  }
  return sessionId;
}

// ===== KIỂM TRA ĐĂNG NHẬP =====
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
if (!currentUser) {
  alert("Vui lòng đăng nhập để thanh toán!");
  window.location.href = "login.html";
}

// ===== CART API =====
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

async function clearCart() {
  try {
    await fetch(`${API_URL}/cart`, {
      method: "DELETE",
      headers: {
        "Session-Id": getSessionId(),
      },
    });
  } catch (error) {
    console.error("Lỗi khi xóa giỏ hàng:", error);
  }
}

// ===== RENDER CHECKOUT =====
async function renderCheckout() {
  const cart = await getCart();
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
          <h4>${item.title || item.name}</h4>
          <p>${item.quantity} × ${item.price.toLocaleString()}đ</p>
        </div>
        <button class="btn-remove" onclick="removeItem('${item.id}')">❌ Bỏ</button>
      </div>
    `;
  });

  totalPriceEl.textContent = total.toLocaleString();
}

// ===== XOÁ SẢN PHẨM =====
async function removeItem(productId) {
  try {
    await fetch(`${API_URL}/cart/${productId}`, {
      method: "DELETE",
      headers: {
        "Session-Id": getSessionId(),
      },
    });
    renderCheckout();
  } catch (error) {
    console.error("Lỗi khi xóa sản phẩm:", error);
  }
}

// ===== THANH TOÁN =====
async function handleCheckout() {
  const fullName = document.getElementById("fullName").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const address = document.getElementById("address").value.trim();
  const paymentMethod = document.getElementById("paymentMethod").value;

  if (!fullName || !phone || !address || !paymentMethod) {
    alert("❌ Vui lòng nhập đầy đủ thông tin thanh toán!");
    return;
  }

  const cart = await getCart();

  if (cart.length === 0) {
    alert("❌ Giỏ hàng trống!");
    return;
  }

  // Tạo đơn hàng
  const order = {
    maKhachHang: currentUser.maKhachHang || "KH" + Date.now(),
    tenNguoiNhan: fullName,
    soDienThoai: phone,
    diaChi: address,
    phuongThucThanhToan: paymentMethod,
    tongTien: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    trangThai: "Đang xử lý",
    ngayTao: new Date().toISOString(),
  };

  try {
    // Gọi API tạo hóa đơn
    const response = await fetch(`${API_URL}/hoadon`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    });

    if (response.ok) {
      alert("✅ Đặt hàng thành công!\nĐơn hàng đang được xử lý.");

      // Xóa giỏ hàng
      await clearCart();

      window.location.href = "index.html";
    } else {
      alert("❌ Đặt hàng thất bại! Vui lòng thử lại.");
    }
  } catch (error) {
    console.error("Lỗi khi đặt hàng:", error);
    alert("❌ Không thể kết nối đến server!");
  }
}

// INIT
renderCheckout();
