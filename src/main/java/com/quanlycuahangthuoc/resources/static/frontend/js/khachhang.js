// ============================================================
// khachhang.js — Trang shop khách hàng: sản phẩm, giỏ hàng, đơn hàng
// Yêu cầu: config.js và cart.js được nhúng trước
// ============================================================

// ================= STATE =================
let products = [];
let currentPage = 1;
const ITEMS_PER_PAGE = 8;

// ================= SẢN PHẨM =================

/**
 * Load danh sách thuốc từ API
 */
async function loadProducts() {
  try {
    const res = await fetch(`${API_URL}/thuoc`);
    if (!res.ok) throw new Error("Không thể tải danh sách thuốc");
    const data = await res.json();

    // Chuẩn hóa dữ liệu thuốc về format sản phẩm
    products = data.map((thuoc) => ({
      id: thuoc.maThuoc,
      name: thuoc.tenThuoc,
      price: thuoc.donGia || thuoc.giaBan || 0,
      description: thuoc.moTa || "Thuốc chất lượng cao",
      image: thuoc.hinhAnh || "https://via.placeholder.com/200",
      category: thuoc.loaiThuoc || thuoc.nsx || "Khác",
      popular: thuoc.soLuongTon || 0,
    }));

    currentPage = 1;
    renderProducts(products);
  } catch (e) {
    console.error("Load products error:", e);
    const box = document.getElementById("productsList");
    if (box) box.innerHTML = "<p style='text-align:center;color:#e53e3e;padding:40px;'>⚠️ Không thể tải sản phẩm. Vui lòng thử lại.</p>";
  }
}

/**
 * Render danh sách sản phẩm ra DOM
 * @param {Array} list - Danh sách sản phẩm cần hiển thị
 */
function renderProducts(list) {
  const box = document.getElementById("productsList");
  if (!box) return;

  // Phân trang
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const pageItems = list.slice(start, start + ITEMS_PER_PAGE);

  if (pageItems.length === 0) {
    box.innerHTML = `
      <p style="text-align:center;grid-column:1/-1;padding:60px;color:#718096;">
        Không tìm thấy sản phẩm nào phù hợp.
      </p>`;
    return;
  }

  let html = "";
  pageItems.forEach((p) => {
    const safeName = escapeHtml(p.name);
    const safeDesc = escapeHtml(p.description);
    const safeImage = escapeHtml(p.image);
    const safeId = escapeHtml(String(p.id));

    html += `
      <div class="product-item">
        <img src="${safeImage}" alt="${safeName}"
             onerror="this.src='https://via.placeholder.com/200'">
        <h3>${safeName}</h3>
        <div class="product-price" data-price="${p.price}">
          ${p.price.toLocaleString("vi-VN")}đ
        </div>
        <p>${safeDesc}</p>
        <button class="btn-primary" onclick="addToCart(event, '${safeId}')">
          🛒 Thêm giỏ hàng
        </button>
      </div>
    `;
  });

  box.innerHTML = html;
  renderPagination(list.length);
}

/**
 * Render phân trang
 */
function renderPagination(totalItems) {
  const paginationBox = document.getElementById("pagination");
  if (!paginationBox) return;

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  if (totalPages <= 1) {
    paginationBox.innerHTML = "";
    return;
  }

  let html = "";
  for (let i = 1; i <= totalPages; i++) {
    html += `<button onclick="goToPage(${i})" class="${i === currentPage ? 'page-btn active' : 'page-btn'}">${i}</button>`;
  }
  paginationBox.innerHTML = html;
}

function goToPage(page) {
  currentPage = page;
  renderProducts(products);
}

// ================= TÌM KIẾM =================

function searchProduct(keyword) {
  const result = products.filter((p) =>
    p.name.toLowerCase().includes(keyword.toLowerCase())
  );
  currentPage = 1;
  renderProducts(result);
}

const searchBox = document.getElementById("searchInput");
if (searchBox) {
  searchBox.addEventListener("keypress", (e) => {
    if (e.key === "Enter") searchProduct(searchBox.value);
  });
}

// ================= LỌC & SẮP XẾP =================

function filterAndSortProducts() {
  let list = [...products];

  // Lọc theo danh mục
  const cat = document.getElementById("categoryFilter")?.value;
  if (cat) {
    list = list.filter((p) => p.category === cat);
  }

  // Lọc theo khoảng giá
  const priceRange = document.getElementById("priceFilter")?.value;
  if (priceRange) {
    const [minStr, maxStr] = priceRange.split("-");
    const min = parseInt(minStr) || 0;
    const max = maxStr === "+" ? Infinity : parseInt(maxStr) || Infinity;
    list = list.filter((p) => p.price >= min && p.price <= max);
  }

  // Sắp xếp
  const sortValue = document.getElementById("sortBy")?.value;
  switch (sortValue) {
    case "name":
      list.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "price-low":
      list.sort((a, b) => a.price - b.price);
      break;
    case "price-high":
      list.sort((a, b) => b.price - a.price);
      break;
    case "popular":
      // Sắp xếp theo lượt tồn kho (popular = nhiều người mua = ít tồn)
      list.sort((a, b) => a.popular - b.popular);
      break;
    default:
      list.sort((a, b) => a.name.localeCompare(b.name));
  }

  currentPage = 1;
  renderProducts(list);
}

// ================= GIỎ HÀNG SIDEBAR =================

async function loadCart() {
  try {
    const res = await fetch(`${API_URL}/cart`, {
      headers: { "Session-Id": getSessionId() },
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

  let total = 0;

  if (cart.length === 0) {
    box.innerHTML = "🛒 Giỏ hàng trống";
    if (totalBox) totalBox.innerText = "0";
    return;
  }

  let html = "";
  cart.forEach((item) => {
    const sum = item.price * item.quantity;
    total += sum;
    const safeTitle = escapeHtml(item.title || item.name);
    const safeId = escapeHtml(String(item.id));
    const safeImage = escapeHtml(item.image);

    html += `
      <div class="cart-row">
        <img src="${safeImage}" style="width:60px;height:60px;object-fit:cover;border-radius:8px;margin-right:10px;"
             onerror="this.src='https://via.placeholder.com/60'">
        <div style="flex:1;">
          <strong>${safeTitle}</strong><br>
          <span style="color:#667eea;font-weight:600;">
            ${item.quantity} × ${item.price.toLocaleString()}đ = ${sum.toLocaleString()}đ
          </span>
        </div>
        <div style="display:flex;gap:5px;align-items:center;">
          <button class="btn-sm" onclick="updateQuantity('${safeId}', ${item.quantity - 1})">-</button>
          <span style="padding:0 10px;font-weight:bold;">${item.quantity}</span>
          <button class="btn-sm" onclick="updateQuantity('${safeId}', ${item.quantity + 1})">+</button>
          <button class="btn-danger-sm" onclick="removeCartItem('${safeId}')">❌</button>
        </div>
      </div>
    `;
  });

  if (totalBox) totalBox.innerText = total.toLocaleString();
  box.innerHTML = html;
}

async function updateQuantity(productId, qty) {
  if (qty <= 0) {
    removeCartItem(productId);
    return;
  }

  try {
    await fetch(`${API_URL}/cart/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Session-Id": getSessionId(),
      },
      body: JSON.stringify({ id: productId, quantity: qty }),
    });

    loadCart();
    updateCartCount();
  } catch (e) {
    console.error("Update quantity error:", e);
  }
}

async function removeCartItem(productId) {
  try {
    await fetch(`${API_URL}/cart/${productId}`, {
      method: "DELETE",
      headers: { "Session-Id": getSessionId() },
    });

    loadCart();
    updateCartCount();
  } catch (e) {
    console.error("Remove item error:", e);
  }
}

// ================= ĐƠN HÀNG =================

async function loadOrders() {
  const box = document.getElementById("ordersList");
  if (!box) return;

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

  try {
    const res = await fetch(`${API_URL}/hoadon`);
    const allOrders = await res.json();

    // Lọc đơn hàng của khách hàng hiện tại
    const orders = allOrders.filter(
      (o) => o.maKhachHang === currentUser.maKhachHang
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

    orders.sort((a, b) => new Date(b.ngayTao || b.ngayLap) - new Date(a.ngayTao || a.ngayLap));

    let html = "";
    orders.forEach((o) => {
      const statusClass =
        o.trangThai === "Hoàn thành" ? "status-completed" :
        o.trangThai === "Đã hủy"     ? "status-cancelled" :
                                        "status-pending";

      html += `
        <div class="order-item">
          <div class="order-header">
            <div>
              <div class="order-id">Đơn hàng #${escapeHtml(String(o.maHoaDon))}</div>
              <small style="color:#999;">🕒 ${formatDateTime(o.ngayTao || o.ngayLap)}</small>
            </div>
            <span class="order-status ${statusClass}">${escapeHtml(o.trangThai || "Đang xử lý")}</span>
          </div>
          <div class="order-details">
            <div class="detail-item">
              <span class="detail-label">Người nhận</span>
              <span class="detail-value">${escapeHtml(o.tenNguoiNhan || "N/A")}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Số điện thoại</span>
              <span class="detail-value">${escapeHtml(o.soDienThoai || "N/A")}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Địa chỉ</span>
              <span class="detail-value">${escapeHtml(o.diaChi || "N/A")}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Tổng tiền</span>
              <span class="detail-value" style="color:#667eea;font-size:18px;">
                ${(o.tongTien || 0).toLocaleString()}đ
              </span>
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

// ================= KHỞI TẠO =================

document.addEventListener("DOMContentLoaded", () => {
  // Load dữ liệu
  loadProducts();
  updateCartCount();
  loadCart();
  loadOrders();

  // Gắn sự kiện bộ lọc
  ["categoryFilter", "priceFilter", "sortBy"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("change", filterAndSortProducts);
  });

  const filterBtn = document.getElementById("applyFilterBtn");
  if (filterBtn) filterBtn.addEventListener("click", filterAndSortProducts);
});