const API_URL = "http://localhost:8080/api";

async function loadOrders() {
  const container = document.getElementById("ordersList");
  container.innerHTML = "Đang tải đơn hàng...";

  try {

    const res = await fetch(API_URL + "/hoadon");
    const orders = await res.json();

    const user = JSON.parse(localStorage.getItem("currentUser"));

    let myOrders = orders;

    if (user && user.maKhachHang) {
      myOrders = orders.filter(o => o.maKhachHang === user.maKhachHang);
    }

    if (myOrders.length === 0) {
      container.innerHTML = "Bạn chưa có đơn hàng nào";
      return;
    }

    let html = "";

    myOrders.forEach(order => {

      let status = "Đang xử lý";
      if (order.trangThai == 1) status = "Đã thanh toán";
      if (order.trangThai == 2) status = "Đã hủy";

      html += `
      <div class="order-card">

        <p><b>Mã đơn:</b> ${order.maHoaDon}</p>
        <p><b>Ngày:</b> ${new Date(order.ngayLap).toLocaleDateString()}</p>
        <p><b>Tổng tiền:</b> ${order.tongTien.toLocaleString()} đ</p>
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
    container.innerHTML = "Không thể tải đơn hàng";
    console.error(error);
  }
}

async function xemChiTiet(maHoaDon) {

  const res = await fetch(API_URL + "/cthoadon/" + maHoaDon);
  const data = await res.json();

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
}

async function huyDon(maHoaDon) {

  if (!confirm("Bạn có chắc muốn hủy đơn hàng?")) return;

  const order = {
    maHoaDon: maHoaDon
  };

  const res = await fetch(API_URL + "/hoadon/huy", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(order)
  });

  const result = await res.json();

  if (result) {
    alert("Đã hủy đơn hàng");
    loadOrders();
  } else {
    alert("Hủy thất bại");
  }

}

window.onload = loadOrders;