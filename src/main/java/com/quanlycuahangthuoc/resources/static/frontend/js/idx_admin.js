// URL cơ sở của API
const API_BASE_URL = "/api";

// Trạng thái hiện tại
let currentAdmin = null;

// Khởi tạo ứng dụng khi tải trang
window.addEventListener("load", function () {
  initializeApp();
});

// Khởi tạo ứng dụng
async function initializeApp() {
  // Kiểm tra xác thực
  currentAdmin =
    JSON.parse(localStorage.getItem("currentAdmin")) ||
    JSON.parse(sessionStorage.getItem("currentAdmin"));

  if (!currentAdmin || currentAdmin.vaiTro !== "admin") {
    // Chuyển hướng về trang đăng nhập nếu chưa xác thực
    window.location.href = "login.html";
    return;
  }

  document.getElementById("adminName").textContent =
    currentAdmin.hoTen || "Quản Trị Viên";

  // Tải dữ liệu dashboard
  await loadDashboardData();
}

// ============= ĐIỀU HƯỚNG =============
function showSection(sectionId) {
  // Ẩn tất cả các phần
  document.querySelectorAll(".content-section").forEach((section) => {
    section.classList.remove("active");
  });

  // Xóa class active khỏi tất cả menu
  document.querySelectorAll(".menu-item").forEach((item) => {
    item.classList.remove("active");
  });

  // Hiển thị phần được chọn
  document.getElementById(sectionId).classList.add("active");

  // Thêm class active vào menu được click
  event.target.closest(".menu-item").classList.add("active");

  // Tải dữ liệu của phần
  switch (sectionId) {
    case "dashboard":
      loadDashboardData();
      break;
    case "employees":
      loadEmployees();
      break;
    case "products":
      loadProducts();
      break;
    case "customers":
      loadCustomers();
      break;
    case "suppliers":
      loadSuppliers();
      break;
    case "imports":
      loadImports();
      break;
    case "orders":
      loadOrders();
      break;
    case "schedule":
      loadSchedule();
      break;
    case "accounts":
      loadAccounts();
      break;
    case "statistics":
      loadStatistics();
      break;
  }
}

// ============= BẢNG ĐIỀU KHIỂN =============
async function loadDashboardData() {
  try {
    // Tải dữ liệu cơ bản từ các endpoint
    const [employees, products, customers, orders, suppliers] =
      await Promise.all([
        fetchAPI("/nhanvien").catch(() => []),
        fetchAPI("/thuoc").catch(() => []),
        fetchAPI("/khachhang").catch(() => []),
        fetchAPI("/hoadon").catch(() => []),
        fetchAPI("/nhacungcap").catch(() => []),
      ]);

    // Cập nhật các thẻ thống kê
    document.getElementById("totalEmployees").textContent =
      employees?.length || 0;
    document.getElementById("totalProducts").textContent =
      products?.length || 0;
    document.getElementById("totalCustomers").textContent =
      customers?.length || 0;
    document.getElementById("totalOrders").textContent = orders?.length || 0;
    document.getElementById("totalSuppliers").textContent =
      suppliers?.length || 0;

    // Tính tổng doanh thu
    const totalRevenue =
      orders?.reduce((sum, order) => sum + (order.tongTien || 0), 0) || 0;
    document.getElementById("totalRevenue").textContent =
      formatCurrency(totalRevenue);

    // Hiển thị hoạt động gần đây
    loadRecentActivity();
  } catch (error) {
    console.error("Lỗi tải dashboard:", error);
  }
}

async function loadRecentActivity() {
  const activityDiv = document.getElementById("recentActivity");
  activityDiv.innerHTML = `
    <div class="activity-item">
      <div class="activity-icon">👥</div>
      <div class="activity-info">
        <h4>Hệ thống đang hoạt động</h4>
        <p>Tất cả chức năng đã sẵn sàng</p>
      </div>
    </div>
  `;
}

// ============= QUẢN LÝ NHÂN VIÊN =============
async function loadEmployees() {
  try {
    const employees = await fetchAPI("/nhanvien");
    const tbody = document.getElementById("employeeTableBody");
    tbody.innerHTML = "";

    if (employees && employees.length > 0) {
      employees.forEach((emp) => {
        const row = `
          <tr>
            <td>${emp.maNhanVien}</td>
            <td>${emp.tenNhanVien}</td>
            <td>${emp.soDienThoai || "N/A"}</td>
            <td>${emp.email || "N/A"}</td>
            <td>${emp.chucVu || "Nhân viên"}</td>
            <td>${formatCurrency(emp.luong || 0)}</td>
            <td><span class="status-badge success">Đang làm</span></td>
            <td>
              <button class="btn-warning" onclick="editEmployee('${emp.maNhanVien}')">✏️ Sửa</button>
              <button class="btn-danger" onclick="deleteEmployee('${emp.maNhanVien}')">🗑️ Xóa</button>
            </td>
          </tr>
        `;
        tbody.innerHTML += row;
      });
    } else {
      tbody.innerHTML =
        '<tr><td colspan="8" class="loading">Chưa có nhân viên nào</td></tr>';
    }
  } catch (error) {
    console.error("Lỗi tải nhân viên:", error);
  }
}

async function addEmployee(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const employeeData = {
    tenNhanVien: formData.get("hoTen"),
    soDienThoai: formData.get("soDienThoai"),
    email: formData.get("email"),
    chucVu: formData.get("chucVu"),
    luong: parseFloat(formData.get("luong")),
  };

  try {
    await fetchAPI("/nhanvien", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(employeeData),
    });

    alert("Thêm nhân viên thành công!");
    closeModal("addEmployeeModal");
    event.target.reset();
    await loadEmployees();
  } catch (error) {
    alert("Không thể thêm nhân viên!");
  }
}

async function deleteEmployee(id) {
  if (!confirm("Bạn có chắc muốn xóa nhân viên này?")) return;

  try {
    await fetchAPI(`/nhanvien/${id}`, { method: "DELETE" });
    alert("Đã xóa nhân viên!");
    await loadEmployees();
  } catch (error) {
    alert("Không thể xóa nhân viên!");
  }
}

// ============= QUẢN LÝ THUỐC =============
async function loadProducts() {
  try {
    const products = await fetchAPI("/thuoc");
    const tbody = document.getElementById("productTableBody");
    tbody.innerHTML = "";

    if (products && products.length > 0) {
      products.forEach((product) => {
        const status =
          product.soLuongTon > 20
            ? '<span class="status-badge success">Còn Hàng</span>'
            : product.soLuongTon > 0
              ? '<span class="status-badge warning">Sắp Hết</span>'
              : '<span class="status-badge danger">Hết Hàng</span>';

        const row = `
          <tr>
            <td>${product.maThuoc}</td>
            <td>${product.tenThuoc}</td>
            <td>${product.donViTinh || "N/A"}</td>
            <td>${formatCurrency(product.giaBan)}</td>
            <td>${product.soLuongTon}</td>
            <td>${formatDate(product.hsd)}</td>
            <td>${status}</td>
            <td>
              <button class="btn-warning" onclick="editProduct('${product.maThuoc}')">✏️</button>
              <button class="btn-danger" onclick="deleteProduct('${product.maThuoc}')">🗑️</button>
            </td>
          </tr>
        `;
        tbody.innerHTML += row;
      });
    } else {
      tbody.innerHTML =
        '<tr><td colspan="8" class="loading">Chưa có sản phẩm nào</td></tr>';
    }
  } catch (error) {
    console.error("Lỗi tải sản phẩm:", error);
  }
}

// ============= QUẢN LÝ KHÁCH HÀNG =============
async function loadCustomers() {
  try {
    const customers = await fetchAPI("/khachhang");
    const tbody = document.getElementById("customerTableBody");
    tbody.innerHTML = "";

    if (customers && customers.length > 0) {
      customers.forEach((customer) => {
        const row = `
          <tr>
            <td>${customer.maKhachHang}</td>
            <td>${customer.tenKhachHang}</td>
            <td>${customer.soDienThoai || "N/A"}</td>
            <td>${customer.email || "N/A"}</td>
            <td>${customer.diaChi || "N/A"}</td>
            <td>${customer.diemTichLuy || 0}</td>
            <td>
              <button class="btn-warning" onclick="editCustomer('${customer.maKhachHang}')">✏️</button>
              <button class="btn-danger" onclick="deleteCustomer('${customer.maKhachHang}')">🗑️</button>
            </td>
          </tr>
        `;
        tbody.innerHTML += row;
      });
    } else {
      tbody.innerHTML =
        '<tr><td colspan="7" class="loading">Chưa có khách hàng nào</td></tr>';
    }
  } catch (error) {
    console.error("Lỗi tải khách hàng:", error);
  }
}

// ============= QUẢN LÝ NHÀ CUNG CẤP =============
async function loadSuppliers() {
  try {
    const suppliers = await fetchAPI("/nhacungcap");
    const tbody = document.getElementById("supplierTableBody");
    tbody.innerHTML = "";

    if (suppliers && suppliers.length > 0) {
      suppliers.forEach((supplier) => {
        const row = `
          <tr>
            <td>${supplier.maNhaCungCap}</td>
            <td>${supplier.tenNhaCungCap}</td>
            <td>${supplier.soDienThoai || "N/A"}</td>
            <td>${supplier.email || "N/A"}</td>
            <td>${supplier.diaChi || "N/A"}</td>
            <td>
              <button class="btn-warning" onclick="editSupplier('${supplier.maNhaCungCap}')">✏️</button>
              <button class="btn-danger" onclick="deleteSupplier('${supplier.maNhaCungCap}')">🗑️</button>
            </td>
          </tr>
        `;
        tbody.innerHTML += row;
      });
    } else {
      tbody.innerHTML =
        '<tr><td colspan="6" class="loading">Chưa có nhà cung cấp nào</td></tr>';
    }
  } catch (error) {
    console.error("Lỗi tải nhà cung cấp:", error);
  }
}

// ============= QUẢN LÝ PHIẾU NHẬP =============
async function loadImports() {
  try {
    const imports = await fetchAPI("/phieunhap");
    const tbody = document.getElementById("importTableBody");
    tbody.innerHTML = "";

    if (imports && imports.length > 0) {
      imports.forEach((imp) => {
        const row = `
          <tr>
            <td>PN${String(imp.maPhieuNhap).padStart(3, "0")}</td>
            <td>${imp.tenNhaCungCap || "N/A"}</td>
            <td>${imp.tenNhanVien || "N/A"}</td>
            <td>${formatDate(imp.ngayNhap)}</td>
            <td>${formatCurrency(imp.tongTien)}</td>
            <td>
              <button class="btn-info" onclick="viewImport('${imp.maPhieuNhap}')">👁️ Xem</button>
            </td>
          </tr>
        `;
        tbody.innerHTML += row;
      });
    } else {
      tbody.innerHTML =
        '<tr><td colspan="6" class="loading">Chưa có phiếu nhập nào</td></tr>';
    }
  } catch (error) {
    console.error("Lỗi tải phiếu nhập:", error);
  }
}

// ============= QUẢN LÝ HÓA ĐƠN =============
async function loadOrders() {
  try {
    const orders = await fetchAPI("/hoadon");
    const tbody = document.getElementById("orderTableBody");
    tbody.innerHTML = "";

    if (orders && orders.length > 0) {
      orders.forEach((order) => {
        const row = `
          <tr>
            <td>HD${String(order.maHoaDon).padStart(3, "0")}</td>
            <td>${order.tenKhachHang || "N/A"}</td>
            <td>${order.tenNhanVien || "N/A"}</td>
            <td>${formatDate(order.ngayLap)}</td>
            <td>${formatCurrency(order.tongTien)}</td>
            <td><span class="status-badge success">Hoàn Thành</span></td>
            <td>
              <button class="btn-info" onclick="viewOrder('${order.maHoaDon}')">👁️ Xem</button>
            </td>
          </tr>
        `;
        tbody.innerHTML += row;
      });
    } else {
      tbody.innerHTML =
        '<tr><td colspan="7" class="loading">Chưa có hóa đơn nào</td></tr>';
    }
  } catch (error) {
    console.error("Lỗi tải hóa đơn:", error);
  }
}

// ============= QUẢN LÝ LỊCH LÀM VIỆC =============
async function loadSchedule() {
  try {
    const schedule = await fetchAPI("/lichlam");
    const tbody = document.getElementById("scheduleTableBody");
    tbody.innerHTML = "";

    if (schedule && schedule.length > 0) {
      schedule.forEach((shift) => {
        const status =
          new Date(shift.ngayLam) < new Date()
            ? '<span class="status-badge success">Hoàn Thành</span>'
            : '<span class="status-badge warning">Sắp Tới</span>';

        const row = `
          <tr>
            <td>${shift.maLich}</td>
            <td>${shift.tenNhanVien || "N/A"}</td>
            <td>${formatDate(shift.ngayLam)}</td>
            <td>${shift.gioBatDau}</td>
            <td>${shift.gioKetThuc}</td>
            <td>${status}</td>
            <td>
              <button class="btn-warning" onclick="editSchedule('${shift.maLich}')">✏️</button>
              <button class="btn-danger" onclick="deleteSchedule('${shift.maLich}')">🗑️</button>
            </td>
          </tr>
        `;
        tbody.innerHTML += row;
      });
    } else {
      tbody.innerHTML =
        '<tr><td colspan="7" class="loading">Chưa có lịch làm việc</td></tr>';
    }
  } catch (error) {
    console.error("Lỗi tải lịch làm việc:", error);
  }
}

// ============= QUẢN LÝ TÀI KHOẢN =============
async function loadAccounts() {
  try {
    const accounts = await fetchAPI("/taikhoan");
    const tbody = document.getElementById("accountTableBody");
    tbody.innerHTML = "";

    if (accounts && accounts.length > 0) {
      accounts.forEach((account) => {
        const row = `
          <tr>
            <td>${account.maTK}</td>
            <td>${account.tenDangNhap}</td>
            <td><span class="status-badge ${account.vaiTro === "admin" ? "danger" : "info"}">${account.vaiTro}</span></td>
            <td><span class="status-badge success">Hoạt động</span></td>
            <td>
              <button class="btn-warning" onclick="editAccount('${account.maTK}')">✏️</button>
              <button class="btn-danger" onclick="deleteAccount('${account.maTK}')">🗑️</button>
            </td>
          </tr>
        `;
        tbody.innerHTML += row;
      });
    } else {
      tbody.innerHTML =
        '<tr><td colspan="5" class="loading">Chưa có tài khoản nào</td></tr>';
    }
  } catch (error) {
    console.error("Lỗi tải tài khoản:", error);
  }
}

// ============= THỐNG KÊ =============
async function loadStatistics() {
  try {
    const orders = await fetchAPI("/hoadon");
    const customers = await fetchAPI("/khachhang");

    const totalRevenue =
      orders?.reduce((sum, order) => sum + (order.tongTien || 0), 0) || 0;
    document.getElementById("statRevenue").textContent =
      formatCurrency(totalRevenue);
    document.getElementById("statOrders").textContent = orders?.length || 0;
    document.getElementById("statNewCustomers").textContent =
      customers?.length || 0;
    document.getElementById("statProductsSold").textContent = "0";
  } catch (error) {
    console.error("Lỗi tải thống kê:", error);
  }
}

// ============= HÀM XỬ LÝ MODAL =============
function openModal(modalId) {
  document.getElementById(modalId).classList.add("active");
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove("active");
}

window.onclick = function (event) {
  if (event.target.classList.contains("modal")) {
    event.target.classList.remove("active");
  }
};

// ============= HÀM TIỆN ÍCH =============
async function fetchAPI(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

function formatDate(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN");
}

function logout() {
  if (confirm("Bạn có chắc muốn đăng xuất?")) {
    localStorage.removeItem("currentAdmin");
    sessionStorage.removeItem("currentAdmin");
    window.location.href = "login.html";
  }
}

// ============= TÌM KIẾM =============
document.addEventListener("DOMContentLoaded", function () {
  const searchEmployee = document.getElementById("searchEmployee");
  if (searchEmployee) {
    searchEmployee.addEventListener("input", function (e) {
      // Thêm logic tìm kiếm
    });
  }

  const searchProduct = document.getElementById("searchProduct");
  if (searchProduct) {
    searchProduct.addEventListener("input", function (e) {
      // Thêm logic tìm kiếm
    });
  }

  const searchCustomer = document.getElementById("searchCustomer");
  if (searchCustomer) {
    searchCustomer.addEventListener("input", function (e) {
      // Thêm logic tìm kiếm
    });
  }
});

// Placeholder functions cho các chức năng chưa hoàn thiện
function editEmployee(id) {
  alert("Chức năng đang phát triển");
}
function editProduct(id) {
  alert("Chức năng đang phát triển");
}
function deleteProduct(id) {
  if (confirm("Xóa?")) alert("Đã xóa");
}
function editCustomer(id) {
  alert("Chức năng đang phát triển");
}
function deleteCustomer(id) {
  if (confirm("Xóa?")) alert("Đã xóa");
}
function editSupplier(id) {
  alert("Chức năng đang phát triển");
}
function deleteSupplier(id) {
  if (confirm("Xóa?")) alert("Đã xóa");
}
function viewImport(id) {
  alert("Xem chi tiết phiếu nhập " + id);
}
function viewOrder(id) {
  alert("Xem chi tiết hóa đơn " + id);
}
function editSchedule(id) {
  alert("Chức năng đang phát triển");
}
function deleteSchedule(id) {
  if (confirm("Xóa?")) alert("Đã xóa");
}
function editAccount(id) {
  alert("Chức năng đang phát triển");
}
function deleteAccount(id) {
  if (confirm("Xóa?")) alert("Đã xóa");
}
