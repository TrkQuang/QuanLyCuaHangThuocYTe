async function getCart() {
  try {
    return await apiFetch("/cart");
  } catch (e) {
    return [];
  }
}

async function clearCart() {
  await apiFetch("/cart", { method: "DELETE" });
}

async function resolveNhanVienForCheckout() {
  const list = await apiFetch("/nhanvien");
  if (!Array.isArray(list) || list.length === 0) {
    throw new Error("He thong chua co nhan vien de xu ly hoa don");
  }

  const first = list.find((x) => x && x.maNhanVien);
  if (!first || !first.maNhanVien) {
    throw new Error("Khong tim thay ma nhan vien hop le");
  }

  return first.maNhanVien;
}

async function renderCheckout() {
  const cart = await getCart();
  const checkoutItems = document.getElementById("checkoutItems");
  const totalPriceEl = document.getElementById("totalPrice");
  if (!checkoutItems || !totalPriceEl) return;

  checkoutItems.innerHTML = "";
  let total = 0;

  if (!cart.length) {
    checkoutItems.innerHTML = "<p>Gio hang trong</p>";
    totalPriceEl.textContent = "0";
    return;
  }

  cart.forEach((item) => {
    const lineTotal = Number(item.price || 0) * Number(item.quantity || 0);
    total += lineTotal;
    checkoutItems.innerHTML += `
      <div class="checkout-item">
        <div class="checkout-info">
          <h4>${escapeHtml(item.title || item.name || "")}</h4>
          <p>${item.quantity} x ${Number(item.price || 0).toLocaleString("vi-VN")}đ</p>
        </div>
        <button class="btn-remove" onclick="removeCheckoutItem('${escapeHtml(String(item.id))}')">Bo</button>
      </div>
    `;
  });

  totalPriceEl.textContent = total.toLocaleString("vi-VN");
}

async function removeCheckoutItem(productId) {
  await apiFetch(`/cart/${productId}`, { method: "DELETE" });
  await renderCheckout();
}

async function handleCheckout() {
  const fullName = document.getElementById("fullName")?.value.trim();
  const phone = document.getElementById("phone")?.value.trim();
  const address = document.getElementById("address")?.value.trim();

  if (!fullName || !phone || !address) {
    alert("Vui long nhap day du thong tin thanh toan");
    return;
  }

  const user = getCurrentUser();
  if (!user || !user.maKhachHang) {
    alert("Khong tim thay thong tin khach hang, vui long dang nhap lai");
    window.location.href = "login.html";
    return;
  }

  const cart = await getCart();
  if (!cart.length) {
    alert("Gio hang trong");
    return;
  }

  try {
    const maNhanVien = await resolveNhanVienForCheckout();
    const hoaDon = {
      maHoaDon: `HD${Date.now()}`,
      maKhachHang: user.maKhachHang,
      maNhanVien,
      ngayTao: new Date().toISOString().split("T")[0],
    };

    const chiTiet = cart.map((item, idx) => ({
      maCTHD: `CTHD${Date.now()}${idx}`,
      maHoaDon: hoaDon.maHoaDon,
      maThuoc: item.id,
      soLuong: Number(item.quantity || 1),
      hdsd: `KH: ${fullName} - SDT: ${phone} - DC: ${address}`,
    }));

    await apiFetch("/hoadon/full", {
      method: "POST",
      body: JSON.stringify({ hoaDon, chiTiet }),
    });
    await clearCart();
    alert("Dat hang thanh cong");
    window.location.href = "order-history.html";
  } catch (e) {
    alert(e.message || "Dat hang that bai");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  if (!getCurrentUser()) {
    alert("Vui long dang nhap de thanh toan");
    window.location.href = "login.html";
    return;
  }
  renderCheckout();
});
