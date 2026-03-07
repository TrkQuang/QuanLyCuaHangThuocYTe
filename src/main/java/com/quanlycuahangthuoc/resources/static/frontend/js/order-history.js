var API_URL = "http://localhost:8080/api";

// Load lịch sử đơn hàng
async function loadOrders() {

  const container = document.getElementById("ordersList");
  container.innerHTML = "Đang tải đơn hàng...";

  try {

    const res = await fetch(API_URL + "/hoadon");
    const orders = await res.json();

    console.log("Orders:", orders);

    if (!orders || orders.length === 0) {
      container.innerHTML = "Bạn chưa có đơn hàng nào";
      return;
    }

    let html = "";

    orders.forEach(order => {

      let status = "Đang xử lý";
      if (order.trangThai == 1) status = "Đã thanh toán";
      if (order.trangThai == 2) status = "Đã hủy";

      html += `
      <div class="order-card">

        <p><b>Mã đơn:</b> ${order.maHoaDon}</p>

        <p><b>Ngày:</b>
        ${order.ngayLap ? new Date(order.ngayLap).toLocaleDateString() : ""}
        </p>

        <p><b>Tổng tiền:</b>
        ${order.tongTien ? Number(order.tongTien).toLocaleString() : 0} đ
        </p>

        <p><b>Trạng thái:</b> ${status}</p>

        <button onclick="xemChiTiet('${order.maHoaDon}')">
        Xem chi tiết
        </button>

        ${
          order.trangThai == 0
            ? `<button onclick="huyDon('${order.maHoaDon}')">
                Hủy đơn
              </button>`
            : ""
        }

      </div>
      `;
    });

    container.innerHTML = html;

  } catch (error) {

    console.error(error);
    container.innerHTML = "Không thể tải đơn hàng";

  }
}


// Xem chi tiết hóa đơn
async function xemChiTiet(maHoaDon) {

  try {

    const res = await fetch(API_URL + "/cthoadon/" + maHoaDon);
    const data = await res.json();

    if (!data || data.length === 0) {
      alert("Không có chi tiết đơn hàng");
      return;
    }

    let text = "Chi tiết đơn hàng:\n\n";

    data.forEach(item => {

      text += `
Mã thuốc: ${item.maThuoc}
Số lượng: ${item.soLuong}
Đơn giá: ${item.donGia}
Thành tiền: ${item.thanhTien}

`;

    });

    alert(text);

  } catch (error) {

    console.error(error);
    alert("Không thể tải chi tiết đơn hàng");

  }
}


// Hủy đơn hàng (PUT API)
async function huyDon(maHoaDon) {

  const confirmCancel = confirm("Bạn có chắc muốn hủy đơn hàng?");
  if (!confirmCancel) return;

  try {

    const res = await fetch(API_URL + "/hoadon/huy", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        maHoaDon: maHoaDon
      })
    });

    const result = await res.json();

    if (result) {
      alert("Đã hủy đơn hàng");
      loadOrders();
    } else {
      alert("Hủy thất bại");
    }

  } catch (error) {

    console.error(error);
    alert("Không thể hủy đơn hàng");

  }

}

window.onload = loadOrders;