// ====================
// CẤU HÌNH VÀ KHỞI TẠO
// ====================

const API_URL = "http://localhost:8080/api";
let currentUser = null;
let currentNhanVienId = null;

function normalizeRole(role) {
  return String(role || "")
    .trim()
    .toUpperCase();
}

function normalizeInvoiceStatus(status) {
  return String(status || "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "_");
}

function isPendingInvoiceStatus(status) {
  const normalized = normalizeInvoiceStatus(status);
  return normalized === "CHO_XAC_NHAN" || normalized === "CHOXACNHAN";
}

function getInvoiceStatusClass(status) {
  const normalized = normalizeInvoiceStatus(status);
  if (normalized === "DA_THANH_TOAN") return "badge-success";
  if (normalized === "HUY") return "badge-danger";
  return "badge-warning";
}

function normalizePhieuNhapStatus(status) {
  return String(status || "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "_");
}

function isPendingPhieuNhapStatus(status) {
  const normalized = normalizePhieuNhapStatus(status);
  return normalized === "CHO_XAC_NHAN" || normalized === "CHOXACNHAN";
}

function getPhieuNhapStatusClass(status) {
  const normalized = normalizePhieuNhapStatus(status);
  if (normalized === "DA_XAC_NHAN") return "badge-success";
  if (normalized === "DA_HUY") return "badge-danger";
  return "badge-warning";
}

function formatPhieuNhapStatus(status) {
  const normalized = normalizePhieuNhapStatus(status);
  if (normalized === "DA_XAC_NHAN") return "DA_XAC_NHAN";
  if (normalized === "DA_HUY") return "DA_HUY";
  return "CHO_XAC_NHAN";
}

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

  if (normalizeRole(currentUser.loaiTaiKhoan) === "BANNED") {
    alert("Tài khoản đã bị cấm, không thể truy cập trang nhân viên");
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
    return;
  }

  // Kiểm tra quyền Nhân Viên
  if (
    normalizeRole(currentUser.loaiTaiKhoan) !== "NHANVIEN" &&
    normalizeRole(currentUser.loaiTaiKhoan) !== "NhanVien"
  ) {
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
    lichdangky: "Đăng Ký Lịch Làm",
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
    case "lichdangky":
      await loadLichDangKyNhanVienPage();
      break;
  }
}

async function resolveCurrentNhanVienId() {
  if (currentNhanVienId) return currentNhanVienId;
  const res = await fetch(`${API_URL}/nhanvien`);
  const list = await res.json();
  const currentNV = list.find((nv) => nv.maTaiKhoan === currentUser.maTaiKhoan);
  currentNhanVienId = currentNV ? currentNV.maNhanVien : null;
  return currentNhanVienId;
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
    const sourceDate = hd.ngayTao || hd.ngayLap;
    const hdDate = sourceDate ? sourceDate.split("T")[0] : "";
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
    .sort(
      (a, b) =>
        new Date(b.ngayTao || b.ngayLap) - new Date(a.ngayTao || a.ngayLap),
    )
    .slice(0, 5);

  if (recentOrders.length === 0) {
    ordersDiv.innerHTML = "<p>Chưa có hóa đơn nào</p>";
    return;
  }

  let html = "";
  recentOrders.forEach((hd) => {
    const time = formatDateTime(hd.ngayTao || hd.ngayLap);
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
    const hsdText = thuoc.hsd ? formatDate(thuoc.hsd) : "";
    html += `
            <tr ${rowClass}>
                <td>${thuoc.maThuoc}</td>
                <td>${thuoc.tenThuoc}</td>
                <td>${thuoc.donViTinh || ""}</td>
                <td>${formatCurrency(thuoc.giaBan)}</td>
                <td>${thuoc.soLuongTon}</td>
                <td>${hsdText}</td>
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
      (t.donViTinh && t.donViTinh.toLowerCase().includes(keyword)),
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
                <label>Đơn vị *</label>
              <input type="text" name="donViTinh" required placeholder="Viên, Hộp, Chai...">
            </div>
            <div class="form-group">
                <label>Giá bán *</label>
                <input type="number" name="giaBan" required min="0">
            </div>
            <div class="form-group">
                <label>Số lượng *</label>
              <input type="number" name="soLuongTon" required min="0">
            </div>
            <div class="form-group">
              <label>Hạn sử dụng</label>
              <input type="date" name="hsd">
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
    const payload = {
      tenThuoc: data.tenThuoc,
      donViTinh: data.donViTinh,
      giaBan: Number(data.giaBan || 0),
      soLuongTon: Number(data.soLuongTon || 0),
      hsd: data.hsd || "",
    };

    const response = await fetch(`${API_URL}/thuoc/them-thuoc`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
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
      '<tr><td colspan="7" class="text-center">Chưa có phiếu nhập nào</td></tr>';
    return;
  }

  let html = "";
  data.forEach((pn) => {
    const statusClass = getPhieuNhapStatusClass(pn.trangThai);
    const canEdit = isPendingPhieuNhapStatus(pn.trangThai);
    const editButtons = canEdit
      ? `
          <button class="btn btn-success" onclick="editPhieuNhap('${pn.maPhieuNhap}')" title="Chinh sua chi tiet">
            <i class="fas fa-pen"></i>
          </button>
          <button class="btn btn-success" onclick="xacNhanPhieuNhap('${pn.maPhieuNhap}')" title="Xac nhan phieu nhap">
            <i class="fas fa-check"></i>
          </button>
          <button class="btn btn-danger" onclick="huyPhieuNhap('${pn.maPhieuNhap}')" title="Huy phieu nhap">
            <i class="fas fa-times"></i>
          </button>
        `
      : "";

    html += `
            <tr>
                <td>${pn.maPhieuNhap}</td>
                <td>${formatDate(pn.ngayNhap)}</td>
                <td>${pn.maNhaCungCap || ""}</td>
                <td>${pn.maNhanVien || ""}</td>
                <td>${formatCurrency(pn.tongTien)}</td>
                <td><span class="badge ${statusClass}">${formatPhieuNhapStatus(pn.trangThai)}</span></td>
                <td>
                    <button class="btn btn-view" onclick="viewPhieuNhap('${pn.maPhieuNhap}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    ${editButtons}
                </td>
            </tr>
        `;
  });

  tbody.innerHTML = html;
}

function buildPhieuNhapDetailRow(optionsHtml, row = {}) {
  return `
    <tr class="pn-detail-row">
      <td>
        <select class="pn-ma-thuoc" required>
          ${optionsHtml}
        </select>
      </td>
      <td>
        <input class="pn-so-luong" type="number" min="1" value="${row.soLuongNhap || 1}" required />
      </td>
      <td>
        <input class="pn-don-gia" type="number" min="1" value="${row.donGia || 1}" required />
      </td>
      <td>
        <button type="button" class="btn btn-danger" onclick="removePhieuNhapRow(this)">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    </tr>
  `;
}

function removePhieuNhapRow(btn) {
  const tbody = document.getElementById("phieuNhapDetailBody");
  if (!tbody) return;
  if (tbody.querySelectorAll("tr").length <= 1) {
    showNotification("Phiếu nhập cần ít nhất 1 dòng thuốc", "error");
    return;
  }
  btn.closest("tr")?.remove();
}

function collectPhieuNhapDetails(maPhieuNhap) {
  const rows = Array.from(document.querySelectorAll("#phieuNhapDetailBody tr"));
  return rows.map((row, idx) => ({
    maCTPN: row.dataset.mactpn || `CTPN${Date.now()}${idx}`,
    maPhieuNhap,
    maThuoc: row.querySelector(".pn-ma-thuoc")?.value,
    soLuongNhap: Number(row.querySelector(".pn-so-luong")?.value || 0),
    donGia: Number(row.querySelector(".pn-don-gia")?.value || 0),
  }));
}

/**
 * Hiển thị modal tạo phiếu nhập
 */
async function showAddPhieuNhapModal() {
  try {
    const [nccRes, thuocRes] = await Promise.all([
      fetch(`${API_URL}/nhacungcap`),
      fetch(`${API_URL}/thuoc`),
    ]);

    const nccList = nccRes.ok ? await nccRes.json() : [];
    const thuocList = thuocRes.ok ? await thuocRes.json() : [];

    const activeNcc = nccList.filter(
      (ncc) => normalizeInvoiceStatus(ncc.trangThai) !== "NGUNG_HOP_TAC",
    );

    if (activeNcc.length === 0) {
      showNotification("Khong co nha cung cap hop le", "error");
      return;
    }
    if (thuocList.length === 0) {
      showNotification("Khong co thuoc de tao phieu nhap", "error");
      return;
    }

    const nccOptions = activeNcc
      .map(
        (ncc) =>
          `<option value="${ncc.maNhaCungCap}">${ncc.maNhaCungCap} - ${ncc.tenNhaCungCap || ""}</option>`,
      )
      .join("");

    const thuocOptions = thuocList
      .map(
        (t) =>
          `<option value="${t.maThuoc}" data-price="${Number(t.giaBan || 0)}">${t.maThuoc} - ${t.tenThuoc || ""}</option>`,
      )
      .join("");

    const modalBody = document.getElementById("modalBody");
    modalBody.innerHTML = `
      <h2>Tao phieu nhap</h2>
      <form id="addImportForm">
        <div class="form-group">
          <label>Ma phieu nhap</label>
          <input type="text" name="maPhieuNhap" required value="PN${Date.now()}" />
        </div>
        <div class="form-group">
          <label>Nha cung cap</label>
          <select name="maNhaCungCap" required>
            ${nccOptions}
          </select>
        </div>
        <div class="form-group">
          <label>Chi tiet thuoc nhap</label>
          <div class="pn-detail-table-wrap">
            <table id="detailTable">
              <thead>
                <tr><th>Thuoc</th><th>So luong</th><th>Don gia nhap</th><th>Thao tac</th></tr>
              </thead>
              <tbody id="phieuNhapDetailBody">
                ${buildPhieuNhapDetailRow(thuocOptions)}
              </tbody>
            </table>
          </div>
          <div style="margin-top: 10px;">
            <button type="button" class="btn btn-secondary" id="btnAddPhieuNhapRow">
              <i class="fas fa-plus"></i> Them dong thuoc
            </button>
          </div>
        </div>
        <div class="form-actions">
          <button type="button" class="btn btn-cancel" onclick="closeModal()">Huy</button>
          <button type="submit" class="btn btn-primary">Luu phieu nhap</button>
        </div>
      </form>
    `;

    document
      .getElementById("btnAddPhieuNhapRow")
      .addEventListener("click", () => {
        const tbody = document.getElementById("phieuNhapDetailBody");
        tbody.insertAdjacentHTML(
          "beforeend",
          buildPhieuNhapDetailRow(thuocOptions),
        );
      });

    document
      .getElementById("addImportForm")
      .addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const raw = Object.fromEntries(formData);

        try {
          const maNhanVien = await resolveCurrentNhanVienId();
          if (!maNhanVien) {
            showNotification(
              "Khong tim thay nhan vien dang dang nhap",
              "error",
            );
            return;
          }

          const chiTiet = collectPhieuNhapDetails(raw.maPhieuNhap);
          if (chiTiet.length === 0) {
            showNotification("Can it nhat 1 dong chi tiet", "error");
            return;
          }

          const payload = {
            phieuNhap: {
              maPhieuNhap: raw.maPhieuNhap,
              maNhaCungCap: raw.maNhaCungCap,
              maNhanVien,
              ngayNhap: new Date().toISOString().split("T")[0],
            },
            chiTiet,
          };

          const res = await fetch(`${API_URL}/phieunhap/full`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

          if (!res.ok) {
            throw new Error(await res.text());
          }

          showNotification("Tao phieu nhap thanh cong", "success");
          closeModal();
          loadPhieuNhapData();
          loadThuocData();
        } catch (err) {
          showNotification(err.message || "Tao phieu nhap that bai", "error");
        }
      });

    openModal();
  } catch (error) {
    showNotification("Khong the tai du lieu tao phieu nhap", "error");
  }
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
    renderDrugSearchResults(allThuoc);
  } catch (error) {
    console.error("Lỗi khi load thuốc:", error);
    showNotification("Không thể tải danh sách thuốc", "error");
  }
}

function renderDrugSearchResults(drugList) {
  const resultsDiv = document.getElementById("drugSearchResults");
  if (!resultsDiv) return;

  if (!drugList || drugList.length === 0) {
    resultsDiv.innerHTML = "<p>Không có thuốc nào</p>";
    return;
  }

  let html = "";
  drugList.forEach((t) => {
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
 * Tìm kiếm thuốc để thêm vào giỏ
 */
function searchDrugForSale() {
  const keyword = document.getElementById("searchDrug").value.toLowerCase();

  const filtered = !keyword
    ? allThuoc
    : allThuoc.filter(
        (t) =>
          t.tenThuoc.toLowerCase().includes(keyword) ||
          t.maThuoc.toLowerCase().includes(keyword),
      );

  renderDrugSearchResults(filtered);
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
    const response = await fetch(
      `${API_URL}/khachhang/by-phone/${encodeURIComponent(phone)}`,
    );

    if (response.ok) {
      const customer = await response.json();
      const customerName = `${customer.ho || ""} ${customer.ten || ""}`.trim();
      document.getElementById("customerName").value = customerName;
      document.getElementById("customerName").dataset.maKhachHang =
        customer.maKhachHang;
      showNotification("Đã tìm thấy khách hàng", "success");
    } else {
      document.getElementById("customerName").value = "";
      document.getElementById("customerName").dataset.maKhachHang = "";
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

  try {
    const maNhanVien = await resolveCurrentNhanVienId();
    if (!maNhanVien) {
      showNotification("Khong tim thay nhan vien dang dang nhap", "error");
      return;
    }

    const maKhachHang =
      document.getElementById("customerName").dataset.maKhachHang;
    if (!maKhachHang) {
      showNotification("Khach hang chua ton tai trong he thong", "error");
      return;
    }

    const maHoaDon = `HD${Date.now()}`;
    const payload = {
      hoaDon: {
        maHoaDon,
        maKhachHang,
        maNhanVien,
        ngayTao: new Date().toISOString().split("T")[0],
      },
      chiTiet: cartItems.map((item, idx) => ({
        maCTHD: `CTHD${Date.now()}${idx}`,
        maHoaDon,
        maThuoc: item.maThuoc,
        soLuong: Number(item.quantity),
        hdsd: "Dung theo huong dan bac si",
      })),
    };

    const response = await fetch(`${API_URL}/hoadon/full`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
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
    const statusClass = getInvoiceStatusClass(hd.trangThai);
    const canHandle = isPendingInvoiceStatus(hd.trangThai);

    const actionButtons = canHandle
      ? `
          <button class="btn btn-success" onclick="confirmThanhToanNhanVien('${hd.maHoaDon}')" title="Xac nhan thanh toan">
            <i class="fas fa-check"></i>
          </button>
          <button class="btn btn-danger" onclick="confirmHuyHoaDonNhanVien('${hd.maHoaDon}')" title="Huy hoa don">
            <i class="fas fa-times"></i>
          </button>
        `
      : "";

    html += `
            <tr>
                <td>${hd.maHoaDon}</td>
                <td>${formatDate(hd.ngayTao || hd.ngayLap)}</td>
                <td>${hd.maKhachHang || ""}</td>
                <td>${hd.maNhanVien || ""}</td>
                <td>${formatCurrency(hd.tongTien)}</td>
                <td><span class="badge ${statusClass}">${hd.trangThai || "Chưa xác định"}</span></td>
                <td>
                    <button class="btn btn-view" onclick="viewHoaDon('${hd.maHoaDon}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    ${actionButtons}
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
    fetch(`${API_URL}/taikhoan/session/logout`, {
      method: "POST",
      credentials: "include",
    }).catch(() => {});
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
    const user = currentUser || JSON.parse(localStorage.getItem("currentUser"));
    if (!user) {
      throw new Error("Không tìm thấy phiên đăng nhập");
    }

    var accountId = String(user.maTaiKhoan || "").trim();
    var username = String(user.tenDangNhap || "")
      .trim()
      .toLowerCase();

    if (!accountId && username) {
      try {
        const taiKhoanRes = await fetch(`${API_URL}/taikhoan`);
        if (taiKhoanRes.ok) {
          const allTaiKhoan = await taiKhoanRes.json();
          const matchedAccount = allTaiKhoan.find(
            (tk) =>
              String(tk.tenDangNhap || "")
                .trim()
                .toLowerCase() === username,
          );
          accountId = matchedAccount
            ? String(matchedAccount.maTaiKhoan || "").trim()
            : "";
        }
      } catch (error) {
        console.warn("Không thể map maTaiKhoan từ tenDangNhap:", error);
      }
    }

    const response = await fetch(`${API_URL}/nhanvien`);
    const allNhanVien = await response.json();

    function normalized(value) {
      return String(value || "")
        .trim()
        .toLowerCase();
    }

    const userEmail = normalized(user.email);

    const scored = allNhanVien
      .map((nv) => {
        let score = 0;
        const nvAccountId = String(nv.maTaiKhoan || "").trim();
        if (accountId && nvAccountId === accountId) score += 100;
        if (user.maNhanVien && nv.maNhanVien === user.maNhanVien) score += 80;
        if (userEmail && normalized(nv.email) === userEmail) score += 40;
        return { nv, score };
      })
      .sort((a, b) => b.score - a.score);

    const myInfo = scored.length && scored[0].score > 0 ? scored[0].nv : null;

    if (!myInfo) {
      document.getElementById("hosoContent").innerHTML = `
        <div style="text-align: center; padding: 50px;">
          <i class="fas fa-exclamation-circle" style="font-size: 50px; color: #f44336;"></i>
          <p style="margin-top: 15px; color: #666;">Không tìm thấy hồ sơ nhân viên khớp với tài khoản hiện tại</p>
        </div>
      `;
      return;
    }

    const hoTen = `${myInfo.ho || ""} ${myInfo.ten || ""}`.trim();
    const usernameCode = String(user.tenDangNhap || "")
      .trim()
      .toUpperCase();
    const profileCode = usernameCode.startsWith("NV")
      ? usernameCode
      : myInfo.maNhanVien || "";
    const profileName = hoTen || user.tenDangNhap || "Nhân viên";

    // Hiển thị hồ sơ
    document.getElementById("hosoContent").innerHTML = `
      <div style="background: linear-gradient(135deg, #1abc9c 0%, #16a085 100%); padding: 40px; border-radius: 20px; color: white; text-align: center; margin-bottom: 30px; box-shadow: 0 10px 30px rgba(26, 188, 156, 0.3);">
        <div style="width: 120px; height: 120px; border-radius: 50%; background: white; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 5px 15px rgba(0,0,0,0.2);">
          <i class="fas fa-user" style="font-size: 60px; color: #1abc9c;"></i>
        </div>
        <h2 style="margin: 0; font-size: 32px; font-weight: 600;">${profileName}</h2>
        <p style="margin: 10px 0 0; opacity: 0.95; font-size: 18px;">
          <i class="fas fa-id-badge"></i> ${profileCode}
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
  const item = allThuoc.find((t) => t.maThuoc === id);
  if (!item) {
    showNotification("Khong tim thay thuoc", "error");
    return;
  }

  const modalBody = document.getElementById("modalBody");
  modalBody.innerHTML = `
    <h2>Cap nhat thuoc</h2>
    <form id="editThuocFormNv">
      <input type="hidden" name="maThuoc" value="${item.maThuoc}" />
      <div class="form-group"><label>Ten thuoc</label><input name="tenThuoc" required value="${item.tenThuoc || ""}" /></div>
      <div class="form-group"><label>Don vi tinh</label><input name="donViTinh" value="${item.donViTinh || ""}" /></div>
      <div class="form-group"><label>Gia ban</label><input type="number" name="giaBan" min="0" value="${item.giaBan || 0}" /></div>
      <div class="form-group"><label>So luong ton</label><input type="number" name="soLuongTon" min="0" value="${item.soLuongTon || 0}" /></div>
      <div class="form-group"><label>Han su dung</label><input type="date" name="hsd" value="${item.hsd ? String(item.hsd).split("T")[0] : ""}" /></div>
      <div class="form-actions">
        <button type="button" class="btn btn-cancel" onclick="closeModal()">Huy</button>
        <button type="submit" class="btn btn-primary">Luu</button>
      </div>
    </form>
  `;

  document
    .getElementById("editThuocFormNv")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const payload = Object.fromEntries(new FormData(e.target));
      payload.giaBan = Number(payload.giaBan || 0);
      payload.soLuongTon = Number(payload.soLuongTon || 0);
      try {
        const res = await fetch(`${API_URL}/thuoc`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          throw new Error(await res.text());
        }
        closeModal();
        await loadThuocData();
        showNotification("Cap nhat thuoc thanh cong", "success");
      } catch (err) {
        showNotification(err.message || "Cap nhat that bai", "error");
      }
    });

  openModal();
}
function viewPhieuNhap(id) {
  Promise.all([
    fetch(`${API_URL}/phieunhap/${id}`).then((r) => (r.ok ? r.json() : null)),
    fetch(`${API_URL}/ctphieunhap/phieunhap/${id}`).then((r) =>
      r.ok ? r.json() : [],
    ),
  ])
    .then(([pn, details]) => {
      if (!pn) {
        showNotification("Khong tim thay phieu nhap", "error");
        return;
      }
      const canEdit = isPendingPhieuNhapStatus(pn.trangThai);
      const rows = (details || [])
        .map(
          (d) =>
            `<tr><td>${d.maCTPN}</td><td>${d.maThuoc}</td><td>${d.soLuongNhap}</td><td>${formatCurrency(d.donGia)}</td></tr>`,
        )
        .join("");

      const actionButtons = canEdit
        ? `
          <div class="form-actions" style="margin-top: 14px;">
            <button type="button" class="btn btn-secondary" onclick="editPhieuNhap('${pn.maPhieuNhap}')">Chinh sua chi tiet</button>
            <button type="button" class="btn btn-success" onclick="xacNhanPhieuNhap('${pn.maPhieuNhap}')">Xac nhan</button>
            <button type="button" class="btn btn-danger" onclick="huyPhieuNhap('${pn.maPhieuNhap}')">Huy phieu</button>
          </div>
        `
        : "";

      document.getElementById("modalBody").innerHTML = `
        <h2>Chi tiet phieu nhap ${pn.maPhieuNhap}</h2>
        <p>Ngay nhap: ${formatDate(pn.ngayNhap)} | NV: ${pn.maNhanVien || ""} | NCC: ${pn.maNhaCungCap || ""} | Trang thai: ${formatPhieuNhapStatus(pn.trangThai)}</p>
        <div class="pn-detail-table-wrap">
          <table id="detailTable"><thead><tr><th>Ma CTPN</th><th>Ma thuoc</th><th>So luong</th><th>Don gia</th></tr></thead><tbody>${rows || '<tr><td colspan="4">Khong co chi tiet</td></tr>'}</tbody></table>
        </div>
        ${actionButtons}
      `;
      openModal();
    })
    .catch(() =>
      showNotification("Khong tai duoc chi tiet phieu nhap", "error"),
    );
}

async function editPhieuNhap(maPhieuNhap) {
  try {
    const [pnRes, detailRes, thuocRes] = await Promise.all([
      fetch(`${API_URL}/phieunhap/${maPhieuNhap}`),
      fetch(`${API_URL}/ctphieunhap/phieunhap/${maPhieuNhap}`),
      fetch(`${API_URL}/thuoc`),
    ]);

    if (!pnRes.ok) {
      showNotification("Khong tim thay phieu nhap", "error");
      return;
    }

    const pn = await pnRes.json();
    if (!isPendingPhieuNhapStatus(pn.trangThai)) {
      showNotification("Phieu nhap da hoan tat, khong the sua", "error");
      return;
    }

    const details = detailRes.ok ? await detailRes.json() : [];
    const thuocList = thuocRes.ok ? await thuocRes.json() : [];
    if (thuocList.length === 0) {
      showNotification("Khong co thuoc de cap nhat", "error");
      return;
    }

    const thuocOptions = thuocList
      .map(
        (t) =>
          `<option value="${t.maThuoc}">${t.maThuoc} - ${t.tenThuoc || ""}</option>`,
      )
      .join("");

    const rowsHtml = (details || [])
      .map((d) => {
        const baseRow = buildPhieuNhapDetailRow(thuocOptions, d);
        return baseRow.replace(
          '<tr class="pn-detail-row">',
          `<tr class=\"pn-detail-row\" data-mactpn=\"${d.maCTPN || ""}\">`,
        );
      })
      .join("");

    document.getElementById("modalBody").innerHTML = `
      <h2>Chinh sua phieu nhap ${pn.maPhieuNhap}</h2>
      <p>NCC: ${pn.maNhaCungCap || ""} | NV: ${pn.maNhanVien || ""} | Trang thai: ${formatPhieuNhapStatus(pn.trangThai)}</p>
      <div class="pn-detail-table-wrap">
        <table id="detailTable">
          <thead>
            <tr><th>Thuoc</th><th>So luong</th><th>Don gia nhap</th><th>Thao tac</th></tr>
          </thead>
          <tbody id="phieuNhapDetailBody">${rowsHtml || buildPhieuNhapDetailRow(thuocOptions)}</tbody>
        </table>
      </div>
      <div style="margin-top: 10px;">
        <button type="button" class="btn btn-secondary" id="btnAddEditPhieuNhapRow">
          <i class="fas fa-plus"></i> Them dong thuoc
        </button>
      </div>
      <div class="form-actions" style="margin-top: 14px;">
        <button type="button" class="btn btn-cancel" onclick="closeModal()">Dong</button>
        <button type="button" class="btn btn-primary" id="btnSavePhieuNhapEdit">Luu thay doi</button>
      </div>
    `;

    document
      .querySelectorAll("#phieuNhapDetailBody .pn-detail-row")
      .forEach((row) => {
        const selected = row.dataset.mactpn
          ? (details.find((d) => d.maCTPN === row.dataset.mactpn) || {}).maThuoc
          : null;
        if (selected) {
          const select = row.querySelector(".pn-ma-thuoc");
          if (select) select.value = selected;
        }
      });

    document
      .getElementById("btnAddEditPhieuNhapRow")
      .addEventListener("click", () => {
        const tbody = document.getElementById("phieuNhapDetailBody");
        tbody.insertAdjacentHTML(
          "beforeend",
          buildPhieuNhapDetailRow(thuocOptions),
        );
      });

    document
      .getElementById("btnSavePhieuNhapEdit")
      .addEventListener("click", async () => {
        try {
          const chiTiet = collectPhieuNhapDetails(maPhieuNhap);
          const response = await fetch(
            `${API_URL}/phieunhap/${maPhieuNhap}/details`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ chiTiet }),
            },
          );

          const result = await response.json().catch(() => false);
          if (!response.ok || result !== true) {
            const errText = await response.text().catch(() => "");
            showNotification(
              errText || "Cap nhat phieu nhap that bai",
              "error",
            );
            return;
          }

          showNotification("Cap nhat phieu nhap thanh cong", "success");
          closeModal();
          await loadPhieuNhapData();
          await loadThuocData();
          await loadDashboardData();
        } catch (error) {
          showNotification("Co loi khi cap nhat phieu nhap", "error");
        }
      });

    openModal();
  } catch (error) {
    showNotification("Khong the tai du lieu chinh sua phieu nhap", "error");
  }
}

async function xacNhanPhieuNhap(maPhieuNhap) {
  if (!confirm("Xac nhan phieu nhap nay? Sau khi xac nhan se khong sua duoc."))
    return;

  try {
    const response = await fetch(
      `${API_URL}/phieunhap/${maPhieuNhap}/xacnhan`,
      {
        method: "PUT",
      },
    );
    const result = await response.json().catch(() => false);

    if (!response.ok || result !== true) {
      const errText = await response.text().catch(() => "");
      showNotification(errText || "Xac nhan phieu nhap that bai", "error");
      return;
    }

    showNotification("Xac nhan phieu nhap thanh cong", "success");
    await loadPhieuNhapData();
    await loadDashboardData();
  } catch (error) {
    showNotification("Co loi khi xac nhan phieu nhap", "error");
  }
}

async function huyPhieuNhap(maPhieuNhap) {
  if (!confirm("Huy phieu nhap nay? He thong se hoan lai ton kho da nhap."))
    return;

  try {
    const response = await fetch(`${API_URL}/phieunhap/${maPhieuNhap}/huy`, {
      method: "PUT",
    });
    const result = await response.json().catch(() => false);

    if (!response.ok || result !== true) {
      const errText = await response.text().catch(() => "");
      showNotification(errText || "Huy phieu nhap that bai", "error");
      return;
    }

    showNotification("Da huy phieu nhap", "success");
    await loadPhieuNhapData();
    await loadThuocData();
    await loadDashboardData();
  } catch (error) {
    showNotification("Co loi khi huy phieu nhap", "error");
  }
}
function viewHoaDon(id) {
  Promise.all([
    fetch(`${API_URL}/hoadon`).then((r) => (r.ok ? r.json() : [])),
    fetch(`${API_URL}/cthoadon/${id}`).then((r) => (r.ok ? r.json() : [])),
  ])
    .then(([hoadonList, details]) => {
      const hd = (hoadonList || []).find((x) => x.maHoaDon === id);
      if (!hd) {
        showNotification("Khong tim thay hoa don", "error");
        return;
      }
      const rows = (details || [])
        .map(
          (d) =>
            `<tr><td>${d.maCTHD}</td><td>${d.maThuoc}</td><td>${d.soLuong}</td><td>${d.hdsd || ""}</td></tr>`,
        )
        .join("");
      document.getElementById("modalBody").innerHTML = `
        <h2>Chi tiet hoa don ${hd.maHoaDon}</h2>
        <p>Ngay tao: ${formatDate(hd.ngayTao || hd.ngayLap)} | KH: ${hd.maKhachHang || ""} | NV: ${hd.maNhanVien || ""} | Tong tien: ${formatCurrency(hd.tongTien)}</p>
        <table id="detailTable"><thead><tr><th>Ma CTHD</th><th>Ma thuoc</th><th>So luong</th><th>Huong dan</th></tr></thead><tbody>${rows || '<tr><td colspan="4">Khong co chi tiet</td></tr>'}</tbody></table>
      `;
      openModal();
    })
    .catch(() => showNotification("Khong tai duoc chi tiet hoa don", "error"));
}

async function confirmThanhToanNhanVien(maHoaDon) {
  if (!confirm("Xac nhan thanh toan hoa don nay?")) return;

  try {
    const response = await fetch(`${API_URL}/hoadon/thanhtoan`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ maHoaDon }),
    });

    const result = await response.json().catch(() => false);
    if (!response.ok || result !== true) {
      showNotification("Xac nhan thanh toan that bai", "error");
      return;
    }

    showNotification("Xac nhan thanh toan thanh cong", "success");
    loadHoaDonData();
    loadDashboardData();
  } catch (error) {
    showNotification("Co loi xay ra", "error");
  }
}

async function confirmHuyHoaDonNhanVien(maHoaDon) {
  if (!confirm("Ban co chac muon huy hoa don nay?")) return;

  try {
    const response = await fetch(`${API_URL}/hoadon/huy`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ maHoaDon }),
    });

    const result = await response.json().catch(() => false);
    if (!response.ok || result !== true) {
      showNotification("Huy hoa don that bai", "error");
      return;
    }

    showNotification("Da huy hoa don", "success");
    loadHoaDonData();
    loadDashboardData();
  } catch (error) {
    showNotification("Co loi xay ra", "error");
  }
}

// ====================
// ĐĂNG KÝ LỊCH LÀM
// ====================

function getLichLamStatusClass(status) {
  const normalized = String(status || "")
    .trim()
    .toUpperCase();
  if (normalized === "DA_DUYET") return "badge-success";
  if (normalized === "TU_CHOI") return "badge-danger";
  return "badge-warning";
}

async function loadFixedSlotsForNhanVien() {
  const select = document.getElementById("shiftSlotSelect");
  if (!select) return;
  try {
    const response = await fetch(`${API_URL}/lichlam/fixed-slots`);
    const slots = await response.json();
    select.innerHTML = '<option value="">-- Chọn khung giờ --</option>';
    (slots || []).forEach((slot) => {
      const value = `${slot.gioBatDau}|${slot.gioKetThuc}`;
      const text = `${slot.gioBatDau} - ${slot.gioKetThuc}`;
      select.insertAdjacentHTML(
        "beforeend",
        `<option value="${value}">${text}</option>`,
      );
    });
  } catch (error) {
    showNotification("Không thể tải khung giờ cố định", "error");
  }
}

async function loadLichDangKyNhanVienTable() {
  const tbody = document.getElementById("lichdangkyTableBody");
  if (!tbody) return;

  try {
    const maNhanVien = await resolveCurrentNhanVienId();
    if (!maNhanVien) {
      tbody.innerHTML =
        '<tr><td colspan="5" class="text-center">Không tìm thấy nhân viên hiện tại</td></tr>';
      return;
    }

    const response = await fetch(`${API_URL}/lichlam/nhanvien/${maNhanVien}`);
    const data = await response.json();

    if (!data || data.length === 0) {
      tbody.innerHTML =
        '<tr><td colspan="5" class="text-center">Chưa có đăng ký lịch làm nào</td></tr>';
      return;
    }

    let html = "";
    data.forEach((ll) => {
      const statusClass = getLichLamStatusClass(ll.trangThai);
      html += `
        <tr>
          <td>${ll.maLich}</td>
          <td>${formatDate(ll.ngayLam)}</td>
          <td>${ll.gioBatDau || ""}</td>
          <td>${ll.gioKetThuc || ""}</td>
          <td><span class="badge ${statusClass}">${ll.trangThai || "CHO_DUYET"}</span></td>
        </tr>
      `;
    });
    tbody.innerHTML = html;
  } catch (error) {
    console.error("Lỗi khi tải lịch đăng ký:", error);
    showNotification("Không thể tải lịch đăng ký", "error");
  }
}

async function loadLichDangKyNhanVienPage() {
  await loadFixedSlotsForNhanVien();
  await loadLichDangKyNhanVienTable();
}

async function registerLichLamNhanVien() {
  const ngayLam = document.getElementById("shiftNgayLam")?.value;
  const slotValue = document.getElementById("shiftSlotSelect")?.value;

  if (!ngayLam || !slotValue) {
    showNotification("Vui lòng chọn ngày làm và khung giờ", "error");
    return;
  }

  const [gioBatDau, gioKetThuc] = slotValue.split("|");

  try {
    const maNhanVien = await resolveCurrentNhanVienId();
    if (!maNhanVien) {
      showNotification("Không tìm thấy nhân viên hiện tại", "error");
      return;
    }

    const response = await fetch(`${API_URL}/lichlam/dangky`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        maNhanVien,
        ngayLam,
        gioBatDau,
        gioKetThuc,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      showNotification(err || "Đăng ký lịch làm thất bại", "error");
      return;
    }

    showNotification("Đăng ký lịch làm thành công, chờ admin duyệt", "success");
    await loadLichDangKyNhanVienTable();
  } catch (error) {
    console.error("Lỗi:", error);
    showNotification("Có lỗi xảy ra", "error");
  }
}
