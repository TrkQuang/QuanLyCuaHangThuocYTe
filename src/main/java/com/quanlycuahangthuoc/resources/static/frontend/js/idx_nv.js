// URL cơ sở của API
const API_BASE_URL = "/api";

// Trạng thái hiện tại
let currentPage = 1;
let pageSize = 10;
let currentUser = null;

// Khởi tạo ứng dụng khi tải trang
window.addEventListener("load", function () {
  initializeApp();
});

// Khởi tạo ứng dụng
async function initializeApp() {
  // Kiểm tra xác thực
  currentUser =
    JSON.parse(localStorage.getItem("currentUser")) ||
    JSON.parse(sessionStorage.getItem("currentUser"));

  if (!currentUser || !currentUser.maTK) {
    // Chuyển hướng về trang đăng nhập nếu chưa xác thực
    window.location.href = "login.html";
    return;
  }

  document.getElementById("userName").textContent =
    currentUser.tenNhanVien || currentUser.tenDangNhap;

  // Tải dữ liệu bảng điều khiển
  await loadDashboardData();

  // Tải danh sách sản phẩm
  await loadProducts();

  // Tải danh sách khách hàng
  await loadCustomers();

  // Tải danh sách phiếu nhập
  await loadImports();

  // Tải lịch làm việc
  await loadSchedule();
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
    case "products":
      loadProducts();
      break;
    case "customers":
      loadCustomers();
      break;
    case "import":
      loadImports();
      break;
    case "statistics":
      loadStatistics();
      break;
    case "schedule":
      loadSchedule();
      break;
  }
}

// ============= BẢNG ĐIỀU KHIỂN =============
async function loadDashboardData() {
  try {
    showLoading();

    // Tải dữ liệu cơ bản từ các endpoint
    const [products, orders, customers] = await Promise.all([
      fetchAPI("/thuoc"),
      fetchAPI("/hoadon"),
      fetchAPI("/khachhang"),
    ]);

    // Cập nhật các thẻ thống kê
    document.getElementById("totalProducts").textContent =
      products?.length || 0;
    document.getElementById("todaySales").textContent = orders?.length || 0;
    document.getElementById("totalCustomers").textContent =
      customers?.length || 0;

    // Tính số lượng sản phẩm sắp hết hàng
    const lowStockCount =
      products?.filter((p) => p.soLuongTon < 20)?.length || 0;
    document.getElementById("lowStock").textContent = lowStockCount;

    // Tải đơn hàng gần đây
    await loadRecentOrders();

    hideLoading();
  } catch (error) {
    console.error("Error loading dashboard:", error);
    showAlert("Không thể tải dữ liệu dashboard", "error");
    hideLoading();
  }
}

async function loadRecentOrders() {
  try {
    const allOrders = await fetchAPI("/hoadon");
    const orders = allOrders?.slice(0, 5) || [];

    const tbody = document.querySelector("#dashboard table tbody");
    tbody.innerHTML = "";

    if (orders && orders.length > 0) {
      orders.forEach((order) => {
        const row = `
                    <tr>
                        <td>#HD${String(order.maHoaDon).padStart(3, "0")}</td>
                        <td>${order.tenKhachHang || "N/A"}</td>
                        <td>${formatDateTime(order.ngayLap)}</td>
                        <td>${formatCurrency(order.tongTien)}</td>
                        <td><span class="status-badge success">Hoàn Thành</span></td>
                    </tr>
                `;
        tbody.innerHTML += row;
      });
    } else {
      tbody.innerHTML =
        '<tr><td colspan="5" style="text-align: center;">Chưa có đơn hàng nào</td></tr>';
    }
  } catch (error) {
    console.error("Error loading recent orders:", error);
  }
}

// ============= SẢN PHẨM =============
async function loadProducts(page = 1, search = "") {
  try {
    showLoading();

    // API không có phân trang, lấy tất cả và lọc ở client
    const allProducts = await fetchAPI("/thuoc");
    let products = allProducts || [];

    // Lọc theo từ khóa tìm kiếm nếu có
    if (search) {
      products = products.filter(
        (p) =>
          p.tenThuoc?.toLowerCase().includes(search.toLowerCase()) ||
          p.maThuoc?.toString().includes(search),
      );
    }

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
                        <td>${product.loaiThuoc || "N/A"}</td>
                        <td>${formatCurrency(product.giaBan)}</td>
                        <td>${product.soLuongTon}</td>
                        <td>${formatDate(product.hanSuDung)}</td>
                        <td>${status}</td>
                        <td>
                            <button class="btn btn-warning btn-small" onclick="editProduct(${product.maThuoc})">✏️ Sửa</button>
                            <button class="btn btn-danger btn-small" onclick="deleteProduct(${product.maThuoc})">🗑️ Xóa</button>
                        </td>
                    </tr>
                `;
        tbody.innerHTML += row;
      });
    } else {
      tbody.innerHTML =
        '<tr><td colspan="8" style="text-align: center;">Không tìm thấy sản phẩm nào</td></tr>';
    }

    currentPage = page;
    hideLoading();
  } catch (error) {
    console.error("Error loading products:", error);
    showAlert("Không thể tải danh sách sản phẩm", "error");
    hideLoading();
  }
}

async function addProduct(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const productData = {
    maThuoc: formData.get("maThuoc"),
    tenThuoc: formData.get("tenThuoc"),
    loaiThuoc: formData.get("loaiThuoc"),
    donViTinh: formData.get("donViTinh"),
    giaNhap: parseFloat(formData.get("giaNhap")),
    giaBan: parseFloat(formData.get("giaBan")),
    soLuongTon: parseInt(formData.get("soLuongTon")),
    hanSuDung: formData.get("hanSuDung"),
    moTa: formData.get("moTa"),
  };

  try {
    showLoading();
    await fetchAPI("/thuoc/them-thuoc", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData),
    });

    showAlert("Thêm thuốc thành công!", "success");
    closeModal("addProductModal");
    event.target.reset();
    await loadProducts();
    hideLoading();
  } catch (error) {
    console.error("Error adding product:", error);
    showAlert("Không thể thêm thuốc. Vui lòng thử lại!", "error");
    hideLoading();
  }
}

async function editProduct(id) {
  try {
    const product = await fetchAPI(`/thuoc/${id}`);

    // Điền dữ liệu vào form
    // Mở modal chỉnh sửa (cần tạo modal này)
    showAlert(`Chức năng sửa thuốc ${id} đang được phát triển`, "info");
  } catch (error) {
    console.error("Error loading product:", error);
    showAlert("Không thể tải thông tin thuốc", "error");
  }
}

async function deleteProduct(id) {
  if (!confirm("Bạn có chắc muốn xóa thuốc này?")) return;

  try {
    showLoading();
    const response = await fetchAPI(`/thuoc/${id}`, { method: "DELETE" });
    showAlert("Đã xóa thuốc thành công!", "success");
    await loadProducts();
    hideLoading();
  } catch (error) {
    console.error("Error deleting product:", error);
    showAlert("Không thể xóa thuốc. Vui lòng thử lại!", "error");
    hideLoading();
  }
}

// ============= PHIẾU NHẬP =============
async function loadImports(page = 1) {
  try {
    showLoading();

    // Lấy tất cả phiếu nhập từ API
    const imports = await fetchAPI("/phieunhap");

    const tbody = document.querySelector("#import table tbody");
    tbody.innerHTML = "";

    if (imports && imports.length > 0) {
      imports.forEach((imp) => {
        const row = `
                    <tr>
                        <td>PN${String(imp.maPhieuNhap).padStart(3, "0")}</td>
                        <td>${imp.tenNhaCungCap || "N/A"}</td>
                        <td>${formatDate(imp.ngayNhap)}</td>
                        <td>${formatCurrency(imp.tongTien)}</td>
                        <td>${imp.tenNhanVien || "N/A"}</td>
                        <td><span class="status-badge success">Hoàn Thành</span></td>
                        <td>
                            <button class="btn btn-primary btn-small" onclick="viewImport(${imp.maPhieuNhap})">👁️ Xem</button>
                        </td>
                    </tr>
                `;
        tbody.innerHTML += row;
      });
    } else {
      tbody.innerHTML =
        '<tr><td colspan="7" style="text-align: center;">Chưa có phiếu nhập nào</td></tr>';
    }

    hideLoading();
  } catch (error) {
    console.error("Error loading imports:", error);
    showAlert("Không thể tải danh sách phiếu nhập", "error");
    hideLoading();
  }
}

async function addImport(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const importData = {
    maNhaCungCap: parseInt(formData.get("maNhaCungCap")),
    maNhanVien: currentUser.maNhanVien,
    ngayNhap: formData.get("ngayNhap"),
    ghiChu: formData.get("ghiChu"),
  };

  try {
    showLoading();
    await fetchAPI("/phieunhap", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(importData),
    });

    showAlert("Tạo phiếu nhập thành công!", "success");
    closeModal("addImportModal");
    event.target.reset();
    await loadImports();
    hideLoading();
  } catch (error) {
    console.error("Error adding import:", error);
    showAlert("Không thể tạo phiếu nhập. Vui lòng thử lại!", "error");
    hideLoading();
  }
}

async function viewImport(id) {
  try {
    const importDetail = await fetchAPI(`/phieunhap/${id}`);
    const details = await fetchAPI(`/ctphieunhap/phieunhap/${id}`);

    showAlert(`Xem chi tiết phiếu nhập ${id} đang được phát triển`, "info");
  } catch (error) {
    console.error("Error loading import:", error);
    showAlert("Không thể tải thông tin phiếu nhập", "error");
  }
}

// ============= KHÁCH HÀNG =============
async function loadCustomers(page = 1, search = "") {
  try {
    showLoading();

    // API không có pagination, lấy tất cả và filter ở client
    const allCustomers = await fetchAPI("/khachhang");
    let customers = allCustomers || [];

    // Filter by search if needed
    if (search) {
      customers = customers.filter(
        (c) =>
          c.tenKhachHang?.toLowerCase().includes(search.toLowerCase()) ||
          c.soDienThoai?.includes(search) ||
          c.maKhachHang?.toString().includes(search),
      );
    }

    const tbody = document.querySelector("#customers table tbody");
    tbody.innerHTML = "";

    if (customers && customers.length > 0) {
      customers.forEach((customer) => {
        const row = `
                    <tr>
                        <td>KH${String(customer.maKhachHang).padStart(3, "0")}</td>
                        <td>${customer.tenKhachHang}</td>
                        <td>${customer.soDienThoai || "N/A"}</td>
                        <td>${customer.email || "N/A"}</td>
                        <td>${customer.diaChi || "N/A"}</td>
                        <td>${customer.diemTichLuy || 0}</td>
                        <td>
                            <button class="btn btn-warning btn-small" onclick="editCustomer(${customer.maKhachHang})">✏️ Sửa</button>
                            <button class="btn btn-primary btn-small" onclick="viewHistory(${customer.maKhachHang})">📋 Lịch Sử</button>
                        </td>
                    </tr>
                `;
        tbody.innerHTML += row;
      });
    } else {
      tbody.innerHTML =
        '<tr><td colspan="7" style="text-align: center;">Không tìm thấy khách hàng nào</td></tr>';
    }

    hideLoading();
  } catch (error) {
    console.error("Error loading customers:", error);
    showAlert("Không thể tải danh sách khách hàng", "error");
    hideLoading();
  }
}

async function addCustomer(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const customerData = {
    tenKhachHang: formData.get("tenKhachHang"),
    soDienThoai: formData.get("soDienThoai"),
    email: formData.get("email"),
    ngaySinh: formData.get("ngaySinh"),
    diaChi: formData.get("diaChi"),
    diemTichLuy: 0,
  };

  try {
    showLoading();
    await fetchAPI("/khachhang", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(customerData),
    });

    showAlert("Thêm khách hàng thành công!", "success");
    closeModal("addCustomerModal");
    event.target.reset();
    await loadCustomers();
    hideLoading();
  } catch (error) {
    console.error("Error adding customer:", error);
    showAlert("Không thể thêm khách hàng. Vui lòng thử lại!", "error");
    hideLoading();
  }
}

async function editCustomer(id) {
  try {
    const customer = await fetchAPI(`/khachhang/${id}`);
    showAlert(`Chức năng sửa khách hàng ${id} đang được phát triển`, "info");
  } catch (error) {
    console.error("Error loading customer:", error);
    showAlert("Không thể tải thông tin khách hàng", "error");
  }
}

async function viewHistory(id) {
  try {
    const history = await fetchAPI(`/hoadon/khachhang/${id}`);
    showAlert(
      `Xem lịch sử mua hàng của khách hàng ${id} đang được phát triển`,
      "info",
    );
  } catch (error) {
    console.error("Error loading history:", error);
    showAlert("Không thể tải lịch sử mua hàng", "error");
  }
}

// ============= THỐNG KÊ =============
async function loadStatistics() {
  try {
    showLoading();

    // Tải thống kê doanh thu
    const stats = await fetchAPI("/hoadon/statistics");

    // Cập nhật hiển thị thống kê
    // Sẽ được triển khai dựa trên cấu trúc API

    hideLoading();
  } catch (error) {
    console.error("Error loading statistics:", error);
    showAlert("Không thể tải thống kê", "error");
    hideLoading();
  }
}

// ============= LỊCH LÀM VIỆC =============
async function loadSchedule() {
  try {
    showLoading();

    // Lấy lịch làm theo nhân viên hiện tại
    const schedule = await fetchAPI(
      `/lichlam/nhanvien/${currentUser.maNhanVien}`,
    );

    const tbody = document.querySelector("#schedule table tbody");
    tbody.innerHTML = "";

    if (schedule && schedule.length > 0) {
      schedule.forEach((shift) => {
        const status =
          new Date(shift.ngayLam) < new Date()
            ? '<span class="status-badge success">Đã Hoàn Thành</span>'
            : new Date(shift.ngayLam).toDateString() ===
                new Date().toDateString()
              ? '<span class="status-badge warning">Đang Làm</span>'
              : '<span class="status-badge warning">Chưa Bắt Đầu</span>';

        const row = `
                    <tr>
                        <td>${formatDate(shift.ngayLam)}</td>
                        <td>${shift.caLam || "N/A"}</td>
                        <td>${shift.gioBatDau || "08:00"}</td>
                        <td>${shift.gioKetThuc || "17:00"}</td>
                        <td>${status}</td>
                    </tr>
                `;
        tbody.innerHTML += row;
      });
    } else {
      tbody.innerHTML =
        '<tr><td colspan="5" style="text-align: center;">Chưa có lịch làm việc</td></tr>';
    }

    hideLoading();
  } catch (error) {
    console.error("Error loading schedule:", error);
    showAlert("Không thể tải lịch làm việc", "error");
    hideLoading();
  }
}

// ============= HÀM XỬ LÝ MODAL =============
function openModal(modalId) {
  document.getElementById(modalId).classList.add("active");
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove("active");
}

// Đóng modal khi click bên ngoài
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

function formatDateTime(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleString("vi-VN");
}

function showLoading() {
  //kiểu nó load chữ đang chạy
  console.log("Đang tải...");
}

function hideLoading() {
  console.log("Tải hoàn tất");
}

function showAlert(message, type = "info") {
  // Alert đơn giản, có thể cải thiện UI sau
  alert(message);
}

function logout() {
  if (confirm("Bạn có chắc muốn đăng xuất?")) {
    localStorage.removeItem("currentUser");
    sessionStorage.removeItem("currentUser");
    window.location.href = "login.html";
  }
}

// ============= CHỨC NĂNG TÌM KIẾM =============
document.addEventListener("DOMContentLoaded", function () {
  // Tìm kiếm sản phẩm
  const searchProduct = document.getElementById("searchProduct");
  if (searchProduct) {
    let searchTimeout;
    searchProduct.addEventListener("input", function (e) {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        loadProducts(1, e.target.value);
      }, 500);
    });
  }

  // Tìm kiếm khách hàng
  const searchCustomer = document.querySelector("#customers .search-input");
  if (searchCustomer) {
    let searchTimeout;
    searchCustomer.addEventListener("input", function (e) {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        loadCustomers(1, e.target.value);
      }, 500);
    });
  }
});
