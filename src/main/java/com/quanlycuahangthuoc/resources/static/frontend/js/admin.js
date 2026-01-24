// ====================
// CẤU HÌNH VÀ KHỞI TẠO
// ====================

const API_URL = "http://localhost:8080/api";
let currentUser = null;

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

  // Kiểm tra quyền Admin
  if (currentUser.loaiTaiKhoan !== "Admin") {
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
    // Gọi API song song để lấy dữ liệu
    const [nhanvienRes, khachhangRes, thuocRes, hoadonRes] = await Promise.all([
      fetch(`${API_URL}/nhanvien`),
      fetch(`${API_URL}/khachhang`),
      fetch(`${API_URL}/thuoc`),
      fetch(`${API_URL}/hoadon`),
    ]);

    const nhanvien = await nhanvienRes.json();
    const khachhang = await khachhangRes.json();
    const thuoc = await thuocRes.json();
    const hoadon = await hoadonRes.json();

    // Cập nhật số liệu thống kê
    document.getElementById("totalNhanVien").textContent = nhanvien.length;
    document.getElementById("totalKhachHang").textContent = khachhang.length;
    document.getElementById("totalThuoc").textContent = thuoc.length;
    document.getElementById("totalHoaDon").textContent = hoadon.length;

    // Tính doanh thu hôm nay
    calculateTodayRevenue(hoadon);

    // Hiển thị hoạt động gần đây
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
    const hdDate = hd.ngayLap ? hd.ngayLap.split("T")[0] : "";
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
    .sort((a, b) => new Date(b.ngayLap) - new Date(a.ngayLap))
    .slice(0, 5);

  if (recentOrders.length === 0) {
    activityDiv.innerHTML = "<p>Chưa có hoạt động nào</p>";
    return;
  }

  let html = "";
  recentOrders.forEach((hd) => {
    const time = formatDateTime(hd.ngayLap);
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
      '<tr><td colspan="8" class="text-center">Chưa có nhân viên nào</td></tr>';
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
                <td>${nv.gioiTinh || "N/A"}</td>
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
                <label>Giới tính *</label>
                <select name="gioiTinh" required>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                </select>
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
    const nhanvien = data.find(nv => nv.maNhanVien === maNV);

    if (!nhanvien) {
      showNotification("Không tìm thấy thông tin nhân viên", "error");
      return;
    }

    const hoTen = `${nhanvien.ho || ''} ${nhanvien.ten || ''}`.trim();
    
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
                <i class="fas fa-venus-mars" style="color: #667eea; width: 20px;"></i>
                <strong>Giới tính:</strong>
              </div>
              <div style="padding-left: 30px; color: #555;">${nhanvien.gioiTinh || 'Chưa cập nhật'}</div>
            </div>

            <div class="info-row">
              <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 5px;">
                <i class="fas fa-phone" style="color: #667eea; width: 20px;"></i>
                <strong>Số điện thoại:</strong>
              </div>
              <div style="padding-left: 30px; color: #555;">${nhanvien.sdt || nhanvien.SDT || 'Chưa cập nhật'}</div>
            </div>

            <div class="info-row">
              <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 5px;">
                <i class="fas fa-envelope" style="color: #667eea; width: 20px;"></i>
                <strong>Email:</strong>
              </div>
              <div style="padding-left: 30px; color: #555;">${nhanvien.email || 'Chưa cập nhật'}</div>
            </div>

            <div class="info-row">
              <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 5px;">
                <i class="fas fa-map-marker-alt" style="color: #667eea; width: 20px;"></i>
                <strong>Địa chỉ:</strong>
              </div>
              <div style="padding-left: 30px; color: #555;">${nhanvien.diaChi || 'Chưa cập nhật'}</div>
            </div>

            <div class="info-row">
              <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 5px;">
                <i class="fas fa-id-badge" style="color: #667eea; width: 20px;"></i>
                <strong>Mã tài khoản:</strong>
              </div>
              <div style="padding-left: 30px; color: #555;">${nhanvien.maTaiKhoan || 'Chưa cập nhật'}</div>
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
      '<tr><td colspan="7" class="text-center">Chưa có khách hàng nào</td></tr>';
    return;
  }

  let html = "";
  data.forEach((kh) => {
    html += `
            <tr>
                <td>${kh.maKhachHang}</td>
                <td>${kh.hoTen}</td>
                <td>${kh.gioiTinh}</td>
                <td>${kh.soDienThoai}</td>
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
            <div class="form-group">
                <label>Họ tên *</label>
                <input type="text" name="hoTen" required>
            </div>
            <div class="form-group">
                <label>Giới tính *</label>
                <select name="gioiTinh" required>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                </select>
            </div>
            <div class="form-group">
                <label>Số điện thoại *</label>
                <input type="tel" name="soDienThoai" required>
            </div>
            <div class="form-group">
                <label>Email</label>
                <input type="email" name="email">
            </div>
            <div class="form-group">
                <label>Địa chỉ</label>
                <input type="text" name="diaChi">
            </div>
            <div class="form-actions">
                <button type="button" class="btn btn-cancel" onclick="closeModal()">Hủy</button>
                <button type="submit" class="btn btn-primary">Thêm</button>
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
    const response = await fetch(`${API_URL}/khachhang`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      showNotification("Thêm khách hàng thành công", "success");
      closeModal();
      loadKhachHangData();
    } else {
      showNotification("Thêm khách hàng thất bại", "error");
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
    html += `
            <tr>
                <td>${thuoc.maThuoc}</td>
                <td>${thuoc.tenThuoc}</td>
                <td>${thuoc.loaiThuoc || ""}</td>
                <td>${thuoc.donVi || ""}</td>
                <td>${formatCurrency(thuoc.giaBan)}</td>
                <td>${thuoc.soLuong}</td>
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
                    <button class="btn btn-delete" onclick="deletePhieuNhap('${pn.maPhieuNhap}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
  });

  tbody.innerHTML = html;
}

/**
 * Hiển thị modal thêm phiếu nhập
 */
function showAddPhieuNhapModal() {
  showNotification("Chức năng đang được phát triển", "info");
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
    html += `
            <tr>
                <td>${tk.maTaiKhoan}</td>
                <td>${tk.tenDangNhap}</td>
                <td>${tk.email || ""}</td>
                <td><span class="badge badge-${tk.loaiTaiKhoan === "Admin" ? "danger" : "success"}">${tk.loaiTaiKhoan}</span></td>
                <td>
                    <button class="btn btn-delete" onclick="deleteTaiKhoan('${tk.maTaiKhoan}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
  });

  tbody.innerHTML = html;
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
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
  }
}

// Placeholder functions (các hàm edit và view sẽ implement sau)
function editNhanVien(id) {
  showNotification("Chức năng đang phát triển", "info");
}
function editKhachHang(id) {
  showNotification("Chức năng đang phát triển", "info");
}
function viewThuoc(id) {
  showNotification("Chức năng đang phát triển", "info");
}
function editThuoc(id) {
  showNotification("Chức năng đang phát triển", "info");
}
function viewPhieuNhap(id) {
  showNotification("Chức năng đang phát triển", "info");
}
function viewHoaDon(id) {
  showNotification("Chức năng đang phát triển", "info");
}
