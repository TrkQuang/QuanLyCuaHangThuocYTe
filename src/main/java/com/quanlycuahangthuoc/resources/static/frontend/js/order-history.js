// ======================================================
// ORDER HISTORY - LỊCH SỬ ĐƠN HÀNG
// ======================================================

document.addEventListener("DOMContentLoaded", loadOrderHistory);

async function loadOrderHistory() {

  const orderContainer = document.getElementById("ordersList");
  if (!orderContainer) return;

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  console.log("Current User:", currentUser);

  // chưa đăng nhập
  if (!currentUser) {
    orderContainer.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🔒</div>
        <h3>Bạn chưa đăng nhập</h3>
        <p>Vui lòng đăng nhập để xem lịch sử đơn hàng</p>
        <a href="login.html" class="btn-primary">Đăng nhập</a>
      </div>
    `;
    return;
  }

  orderContainer.innerHTML = `<p>Đang tải đơn hàng...</p>`;

  try {

    const response = await fetch(API_URL + "/hoadon");

    if (!response.ok) {
      throw new Error("Không lấy được dữ liệu hóa đơn");
    }

    const orders = await response.json();
    console.log("Orders từ API:", orders);

    orderContainer.innerHTML = "";

    if (!orders || orders.length === 0) {
      orderContainer.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">📦</div>
          <h3>Chưa có đơn hàng</h3>
          <p>Bạn chưa thực hiện đơn hàng nào</p>
        </div>
      `;
      return;
    }

    // sắp xếp đơn mới nhất lên trước
    orders.sort((a, b) => new Date(b.ngayTao) - new Date(a.ngayTao));

    orders.forEach(order => {

      let statusClass = "status-pending";

      if (order.trangThai === "Hoàn thành")
        statusClass = "status-completed";

      if (order.trangThai === "Đã hủy")
        statusClass = "status-cancelled";

      const orderHTML = `
        <div class="order-item">

          <div class="order-header">
            <div class="order-id">
              🧾 ${order.maHoaDon}
            </div>

            <div class="order-status ${statusClass}">
              ${order.trangThai || "Đang xử lý"}
            </div>
          </div>

          <div class="order-details">

            <div class="detail-item">
              <div class="detail-label">Ngày tạo</div>
              <div class="detail-value">
                ${order.ngayTao}
              </div>
            </div>

            <div class="detail-item">
              <div class="detail-label">Nhân viên</div>
              <div class="detail-value">
                ${order.maNhanVien || "-"}
              </div>
            </div>

            <div class="detail-item">
              <div class="detail-label">Tổng tiền</div>
              <div class="detail-value">
                ${Number(order.tongTien).toLocaleString()} đ
              </div>
            </div>

          </div>

        </div>
      `;

      orderContainer.innerHTML += orderHTML;

    });

  } catch (error) {

    console.error("Lỗi load đơn hàng:", error);

    orderContainer.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">⚠️</div>
        <h3>Lỗi tải dữ liệu</h3>
        <p>Không thể tải lịch sử đơn hàng</p>
      </div>
    `;

  }

}