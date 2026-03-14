document.addEventListener("DOMContentLoaded", loadOrderHistory);

function getStatusClass(status) {
  if (!status) return "status-pending";
  if (status.toUpperCase().includes("HUY")) return "status-cancelled";
  if (status.toUpperCase().includes("THANH")) return "status-completed";
  return "status-pending";
}

async function loadOrderHistory() {
  const orderContainer = document.getElementById("ordersList");
  if (!orderContainer) return;

  const currentUser = getCurrentUser();
  if (!currentUser?.maKhachHang) {
    orderContainer.innerHTML =
      '<div class="empty-state"><h3>Vui lòng đăng nhập bằng tài khoản khách hàng</h3></div>';
    return;
  }

  orderContainer.innerHTML = "<p>Đang tải đơn hàng...</p>";

  try {
    const allOrders = await apiFetch("/hoadon");
    const orders = allOrders
      .filter((o) => o.maKhachHang === currentUser.maKhachHang)
      .sort((a, b) => new Date(b.ngayTao) - new Date(a.ngayTao));

    if (!orders.length) {
      orderContainer.innerHTML =
        '<div class="empty-state"><h3>Chưa có đơn hàng</h3></div>';
      return;
    }

    orderContainer.innerHTML = orders
      .map((order) => {
        const status = order.trangThai || "CHO_XAC_NHAN";
        return `
          <div class="order-item">
            <div class="order-header">
              <div class="order-id">🧾 ${escapeHtml(order.maHoaDon)}</div>
              <div class="order-status ${getStatusClass(status)}">${escapeHtml(status)}</div>
            </div>
            <div class="order-details">
              <div class="detail-item">
                <div class="detail-label">Ngày tạo</div>
                <div class="detail-value">${formatDate(order.ngayTao)}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Nhân viên</div>
                <div class="detail-value">${escapeHtml(order.maNhanVien || "-")}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Tổng tiền</div>
                <div class="detail-value">${formatCurrency(order.tongTien)}</div>
              </div>
            </div>
          </div>
        `;
      })
      .join("");
  } catch (error) {
    orderContainer.innerHTML = `<div class="empty-state"><h3>Lỗi tải dữ liệu</h3><p>${escapeHtml(error.message)}</p></div>`;
  }
}
