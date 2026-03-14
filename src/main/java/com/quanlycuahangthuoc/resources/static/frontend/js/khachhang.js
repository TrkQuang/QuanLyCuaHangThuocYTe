let products = [];
let shopControlsInitialized = false;
let globalSearchInitialized = false;
let shopKeywordPrefilledFromUrl = false;
const shopState = {
  filtered: [],
  currentPage: 1,
  extraPerPage: 0,
  totalItems: 0,
  totalPages: 1,
};

function normalizeText(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

function getQueryParamKeyword() {
  const params = new URLSearchParams(window.location.search);
  return String(params.get("q") || "").trim();
}

function navigateToShopWithKeyword(rawKeyword) {
  const keyword = String(rawKeyword || "").trim();
  if (!keyword) return;
  window.location.href = `shop.html?q=${encodeURIComponent(keyword)}`;
}

function getSearchInput() {
  return document.getElementById("searchInput");
}

function getOrCreateSearchDropdown() {
  const searchInput = getSearchInput();
  const searchBox = searchInput?.closest(".search-box");
  if (!searchInput || !searchBox) return null;

  let dropdown = searchBox.querySelector(".search-suggestions");
  if (!dropdown) {
    dropdown = document.createElement("div");
    dropdown.className = "search-suggestions";
    dropdown.setAttribute("role", "listbox");
    searchBox.appendChild(dropdown);
  }

  return dropdown;
}

function hideSearchDropdown() {
  const dropdown = document.querySelector(".search-suggestions");
  if (dropdown) {
    dropdown.innerHTML = "";
    dropdown.style.display = "none";
  }
}

function renderSearchDropdown(keyword) {
  const normalizedKeyword = normalizeText(keyword);
  const dropdown = getOrCreateSearchDropdown();
  if (!dropdown) return;

  if (!normalizedKeyword || !products.length) {
    hideSearchDropdown();
    return;
  }

  const matches = products
    .filter((p) => {
      const name = normalizeText(p.name);
      const desc = normalizeText(p.description);
      return (
        name.includes(normalizedKeyword) || desc.includes(normalizedKeyword)
      );
    })
    .slice(0, 8);

  if (!matches.length) {
    hideSearchDropdown();
    return;
  }

  dropdown.innerHTML = matches
    .map(
      (p) => `
        <button type="button" class="search-suggestion-item" data-name="${escapeHtml(p.name)}">
          <span class="search-suggestion-name">${escapeHtml(p.name)}</span>
          <span class="search-suggestion-price">${Number(p.price || 0).toLocaleString("vi-VN")}đ</span>
        </button>
      `,
    )
    .join("");

  dropdown.querySelectorAll(".search-suggestion-item").forEach((btn) => {
    btn.addEventListener("click", () => {
      const keywordSelected = btn.getAttribute("data-name") || "";
      navigateToShopWithKeyword(keywordSelected);
    });
  });

  dropdown.style.display = "block";
}

function initializeGlobalSearch() {
  if (globalSearchInitialized) return;

  const searchInput = getSearchInput();
  const searchForm = document.getElementById("searchForm");
  const searchBox = searchInput?.closest(".search-box");
  if (!searchInput || !searchBox) return;

  globalSearchInitialized = true;

  searchInput.addEventListener("input", () => {
    renderSearchDropdown(searchInput.value);
  });

  searchInput.addEventListener("focus", () => {
    renderSearchDropdown(searchInput.value);
  });

  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      hideSearchDropdown();
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      const keyword = String(searchInput.value || "").trim();
      navigateToShopWithKeyword(keyword);
    }
  });

  if (searchForm) {
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const keyword = String(searchInput.value || "").trim();
      navigateToShopWithKeyword(keyword);
    });
  }

  document.addEventListener("click", (e) => {
    if (!searchBox.contains(e.target)) {
      hideSearchDropdown();
    }
  });
}

function prefillShopKeywordFromQuery() {
  if (shopKeywordPrefilledFromUrl || !isAdvancedShopPage()) return;
  const queryKeyword = getQueryParamKeyword();
  if (!queryKeyword) return;

  const headerSearchInput = getSearchInput();
  if (headerSearchInput) {
    headerSearchInput.value = queryKeyword;
  }

  const shopKeywordInput = document.getElementById("shopKeyword");
  if (shopKeywordInput) {
    shopKeywordInput.value = queryKeyword;
  }

  shopKeywordPrefilledFromUrl = true;
}

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
  return safeBase;
}

function mapThuocToProduct(x) {
  return {
    id: x.maThuoc,
    name: x.tenThuoc,
    price: Number(x.giaBan || 0),
    stock: Number(x.soLuongTon || 0),
    image: x.hinhAnh || "img/UATThuoc.jpg",
    unit: x.donViTinh || "",
    description: x.donViTinh || "Sản phẩm nhà thuốc",
  };
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
  const totalPages = Math.max(1, shopState.totalPages || 1);
  const currentItems = isAdvancedShopPage()
    ? products.length
    : getCurrentPageItems().length;
  const totalItems = isAdvancedShopPage() ? shopState.totalItems : total;

  countEl.textContent = `${totalItems} sản phẩm | Hiển thị ${currentItems} sản phẩm`;
  pageEl.textContent = `Trang ${shopState.currentPage}/${totalPages}`;

  if (loadMoreBtn) {
    loadMoreBtn.style.display =
      shopState.currentPage < totalPages ? "inline-flex" : "none";
  }
}

function renderShopPagination() {
  const pagination = document.getElementById("shopPagination");
  if (!pagination) return;

  pagination.innerHTML = "";
  const totalPages = Math.max(1, shopState.totalPages || 1);

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
  if (!isAdvancedShopPage()) return Promise.resolve();

  if (resetPage) {
    shopState.currentPage = 1;
  }

  return loadShopProductsPaged({ showLoading: !resetPage });
}

function renderShopPageLoading() {
  const wrap = getDynamicProductsGrid();
  if (!wrap) return;

  wrap.innerHTML = `
    <div class="shop-loading-state">
      <div class="shop-loading-spinner" aria-hidden="true"></div>
      <p>Đang tải sản phẩm...</p>
    </div>
  `;
}

async function loadShopProductsPaged(options = {}) {
  const { showLoading = false } = options;
  if (showLoading) {
    renderShopPageLoading();
  }

  const keyword = getInputValue("shopKeyword").trim();
  const priceFilter = getInputValue("shopPriceFilter");
  const sortBy = getInputValue("shopSortBy") || "name-asc";
  const pageSize = getPageSize();

  const params = new URLSearchParams({
    page: String(shopState.currentPage),
    size: String(pageSize),
    keyword,
    priceFilter,
    sortBy,
    includeImage: "true",
  });

  const data = await apiFetch(`/thuoc/paged?${params.toString()}`);
  const items = Array.isArray(data?.items) ? data.items : [];

  products = items.map(mapThuocToProduct);
  shopState.totalItems = Number(data?.totalItems || 0);
  shopState.totalPages = Math.max(1, Number(data?.totalPages || 1));
  shopState.currentPage = Math.min(
    Math.max(1, Number(data?.page || shopState.currentPage || 1)),
    shopState.totalPages,
  );

  renderProducts(products);
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
      if (shopState.currentPage < shopState.totalPages) {
        shopState.currentPage += 1;
        applyShopView(false);
      }
    });
  }
}

async function loadProducts() {
  try {
    if (isAdvancedShopPage()) {
      prefillShopKeywordFromQuery();
      bindShopControls();
      await applyShopView(true);
      initializeGlobalSearch();
      return;
    }

    const data = await apiFetch(
      "/thuoc/paged?page=1&size=15&includeImage=true&sortBy=name-asc",
    );
    const items = Array.isArray(data?.items) ? data.items : [];
    products = items.map(mapThuocToProduct);

    initializeGlobalSearch();
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
    name.textContent = p.name || "Thuoc";

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
          <p>Ngày tạo: ${formatDate(o.ngayTao)}</p>
          <p>Tổng tiền: ${formatCurrency(o.tongTien)}</p>
          <p>Trạng thái: ${escapeHtml(o.trangThai || "CHO_XAC_NHAN")}</p>
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
  initializeGlobalSearch();
  if (hasProductGrid) {
    await loadProducts();
  }
  await loadOrders();
});
