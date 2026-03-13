// ====================
// CẤU HÌNH VÀ KHỞI TẠO
// ====================

const API_URL = "http://localhost:8080/api";
let currentUser = null;

function normalizeRole(role) {
  return String(role || "")
    .trim()
    .toUpperCase();
}

function normalizeHoaDonStatus(status) {
  return String(status || "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "_");
}

function isPendingHoaDonStatus(status) {
  const s = normalizeHoaDonStatus(status);
  return s === "CHO_XAC_NHAN" || s === "CHOXACNHAN";
}

function normalizePhieuNhapStatus(status) {
  return String(status || "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "_");
}

function isPendingPhieuNhapStatus(status) {
  const s = normalizePhieuNhapStatus(status);
  return s === "CHO_XAC_NHAN" || s === "CHOXACNHAN";
}

function getStatusBadgeClass(status) {
  const s = normalizeHoaDonStatus(status);
  if (s === "DA_THANH_TOAN" || s === "DA_XAC_NHAN") return "badge-success";
  if (s === "HUY" || s === "DA_HUY") return "badge-danger";
  return "badge-warning";
}

// Kiểm tra đăng nhập khi load trang
document.addEventListener("DOMContentLoaded", () => {
  checkAuth();
  initApp();
});

/**
 * Kiểm tra xác thực người dùng
 * Nếu chưa đăng nhập hoặc không phải Admin -> redirect về login
 */
function checkAuth() {
  const userStr = localStorage.getItem("currentUser");
  if (!userStr) {
    window.location.href = "login.html";
    return;
  }

  currentUser = JSON.parse(userStr);

  if (normalizeRole(currentUser.loaiTaiKhoan) === "BANNED") {
    alert("Tài khoản đã bị cấm, không thể truy cập trang quản trị");
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
    return;
  }

  // Kiểm tra quyền Admin
  if (normalizeRole(currentUser.loaiTaiKhoan) !== "ADMIN") {
    alert("Bạn không có quyền truy cập trang này!");
    window.location.href = "login.html";
    return;
  }

  // Hiển thị tên admin
  document.getElementById("adminName").textContent = currentUser.tenDangNhap;
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
    nhanvien: "Quản Lý Nhân Viên",
    khachhang: "Quản Lý Khách Hàng",
    thuoc: "Quản Lý Thuốc",
    phieunhap: "Phiếu Nhập Hàng",
    hoadon: "Hóa Đơn Bán Hàng",
    taikhoan: "Quản Lý Tài Khoản",
    lichlam: "Duyệt Lịch Làm",
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
    case "nhanvien":
      await loadNhanVienData();
      break;
    case "khachhang":
      await loadKhachHangData();
      break;
    case "thuoc":
      await loadThuocData();
      break;
    case "phieunhap":
      await loadPhieuNhapData();
      break;
    case "hoadon":
      await loadHoaDonData();
      break;
    case "taikhoan":
      await loadTaiKhoanData();
      break;
    case "lichlam":
      await loadLichLamChoDuyetData();
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
    const statsRes = await fetch(`${API_URL}/admin/dashboard/stats`, {
      credentials: "include",
    });

    if (statsRes.ok) {
      const stats = await statsRes.json();
      document.getElementById("totalNhanVien").textContent =
        stats.totalEmployees || 0;
      document.getElementById("totalKhachHang").textContent =
        stats.totalCustomers || 0;
      document.getElementById("totalThuoc").textContent =
        stats.totalMedicines || 0;
      document.getElementById("totalHoaDon").textContent =
        stats.totalInvoices || 0;
      document.getElementById("todayRevenue").textContent = formatCurrency(
        stats.totalRevenue || 0,
      );
      document.getElementById("todayOrderCount").textContent =
        stats.totalInvoices || 0;
    }

    const hoadonRes = await fetch(`${API_URL}/hoadon`);
    const hoadon = await hoadonRes.json();
    displayRecentActivity(hoadon);
  } catch (error) {
    console.error("Lỗi khi load dashboard:", error);
    showNotification("Không thể tải dữ liệu dashboard", "error");
  }
}

/**
 * Tính doanh thu hôm nay từ danh sách hóa đơn
 * @param {Array} hoadonList - Danh sách hóa đơn
 */
function calculateTodayRevenue(hoadonList) {
  const today = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD

  let todayRevenue = 0;
  let todayCount = 0;

  hoadonList.forEach((hd) => {
    // Kiểm tra nếu hóa đơn là hôm nay và đã thanh toán
    const sourceDate = hd.ngayTao || hd.ngayLap;
    const hdDate = sourceDate ? sourceDate.split("T")[0] : "";
    if (hdDate === today && hd.trangThai !== "Hủy") {
      todayRevenue += hd.tongTien || 0;
      todayCount++;
    }
  });

  document.getElementById("todayRevenue").textContent =
    formatCurrency(todayRevenue);
  document.getElementById("todayOrderCount").textContent = todayCount;
}

/**
 * Hiển thị hoạt động gần đây
 * @param {Array} hoadonList - Danh sách hóa đơn
 */
function displayRecentActivity(hoadonList) {
  const activityDiv = document.getElementById("recentActivity");

  // Sắp xếp hóa đơn theo ngày giảm dần và lấy 5 cái gần nhất
  const recentOrders = hoadonList
    .sort(
      (a, b) =>
        new Date(b.ngayTao || b.ngayLap) - new Date(a.ngayTao || a.ngayLap),
    )
    .slice(0, 5);

  if (recentOrders.length === 0) {
    activityDiv.innerHTML = "<p>Chưa có hoạt động nào</p>";
    return;
  }

  let html = "";
  recentOrders.forEach((hd) => {
    const time = formatDateTime(hd.ngayTao || hd.ngayLap);
    html += `
            <div class="activity-item">
                <strong>Hóa đơn ${hd.maHoaDon}</strong><br>
                ${time} - ${formatCurrency(hd.tongTien)}
            </div>
        `;
  });

  activityDiv.innerHTML = html;
}

// ====================
// QUẢN LÝ NHÂN VIÊN
// ====================

/**
 * Load danh sách nhân viên
 */
async function loadNhanVienData() {
  try {
    const response = await fetch(`${API_URL}/nhanvien`);
    const data = await response.json();

    displayNhanVienTable(data);
  } catch (error) {
    console.error("Lỗi khi load nhân viên:", error);
    showNotification("Không thể tải danh sách nhân viên", "error");
  }
}

/**
 * Hiển thị bảng nhân viên
 * @param {Array} data - Danh sách nhân viên
 */
function displayNhanVienTable(data) {
  const tbody = document.getElementById("nhanvienTableBody");

  if (data.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="7" class="text-center">Chưa có nhân viên nào</td></tr>';
    return;
  }

  let html = "";
  data.forEach((nv) => {
    // Ghép ho và ten để hiển thị
    const hoTen = `${nv.ho || ""} ${nv.ten || ""}`.trim();

    html += `
            <tr>
                <td>${nv.maNhanVien || ""}</td>
                <td>${hoTen || "N/A"}</td>
                <td>${nv.sdt || nv.SDT || ""}</td>
                <td>${nv.email || ""}</td>
                <td>${nv.diaChi || ""}</td>
                <td>
                    <button class="btn btn-info" onclick="viewHoSoNhanVien('${nv.maNhanVien}')" title="Xem hồ sơ">
                        <i class="fas fa-id-card"></i>
                    </button>
                </td>
                <td>
                    <button class="btn btn-edit" onclick="editNhanVien('${nv.maNhanVien}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-delete" onclick="deleteNhanVien('${nv.maNhanVien}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
  });

  tbody.innerHTML = html;
}

/**
 * Hiển thị modal thêm nhân viên
 */
/**
 * Hiển thị modal thêm nhân viên
 * Modal gồm 2 phần: Tạo tài khoản + Thông tin nhân viên
 */
function showAddNhanVienModal() {
  const modalBody = document.getElementById("modalBody");
  modalBody.innerHTML = `
        <h2>Thêm Nhân Viên Mới</h2>
        <form id="addNhanVienForm">
            <h3 style="color: #667eea; margin-top: 20px;">📝 Thông Tin Tài Khoản</h3>
            <div class="form-group">
                <label>Tên đăng nhập *</label>
                <input type="text" name="tenDangNhap" required placeholder="Tên đăng nhập">
            </div>
            <div class="form-group">
                <label>Mật khẩu *</label>
                <input type="password" name="matKhau" required placeholder="Mật khẩu">
            </div>
            <div class="form-group">
                <label>Email *</label>
                <input type="email" name="email" required placeholder="email@example.com">
            </div>
            <div class="form-group">
                <label>Loại tài khoản *</label>
                <select name="loaiTaiKhoan" required>
                    <option value="NhanVien">Nhân Viên</option>
                    <option value="Admin">Admin</option>
                </select>
            </div>
            
            <h3 style="color: #667eea; margin-top: 20px;">👤 Thông Tin Cá Nhân</h3>
            <div class="form-group">
                <label>Họ tên *</label>
                <input type="text" name="hoTen" required placeholder="Nguyễn Văn A">
            </div>
            <div class="form-group">
                <label>Số điện thoại *</label>
                <input type="tel" name="soDienThoai" required placeholder="0123456789">
            </div>
            <div class="form-group">
                <label>Địa chỉ</label>
                <input type="text" name="diaChi" placeholder="Số nhà, đường, quận/huyện, thành phố">
            </div>
            
            <div class="form-actions">
                <button type="button" class="btn btn-cancel" onclick="closeModal()">Hủy</button>
                <button type="submit" class="btn btn-primary">Tạo Nhân Viên</button>
            </div>
        </form>
    `;

  // Xử lý submit form
  document
    .getElementById("addNhanVienForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData);

      await addNhanVien(data);
    });

  openModal();
}

/**
 * Thêm nhân viên mới (gọi API mới để tạo tài khoản + nhân viên)
 * @param {Object} data - Dữ liệu từ form
 */
async function addNhanVien(data) {
  try {
    // Gọi API mới: /api/nhanvien/create-with-account
    const response = await fetch(`${API_URL}/nhanvien/create-with-account`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      showNotification("Tạo nhân viên và tài khoản thành công!", "success");
      closeModal();
      loadNhanVienData();
    } else {
      const errorMsg = await response.text();
      showNotification(errorMsg || "Thêm nhân viên thất bại", "error");
    }
  } catch (error) {
    console.error("Lỗi:", error);
    showNotification("Có lỗi xảy ra: " + error.message, "error");
  }
}

/**
 * Xóa nhân viên
 * @param {string} maNV - Mã nhân viên
 */
async function deleteNhanVien(maNV) {
  if (!confirm("Bạn có chắc muốn xóa nhân viên này?")) return;

  try {
    const response = await fetch(`${API_URL}/nhanvien/${maNV}`, {
      method: "DELETE",
    });

    if (response.ok) {
      showNotification("Xóa nhân viên thành công", "success");
      loadNhanVienData();
    } else {
      showNotification("Xóa nhân viên thất bại", "error");
    }
  } catch (error) {
    console.error("Lỗi:", error);
    showNotification("Có lỗi xảy ra", "error");
  }
}

/**
 * Xem hồ sơ nhân viên
 * @param {string} maNV - Mã nhân viên
 */
async function viewHoSoNhanVien(maNV) {
  try {
    // Lấy thông tin nhân viên từ API
    const response = await fetch(`${API_URL}/nhanvien`);
    const data = await response.json();
    const nhanvien = data.find((nv) => nv.maNhanVien === maNV);

    if (!nhanvien) {
      showNotification("Không tìm thấy thông tin nhân viên", "error");
      return;
    }

    const hoTen = `${nhanvien.ho || ""} ${nhanvien.ten || ""}`.trim();

    const modalBody = document.getElementById("modalBody");
    modalBody.innerHTML = `
      <div style="max-width: 600px; margin: 0 auto;">
        <h2 style="text-align: center; color: #667eea; margin-bottom: 30px;">
          <i class="fas fa-id-card"></i> Hồ Sơ Nhân Viên
        </h2>
        
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 15px; color: white; text-align: center; margin-bottom: 30px;">
          <div style="width: 100px; height: 100px; border-radius: 50%; background: white; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center;">
            <i class="fas fa-user" style="font-size: 50px; color: #667eea;"></i>
          </div>
          <h3 style="margin: 0; font-size: 24px;">${hoTen}</h3>
          <p style="margin: 5px 0 0; opacity: 0.9;">${nhanvien.maNhanVien}</p>
        </div>

        <div style="background: #f8f9fa; padding: 25px; border-radius: 10px;">
          <div style="display: grid; gap: 20px;">
            
            <div class="info-row">
              <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 5px;">
                <i class="fas fa-phone" style="color: #667eea; width: 20px;"></i>
                <strong>Số điện thoại:</strong>
              </div>
              <div style="padding-left: 30px; color: #555;">${nhanvien.sdt || nhanvien.SDT || "Chưa cập nhật"}</div>
            </div>

            <div class="info-row">
              <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 5px;">
                <i class="fas fa-envelope" style="color: #667eea; width: 20px;"></i>
                <strong>Email:</strong>
              </div>
              <div style="padding-left: 30px; color: #555;">${nhanvien.email || "Chưa cập nhật"}</div>
            </div>

            <div class="info-row">
              <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 5px;">
                <i class="fas fa-map-marker-alt" style="color: #667eea; width: 20px;"></i>
                <strong>Địa chỉ:</strong>
              </div>
              <div style="padding-left: 30px; color: #555;">${nhanvien.diaChi || "Chưa cập nhật"}</div>
            </div>

            <div class="info-row">
              <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 5px;">
                <i class="fas fa-id-badge" style="color: #667eea; width: 20px;"></i>
                <strong>Mã tài khoản:</strong>
              </div>
              <div style="padding-left: 30px; color: #555;">${nhanvien.maTaiKhoan || "Chưa cập nhật"}</div>
            </div>

          </div>
        </div>

        <div style="text-align: center; margin-top: 25px;">
          <button class="btn btn-secondary" onclick="closeModal()" style="padding: 12px 40px;">
            <i class="fas fa-times"></i> Đóng
          </button>
        </div>
      </div>
    `;

    document.getElementById("modal").style.display = "flex";
  } catch (error) {
    console.error("Lỗi:", error);
    showNotification("Có lỗi xảy ra khi tải hồ sơ", "error");
  }
}

// ====================
// QUẢN LÝ KHÁCH HÀNG
// ====================

/**
 * Load danh sách khách hàng
 */
async function loadKhachHangData() {
  try {
    const response = await fetch(`${API_URL}/khachhang`);
    const data = await response.json();

    displayKhachHangTable(data);
  } catch (error) {
    console.error("Lỗi khi load khách hàng:", error);
    showNotification("Không thể tải danh sách khách hàng", "error");
  }
}

/**
 * Hiển thị bảng khách hàng
 * @param {Array} data - Danh sách khách hàng
 */
function displayKhachHangTable(data) {
  const tbody = document.getElementById("khachhangTableBody");

  if (data.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="6" class="text-center">Chưa có khách hàng nào</td></tr>';
    return;
  }

  let html = "";
  data.forEach((kh) => {
    const hoTen = `${kh.ho || ""} ${kh.ten || ""}`.trim();
    html += `
            <tr>
                <td>${kh.maKhachHang}</td>
                <td>${hoTen}</td>
                <td>${kh.sdt}</td>
                <td>${kh.email || ""}</td>
                <td>${kh.diaChi || ""}</td>
                <td>
                    <button class="btn btn-edit" onclick="editKhachHang('${kh.maKhachHang}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-delete" onclick="deleteKhachHang('${kh.maKhachHang}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
  });

  tbody.innerHTML = html;
}

/**
 * Hiển thị modal thêm khách hàng
 */
function showAddKhachHangModal() {
  const modalBody = document.getElementById("modalBody");
  modalBody.innerHTML = `
        <h2>Thêm Khách Hàng Mới</h2>
        <form id="addKhachHangForm">
      <h3 style="color: #667eea; margin-top: 20px;">📝 Thông Tin Tài Khoản</h3>
      <div class="form-group">
        <label>Tên đăng nhập *</label>
        <input type="text" name="tenDangNhap" required>
      </div>
      <div class="form-group">
        <label>Mật khẩu *</label>
        <input type="password" name="matKhau" required>
      </div>
            <div class="form-group">
        <label>Email *</label>
        <input type="email" name="email" required>
            </div>
      <input type="hidden" name="loaiTaiKhoan" value="KHACHHANG">

      <h3 style="color: #667eea; margin-top: 20px;">👤 Thông Tin Khách Hàng</h3>
            <div class="form-group">
        <label>Họ tên *</label>
        <input type="text" name="hoTen" required>
            </div>
            <div class="form-group">
                <label>Số điện thoại *</label>
                <input type="tel" name="soDienThoai" required>
            </div>
            <div class="form-group">
        <label>Ngày sinh</label>
        <input type="date" name="ngaySinh">
            </div>
            <div class="form-group">
                <label>Địa chỉ</label>
                <input type="text" name="diaChi">
            </div>
      <div class="form-group">
        <label>Tiền sử bệnh lý</label>
        <input type="text" name="tienSuBenhLy">
      </div>
            <div class="form-actions">
                <button type="button" class="btn btn-cancel" onclick="closeModal()">Hủy</button>
        <button type="submit" class="btn btn-primary">Tạo Khách Hàng</button>
            </div>
        </form>
    `;

  document
    .getElementById("addKhachHangForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData);

      await addKhachHang(data);
    });

  openModal();
}

/**
 * Thêm khách hàng mới
 * @param {Object} data - Dữ liệu khách hàng
 */
async function addKhachHang(data) {
  try {
    const response = await fetch(`${API_URL}/khachhang/create-with-account`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      showNotification("Tạo khách hàng và tài khoản thành công", "success");
      closeModal();
      loadKhachHangData();
      loadTaiKhoanData();
    } else {
      const err = await response.json().catch(() => ({}));
      showNotification(err.error || "Thêm khách hàng thất bại", "error");
    }
  } catch (error) {
    console.error("Lỗi:", error);
    showNotification("Có lỗi xảy ra", "error");
  }
}

/**
 * Xóa khách hàng
 * @param {string} maKH - Mã khách hàng
 */
async function deleteKhachHang(maKH) {
  if (!confirm("Bạn có chắc muốn xóa khách hàng này?")) return;

  try {
    const response = await fetch(`${API_URL}/khachhang/${maKH}`, {
      method: "DELETE",
    });

    if (response.ok) {
      showNotification("Xóa khách hàng thành công", "success");
      loadKhachHangData();
    } else {
      showNotification("Xóa khách hàng thất bại", "error");
    }
  } catch (error) {
    console.error("Lỗi:", error);
    showNotification("Có lỗi xảy ra", "error");
  }
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
    const hsdText = thuoc.hsd ? formatDate(thuoc.hsd) : "";
    html += `
            <tr>
                <td>${thuoc.maThuoc}</td>
                <td>${thuoc.tenThuoc}</td>
                <td>${thuoc.donViTinh || ""}</td>
                <td>${formatCurrency(thuoc.giaBan)}</td>
                <td>${thuoc.soLuongTon}</td>
          <td>${hsdText}</td>
                <td>
                    <button class="btn btn-view" onclick="viewThuoc('${thuoc.maThuoc}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-edit" onclick="editThuoc('${thuoc.maThuoc}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-delete" onclick="deleteThuoc('${thuoc.maThuoc}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
  });

  tbody.innerHTML = html;
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
                <label>Đơn vị tính *</label>
                <input type="text" name="donViTinh" required placeholder="Viên, Hộp, Chai...">
            </div>
            <div class="form-group">
                <label>Giá bán *</label>
                <input type="number" name="giaBan" required min="0" step="0.01">
            </div>
            <div class="form-group">
                <label>Số lượng tồn *</label>
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

      // Convert string to number for numeric fields
      if (data.giaBan) data.giaBan = parseFloat(data.giaBan);
      if (data.soLuongTon) data.soLuongTon = parseInt(data.soLuongTon);

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

/**
 * Xóa thuốc
 * @param {string} maThuoc - Mã thuốc
 */
async function deleteThuoc(maThuoc) {
  if (!confirm("Bạn có chắc muốn xóa thuốc này?")) return;

  try {
    const response = await fetch(`${API_URL}/thuoc/${maThuoc}`, {
      method: "DELETE",
    });

    if (response.ok) {
      showNotification("Xóa thuốc thành công", "success");
      loadThuocData();
    } else {
      showNotification("Xóa thuốc thất bại", "error");
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
    const statusClass = getStatusBadgeClass(pn.trangThai);
    const canEdit = isPendingPhieuNhapStatus(pn.trangThai);
    const actionButtons = canEdit
      ? `
          <button class="btn btn-edit" onclick="editPhieuNhapAdmin('${pn.maPhieuNhap}')" title="Chỉnh sửa chi tiết">
              <i class="fas fa-pen"></i>
          </button>
          <button class="btn btn-success" onclick="xacNhanPhieuNhapAdmin('${pn.maPhieuNhap}')" title="Xác nhận phiếu nhập">
              <i class="fas fa-check"></i>
          </button>
          <button class="btn btn-delete" onclick="huyPhieuNhapAdmin('${pn.maPhieuNhap}')" title="Hủy phiếu nhập">
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
                <td><span class="badge ${statusClass}">${pn.trangThai || "CHO_XAC_NHAN"}</span></td>
                <td>
                    <button class="btn btn-view" onclick="viewPhieuNhap('${pn.maPhieuNhap}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    ${actionButtons}
                </td>
            </tr>
        `;
  });

  tbody.innerHTML = html;
}

async function resolveCurrentNhanVienIdAdmin() {
  const res = await fetch(`${API_URL}/nhanvien`);
  const list = await res.json();
  const currentNV = list.find((nv) => nv.maTaiKhoan === currentUser.maTaiKhoan);
  return currentNV ? currentNV.maNhanVien : null;
}

function buildPhieuNhapDetailRowAdmin(optionsHtml, row = {}) {
  return `
    <tr class="pn-detail-row-admin" data-mactpn="${row.maCTPN || ""}">
      <td><select class="pn-ma-thuoc" required>${optionsHtml}</select></td>
      <td><input class="pn-so-luong" type="number" min="1" value="${row.soLuongNhap || 1}" required /></td>
      <td><input class="pn-don-gia" type="number" min="1" value="${row.donGia || 1}" required /></td>
      <td><button type="button" class="btn btn-delete" onclick="removePhieuNhapRowAdmin(this)"><i class="fas fa-trash"></i></button></td>
    </tr>
  `;
}

function removePhieuNhapRowAdmin(btn) {
  const tbody = document.getElementById("phieuNhapDetailBodyAdmin");
  if (!tbody) return;
  if (tbody.querySelectorAll("tr").length <= 1) {
    showNotification("Phiếu nhập cần ít nhất 1 dòng thuốc", "error");
    return;
  }
  btn.closest("tr")?.remove();
}

function collectPhieuNhapDetailsAdmin(maPhieuNhap) {
  return Array.from(
    document.querySelectorAll("#phieuNhapDetailBodyAdmin tr"),
  ).map((row, idx) => ({
    maCTPN: row.dataset.mactpn || `CTPN${Date.now()}${idx}`,
    maPhieuNhap,
    maThuoc: row.querySelector(".pn-ma-thuoc")?.value,
    soLuongNhap: Number(row.querySelector(".pn-so-luong")?.value || 0),
    donGia: Number(row.querySelector(".pn-don-gia")?.value || 0),
  }));
}

/**
 * Hiển thị modal thêm phiếu nhập
 */
async function showAddPhieuNhapModal() {
  try {
    const [nccRes, thuocRes] = await Promise.all([
      fetch(`${API_URL}/nhacungcap`),
      fetch(`${API_URL}/thuoc`),
    ]);
    const nccList = nccRes.ok ? await nccRes.json() : [];
    const thuocList = thuocRes.ok ? await thuocRes.json() : [];
    if (!nccList.length || !thuocList.length) {
      showNotification("Thiếu dữ liệu nhà cung cấp hoặc thuốc", "error");
      return;
    }

    const nccOptions = nccList
      .filter(
        (ncc) => normalizePhieuNhapStatus(ncc.trangThai) !== "NGUNG_HOP_TAC",
      )
      .map(
        (ncc) =>
          `<option value="${ncc.maNhaCungCap}">${ncc.maNhaCungCap} - ${ncc.tenNhaCungCap || ""}</option>`,
      )
      .join("");
    const thuocOptions = thuocList
      .map(
        (t) =>
          `<option value="${t.maThuoc}">${t.maThuoc} - ${t.tenThuoc || ""}</option>`,
      )
      .join("");

    const modalBody = document.getElementById("modalBody");
    modalBody.innerHTML = `
      <h2>Tạo phiếu nhập</h2>
      <form id="addPhieuNhapForm">
        <div class="form-group">
          <label>Mã phiếu nhập *</label>
          <input type="text" name="maPhieuNhap" required value="PN${Date.now()}" />
        </div>
        <div class="form-group">
          <label>Nhà cung cấp *</label>
          <select name="maNhaCungCap" required>${nccOptions}</select>
        </div>
        <div class="form-group">
          <label>Chi tiết thuốc nhập</label>
          <div class="pn-detail-table-wrap">
            <table id="detailTable">
              <thead><tr><th>Thuốc</th><th>Số lượng</th><th>Đơn giá nhập</th><th>Thao tác</th></tr></thead>
              <tbody id="phieuNhapDetailBodyAdmin">${buildPhieuNhapDetailRowAdmin(thuocOptions)}</tbody>
            </table>
          </div>
          <div style="margin-top:10px;">
            <button type="button" class="btn btn-secondary" id="btnAddPhieuNhapRowAdmin"><i class="fas fa-plus"></i> Thêm dòng thuốc</button>
          </div>
        </div>
        <div class="form-actions">
          <button type="button" class="btn btn-cancel" onclick="closeModal()">Hủy</button>
          <button type="submit" class="btn btn-primary">Lưu phiếu nhập</button>
        </div>
      </form>
    `;

    document
      .getElementById("btnAddPhieuNhapRowAdmin")
      .addEventListener("click", () => {
        document
          .getElementById("phieuNhapDetailBodyAdmin")
          .insertAdjacentHTML(
            "beforeend",
            buildPhieuNhapDetailRowAdmin(thuocOptions),
          );
      });

    document
      .getElementById("addPhieuNhapForm")
      .addEventListener("submit", async (e) => {
        e.preventDefault();
        const raw = Object.fromEntries(new FormData(e.target));
        const maNhanVien = await resolveCurrentNhanVienIdAdmin();
        if (!maNhanVien) {
          showNotification(
            "Không tìm thấy nhân viên tương ứng tài khoản hiện tại",
            "error",
          );
          return;
        }

        const chiTiet = collectPhieuNhapDetailsAdmin(raw.maPhieuNhap);
        const payload = {
          phieuNhap: {
            maPhieuNhap: raw.maPhieuNhap,
            ngayNhap: new Date().toISOString().split("T")[0],
            maNhanVien,
            maNhaCungCap: raw.maNhaCungCap,
          },
          chiTiet,
        };

        try {
          const res = await fetch(`${API_URL}/phieunhap/full`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          if (!res.ok) throw new Error(await res.text());
          showNotification("Tạo phiếu nhập thành công", "success");
          closeModal();
          loadPhieuNhapData();
        } catch (err) {
          showNotification(err.message || "Tạo phiếu nhập thất bại", "error");
        }
      });

    openModal();
  } catch (error) {
    showNotification("Không thể mở form tạo phiếu nhập", "error");
  }
}

async function editPhieuNhapAdmin(maPhieuNhap) {
  try {
    const [pnRes, detailRes, thuocRes] = await Promise.all([
      fetch(`${API_URL}/phieunhap/${maPhieuNhap}`),
      fetch(`${API_URL}/ctphieunhap/phieunhap/${maPhieuNhap}`),
      fetch(`${API_URL}/thuoc`),
    ]);

    if (!pnRes.ok) {
      showNotification("Không tìm thấy phiếu nhập", "error");
      return;
    }

    const phieuNhap = await pnRes.json();
    if (!isPendingPhieuNhapStatus(phieuNhap.trangThai)) {
      showNotification("Phiếu nhập đã hoàn tất, không thể chỉnh sửa", "error");
      return;
    }

    const details = detailRes.ok ? await detailRes.json() : [];
    const thuocList = thuocRes.ok ? await thuocRes.json() : [];
    if (!thuocList.length) {
      showNotification("Không có thuốc để chỉnh sửa", "error");
      return;
    }

    const thuocOptions = thuocList
      .map(
        (t) =>
          `<option value="${t.maThuoc}">${t.maThuoc} - ${t.tenThuoc || ""}</option>`,
      )
      .join("");

    const rowsHtml = (details || [])
      .map((d) => buildPhieuNhapDetailRowAdmin(thuocOptions, d))
      .join("");

    const modalBody = document.getElementById("modalBody");
    modalBody.innerHTML = `
      <h2>Chỉnh sửa phiếu nhập ${phieuNhap.maPhieuNhap}</h2>
      <p>NCC: ${phieuNhap.maNhaCungCap || ""} | NV: ${phieuNhap.maNhanVien || ""} | Trạng thái: ${formatPhieuNhapStatus(phieuNhap.trangThai)}</p>
      <div class="pn-detail-table-wrap">
        <table id="detailTable">
          <thead>
            <tr><th>Thuốc</th><th>Số lượng</th><th>Đơn giá nhập</th><th>Thao tác</th></tr>
          </thead>
          <tbody id="phieuNhapDetailBodyAdmin">${rowsHtml || buildPhieuNhapDetailRowAdmin(thuocOptions)}</tbody>
        </table>
      </div>
      <div style="margin-top: 10px;">
        <button type="button" class="btn btn-secondary" id="btnAddEditPhieuNhapRowAdmin">
          <i class="fas fa-plus"></i> Thêm dòng thuốc
        </button>
      </div>
      <div class="form-actions" style="margin-top: 14px;">
        <button type="button" class="btn btn-cancel" onclick="closeModal()">Đóng</button>
        <button type="button" class="btn btn-primary" id="btnSavePhieuNhapEditAdmin">Lưu thay đổi</button>
      </div>
    `;

    document
      .querySelectorAll("#phieuNhapDetailBodyAdmin .pn-detail-row-admin")
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
      .getElementById("btnAddEditPhieuNhapRowAdmin")
      .addEventListener("click", () => {
        document
          .getElementById("phieuNhapDetailBodyAdmin")
          .insertAdjacentHTML(
            "beforeend",
            buildPhieuNhapDetailRowAdmin(thuocOptions),
          );
      });

    document
      .getElementById("btnSavePhieuNhapEditAdmin")
      .addEventListener("click", async () => {
        try {
          const chiTiet = collectPhieuNhapDetailsAdmin(maPhieuNhap);
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
              errText || "Cập nhật phiếu nhập thất bại",
              "error",
            );
            return;
          }

          showNotification("Cập nhật phiếu nhập thành công", "success");
          closeModal();
          await loadPhieuNhapData();
          await loadThuocData();
          await loadDashboardData();
        } catch (error) {
          showNotification("Có lỗi khi cập nhật phiếu nhập", "error");
        }
      });

    openModal();
  } catch (error) {
    showNotification("Không thể tải dữ liệu chỉnh sửa phiếu nhập", "error");
  }
}

async function xacNhanPhieuNhapAdmin(maPhieuNhap) {
  if (!confirm("Xác nhận phiếu nhập này? Sau khi xác nhận sẽ không sửa được."))
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
      showNotification(errText || "Xác nhận phiếu nhập thất bại", "error");
      return;
    }

    showNotification("Xác nhận phiếu nhập thành công", "success");
    await loadPhieuNhapData();
    await loadDashboardData();
  } catch (error) {
    showNotification("Có lỗi khi xác nhận phiếu nhập", "error");
  }
}

async function huyPhieuNhapAdmin(maPhieuNhap) {
  if (!confirm("Hủy phiếu nhập này?")) return;

  try {
    const response = await fetch(`${API_URL}/phieunhap/${maPhieuNhap}/huy`, {
      method: "PUT",
    });
    const result = await response.json().catch(() => false);

    if (!response.ok || result !== true) {
      const errText = await response.text().catch(() => "");
      showNotification(errText || "Hủy phiếu nhập thất bại", "error");
      return;
    }

    showNotification("Đã hủy phiếu nhập", "success");
    await loadPhieuNhapData();
    await loadThuocData();
    await loadDashboardData();
  } catch (error) {
    showNotification("Có lỗi khi hủy phiếu nhập", "error");
  }
}

/**
 * Xóa phiếu nhập
 * @param {string} maPN - Mã phiếu nhập
 */
async function deletePhieuNhap(maPN) {
  if (!confirm("Bạn có chắc muốn xóa phiếu nhập này?")) return;

  try {
    const response = await fetch(`${API_URL}/phieunhap/${maPN}`, {
      method: "DELETE",
    });

    if (response.ok) {
      showNotification("Xóa phiếu nhập thành công", "success");
      loadPhieuNhapData();
    } else {
      showNotification("Xóa phiếu nhập thất bại", "error");
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
    const statusClass = getStatusBadgeClass(hd.trangThai);

    // Tạo nút hành động dựa trên trạng thái
    let actionButtons = `<button class="btn btn-view" onclick="viewHoaDon('${hd.maHoaDon}')" title="Xem chi tiết">
                            <i class="fas fa-eye"></i>
                        </button>`;

    if (isPendingHoaDonStatus(hd.trangThai)) {
      actionButtons += `
        <button class="btn btn-success" onclick="confirmThanhToan('${hd.maHoaDon}')" title="Thanh toán">
            <i class="fas fa-check-circle"></i>
        </button>
        <button class="btn btn-delete" onclick="confirmHuyHoaDon('${hd.maHoaDon}')" title="Hủy hóa đơn">
            <i class="fas fa-times-circle"></i>
        </button>`;
    }

    html += `
            <tr>
                <td>${hd.maHoaDon}</td>
                <td>${formatDate(hd.ngayTao || hd.ngayLap)}</td>
                <td>${hd.maKhachHang || ""}</td>
                <td>${hd.maNhanVien || ""}</td>
                <td>${formatCurrency(hd.tongTien)}</td>
                <td><span class="badge ${statusClass}">${hd.trangThai || "CHO_XAC_NHAN"}</span></td>
                <td>
                    ${actionButtons}
                </td>
            </tr>
        `;
  });

  tbody.innerHTML = html;
}

// ====================
// QUẢN LÝ TÀI KHOẢN
// ====================

/**
 * Load danh sách tài khoản
 */
async function loadTaiKhoanData() {
  try {
    const response = await fetch(`${API_URL}/taikhoan`);
    const data = await response.json();

    displayTaiKhoanTable(data);
  } catch (error) {
    console.error("Lỗi khi load tài khoản:", error);
    showNotification("Không thể tải danh sách tài khoản", "error");
  }
}

/**
 * Hiển thị bảng tài khoản
 * @param {Array} data - Danh sách tài khoản
 */
function displayTaiKhoanTable(data) {
  const tbody = document.getElementById("taikhoanTableBody");

  if (data.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="5" class="text-center">Chưa có tài khoản nào</td></tr>';
    return;
  }

  let html = "";
  data.forEach((tk) => {
    const role = normalizeRole(tk.loaiTaiKhoan);
    const badgeClass =
      role === "ADMIN" ? "danger" : role === "BANNED" ? "danger" : "success";

    const loaiTaiKhoanText = role === "BANNED" ? "BANNED (Đã bị cấm)" : role;

    const toggleBanButton =
      role === "BANNED"
        ? `<button class="btn btn-success" onclick="showGoCamTaiKhoanModal('${tk.maTaiKhoan}')" title="Gỡ cấm tài khoản">
             <i class="fas fa-user-check"></i>
           </button>`
        : `<button class="btn btn-danger" onclick="banTaiKhoan('${tk.maTaiKhoan}')" title="Vô hiệu hóa tài khoản">
             <i class="fas fa-user-slash"></i>
           </button>`;

    html += `
            <tr>
                <td>${tk.maTaiKhoan}</td>
                <td>${tk.tenDangNhap}</td>
                <td>${tk.email || ""}</td>
          <td><span class="badge badge-${badgeClass}">${loaiTaiKhoanText}</span></td>
                <td>
            <button class="btn btn-secondary" onclick="resetMatKhauTaiKhoan('${tk.maTaiKhoan}')" title="Reset mật khẩu về 123456">
              <i class="fas fa-key"></i>
            </button>
            ${toggleBanButton}
                    <button class="btn btn-delete" onclick="deleteTaiKhoan('${tk.maTaiKhoan}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
  });

  tbody.innerHTML = html;
}

async function resetMatKhauTaiKhoan(maTK) {
  if (!confirm("Reset mật khẩu tài khoản này về mặc định 123456?")) return;

  try {
    const response = await fetch(`${API_URL}/taikhoan/${maTK}/reset-password`, {
      method: "PUT",
    });

    const result = await response.json().catch(() => false);
    if (!response.ok || result !== true) {
      const err = await response.text();
      showNotification(err || "Reset mật khẩu thất bại", "error");
      return;
    }

    showNotification("Đã reset mật khẩu về 123456", "success");
  } catch (error) {
    console.error("Lỗi:", error);
    showNotification("Có lỗi xảy ra", "error");
  }
}

async function banTaiKhoan(maTK) {
  if (!confirm("Bạn có chắc muốn vô hiệu hóa tài khoản này?")) return;

  try {
    const response = await fetch(`${API_URL}/taikhoan/${maTK}/ban`, {
      method: "PUT",
    });

    const result = await response.json().catch(() => false);
    if (!response.ok || result !== true) {
      const err = await response.text();
      showNotification(err || "Vô hiệu hóa tài khoản thất bại", "error");
      return;
    }

    showNotification("Đã vô hiệu hóa tài khoản", "success");
    loadTaiKhoanData();
  } catch (error) {
    console.error("Lỗi:", error);
    showNotification("Có lỗi xảy ra", "error");
  }
}

function showGoCamTaiKhoanModal(maTK) {
  const modalBody = document.getElementById("modalBody");
  if (!modalBody) {
    goCamTaiKhoan(maTK, "NHANVIEN");
    return;
  }

  modalBody.innerHTML = `
    <h2>Gỡ Cấm Tài Khoản</h2>
    <form id="goCamTaiKhoanForm">
      <div class="form-group">
        <label>Mã tài khoản</label>
        <input type="text" value="${maTK}" disabled>
      </div>
      <div class="form-group">
        <label>Vai trò sau khi gỡ cấm *</label>
        <select name="loaiTaiKhoan" required>
          <option value="NHANVIEN" selected>NHANVIEN</option>
          <option value="KHACHHANG">KHACHHANG</option>
          <option value="ADMIN">ADMIN</option>
        </select>
      </div>
      <div class="form-actions">
        <button type="button" class="btn btn-cancel" onclick="closeModal()">Hủy</button>
        <button type="submit" class="btn btn-success">Gỡ cấm</button>
      </div>
    </form>
  `;

  document
    .getElementById("goCamTaiKhoanForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const roleSauMoKhoa = String(formData.get("loaiTaiKhoan") || "");
      await goCamTaiKhoan(maTK, roleSauMoKhoa);
    });

  openModal();
}

async function goCamTaiKhoan(maTK, roleSauMoKhoa) {
  if (!roleSauMoKhoa) {
    showNotification("Thiếu vai trò sau khi gỡ cấm", "error");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/taikhoan/${maTK}/unban`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ loaiTaiKhoan: roleSauMoKhoa }),
    });

    const result = await response.json().catch(() => false);
    if (!response.ok || result !== true) {
      const err = await response.text();
      showNotification(err || "Gỡ cấm tài khoản thất bại", "error");
      return;
    }

    showNotification("Đã gỡ cấm tài khoản", "success");
    closeModal();
    loadTaiKhoanData();
  } catch (error) {
    console.error("Lỗi:", error);
    showNotification("Có lỗi xảy ra", "error");
  }
}

// ====================
// DUYỆT LỊCH LÀM
// ====================

let allLichLamData = [];

function getLichLamStatusBadgeClass(status) {
  const s = String(status || "")
    .trim()
    .toUpperCase();
  if (s === "DA_DUYET") return "badge-success";
  if (s === "TU_CHOI") return "badge-danger";
  return "badge-warning";
}

function normalizeSlotValue(gioBatDau, gioKetThuc) {
  return `${String(gioBatDau || "").trim()}|${String(gioKetThuc || "").trim()}`;
}

async function initLichLamFilters() {
  const slotSelect = document.getElementById("lichlamFilterSlot");
  if (!slotSelect) return;
  if (slotSelect.dataset.loaded === "1") return;

  try {
    const response = await fetch(`${API_URL}/lichlam/fixed-slots`);
    const slots = response.ok ? await response.json() : [];
    slotSelect.innerHTML = '<option value="">Tất cả khung giờ</option>';
    (slots || []).forEach((slot) => {
      const value = normalizeSlotValue(slot.gioBatDau, slot.gioKetThuc);
      slotSelect.insertAdjacentHTML(
        "beforeend",
        `<option value="${value}">${slot.gioBatDau} - ${slot.gioKetThuc}</option>`,
      );
    });
    slotSelect.dataset.loaded = "1";
  } catch (error) {
    // Ignore filter option loading errors to avoid blocking main table.
  }
}

function refreshLichLamSlotOptionsFromData(data) {
  const slotSelect = document.getElementById("lichlamFilterSlot");
  if (!slotSelect) return;

  const currentValue = slotSelect.value || "";
  const slotMap = new Map();

  Array.from(slotSelect.options || []).forEach((opt) => {
    const value = String(opt.value || "").trim();
    if (!value) return;
    slotMap.set(value, opt.textContent || value.replace("|", " - "));
  });

  (data || []).forEach((ll) => {
    const value = normalizeSlotValue(ll.gioBatDau, ll.gioKetThuc);
    if (!value || value === "|") return;
    if (!slotMap.has(value)) {
      slotMap.set(value, `${ll.gioBatDau || ""} - ${ll.gioKetThuc || ""}`);
    }
  });

  slotSelect.innerHTML = '<option value="">Tất cả khung giờ</option>';
  Array.from(slotMap.entries()).forEach(([value, label]) => {
    slotSelect.insertAdjacentHTML(
      "beforeend",
      `<option value="${value}">${label}</option>`,
    );
  });

  if (currentValue && slotMap.has(currentValue)) {
    slotSelect.value = currentValue;
  }
}

function applyLichLamFilters() {
  const dateValue = document.getElementById("lichlamFilterDate")?.value || "";
  const slotValue = document.getElementById("lichlamFilterSlot")?.value || "";

  const filtered = (allLichLamData || []).filter((ll) => {
    const byDate = !dateValue || String(ll.ngayLam || "").startsWith(dateValue);
    const bySlot =
      !slotValue ||
      normalizeSlotValue(ll.gioBatDau, ll.gioKetThuc) === slotValue;
    return byDate && bySlot;
  });

  displayLichLamChoDuyetTable(filtered || []);
}

function clearLichLamFilters() {
  const dateInput = document.getElementById("lichlamFilterDate");
  const slotSelect = document.getElementById("lichlamFilterSlot");
  if (dateInput) dateInput.value = "";
  if (slotSelect) slotSelect.value = "";
  applyLichLamFilters();
}

async function loadLichLamChoDuyetData() {
  try {
    await initLichLamFilters();
    const response = await fetch(`${API_URL}/lichlam`);
    const data = response.ok ? await response.json() : [];
    allLichLamData = Array.isArray(data) ? data : [];
    refreshLichLamSlotOptionsFromData(allLichLamData);
    applyLichLamFilters();
  } catch (error) {
    console.error("Lỗi khi load lịch làm chờ duyệt:", error);
    showNotification("Không thể tải danh sách lịch làm", "error");
  }
}

function displayLichLamChoDuyetTable(data) {
  const tbody = document.getElementById("lichlamTableBody");
  if (!tbody) return;

  if (data.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="7" class="text-center">Không có đăng ký nào cần duyệt</td></tr>';
    return;
  }

  let html = "";
  data.forEach((ll) => {
    const status = String(ll.trangThai || "CHO_DUYET").toUpperCase();
    const canHandle = status === "CHO_DUYET";

    const actionButtons = canHandle
      ? `
          <button class="btn btn-success" onclick="duyetDangKyLichLam('${ll.maLich}')" title="Duyệt đăng ký">
            <i class="fas fa-check"></i>
          </button>
          <button class="btn btn-delete" onclick="tuChoiDangKyLichLam('${ll.maLich}')" title="Từ chối đăng ký">
            <i class="fas fa-times"></i>
          </button>
        `
      : '<span style="color:#64748b;font-size:12px;">Đã xử lý</span>';

    html += `
      <tr>
        <td>${ll.maLich}</td>
        <td>${ll.maNhanVien}</td>
        <td>${formatDate(ll.ngayLam)}</td>
        <td>${ll.gioBatDau || ""}</td>
        <td>${ll.gioKetThuc || ""}</td>
        <td><span class="badge ${getLichLamStatusBadgeClass(status)}">${status}</span></td>
        <td>
          ${actionButtons}
        </td>
      </tr>
    `;
  });
  tbody.innerHTML = html;
}

async function duyetDangKyLichLam(maLich) {
  if (!confirm("Duyệt đăng ký lịch làm này?")) return;

  try {
    const response = await fetch(`${API_URL}/lichlam/${maLich}/duyet`, {
      method: "PUT",
    });
    if (!response.ok) {
      const err = await response.text();
      showNotification(err || "Duyệt đăng ký thất bại", "error");
      return;
    }
    showNotification("Đã duyệt đăng ký lịch làm", "success");
    loadLichLamChoDuyetData();
  } catch (error) {
    console.error("Lỗi:", error);
    showNotification("Có lỗi xảy ra", "error");
  }
}

async function tuChoiDangKyLichLam(maLich) {
  if (!confirm("Từ chối đăng ký lịch làm này?")) return;

  try {
    const response = await fetch(`${API_URL}/lichlam/${maLich}/tuchoi`, {
      method: "PUT",
    });
    if (!response.ok) {
      const err = await response.text();
      showNotification(err || "Từ chối đăng ký thất bại", "error");
      return;
    }
    showNotification("Đã từ chối đăng ký lịch làm", "success");
    loadLichLamChoDuyetData();
  } catch (error) {
    console.error("Lỗi:", error);
    showNotification("Có lỗi xảy ra", "error");
  }
}

/**
 * Xóa tài khoản
 * @param {string} maTK - Mã tài khoản
 */
async function deleteTaiKhoan(maTK) {
  if (!confirm("Bạn có chắc muốn xóa tài khoản này?")) return;

  try {
    const response = await fetch(`${API_URL}/taikhoan/${maTK}`, {
      method: "DELETE",
    });

    if (response.ok) {
      showNotification("Xóa tài khoản thành công", "success");
      loadTaiKhoanData();
    } else {
      showNotification("Xóa tài khoản thất bại", "error");
    }
  } catch (error) {
    console.error("Lỗi:", error);
    showNotification("Có lỗi xảy ra", "error");
  }
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
// CÁC HÀM EDIT VÀ VIEW CHI TIẾT
// ====================

/**
 * Chỉnh sửa thông tin nhân viên
 * @param {string} maNV - Mã nhân viên
 */
async function editNhanVien(maNV) {
  try {
    // Lấy thông tin nhân viên hiện tại
    const response = await fetch(`${API_URL}/nhanvien`);
    const data = await response.json();
    const nhanvien = data.find((nv) => nv.maNhanVien === maNV);

    if (!nhanvien) {
      showNotification("Không tìm thấy thông tin nhân viên", "error");
      return;
    }

    const hoTen = `${nhanvien.ho || ""} ${nhanvien.ten || ""}`.trim();

    const modalBody = document.getElementById("modalBody");
    modalBody.innerHTML = `
      <h2>Chỉnh Sửa Nhân Viên</h2>
      <form id="editNhanVienForm">
        <div class="form-group">
          <label>Mã nhân viên</label>
          <input type="text" value="${nhanvien.maNhanVien}" disabled>
        </div>
        <div class="form-group">
          <label>Họ tên *</label>
          <input type="text" name="hoTen" value="${hoTen}" required>
        </div>
        <div class="form-group">
          <label>Số điện thoại *</label>
          <input type="tel" name="soDienThoai" value="${nhanvien.sdt || nhanvien.SDT || ""}" required>
        </div>
        <div class="form-group">
          <label>Email</label>
          <input type="email" name="email" value="${nhanvien.email || ""}">
        </div>
        <div class="form-group">
          <label>Địa chỉ</label>
          <input type="text" name="diaChi" value="${nhanvien.diaChi || ""}">
        </div>
        <div class="form-actions">
          <button type="button" class="btn btn-cancel" onclick="closeModal()">Hủy</button>
          <button type="submit" class="btn btn-primary">Cập Nhật</button>
        </div>
      </form>
    `;

    document
      .getElementById("editNhanVienForm")
      .addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);

        // Split hoTen into ho and ten
        const nameParts = data.hoTen.trim().split(/\s+/);
        const ten = nameParts.pop();
        const ho = nameParts.join(" ");

        const updateData = {
          maNhanVien: nhanvien.maNhanVien,
          ho: ho,
          ten: ten,
          sdt: data.soDienThoai,
          email: data.email,
          diaChi: data.diaChi,
          maTaiKhoan: nhanvien.maTaiKhoan,
        };

        try {
          const response = await fetch(`${API_URL}/nhanvien`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updateData),
          });

          if (response.ok) {
            showNotification("Cập nhật nhân viên thành công", "success");
            closeModal();
            loadNhanVienData();
          } else {
            showNotification("Cập nhật nhân viên thất bại", "error");
          }
        } catch (error) {
          console.error("Lỗi:", error);
          showNotification("Có lỗi xảy ra", "error");
        }
      });

    openModal();
  } catch (error) {
    console.error("Lỗi:", error);
    showNotification("Không thể tải thông tin nhân viên", "error");
  }
}

/**
 * Chỉnh sửa thông tin khách hàng
 * @param {string} maKH - Mã khách hàng
 */
async function editKhachHang(maKH) {
  try {
    // Lấy thông tin khách hàng hiện tại
    const response = await fetch(`${API_URL}/khachhang`);
    const data = await response.json();
    const khachhang = data.find((kh) => kh.maKhachHang === maKH);

    if (!khachhang) {
      showNotification("Không tìm thấy thông tin khách hàng", "error");
      return;
    }

    const hoTen = `${khachhang.ho || ""} ${khachhang.ten || ""}`.trim();

    const modalBody = document.getElementById("modalBody");
    modalBody.innerHTML = `
      <h2>Chỉnh Sửa Khách Hàng</h2>
      <form id="editKhachHangForm">
        <div class="form-group">
          <label>Mã khách hàng</label>
          <input type="text" value="${khachhang.maKhachHang}" disabled>
        </div>
        <div class="form-group">
          <label>Họ tên *</label>
          <input type="text" name="hoTen" value="${hoTen}" required>
        </div>
        <div class="form-group">
          <label>Số điện thoại *</label>
          <input type="tel" name="soDienThoai" value="${khachhang.sdt || ""}" required>
        </div>
        <div class="form-group">
          <label>Email</label>
          <input type="email" name="email" value="${khachhang.email || ""}">
        </div>
        <div class="form-group">
          <label>Địa chỉ</label>
          <input type="text" name="diaChi" value="${khachhang.diaChi || ""}">
        </div>
        <div class="form-actions">
          <button type="button" class="btn btn-cancel" onclick="closeModal()">Hủy</button>
          <button type="submit" class="btn btn-primary">Cập Nhật</button>
        </div>
      </form>
    `;

    document
      .getElementById("editKhachHangForm")
      .addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);

        // Split hoTen into ho and ten
        const nameParts = data.hoTen.trim().split(/\s+/);
        const ten = nameParts.pop();
        const ho = nameParts.join(" ");

        const updateData = {
          maKhachHang: khachhang.maKhachHang,
          ho: ho,
          ten: ten,
          sdt: data.soDienThoai,
          email: data.email,
          diaChi: data.diaChi,
        };

        try {
          const response = await fetch(`${API_URL}/khachhang`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updateData),
          });

          if (response.ok) {
            showNotification("Cập nhật khách hàng thành công", "success");
            closeModal();
            loadKhachHangData();
          } else {
            showNotification("Cập nhật khách hàng thất bại", "error");
          }
        } catch (error) {
          console.error("Lỗi:", error);
          showNotification("Có lỗi xảy ra", "error");
        }
      });

    openModal();
  } catch (error) {
    console.error("Lỗi:", error);
    showNotification("Không thể tải thông tin khách hàng", "error");
  }
}

/**
 * Xem chi tiết thuốc
 * @param {string} maThuoc - Mã thuốc
 */
async function viewThuoc(maThuoc) {
  try {
    const response = await fetch(`${API_URL}/thuoc/${maThuoc}`);

    if (!response.ok) {
      showNotification("Không thể tải thông tin thuốc", "error");
      return;
    }

    const thuoc = await response.json();

    if (!thuoc) {
      showNotification("Không tìm thấy thông tin thuốc", "error");
      return;
    }

    const modalBody = document.getElementById("modalBody");
    modalBody.innerHTML = `
      <div style="max-width: 600px; margin: 0 auto;">
        <h2 style="text-align: center; color: #667eea; margin-bottom: 30px;">
          <i class="fas fa-pills"></i> Chi Tiết Thuốc
        </h2>
        
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 15px; color: white; text-align: center; margin-bottom: 30px;">
          <h3 style="margin: 0; font-size: 24px;">${thuoc.tenThuoc}</h3>
          <p style="margin: 5px 0 0; opacity: 0.9;">${thuoc.maThuoc}</p>
        </div>

        <div style="background: #f8f9fa; padding: 25px; border-radius: 10px;">
          <div style="display: grid; gap: 20px;">
            
            <div class="info-row">
              <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 5px;">
                <i class="fas fa-box" style="color: #667eea; width: 20px;"></i>
                <strong>Đơn vị tính:</strong>
              </div>
              <div style="padding-left: 30px; color: #555;">${thuoc.donViTinh || "Chưa cập nhật"}</div>
            </div>

            <div class="info-row">
              <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 5px;">
                <i class="fas fa-money-bill-wave" style="color: #667eea; width: 20px;"></i>
                <strong>Giá bán:</strong>
              </div>
              <div style="padding-left: 30px; color: #555;">${formatCurrency(thuoc.giaBan)}</div>
            </div>

            <div class="info-row">
              <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 5px;">
                <i class="fas fa-warehouse" style="color: #667eea; width: 20px;"></i>
                <strong>Số lượng tồn:</strong>
              </div>
              <div style="padding-left: 30px; color: #555;">${thuoc.soLuongTon || 0} ${thuoc.donViTinh || ""}</div>
            </div>

            <div class="info-row">
              <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 5px;">
                <i class="fas fa-calendar-alt" style="color: #667eea; width: 20px;"></i>
                <strong>Hạn sử dụng:</strong>
              </div>
              <div style="padding-left: 30px; color: #555;">${thuoc.hsd ? formatDate(thuoc.hsd) : "Chưa cập nhật"}</div>
            </div>

          </div>
        </div>

        <div style="margin-top: 20px; text-align: center;">
          <button class="btn btn-primary" onclick="closeModal()">Đóng</button>
        </div>
      </div>
    `;

    openModal();
  } catch (error) {
    console.error("Lỗi:", error);
    showNotification("Không thể tải thông tin thuốc", "error");
  }
}

/**
 * Chỉnh sửa thông tin thuốc
 * @param {string} maThuoc - Mã thuốc
 */
async function editThuoc(maThuoc) {
  try {
    const response = await fetch(`${API_URL}/thuoc/${maThuoc}`);
    const thuoc = await response.json();

    if (!thuoc) {
      showNotification("Không tìm thấy thông tin thuốc", "error");
      return;
    }

    const modalBody = document.getElementById("modalBody");
    modalBody.innerHTML = `
      <h2>Chỉnh Sửa Thuốc</h2>
      <form id="editThuocForm">
        <div class="form-group">
          <label>Mã thuốc</label>
          <input type="text" value="${thuoc.maThuoc}" disabled>
        </div>
        <div class="form-group">
          <label>Tên thuốc *</label>
          <input type="text" name="tenThuoc" value="${thuoc.tenThuoc}" required>
        </div>
        <div class="form-group">
          <label>Đơn vị tính *</label>
          <input type="text" name="donViTinh" value="${thuoc.donViTinh || ""}" required placeholder="Viên, Hộp, Chai...">
        </div>
        <div class="form-group">
          <label>Giá bán *</label>
          <input type="number" name="giaBan" value="${thuoc.giaBan}" required min="0" step="0.01">
        </div>
        <div class="form-group">
          <label>Số lượng tồn *</label>
          <input type="number" name="soLuongTon" value="${thuoc.soLuongTon || 0}" required min="0">
        </div>
        <div class="form-group">
          <label>Hạn sử dụng</label>
          <input type="date" name="hsd" value="${thuoc.hsd ? thuoc.hsd.split("T")[0] : ""}">
        </div>
        <div class="form-actions">
          <button type="button" class="btn btn-cancel" onclick="closeModal()">Hủy</button>
          <button type="submit" class="btn btn-primary">Cập Nhật</button>
        </div>
      </form>
    `;

    document
      .getElementById("editThuocForm")
      .addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);

        // Convert string to number for numeric fields
        if (data.giaBan) data.giaBan = parseFloat(data.giaBan);
        if (data.soLuongTon) data.soLuongTon = parseInt(data.soLuongTon);

        const updateData = {
          maThuoc: thuoc.maThuoc,
          tenThuoc: data.tenThuoc,
          donViTinh: data.donViTinh,
          giaBan: data.giaBan,
          soLuongTon: data.soLuongTon,
          hsd: data.hsd,
          maNhaCungCap: thuoc.maNhaCungCap || "",
        };

        try {
          const response = await fetch(`${API_URL}/thuoc`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updateData),
          });

          if (response.ok) {
            showNotification("Cập nhật thuốc thành công", "success");
            closeModal();
            loadThuocData();
          } else {
            showNotification("Cập nhật thuốc thất bại", "error");
          }
        } catch (error) {
          console.error("Lỗi:", error);
          showNotification("Có lỗi xảy ra", "error");
        }
      });

    openModal();
  } catch (error) {
    console.error("Lỗi:", error);
    showNotification("Không thể tải thông tin thuốc", "error");
  }
}

/**
 * Xem chi tiết phiếu nhập
 * @param {string} maPhieuNhap - Mã phiếu nhập
 */
async function viewPhieuNhap(maPhieuNhap) {
  try {
    const [phieuNhapRes, detailsRes] = await Promise.all([
      fetch(`${API_URL}/phieunhap/${maPhieuNhap}`),
      fetch(`${API_URL}/ctphieunhap/phieunhap/${maPhieuNhap}`),
    ]);

    if (!phieuNhapRes.ok) {
      showNotification("Không thể tải thông tin phiếu nhập", "error");
      return;
    }

    const phieuNhap = await phieuNhapRes.json();
    const details = detailsRes.ok ? await detailsRes.json() : [];

    if (!phieuNhap) {
      showNotification("Không tìm thấy thông tin phiếu nhập", "error");
      return;
    }

    const canEdit = isPendingPhieuNhapStatus(phieuNhap.trangThai);
    const detailRows = (details || [])
      .map(
        (d) =>
          `<tr><td>${d.maCTPN}</td><td>${d.maThuoc}</td><td>${d.soLuongNhap}</td><td>${formatCurrency(d.donGia)}</td></tr>`,
      )
      .join("");

    const actionButtons = canEdit
      ? `
        <div class="form-actions" style="margin-top: 14px;">
          <button type="button" class="btn btn-secondary" onclick="editPhieuNhapAdmin('${phieuNhap.maPhieuNhap}')">Chỉnh sửa chi tiết</button>
          <button type="button" class="btn btn-success" onclick="xacNhanPhieuNhapAdmin('${phieuNhap.maPhieuNhap}')">Xác nhận</button>
          <button type="button" class="btn btn-danger" onclick="huyPhieuNhapAdmin('${phieuNhap.maPhieuNhap}')">Hủy phiếu</button>
        </div>
      `
      : "";

    const modalBody = document.getElementById("modalBody");
    modalBody.innerHTML = `
      <div style="max-width: 760px; margin: 0 auto;">
        <h2 style="text-align: center; color: #667eea; margin-bottom: 30px;">
          <i class="fas fa-file-import"></i> Chi Tiết Phiếu Nhập
        </h2>
        
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 15px; color: white; margin-bottom: 30px;">
          <h3 style="margin: 0; font-size: 24px; text-align: center;">${phieuNhap.maPhieuNhap}</h3>
          <p style="margin: 10px 0 0; text-align: center; opacity: 0.9;">Ngày nhập: ${formatDate(phieuNhap.ngayNhap)}</p>
        </div>

        <div style="background: #f8f9fa; padding: 25px; border-radius: 10px; margin-bottom: 16px;">
          <div style="display: grid; gap: 15px;">
            
            <div class="info-row">
              <div style="display: flex; align-items: center; gap: 10px;">
                <i class="fas fa-truck" style="color: #667eea; width: 20px;"></i>
                <strong>Nhà cung cấp:</strong>
                <span style="margin-left: auto; color: #555;">${phieuNhap.maNhaCungCap || "N/A"}</span>
              </div>
            </div>

            <div class="info-row">
              <div style="display: flex; align-items: center; gap: 10px;">
                <i class="fas fa-user" style="color: #667eea; width: 20px;"></i>
                <strong>Nhân viên nhập:</strong>
                <span style="margin-left: auto; color: #555;">${phieuNhap.maNhanVien || "N/A"}</span>
              </div>
            </div>

            <div class="info-row" style="border-top: 2px solid #dee2e6; padding-top: 15px; margin-top: 10px;">
              <div style="display: flex; align-items: center; gap: 10px;">
                <i class="fas fa-flag" style="color: #667eea; width: 20px;"></i>
                <strong>Trạng thái:</strong>
                <span style="margin-left: auto; color: #555;">${formatPhieuNhapStatus(phieuNhap.trangThai)}</span>
              </div>
            </div>

            <div class="info-row" style="border-top: 1px dashed #cfd4dc; padding-top: 15px; margin-top: 5px;">
              <div style="display: flex; align-items: center; gap: 10px;">
                <i class="fas fa-money-bill-wave" style="color: #28a745; width: 20px;"></i>
                <strong style="font-size: 18px;">Tổng tiền:</strong>
                <span style="margin-left: auto; color: #28a745; font-size: 20px; font-weight: bold;">${formatCurrency(phieuNhap.tongTien)}</span>
              </div>
            </div>

          </div>
        </div>

        <div class="pn-detail-table-wrap">
          <table id="detailTable">
            <thead>
              <tr><th>Mã CTPN</th><th>Mã thuốc</th><th>Số lượng</th><th>Đơn giá</th></tr>
            </thead>
            <tbody>${detailRows || '<tr><td colspan="4" class="text-center">Không có chi tiết phiếu nhập</td></tr>'}</tbody>
          </table>
        </div>

        ${actionButtons}

        <div style="margin-top: 20px; text-align: center;">
          <button class="btn btn-primary" onclick="closeModal()">Đóng</button>
        </div>
      </div>
    `;

    openModal();
  } catch (error) {
    console.error("Lỗi:", error);
    showNotification("Không thể tải thông tin phiếu nhập", "error");
  }
}

/**
 * Xem chi tiết hóa đơn
 * @param {string} maHoaDon - Mã hóa đơn
 */
async function viewHoaDon(maHoaDon) {
  try {
    const response = await fetch(`${API_URL}/hoadon`);
    const data = await response.json();
    const hoaDon = data.find((hd) => hd.maHoaDon === maHoaDon);

    if (!hoaDon) {
      showNotification("Không tìm thấy thông tin hóa đơn", "error");
      return;
    }

    const statusColor = hoaDon.trangThai === "Hủy" ? "#dc3545" : "#28a745";
    const statusIcon =
      hoaDon.trangThai === "Hủy" ? "fa-times-circle" : "fa-check-circle";

    const modalBody = document.getElementById("modalBody");
    modalBody.innerHTML = `
      <div style="max-width: 700px; margin: 0 auto;">
        <h2 style="text-align: center; color: #667eea; margin-bottom: 30px;">
          <i class="fas fa-receipt"></i> Chi Tiết Hóa Đơn
        </h2>
        
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 15px; color: white; margin-bottom: 30px;">
          <h3 style="margin: 0; font-size: 24px; text-align: center;">${hoaDon.maHoaDon}</h3>
          <p style="margin: 10px 0 0; text-align: center; opacity: 0.9;">Ngày lập: ${formatDate(hoaDon.ngayTao || hoaDon.ngayLap)}</p>
          <div style="text-align: center; margin-top: 15px;">
            <span style="background: ${statusColor}; padding: 8px 20px; border-radius: 20px; font-weight: bold;">
              <i class="fas ${statusIcon}"></i> ${hoaDon.trangThai || "Chưa xác định"}
            </span>
          </div>
        </div>

        <div style="background: #f8f9fa; padding: 25px; border-radius: 10px; margin-bottom: 20px;">
          <div style="display: grid; gap: 15px;">
            
            <div class="info-row">
              <div style="display: flex; align-items: center; gap: 10px;">
                <i class="fas fa-user-friends" style="color: #667eea; width: 20px;"></i>
                <strong>Khách hàng:</strong>
                <span style="margin-left: auto; color: #555;">${hoaDon.maKhachHang || "Khách lẻ"}</span>
              </div>
            </div>

            <div class="info-row">
              <div style="display: flex; align-items: center; gap: 10px;">
                <i class="fas fa-user" style="color: #667eea; width: 20px;"></i>
                <strong>Nhân viên:</strong>
                <span style="margin-left: auto; color: #555;">${hoaDon.maNhanVien || "N/A"}</span>
              </div>
            </div>

            <div class="info-row" style="border-top: 2px solid #dee2e6; padding-top: 15px; margin-top: 10px;">
              <div style="display: flex; align-items: center; gap: 10px;">
                <i class="fas fa-money-bill-wave" style="color: #28a745; width: 20px;"></i>
                <strong style="font-size: 18px;">Tổng tiền:</strong>
                <span style="margin-left: auto; color: #28a745; font-size: 20px; font-weight: bold;">${formatCurrency(hoaDon.tongTien)}</span>
              </div>
            </div>

          </div>
        </div>

        <div style="margin-top: 20px; text-align: center;">
          <button class="btn btn-primary" onclick="closeModal()">Đóng</button>
        </div>
      </div>
    `;

    openModal();
  } catch (error) {
    console.error("Lỗi:", error);
    showNotification("Không thể tải thông tin hóa đơn", "error");
  }
}

/**
 * Xác nhận thanh toán hóa đơn
 * @param {string} maHoaDon - Mã hóa đơn
 */
async function confirmThanhToan(maHoaDon) {
  if (!confirm("Xác nhận thanh toán hóa đơn này?")) return;

  try {
    const response = await fetch(`${API_URL}/hoadon/thanhtoan`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ maHoaDon: maHoaDon }),
    });

    const result = await response.json().catch(() => false);
    if (response.ok && result === true) {
      showNotification("Thanh toán hóa đơn thành công", "success");
      loadHoaDonData();
    } else {
      showNotification("Thanh toán hóa đơn thất bại", "error");
    }
  } catch (error) {
    console.error("Lỗi:", error);
    showNotification("Có lỗi xảy ra", "error");
  }
}

/**
 * Xác nhận hủy hóa đơn
 * @param {string} maHoaDon - Mã hóa đơn
 */
async function confirmHuyHoaDon(maHoaDon) {
  if (!confirm("Bạn có chắc muốn hủy hóa đơn này?")) return;

  try {
    const response = await fetch(`${API_URL}/hoadon/huy`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ maHoaDon: maHoaDon }),
    });

    const result = await response.json().catch(() => false);
    if (response.ok && result === true) {
      showNotification("Đã hủy hóa đơn", "success");
      loadHoaDonData();
    } else {
      showNotification("Hủy hóa đơn thất bại", "error");
    }
  } catch (error) {
    console.error("Lỗi:", error);
    showNotification("Có lỗi xảy ra", "error");
  }
}
