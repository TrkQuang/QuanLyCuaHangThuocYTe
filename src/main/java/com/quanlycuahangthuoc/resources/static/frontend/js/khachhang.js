let products = [];
let shopControlsInitialized = false;
const shopState = {
  filtered: [],
  currentPage: 1,
  extraPerPage: 0,
};

function getDynamicProductsGrid() {
  return (
    document.getElementById("dynamicProductsGrid") ||
    document.querySelector(".products-grid")
  );
}

function isAdvancedShopPage() {
  return !!document.getElementById("shopControls");
}

function getInputValue(id) {
  const el = document.getElementById(id);
  return el ? String(el.value || "") : "";
}

function getPageSize() {
  const baseSize = parseInt(getInputValue("shopPageSize") || "8", 10);
  const safeBase = Number.isFinite(baseSize) && baseSize > 0 ? baseSize : 8;
  return safeBase + shopState.extraPerPage;
}

function filterAndSortProducts(source) {
  const keyword = getInputValue("shopKeyword").trim().toLowerCase();
  const unitFilter = getInputValue("shopUnitFilter");
  const priceFilter = getInputValue("shopPriceFilter");
  const stockFilter = getInputValue("shopStockFilter");
  const sortBy = getInputValue("shopSortBy") || "name-asc";

  let list = [...source].filter((item) => {
    const matchesKeyword =
      !keyword ||
      item.name.toLowerCase().includes(keyword) ||
      item.description.toLowerCase().includes(keyword);

    const matchesUnit = !unitFilter || item.unit === unitFilter;

    let matchesPrice = true;
    if (priceFilter === "lt5000") matchesPrice = item.price < 5000;
    if (priceFilter === "5000-10000")
      matchesPrice = item.price >= 5000 && item.price <= 10000;
    if (priceFilter === "10000-20000")
      matchesPrice = item.price > 10000 && item.price <= 20000;
    if (priceFilter === "gt20000") matchesPrice = item.price > 20000;

    let matchesStock = true;
    if (stockFilter === "in-stock") matchesStock = item.stock > 0;
    if (stockFilter === "low-stock")
      matchesStock = item.stock > 0 && item.stock <= 20;
    if (stockFilter === "out-stock") matchesStock = item.stock <= 0;

    return matchesKeyword && matchesUnit && matchesPrice && matchesStock;
  });

  list.sort((a, b) => {
    if (sortBy === "name-asc") return a.name.localeCompare(b.name, "vi");
    if (sortBy === "name-desc") return b.name.localeCompare(a.name, "vi");
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    if (sortBy === "stock-desc") return b.stock - a.stock;
    return 0;
  });

  return list;
}

function getCurrentPageItems() {
  const pageSize = getPageSize();
  const start = (shopState.currentPage - 1) * pageSize;
  return shopState.filtered.slice(start, start + pageSize);
}

function renderShopSummary() {
  const countEl = document.getElementById("shopCountInfo");
  const pageEl = document.getElementById("shopPageInfo");
  const loadMoreBtn = document.getElementById("shopLoadMoreBtn");
  if (!countEl || !pageEl) return;

  const total = shopState.filtered.length;
  const pageSize = getPageSize();
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentItems = getCurrentPageItems().length;

  countEl.textContent = `${total} sản phẩm | Hiển thị ${currentItems} sản phẩm`;
  pageEl.textContent = `Trang ${shopState.currentPage}/${totalPages}`;

  if (loadMoreBtn) {
    loadMoreBtn.style.display = total > pageSize ? "inline-flex" : "none";
  }
}

function renderShopPagination() {
  const pagination = document.getElementById("shopPagination");
  if (!pagination) return;

  pagination.innerHTML = "";
  const pageSize = getPageSize();
  const totalPages = Math.max(
    1,
    Math.ceil(shopState.filtered.length / pageSize),
  );

  const prev = document.createElement("button");
  prev.className = "shop-page-btn";
  prev.textContent = "<";
  prev.disabled = shopState.currentPage <= 1;
  prev.addEventListener("click", () => {
    if (shopState.currentPage > 1) {
      shopState.currentPage -= 1;
      applyShopView(false);
    }
  });
  pagination.appendChild(prev);

  for (let p = 1; p <= totalPages; p += 1) {
    const btn = document.createElement("button");
    btn.className = `shop-page-btn${p === shopState.currentPage ? " active" : ""}`;
    btn.textContent = String(p);
    btn.addEventListener("click", () => {
      shopState.currentPage = p;
      applyShopView(false);
    });
    pagination.appendChild(btn);
  }

  const next = document.createElement("button");
  next.className = "shop-page-btn";
  next.textContent = ">";
  next.disabled = shopState.currentPage >= totalPages;
  next.addEventListener("click", () => {
    if (shopState.currentPage < totalPages) {
      shopState.currentPage += 1;
      applyShopView(false);
    }
  });
  pagination.appendChild(next);
}

function applyShopView(resetPage = true) {
  if (!isAdvancedShopPage()) return;

  shopState.filtered = filterAndSortProducts(products);
  if (resetPage) {
    shopState.currentPage = 1;
  }

  const pageSize = getPageSize();
  const totalPages = Math.max(
    1,
    Math.ceil(shopState.filtered.length / pageSize),
  );
  if (shopState.currentPage > totalPages) {
    shopState.currentPage = totalPages;
  }

  renderProducts(getCurrentPageItems());
  renderShopSummary();
  renderShopPagination();
}

function populateUnitFilter() {
  const unitSelect = document.getElementById("shopUnitFilter");
  if (!unitSelect) return;

  const selected = unitSelect.value;
  const units = [...new Set(products.map((p) => p.unit).filter(Boolean))].sort(
    (a, b) => a.localeCompare(b, "vi"),
  );

  unitSelect.innerHTML = '<option value="">Tất cả</option>';
  units.forEach((unit) => {
    const opt = document.createElement("option");
    opt.value = unit;
    opt.textContent = unit;
    unitSelect.appendChild(opt);
  });

  if (selected && units.includes(selected)) {
    unitSelect.value = selected;
  }
}

function bindShopControls() {
  if (shopControlsInitialized || !isAdvancedShopPage()) return;
  shopControlsInitialized = true;

  const applyBtn = document.getElementById("shopApplyFilterBtn");
  const resetBtn = document.getElementById("shopResetFilterBtn");
  const loadMoreBtn = document.getElementById("shopLoadMoreBtn");

  const autoIds = [
    "shopKeyword",
    "shopUnitFilter",
    "shopPriceFilter",
    "shopStockFilter",
    "shopSortBy",
    "shopPageSize",
  ];

  autoIds.forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const eventName = el.tagName === "INPUT" ? "input" : "change";
    el.addEventListener(eventName, () => {
      if (id === "shopPageSize") {
        shopState.extraPerPage = 0;
      }
      applyShopView(true);
    });
  });

  if (applyBtn) {
    applyBtn.addEventListener("click", () => applyShopView(true));
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      const keyword = document.getElementById("shopKeyword");
      const unit = document.getElementById("shopUnitFilter");
      const price = document.getElementById("shopPriceFilter");
      const stock = document.getElementById("shopStockFilter");
      const sort = document.getElementById("shopSortBy");
      const pageSize = document.getElementById("shopPageSize");

      if (keyword) keyword.value = "";
      if (unit) unit.value = "";
      if (price) price.value = "";
      if (stock) stock.value = "";
      if (sort) sort.value = "name-asc";
      if (pageSize) pageSize.value = "8";

      shopState.extraPerPage = 0;
      applyShopView(true);
    });
  }

  if (loadMoreBtn) {
    loadMoreBtn.addEventListener("click", () => {
      shopState.extraPerPage += 4;
      applyShopView(true);
    });
  }
}

async function loadProducts() {
  try {
    const data = await apiFetch("/thuoc");
    products = data.map((x) => ({
      id: x.maThuoc,
      name: x.tenThuoc,
      price: Number(x.giaBan || 0),
      stock: Number(x.soLuongTon || 0),
      image: x.hinhAnh || "img/UATThuoc.jpg",
      unit: x.donViTinh || "",
      description: x.donViTinh || "Sản phẩm nhà thuốc",
    }));

    if (isAdvancedShopPage()) {
      populateUnitFilter();
      bindShopControls();
      applyShopView(true);
      return;
    }

    renderProducts(products);
  } catch (e) {
    const wrap = getDynamicProductsGrid();
    if (wrap)
      wrap.innerHTML = `<p style="color:red">${escapeHtml(e.message)}</p>`;
  }
}

function renderProducts(list) {
  const wrap = getDynamicProductsGrid();
  if (!wrap) return;

  wrap.innerHTML = "";

  list.forEach((p) => {
    const item = document.createElement("div");
    item.className = "product-item";

    const img = document.createElement("img");
    img.src = p.image || "img/UATThuoc.jpg";
    img.alt = p.name || "Sản phẩm";
    img.onerror = () => {
      img.src = "img/UATThuoc.jpg";
    };

    const name = document.createElement("h3");
    name.textContent = p.name || "Thuốc";

    const price = document.createElement("div");
    price.className = "product-price";
    price.setAttribute("data-price", String(Number(p.price || 0)));
    price.textContent = `${Number(p.price || 0).toLocaleString("vi-VN")}đ`;

    const desc = document.createElement("p");
    desc.textContent = `${p.description || "Sản phẩm nhà thuốc"} | Còn: ${Number(p.stock || 0)}`;

    const btn = document.createElement("button");
    btn.className = "btn-primary";
    btn.textContent = "Thêm giỏ hàng";
    btn.disabled = Number(p.stock || 0) <= 0;
    if (btn.disabled) {
      btn.textContent = "Hết hàng";
      btn.style.opacity = "0.6";
      btn.style.cursor = "not-allowed";
    }
    btn.addEventListener("click", (event) => addToCart(event, p.id));

    item.appendChild(img);
    item.appendChild(name);
    item.appendChild(price);
    item.appendChild(desc);
    item.appendChild(btn);
    wrap.appendChild(item);
  });
}

async function loadOrders() {
  const box = document.getElementById("ordersList");
  if (!box) return;

  const currentUser = getCurrentUser();
  if (!currentUser?.maKhachHang) {
    box.innerHTML =
      "<p>Vui lòng đăng nhập bằng tài khoản khách hàng để xem đơn hàng.</p>";
    return;
  }

  try {
    const all = await apiFetch("/hoadon");
    const mine = all.filter((o) => o.maKhachHang === currentUser.maKhachHang);

    if (!mine.length) {
      box.innerHTML = "<p>Chưa có đơn hàng nào.</p>";
      return;
    }

    box.innerHTML = mine
      .sort((a, b) => new Date(b.ngayTao) - new Date(a.ngayTao))
      .map(
        (o) => `
        <div class="order-card">
          <h3>Don #${escapeHtml(o.maHoaDon)}</h3>
          <p>Ngay tao: ${formatDate(o.ngayTao)}</p>
          <p>Tong tien: ${formatCurrency(o.tongTien)}</p>
          <p>Trang thai: ${escapeHtml(o.trangThai || "CHO_XAC_NHAN")}</p>
        </div>
      `,
      )
      .join("");
  } catch (e) {
    box.innerHTML = `<p style="color:red">${escapeHtml(e.message)}</p>`;
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  await updateCartCount();
  const hasProductGrid = !!getDynamicProductsGrid();
  if (hasProductGrid) {
    await loadProducts();
  }
  await loadOrders();
});
