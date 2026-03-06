const API_URL = "http://localhost:8080/api";

// ================= UTILITIES =================

function getSessionId() {
  let sessionId = localStorage.getItem("sessionId");
  if (!sessionId) {
    sessionId = "session-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9);
    localStorage.setItem("sessionId", sessionId);
  }
  return sessionId;
}

function escapeHtml(unsafe) {
  if (unsafe == null) return "—";
  return unsafe
    .toString()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ================= CART COUNT (header) =================

async function updateCartCount() {
  try {
    // GET /api/cart rồi đếm số item
    const res = await fetch(API_URL + "/cart", {
      headers: { "Session-Id": getSessionId() },
    });
    const items = await res.json();
    const box = document.getElementById("cartCount");
    if (box) box.innerText = Array.isArray(items) ? items.length : 0;
  } catch (e) {
    console.error("Lỗi đếm giỏ hàng:", e);
  }
}

// ================= ORDER HISTORY =================

// trangThai là số theo API: 0 = đang xử lý, 1 = hoàn thành, 2 = đã hủy
const STATUS_MAP = {
  0: { cls: "status-pending",   label: "Đang xử lý" },
  1: { cls: "status-completed", label: "Hoàn thành"  },
  2: { cls: "status-cancelled", label: "Đã hủy"      },
};

async function loadOrders() {
  const container = document.getElementById("ordersList");
  if (!container) return;

  container.innerHTML = "<p>Đang tải lịch sử đơn hàng...</p>";

  try {
    const response = await fetch(API_URL + "/hoadon");
    if (!response.ok) throw new Error("HTTP " + response.status);

    let orders = await response.json();
    console.log("Orders từ API:", orders);

    // Lọc theo khách hàng đang đăng nhập (key "currentUser" — nhất quán toàn dự án)
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
    if (currentUser?.maKhachHang) {
      orders = orders.filter((o) => o.maKhachHang === currentUser.maKhachHang);
    }

    showOrders(orders);
  } catch (error) {
    console.error("Lỗi tải đơn hàng:", error);
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">⚠️</div>
        <h3>Không thể tải đơn hàng</h3>
        <p>Vui lòng kiểm tra kết nối và thử lại.</p>
        <button class="btn-primary" onclick="loadOrders()">🔄 Thử lại</button>
      </div>`;
  }
}

function showOrders(orders) {
  const container = document.getElementById("ordersList");
  if (!container) return;

  if (!orders || orders.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📋</div>
        <h3>Chưa có đơn hàng nào</h3>
        <p>Hãy mua sắm và đặt hàng để xem lịch sử tại đây</p>
        <a href="shop.html" class="btn-primary">🛒 Mua ngay</a>
      </div>`;
    return;
  }

  // Sắp xếp mới nhất lên đầu — field đúng theo API là ngayLap
  orders.sort((a, b) =>
  new Date(b.ngayLap || b.ngayTao) -
  new Date(a.ngayLap || a.ngayTao)
);

  let html = "";
  orders.forEach((order) => {
    const status = STATUS_MAP[order.trangThai] ?? STATUS_MAP[0];
    const ngay = order.ngayLap
      ? new Date(order.ngayLap).toLocaleDateString("vi-VN")
      : "—";

    html += `
      <div class="order-item">
        <div class="order-header">
          <span class="order-id">🧾 Đơn #${escapeHtml(order.maHoaDon)}</span>
          <span class="order-status ${status.cls}">${status.label}</span>
        </div>
        <div class="order-details">
          <div class="detail-item">
            <span class="detail-label">Mã khách hàng</span>
            <span class="detail-value">${escapeHtml(order.maKhachHang)}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Nhân viên xử lý</span>
            <span class="detail-value">${escapeHtml(order.maNhanVien)}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Ngày lập</span>
            <span class="detail-value">${ngay}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Tổng tiền</span>
            <span class="detail-value" style="color:#667eea; font-size:18px;">
              ${Number(order.tongTien ?? 0).toLocaleString("vi-VN")} VNĐ
            </span>
          </div>
        </div>
        <div style="margin-top:16px; text-align:right;">
          <button class="btn-sm" onclick="xemChiTiet('${escapeHtml(order.maHoaDon)}')">
            🔍 Xem chi tiết
          </button>
        </div>
      </div>`;
  });

  container.innerHTML = html;
}

// ================= CHI TIẾT HÓA ĐƠN =================

// GET /api/cthoadon/{maHoaDon}
async function xemChiTiet(maHoaDon) {
  try {
    const res = await fetch(API_URL + "/cthoadon/" + maHoaDon);
    if (!res.ok) throw new Error("HTTP " + res.status);
    hienThiChiTiet(maHoaDon, await res.json());
  } catch (e) {
    alert("Không thể tải chi tiết đơn hàng. Vui lòng thử lại.");
    console.error("Lỗi xem chi tiết:", e);
  }
}

function hienThiChiTiet(maHoaDon, chiTiet) {
  const old = document.getElementById("orderDetailModal");
  if (old) old.remove();

  let rows = "";
  let tongTien = 0;

  chiTiet.forEach((item) => {
    tongTien += item.thanhTien ?? 0;
    rows += `
      <tr>
        <td style="padding:12px 8px;">${escapeHtml(item.maThuoc)}</td>
        <td style="padding:12px 8px; text-align:center;">${item.soLuong ?? 0}</td>
        <td style="padding:12px 8px; text-align:right;">${Number(item.donGia ?? 0).toLocaleString("vi-VN")} đ</td>
        <td style="padding:12px 8px; text-align:right; font-weight:700; color:#667eea;">
          ${Number(item.thanhTien ?? 0).toLocaleString("vi-VN")} đ
        </td>
      </tr>`;
  });

  const modal = document.createElement("div");
  modal.id = "orderDetailModal";
  modal.style.cssText = `
    position:fixed; top:0; left:0; width:100%; height:100%;
    background:rgba(0,0,0,0.5); z-index:9999;
    display:flex; align-items:center; justify-content:center; padding:20px;
  `;
  modal.innerHTML = `
    <div style="background:#fff; border-radius:16px; padding:32px; max-width:640px;
                width:100%; max-height:80vh; overflow-y:auto;
                box-shadow:0 20px 60px rgba(0,0,0,0.3);">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px;">
        <h3 style="font-size:22px; font-weight:800; color:#2d3748;">
          🧾 Chi tiết đơn #${escapeHtml(maHoaDon)}
        </h3>
        <button onclick="document.getElementById('orderDetailModal').remove()"
          style="background:none; border:none; font-size:24px; cursor:pointer; color:#718096;">✕</button>
      </div>
      <table style="width:100%; border-collapse:collapse; font-size:15px;">
        <thead>
          <tr style="background:#f7fafc; border-bottom:2px solid #e2e8f0;">
            <th style="padding:12px 8px; text-align:left; color:#718096;">Mã thuốc</th>
            <th style="padding:12px 8px; text-align:center; color:#718096;">Số lượng</th>
            <th style="padding:12px 8px; text-align:right; color:#718096;">Đơn giá</th>
            <th style="padding:12px 8px; text-align:right; color:#718096;">Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          ${rows || "<tr><td colspan='4' style='padding:20px; text-align:center; color:#718096;'>Không có sản phẩm</td></tr>"}
        </tbody>
        <tfoot>
          <tr style="border-top:2px solid #e2e8f0;">
            <td colspan="3" style="padding:16px 8px; font-weight:700; text-align:right; color:#2d3748;">Tổng cộng:</td>
            <td style="padding:16px 8px; font-weight:800; font-size:18px; color:#667eea; text-align:right;">
              ${tongTien.toLocaleString("vi-VN")} đ
            </td>
          </tr>
        </tfoot>
      </table>
    </div>`;

  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.remove();
  });

  document.body.appendChild(modal);
}

// ================= INIT =================
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  loadOrders();
});