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

let allProducts = [];
let currentPage = 1;
const itemsPerPage = 4;

// =================hàm load tất cả sản phẩm==================
async function loadProducts() {
  try {
    const response = await fetch(API_URL + "/thuoc");
    const data = await response.json();

    allProducts = data;

    renderProducts(allProducts);
  } catch (error) {
    console.error("Lỗi tải sản phẩm:", error);
  }
}

//===========Hiển thị sản phẩm==============
function renderProducts(products) {
  const list = document.getElementById("productsList");

  if (!list) return;

  list.innerHTML = "";

  products.forEach((p) => {
    list.innerHTML += `
      <div class="product-item">
        <img src="${p.hinhAnh}" alt="${p.tenThuoc}">
        <h3>${p.tenThuoc}</h3>
        <div class="product-price">${p.gia.toLocaleString()} đ</div>
        <p>${p.moTa || ""}</p>

        <button class="btn-primary" onclick="addToCart(${p.maThuoc})">
          Thêm giỏ hàng
        </button>
      </div>
    `;
  });
}

function loadMore() {
  currentPage++;
  renderProducts(allProducts);
}

// ================= SEARCH =================

function searchProduct(keyword) {
  const result = allProducts.filter((p) =>
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

  let list = [...allProducts];

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
    const res = await fetch(API_URL + "/hoadon", {
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
  try {
    await fetch(API_URL + "/thuoc", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        maThuoc: productId,
        soLuongTon: qty
      })
    });

    loadProducts();
  } catch (e) {
    console.error("Update quantity error:", e);
  }
}

async function removeItem(productId) {
  try {
    await fetch(API_URL + "/thuoc/" + productId, {
      method: "DELETE"
    });

    loadProducts();
  } catch (e) {
    console.error("Remove error:", e);
  }
}

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  const box = document.getElementById("cartCount");

  if (box) box.innerText = cart.length;
}

//=====ORDER======
async function loadOrders() {
  try {
    const response = await fetch(API_URL + "/thuoc");
    const orders = await response.json();

    showOrders(orders);
  } catch (error) {
    console.error("Lỗi tải đơn hàng:", error);
  }
}

function showOrders(orders) {
  const container = document.getElementById("ordersList");

  if (!orders || orders.length === 0) {
    container.innerHTML = "<p>Chưa có đơn hàng</p>";
    return;
  }

  let html = "";

  orders.forEach(order => {
    html += `
      <div class="order-card">
        <h3>Mã hóa đơn: ${order.maHoaDon}</h3>
        <p>Khách hàng: ${order.maKhachHang}</p>
        <p>Ngày tạo: ${order.ngayTao}</p>
        <p>Tổng tiền: ${order.tongTien.toLocaleString()} VNĐ</p>
      </div>
    `;
  });

  container.innerHTML = html;
}

// ================= INIT =================
document.addEventListener("DOMContentLoaded", () => {
  loadProducts();
  loadOrders();
  updateCartCount();
});
