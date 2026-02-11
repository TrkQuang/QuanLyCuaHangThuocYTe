// ====================
// CẤU HÌNH VÀ KHỞI TẠO
// ====================

const API_URL = "http://localhost:8080/api";
let currentUser = null;
let cartItems = []; // Giỏ hàng
let allThuoc = []; // Danh sách tất cả thuốc (để search)

// Kiểm tra đăng nhập khi load trang
document.addEventListener("DOMContentLoaded", () => {
  checkAuth();
  initApp();
});

/**
 * Kiểm tra xác thực người dùng
 * Nếu chưa đăng nhập hoặc không phải NhanVien -> redirect về login
 */
function checkAuth() {
  const userStr = localStorage.getItem("currentUser");
  if (!userStr) {
    window.location.href = "login.html";
    return;
  }

  currentUser = JSON.parse(userStr);

  // Kiểm tra quyền Nhân Viên
  if (currentUser.loaiTaiKhoan !== "NhanVien") {
    alert("Bạn không có quyền truy cập trang này!");
    window.location.href = "login.html";
    return;
  }

  // Hiển thị tên nhân viên
  document.getElementById("nvName").textContent = currentUser.tenDangNhap;
}

/**
 * Khởi tạo ứng dụng
 */
function initApp() {
  // Cập nhật thời gian
  updateDateTime();
  setInterval(updateDateTime, 1000);

  // Xử lý menu navigation
  setupMenuNavigation();

  // Xử lý nút đăng xuất
  document.getElementById("logoutBtn").addEventListener("click", logout);

  // Load dashboard data
  loadDashboardData();
}

// ====================
// XỬ LÝ NAVIGATION
// ====================

/**
 * Thiết lập điều hướng menu
 */
function setupMenuNavigation() {
  const menuItems = document.querySelectorAll(".menu-item");

  menuItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();

      // Remove active class từ tất cả items
      menuItems.forEach((mi) => mi.classList.remove("active"));

      // Add active class cho item được click
      item.classList.add("active");

      // Lấy page cần hiển thị
      const pageName = item.getAttribute("data-page");

      // Chuyển page
      switchPage(pageName);
    });
  });
}

/**
 * Chuyển đổi giữa các trang
 * @param {string} pageName - Tên trang cần hiển thị
 */
function switchPage(pageName) {
  // Ẩn tất cả các page
  document.querySelectorAll(".page").forEach((page) => {
    page.classList.remove("active");
  });

  // Hiển thị page được chọn
  const targetPage = document.getElementById(`${pageName}-page`);
  if (targetPage) {
    targetPage.classList.add("active");
  }

  // Cập nhật title
  const titles = {
    dashboard: "Dashboard",
    thuoc: "Quản Lý Thuốc",
    phieunhap: "Phiếu Nhập Hàng",
    banhang: "Bán Hàng",
    hoadon: "Hóa Đơn",
    hoso: "Hồ Sơ Của Tôi",
  };

  document.getElementById("pageTitle").textContent =
    titles[pageName] || pageName;

  // Load dữ liệu cho page tương ứng
  loadPageData(pageName);
}

/**
 * Load dữ liệu cho từng page
 * @param {string} pageName - Tên page
 */
async function loadPageData(pageName) {
  switch (pageName) {
    case "dashboard":
      await loadDashboardData();
      break;
    case "thuoc":
      await loadThuocData();
      break;
    case "phieunhap":
      await loadPhieuNhapData();
      break;
    case "banhang":
      await loadThuocForSale();
      break;
    case "hoadon":
      await loadHoaDonData();
      break;
    case "hoso":
      await loadHoSoCuaToi();
      break;
  }
}

// ====================
// LOAD DASHBOARD DATA
// ====================

/**
 * Load dữ liệu dashboard (thống kê tổng quan)
 */
async function loadDashboardData() {
  try {
    // Gọi API song song
    const [thuocRes, phieunhapRes, hoadonRes] = await Promise.all([
      fetch(`${API_URL}/thuoc`),
      fetch(`${API_URL}/phieunhap`),
      fetch(`${API_URL}/hoadon`),
    ]);

    const thuoc = await thuocRes.json();
    const phieunhap = await phieunhapRes.json();
    const hoadon = await hoadonRes.json();

    // Cập nhật số liệu thống kê
    document.getElementById("totalThuoc").textContent = thuoc.length;
    document.getElementById("totalPhieuNhap").textContent = phieunhap.length;
    document.getElementById("totalHoaDon").textContent = hoadon.length;

    // Tính doanh thu hôm nay
    calculateTodayRevenue(hoadon);

    // Hiển thị hóa đơn gần đây
    displayRecentOrders(hoadon);

    // Hiển thị thuốc sắp hết
    displayLowStockDrugs(thuoc);
  } catch (error) {
    console.error("Lỗi khi load dashboard:", error);
    showNotification("Không thể tải dữ liệu dashboard", "error");
  }
}

/**
 * Tính doanh thu hôm nay
 * @param {Array} hoadonList - Danh sách hóa đơn
 */
function calculateTodayRevenue(hoadonList) {
  const today = new Date().toISOString().split("T")[0];

  let todayRevenue = 0;

  hoadonList.forEach((hd) => {
    const hdDate = hd.ngayLap ? hd.ngayLap.split("T")[0] : "";
    if (hdDate === today && hd.trangThai !== "Hủy") {
      todayRevenue += hd.tongTien || 0;
    }
  });

  document.getElementById("todayRevenue").textContent =
    formatCurrency(todayRevenue);
}

/**
 * Hiển thị hóa đơn gần đây
 * @param {Array} hoadonList - Danh sách hóa đơn
 */
function displayRecentOrders(hoadonList) {
  const ordersDiv = document.getElementById("recentOrders");

  const recentOrders = hoadonList
    .sort((a, b) => new Date(b.ngayLap) - new Date(a.ngayLap))
    .slice(0, 5);

  if (recentOrders.length === 0) {
    ordersDiv.innerHTML = "<p>Chưa có hóa đơn nào</p>";
    return;
  }

  let html = "";
  recentOrders.forEach((hd) => {
    const time = formatDateTime(hd.ngayLap);
    html += `
            <div class="activity-item">
                <strong>HD: ${hd.maHoaDon}</strong><br>
                ${time} - ${formatCurrency(hd.tongTien)}
            </div>
        `;
  });

  ordersDiv.innerHTML = html;
}

/**
 * Hiển thị thuốc sắp hết (số lượng < 10)
 * @param {Array} thuocList - Danh sách thuốc
 */
function displayLowStockDrugs(thuocList) {
  const lowStockDiv = document.getElementById("lowStockDrugs");

  // Lọc thuốc có số lượng < 10
  const lowStock = thuocList
    .filter((t) => t.soLuongTon < 10)
    .sort((a, b) => a.soLuongTon - b.soLuongTon)
    .slice(0, 5);

  if (lowStock.length === 0) {
    lowStockDiv.innerHTML =
      '<p style="color: green;">✓ Tất cả thuốc đều đủ số lượng</p>';
    return;
  }

  let html = "";
  lowStock.forEach((t) => {
    html += `
            <div class="activity-item" style="color: #f44336;">
                <strong>${t.tenThuoc}</strong><br>
                Còn ${t.soLuongTon} ${t.donViTinh}
            </div>
        `;
  });

  lowStockDiv.innerHTML = html;
}

// ====================
// QUẢN LÝ THUỐC
// ====================

/**
 * Load danh sách thuốc
 */
async function loadThuocData() {
  try {
    const response = await fetch(`${API_URL}/thuoc`);
    const data = await response.json();

    allThuoc = data; // Lưu để search
    displayThuocTable(data);
  } catch (error) {
    console.error("Lỗi khi load thuốc:", error);
    showNotification("Không thể tải danh sách thuốc", "error");
  }
}

/**
 * Hiển thị bảng thuốc
 * @param {Array} data - Danh sách thuốc
 */
function displayThuocTable(data) {
  const tbody = document.getElementById("thuocTableBody");

  if (data.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="7" class="text-center">Chưa có thuốc nào</td></tr>';
    return;
  }

  let html = "";
  data.forEach((thuoc) => {
    // Highlight nếu số lượng < 10
    const rowClass =
      thuoc.soLuongTon < 10 ? 'style="background: #fff3e0;"' : "";
    html += `
            <tr ${rowClass}>
                <td>${thuoc.maThuoc}</td>
                <td>${thuoc.tenThuoc}</td>
                <td>${thuoc.nsx || ""}</td>
                <td>${thuoc.donViTinh || ""}</td>
                <td>${formatCurrency(thuoc.giaBan)}</td>
                <td>${thuoc.soLuongTon}</td>
                <td>
                    <button class="btn btn-edit" onclick="editThuoc('${thuoc.maThuoc}')">
                        <i class="fas fa-edit"></i>
                    </button>
                </td>
            </tr>
        `;
  });

  tbody.innerHTML = html;
}

/**
 * Tìm kiếm thuốc
 */
function searchThuoc() {
  const keyword = document.getElementById("searchThuoc").value.toLowerCase();

  if (!keyword) {
    displayThuocTable(allThuoc);
    return;
  }

  const filtered = allThuoc.filter(
    (t) =>
      t.tenThuoc.toLowerCase().includes(keyword) ||
      t.maThuoc.toLowerCase().includes(keyword) ||
      (t.nsx && t.nsx.toLowerCase().includes(keyword)),
  );

  displayThuocTable(filtered);
}

/**
 * Hiển thị modal thêm thuốc
 */
function showAddThuocModal() {
  const modalBody = document.getElementById("modalBody");
  modalBody.innerHTML = `
        <h2>Thêm Thuốc Mới</h2>
        <form id="addThuocForm">
            <div class="form-group">
                <label>Tên thuốc *</label>
                <input type="text" name="tenThuoc" required>
            </div>
            <div class="form-group">
                <label>Loại thuốc</label>
                <input type="text" name="loaiThuoc">
            </div>
            <div class="form-group">
                <label>Đơn vị *</label>
                <input type="text" name="donVi" required placeholder="Viên, Hộp, Chai...">
            </div>
            <div class="form-group">
                <label>Giá bán *</label>
                <input type="number" name="giaBan" required min="0">
            </div>
            <div class="form-group">
                <label>Số lượng *</label>
                <input type="number" name="soLuong" required min="0">
            </div>
            <div class="form-actions">
                <button type="button" class="btn btn-cancel" onclick="closeModal()">Hủy</button>
                <button type="submit" class="btn btn-primary">Thêm</button>
            </div>
        </form>
    `;

  document
    .getElementById("addThuocForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData);

      await addThuoc(data);
    });

  openModal();
}

/**
 * Thêm thuốc mới
 * @param {Object} data - Dữ liệu thuốc
 */
async function addThuoc(data) {
  try {
    const response = await fetch(`${API_URL}/thuoc/them-thuoc`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      showNotification("Thêm thuốc thành công", "success");
      closeModal();
      loadThuocData();
    } else {
      const error = await response.text();
      showNotification(error || "Thêm thuốc thất bại", "error");
    }
  } catch (error) {
    console.error("Lỗi:", error);
    showNotification("Có lỗi xảy ra", "error");
  }
}

// ====================
// QUẢN LÝ PHIẾU NHẬP
// ====================

/**
 * Load danh sách phiếu nhập
 */
async function loadPhieuNhapData() {
  try {
    const response = await fetch(`${API_URL}/phieunhap`);
    const data = await response.json();

    displayPhieuNhapTable(data);
  } catch (error) {
    console.error("Lỗi khi load phiếu nhập:", error);
    showNotification("Không thể tải danh sách phiếu nhập", "error");
  }
}

/**
 * Hiển thị bảng phiếu nhập
 * @param {Array} data - Danh sách phiếu nhập
 */
function displayPhieuNhapTable(data) {
  const tbody = document.getElementById("phieunhapTableBody");

  if (data.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="6" class="text-center">Chưa có phiếu nhập nào</td></tr>';
    return;
  }

  let html = "";
  data.forEach((pn) => {
    html += `
            <tr>
                <td>${pn.maPhieuNhap}</td>
                <td>${formatDate(pn.ngayNhap)}</td>
                <td>${pn.maNhaCungCap || ""}</td>
                <td>${pn.maNhanVien || ""}</td>
                <td>${formatCurrency(pn.tongTien)}</td>
                <td>
                    <button class="btn btn-view" onclick="viewPhieuNhap('${pn.maPhieuNhap}')">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            </tr>
        `;
  });

  tbody.innerHTML = html;
}

/**
 * Hiển thị modal tạo phiếu nhập
 */
function showAddPhieuNhapModal() {
  showNotification("Chức năng đang được phát triển", "info");
}

// ====================
// BÁN HÀNG
// ====================

/**
 * Load danh sách thuốc để bán
 */
async function loadThuocForSale() {
  try {
    const response = await fetch(`${API_URL}/thuoc`);
    allThuoc = await response.json();
  } catch (error) {
    console.error("Lỗi khi load thuốc:", error);
    showNotification("Không thể tải danh sách thuốc", "error");
  }
}

/**
 * Tìm kiếm thuốc để thêm vào giỏ
 */
function searchDrugForSale() {
  const keyword = document.getElementById("searchDrug").value.toLowerCase();
  const resultsDiv = document.getElementById("drugSearchResults");

  if (!keyword) {
    resultsDiv.innerHTML = "";
    return;
  }

  const filtered = allThuoc.filter(
    (t) =>
      t.tenThuoc.toLowerCase().includes(keyword) ||
      t.maThuoc.toLowerCase().includes(keyword),
  );

  if (filtered.length === 0) {
    resultsDiv.innerHTML = "<p>Không tìm thấy thuốc nào</p>";
    return;
  }

  let html = "";
  filtered.forEach((t) => {
    html += `
            <div class="drug-item" onclick='addToCart(${JSON.stringify(t)})'>
                <div class="drug-item-name">${t.tenThuoc}</div>
                <div class="drug-item-info">Mã: ${t.maThuoc} | Còn: ${t.soLuongTon} ${t.donViTinh}</div>
                <div class="drug-item-price">${formatCurrency(t.giaBan)}</div>
            </div>
        `;
  });

  resultsDiv.innerHTML = html;
}

/**
 * Thêm thuốc vào giỏ hàng
 * @param {Object} drug - Thông tin thuốc
 */
function addToCart(drug) {
  // Kiểm tra xem thuốc đã có trong giỏ chưa
  const existingItem = cartItems.find((item) => item.maThuoc === drug.maThuoc);

  if (existingItem) {
    // Nếu đã có thì tăng số lượng
    if (existingItem.quantity < drug.soLuongTon) {
      existingItem.quantity++;
    } else {
      showNotification("Không đủ số lượng trong kho", "error");
      return;
    }
  } else {
    // Nếu chưa có thì thêm mới
    cartItems.push({
      ...drug,
      quantity: 1,
    });
  }

  updateCartDisplay();
  showNotification("Đã thêm vào giỏ hàng", "success");
}

/**
 * Cập nhật hiển thị giỏ hàng
 */
function updateCartDisplay() {
  const tbody = document.getElementById("cartTableBody");

  if (cartItems.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="5" class="text-center">Giỏ hàng trống</td></tr>';
    document.getElementById("cartTotal").textContent = "0 đ";
    return;
  }

  let html = "";
  let total = 0;

  cartItems.forEach((item, index) => {
    const itemTotal = item.giaBan * item.quantity;
    total += itemTotal;

    html += `
            <tr>
                <td>${item.tenThuoc}</td>
                <td>${formatCurrency(item.giaBan)}</td>
                <td>
                    <input type="number" value="${item.quantity}" min="1" max="${item.soLuongTon}" 
                           onchange="updateCartQuantity(${index}, this.value)">
                </td>
                <td>${formatCurrency(itemTotal)}</td>
                <td>
                    <button class="btn-remove" onclick="removeFromCart(${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
  });

  tbody.innerHTML = html;
  document.getElementById("cartTotal").textContent = formatCurrency(total);
}

/**
 * Cập nhật số lượng trong giỏ
 * @param {number} index - Index của item
 * @param {number} quantity - Số lượng mới
 */
function updateCartQuantity(index, quantity) {
  const item = cartItems[index];
  quantity = parseInt(quantity);

  if (quantity < 1) {
    showNotification("Số lượng phải >= 1", "error");
    updateCartDisplay();
    return;
  }

  if (quantity > item.soLuongTon) {
    showNotification("Không đủ số lượng trong kho", "error");
    updateCartDisplay();
    return;
  }

  item.quantity = quantity;
  updateCartDisplay();
}

/**
 * Xóa item khỏi giỏ hàng
 * @param {number} index - Index của item cần xóa
 */
function removeFromCart(index) {
  cartItems.splice(index, 1);
  updateCartDisplay();
  showNotification("Đã xóa khỏi giỏ hàng", "success");
}

/**
 * Tìm kiếm khách hàng theo SĐT
 */
async function searchCustomer() {
  const phone = document.getElementById("customerPhone").value.trim();

  if (!phone) return;

  try {
    // Lấy danh sách khách hàng và tìm theo SĐT
    const response = await fetch(`${API_URL}/khachhang`);
    const customers = await response.json();

    const customer = customers.find((c) => c.sdt === phone);

    if (customer) {
      const customerName = `${customer.ho || ""} ${customer.ten || ""}`.trim();
      document.getElementById("customerName").value = customerName;
      showNotification("Đã tìm thấy khách hàng", "success");
    } else {
      document.getElementById("customerName").value = "";
      showNotification("Không tìm thấy khách hàng", "info");
    }
  } catch (error) {
    console.error("Lỗi khi tìm khách hàng:", error);
  }
}

/**
 * Tạo hóa đơn
 */
async function createInvoice() {
  // Validate
  if (cartItems.length === 0) {
    showNotification("Giỏ hàng trống!", "error");
    return;
  }

  const customerPhone = document.getElementById("customerPhone").value.trim();
  const customerName = document.getElementById("customerName").value.trim();

  if (!customerPhone || !customerName) {
    showNotification("Vui lòng nhập thông tin khách hàng!", "error");
    return;
  }

  // Tính tổng tiền
  const tongTien = cartItems.reduce(
    (sum, item) => sum + item.giaBan * item.quantity,
    0,
  );

  // Chuẩn bị dữ liệu hóa đơn
  const hoaDon = {
    ngayLap: new Date().toISOString(),
    maKhachHang: null, // Sẽ cần logic để lấy mã khách hàng
    maNhanVien: currentUser.maTaiKhoan, // Hoặc lấy từ thông tin nhân viên
    tongTien: tongTien,
    trangThai: "Đã thanh toán",
  };

  try {
    // Tạo hóa đơn
    const response = await fetch(`${API_URL}/hoadon`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(hoaDon),
    });

    if (response.ok) {
      showNotification("Tạo hóa đơn thành công!", "success");

      // Reset giỏ hàng
      cartItems = [];
      updateCartDisplay();

      // Clear form
      document.getElementById("customerPhone").value = "";
      document.getElementById("customerName").value = "";
      document.getElementById("searchDrug").value = "";
      document.getElementById("drugSearchResults").innerHTML = "";

      // Chuyển sang trang hóa đơn
      switchPage("hoadon");
    } else {
      showNotification("Tạo hóa đơn thất bại", "error");
    }
  } catch (error) {
    console.error("Lỗi:", error);
    showNotification("Có lỗi xảy ra", "error");
  }
}

// ====================
// QUẢN LÝ HÓA ĐƠN
// ====================

/**
 * Load danh sách hóa đơn
 */
async function loadHoaDonData() {
  try {
    const response = await fetch(`${API_URL}/hoadon`);
    const data = await response.json();

    displayHoaDonTable(data);
  } catch (error) {
    console.error("Lỗi khi load hóa đơn:", error);
    showNotification("Không thể tải danh sách hóa đơn", "error");
  }
}

/**
 * Hiển thị bảng hóa đơn
 * @param {Array} data - Danh sách hóa đơn
 */
function displayHoaDonTable(data) {
  const tbody = document.getElementById("hoadonTableBody");

  if (data.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="7" class="text-center">Chưa có hóa đơn nào</td></tr>';
    return;
  }

  let html = "";
  data.forEach((hd) => {
    const statusClass =
      hd.trangThai === "Hủy" ? "badge-danger" : "badge-success";
    html += `
            <tr>
                <td>${hd.maHoaDon}</td>
                <td>${formatDate(hd.ngayLap)}</td>
                <td>${hd.maKhachHang || ""}</td>
                <td>${hd.maNhanVien || ""}</td>
                <td>${formatCurrency(hd.tongTien)}</td>
                <td><span class="badge ${statusClass}">${hd.trangThai || "Chưa xác định"}</span></td>
                <td>
                    <button class="btn btn-view" onclick="viewHoaDon('${hd.maHoaDon}')">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            </tr>
        `;
  });

  tbody.innerHTML = html;
}

// ====================
// UTILITY FUNCTIONS
// ====================

/**
 * Cập nhật ngày giờ hiện tại
 */
function updateDateTime() {
  const now = new Date();

  const dateStr = now.toLocaleDateString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const timeStr = now.toLocaleTimeString("vi-VN");

  document.getElementById("currentDate").textContent = dateStr;
  document.getElementById("currentTime").textContent = timeStr;
}

/**
 * Format số tiền
 * @param {number} amount - Số tiền
 * @returns {string} - Số tiền đã format
 */
function formatCurrency(amount) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount || 0);
}

/**
 * Format ngày
 * @param {string} dateStr - Chuỗi ngày
 * @returns {string} - Ngày đã format
 */
function formatDate(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("vi-VN");
}

/**
 * Format ngày giờ
 * @param {string} dateStr - Chuỗi ngày giờ
 * @returns {string} - Ngày giờ đã format
 */
function formatDateTime(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleString("vi-VN");
}

/**
 * Mở modal
 */
function openModal() {
  document.getElementById("modal").style.display = "block";
}

/**
 * Đóng modal
 */
function closeModal() {
  document.getElementById("modal").style.display = "none";
}

/**
 * Hiển thị thông báo
 * @param {string} message - Nội dung thông báo
 * @param {string} type - Loại thông báo (success, error, info)
 */
function showNotification(message, type = "info") {
  // Tạo element thông báo
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === "success" ? "#4caf50" : type === "error" ? "#f44336" : "#2196f3"};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s;
    `;

  document.body.appendChild(notification);

  // Tự động xóa sau 3 giây
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

/**
 * Đăng xuất
 */
function logout() {
  if (confirm("Bạn có chắc muốn đăng xuất?")) {
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
  }
}

// ====================
// HỒ SƠ CỦA TÔI
// ====================

/**
 * Load và hiển thị hồ sơ của nhân viên đang đăng nhập
 */
async function loadHoSoCuaToi() {
  try {
    // Lấy mã nhân viên từ localStorage (giả sử có lưu mã nhân viên khi đăng nhập)
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    // Lấy danh sách tất cả nhân viên
    const response = await fetch(`${API_URL}/nhanvien`);
    const allNhanVien = await response.json();

    // Tìm thông tin nhân viên hiện tại dựa trên username hoặc email
    const myInfo = allNhanVien.find(
      (nv) =>
        nv.email === currentUser.email ||
        nv.maTaiKhoan === currentUser.maTaiKhoan,
    );

    if (!myInfo) {
      document.getElementById("hosoContent").innerHTML = `
        <div style="text-align: center; padding: 50px;">
          <i class="fas fa-exclamation-circle" style="font-size: 50px; color: #f44336;"></i>
          <p style="margin-top: 15px; color: #666;">Không tìm thấy thông tin hồ sơ của bạn</p>
        </div>
      `;
      return;
    }

    const hoTen = `${myInfo.ho || ""} ${myInfo.ten || ""}`.trim();

    // Hiển thị hồ sơ
    document.getElementById("hosoContent").innerHTML = `
      <div style="background: linear-gradient(135deg, #1abc9c 0%, #16a085 100%); padding: 40px; border-radius: 20px; color: white; text-align: center; margin-bottom: 30px; box-shadow: 0 10px 30px rgba(26, 188, 156, 0.3);">
        <div style="width: 120px; height: 120px; border-radius: 50%; background: white; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 5px 15px rgba(0,0,0,0.2);">
          <i class="fas fa-user" style="font-size: 60px; color: #1abc9c;"></i>
        </div>
        <h2 style="margin: 0; font-size: 32px; font-weight: 600;">${hoTen}</h2>
        <p style="margin: 10px 0 0; opacity: 0.95; font-size: 18px;">
          <i class="fas fa-id-badge"></i> ${myInfo.maNhanVien}
        </p>
        <div style="display: inline-block; background: rgba(255,255,255,0.2); padding: 8px 20px; border-radius: 20px; margin-top: 15px;">
          <i class="fas fa-briefcase"></i> Nhân Viên
        </div>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-bottom: 30px;">
        
        <div style="background: white; padding: 25px; border-radius: 15px; box-shadow: 0 2px 10px rgba(0,0,0,0.08);">
          <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px;">
            <div style="width: 50px; height: 50px; background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 12px; display: flex; align-items: center; justify-content: center;">
              <i class="fas fa-venus-mars" style="font-size: 24px; color: white;"></i>
            </div>
            <div>
              <p style="margin: 0; font-size: 13px; color: #999;">Giới Tính</p>
              <h3 style="margin: 5px 0 0; font-size: 18px; color: #333;">${myInfo.gioiTinh || "Chưa cập nhật"}</h3>
            </div>
          </div>
        </div>

        <div style="background: white; padding: 25px; border-radius: 15px; box-shadow: 0 2px 10px rgba(0,0,0,0.08);">
          <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px;">
            <div style="width: 50px; height: 50px; background: linear-gradient(135deg, #f093fb, #f5576c); border-radius: 12px; display: flex; align-items: center; justify-content: center;">
              <i class="fas fa-phone" style="font-size: 24px; color: white;"></i>
            </div>
            <div>
              <p style="margin: 0; font-size: 13px; color: #999;">Số Điện Thoại</p>
              <h3 style="margin: 5px 0 0; font-size: 18px; color: #333;">${myInfo.sdt || myInfo.SDT || "Chưa cập nhật"}</h3>
            </div>
          </div>
        </div>

        <div style="background: white; padding: 25px; border-radius: 15px; box-shadow: 0 2px 10px rgba(0,0,0,0.08);">
          <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px;">
            <div style="width: 50px; height: 50px; background: linear-gradient(135deg, #4facfe, #00f2fe); border-radius: 12px; display: flex; align-items: center; justify-content: center;">
              <i class="fas fa-envelope" style="font-size: 24px; color: white;"></i>
            </div>
            <div>
              <p style="margin: 0; font-size: 13px; color: #999;">Email</p>
              <h3 style="margin: 5px 0 0; font-size: 16px; color: #333; word-break: break-all;">${myInfo.email || "Chưa cập nhật"}</h3>
            </div>
          </div>
        </div>

        <div style="background: white; padding: 25px; border-radius: 15px; box-shadow: 0 2px 10px rgba(0,0,0,0.08);">
          <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px;">
            <div style="width: 50px; height: 50px; background: linear-gradient(135deg, #43e97b, #38f9d7); border-radius: 12px; display: flex; align-items: center; justify-content: center;">
              <i class="fas fa-id-badge" style="font-size: 24px; color: white;"></i>
            </div>
            <div>
              <p style="margin: 0; font-size: 13px; color: #999;">Mã Tài Khoản</p>
              <h3 style="margin: 5px 0 0; font-size: 18px; color: #333;">${myInfo.maTaiKhoan || "Chưa cập nhật"}</h3>
            </div>
          </div>
        </div>

      </div>

      <div style="background: white; padding: 30px; border-radius: 15px; box-shadow: 0 2px 10px rgba(0,0,0,0.08);">
        <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 20px;">
          <div style="width: 50px; height: 50px; background: linear-gradient(135deg, #fa709a, #fee140); border-radius: 12px; display: flex; align-items: center; justify-content: center;">
            <i class="fas fa-map-marker-alt" style="font-size: 24px; color: white;"></i>
          </div>
          <div>
            <p style="margin: 0; font-size: 13px; color: #999;">Địa Chỉ</p>
            <h3 style="margin: 5px 0 0; font-size: 16px; color: #333;">${myInfo.diaChi || "Chưa cập nhật"}</h3>
          </div>
        </div>
      </div>

      <div style="text-align: center; margin-top: 30px; padding: 20px; background: #f8f9fa; border-radius: 10px;">
        <p style="color: #666; margin: 0;">
          <i class="fas fa-info-circle"></i> 
          Nếu cần cập nhật thông tin, vui lòng liên hệ quản trị viên
        </p>
      </div>
    `;
  } catch (error) {
    console.error("Lỗi khi tải hồ sơ:", error);
    document.getElementById("hosoContent").innerHTML = `
      <div style="text-align: center; padding: 50px;">
        <i class="fas fa-exclamation-triangle" style="font-size: 50px; color: #ff9800;"></i>
        <p style="margin-top: 15px; color: #666;">Có lỗi xảy ra khi tải hồ sơ</p>
      </div>
    `;
  }
}

// Placeholder functions
function editThuoc(id) {
  showNotification("Chức năng đang phát triển", "info");
}
function viewPhieuNhap(id) {
  showNotification("Chức năng đang phát triển", "info");
}
function viewHoaDon(id) {
  showNotification("Chức năng đang phát triển", "info");
}
