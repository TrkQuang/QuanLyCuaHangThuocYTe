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

// XSS Protection - Sanitize HTML
function escapeHtml(unsafe) {
  if (unsafe == null) return "";
  return unsafe
    .toString()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ================= PRODUCTS =================

let products = [];
let currentPage = 1;
const itemsPerPage = 4;

async function loadProducts() {
  try {
    const res = await fetch(API_URL + "/thuoc");
    const data = await res.json();

    // Chuyển đổi dữ liệu thuốc sang format product
    products = data.map((thuoc) => ({
      id: thuoc.maThuoc,
      name: thuoc.tenThuoc,
      price: thuoc.donGia,
      description: thuoc.moTa || "Thuốc chất lượng cao",
      image: thuoc.hinhAnh || "https://via.placeholder.com/200",
      category: thuoc.nsx || "Khác",
      popular: thuoc.soLuongTon || 0,
    }));

    renderProducts(products);
  } catch (e) {
    console.error("Load products error:", e);
  }
}

function renderProducts(list) {
  const box = document.getElementById("productsList");
  if (!box) return;

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  const pageItems = list.slice(start, end);

  let html = "";

  pageItems.forEach((p) => {
    // Sanitize all user-generated content
    const safeName = escapeHtml(p.name);
    const safeDescription = escapeHtml(p.description);
    const safeImage = escapeHtml(p.image);
    const safeId = escapeHtml(p.id);

    html += `
      <div class="product-item">
        <img src="${safeImage}" alt="${safeName}" onerror="this.src='https://via.placeholder.com/200'">
        <h3>${safeName}</h3>
        <div class="product-price">${p.price.toLocaleString()}đ</div>
        <p>${safeDescription}</p>
        <button class="btn-primary" data-id="${safeId}" onclick="addToCart('${safeName.replace(/'/g, "\\'")}', ${p.price})">
          Thêm giỏ hàng
        </button>
      </div>
    `;
  });

  box.innerHTML = html;
}

function loadMore() {
  currentPage++;
  renderProducts(products);
}

// ================= SEARCH =================

function searchProduct(keyword) {
  const result = products.filter((p) =>
    p.name.toLowerCase().includes(keyword.toLowerCase()),
  );

  currentPage = 1;
  renderProducts(result);
}

const searchBox = document.getElementById("searchInput");
if (searchBox) {
  searchBox.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      searchProduct(searchBox.value);
    }
  });
}

// ================= FILTER =================

function applyFilter() {
  const cat = document.getElementById("categoryFilter")?.value;
  const sort = document.getElementById("sortBy")?.value;

  let list = [...products];

  if (cat) {
    list = list.filter((p) => p.category === cat);
  }

  if (sort === "price-low") {
    list.sort((a, b) => a.price - b.price);
  } else if (sort === "price-high") {
    list.sort((a, b) => b.price - a.price);
  } else if (sort === "popular") {
    list.sort((a, b) => b.popular - a.popular);
  } else {
    list.sort((a, b) => a.name.localeCompare(b.name));
  }

  currentPage = 1;
  renderProducts(list);
}

// ================= CART =================

async function loadCart() {
  try {
    const res = await fetch(API_URL + "/cart", {
      headers: {
        "Session-Id": getSessionId(),
      },
    });
    const cart = await res.json();
    showCart(cart);
  } catch (e) {
    console.error("Load cart error:", e);
  }
}

function showCart(cart) {
  const box = document.getElementById("cartItems");
  const totalBox = document.getElementById("totalPrice");
  if (!box) return;

  let html = "";
  let total = 0;

  if (cart.length === 0) {
    box.innerHTML = "🛒 Giỏ hàng trống";
    if (totalBox) totalBox.innerText = "0";
    return;
  }

  cart.forEach((item) => {
    const sum = item.price * item.quantity;
    total += sum;

    html += `
      <div class="cart-row">
        <img src="${item.image}" style="width:60px;height:60px;object-fit:cover;border-radius:8px;margin-right:10px;">
        <div style="flex:1;">
          <strong>${item.title || item.name}</strong><br>
          <span style="color:#667eea;font-weight:600;">${item.quantity} × ${item.price.toLocaleString()}đ = ${sum.toLocaleString()}đ</span>
        </div>
        <div style="display:flex;gap:5px;align-items:center;">
          <button class="btn-sm" onclick="updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
          <span style="padding:0 10px;font-weight:bold;">${item.quantity}</span>
          <button class="btn-sm" onclick="updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
          <button class="btn-danger-sm" onclick="removeItem('${item.id}')">❌</button>
        </div>
      </div>
    `;
  });

  if (totalBox) totalBox.innerText = total.toLocaleString();
  box.innerHTML = html;
}

async function updateQuantity(productId, qty) {
  if (qty <= 0) {
    removeItem(productId);
    return;
  }

  try {
    await fetch(API_URL + "/cart/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Session-Id": getSessionId(),
      },
      body: JSON.stringify({
        id: productId,
        quantity: qty,
      }),
    });

    loadCart();
    updateCartCount();
  } catch (e) {
    console.error("Update quantity error:", e);
  }
}

async function removeItem(productId) {
  try {
    await fetch(API_URL + "/cart/" + productId, {
      method: "DELETE",
      headers: {
        "Session-Id": getSessionId(),
      },
    });

    loadCart();
    updateCartCount();
  } catch (e) {
    console.error("Remove item error:", e);
  }
}

async function updateCartCount() {
  try {
    const res = await fetch(API_URL + "/cart/count", {
      headers: {
        "Session-Id": getSessionId(),
      },
    });
    const data = await res.json();

    const box = document.getElementById("cartCount");
    if (box) box.innerText = data.count || 0;
  } catch (e) {
    console.error("Update cart count error:", e);
  }
}

// ================= ORDERS =================

async function loadOrders() {
  const box = document.getElementById("orderList");
  if (!box) return;

  try {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (!currentUser || !currentUser.maKhachHang) {
      box.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">🔒</div>
          <h3>Vui lòng đăng nhập</h3>
          <p>Bạn cần đăng nhập để xem lịch sử đơn hàng</p>
          <a href="login.html" class="btn-primary">Đăng nhập ngay</a>
        </div>
      `;
      return;
    }

    const res = await fetch(API_URL + "/hoadon");
    const allOrders = await res.json();

    // Lọc đơn hàng của khách hàng hiện tại
    const orders = allOrders.filter(
      (o) => o.maKhachHang === currentUser.maKhachHang,
    );

    if (orders.length === 0) {
      box.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">📦</div>
          <h3>Chưa có đơn hàng nào</h3>
          <p>Hãy bắt đầu mua sắm ngay!</p>
          <a href="shop.html" class="btn-primary">Mua sắm ngay</a>
        </div>
      `;
      return;
    }

    let html = "";

    orders.sort((a, b) => new Date(b.ngayTao) - new Date(a.ngayTao));

    orders.forEach((o) => {
      const statusClass =
        o.trangThai === "Hoàn thành"
          ? "status-completed"
          : o.trangThai === "Đã hủy"
            ? "status-cancelled"
            : "status-pending";

      html += `
        <div class="order-item">
          <div class="order-header">
            <div>
              <div class="order-id">Đơn hàng #${o.maHoaDon}</div>
              <small style="color:#999;">🕒 ${new Date(o.ngayTao).toLocaleString("vi-VN")}</small>
            </div>
            <span class="order-status ${statusClass}">${o.trangThai}</span>
          </div>
          <div class="order-details">
            <div class="detail-item">
              <span class="detail-label">Người nhận</span>
              <span class="detail-value">${o.tenNguoiNhan || "N/A"}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Số điện thoại</span>
              <span class="detail-value">${o.soDienThoai || "N/A"}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Địa chỉ</span>
              <span class="detail-value">${o.diaChi || "N/A"}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Tổng tiền</span>
              <span class="detail-value" style="color:#667eea;font-size:18px;">${(o.tongTien || 0).toLocaleString()}đ</span>
            </div>
          </div>
        </div>
      `;
    });

    box.innerHTML = html;
  } catch (e) {
    console.error("Load orders error:", e);
    box.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">⚠️</div>
        <h3>Không thể tải đơn hàng</h3>
        <p>Vui lòng thử lại sau</p>
      </div>
    `;
  }
}

// ================= INIT =================

loadProducts();
updateCartCount();
loadCart();
loadOrders();
