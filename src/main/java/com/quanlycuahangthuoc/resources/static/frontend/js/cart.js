async function addToCart(eventOrId, maybeIdOrPrice) {
  let productId = "";
  let title = "";
  let image = "";
  let price = 0;

  const isEvent =
    eventOrId && typeof eventOrId === "object" && "target" in eventOrId;

  if (isEvent) {
    productId = String(maybeIdOrPrice || "");
    const button = eventOrId?.target?.closest("button") || eventOrId?.target;
    const productItem = button?.closest(".product-item");
    if (!productItem) return;

    title = productItem.querySelector("h3")?.innerText || productId;
    image = productItem.querySelector("img")?.src || "";
    const priceEl =
      productItem.querySelector(".product-price") ||
      productItem.querySelector(".new-price");
    price = Number(
      priceEl?.getAttribute("data-price") ||
        priceEl?.innerText?.replace(/[^0-9]/g, "") ||
        0,
    );
  } else {
    // Legacy calls like addToCart('panadol', 20000)
    productId = String(eventOrId || "");
    title = productId;
    price = Number(maybeIdOrPrice || 0);
  }

  try {
    await apiFetch("/cart/add", {
      method: "POST",
      body: JSON.stringify({
        id: productId,
        title,
        price,
        image,
        quantity: 1,
      }),
    });
    await updateCartCount();
    alert(`Đã thêm \"${title}\" vào giỏ hàng`);
  } catch (e) {
    alert(e.message || "Không thể thêm vào giỏ hàng");
  }
}

async function updateCartCount() {
  try {
    const data = await apiFetch("/cart/count");
    const cartCountEl = document.getElementById("cartCount");
    if (cartCountEl) {
      cartCountEl.innerText = data.count || 0;
    }
  } catch (e) {
    const cartCountEl = document.getElementById("cartCount");
    if (cartCountEl) {
      cartCountEl.innerText = "0";
    }
  }
}

let headerSearchProducts = [];
let headerSearchInitialized = false;

function getHeaderSearchInput() {
  return document.getElementById("searchInput");
}

function getOrCreateHeaderSearchDropdown() {
  const searchInput = getHeaderSearchInput();
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

function hideHeaderSearchDropdown() {
  const dropdown = document.querySelector(".search-suggestions");
  if (!dropdown) return;
  dropdown.innerHTML = "";
  dropdown.style.display = "none";
}

function normalizeSearchText(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

function navigateToShopWithKeyword(rawKeyword) {
  const keyword = String(rawKeyword || "").trim();
  if (!keyword) return;
  window.location.href = `shop.html?q=${encodeURIComponent(keyword)}`;
}

function renderHeaderSearchDropdown(keyword) {
  const normalizedKeyword = normalizeSearchText(keyword);
  const dropdown = getOrCreateHeaderSearchDropdown();
  if (!dropdown) return;

  if (!normalizedKeyword || !headerSearchProducts.length) {
    hideHeaderSearchDropdown();
    return;
  }

  const matches = headerSearchProducts
    .filter((p) => {
      const name = normalizeSearchText(p.name);
      const desc = normalizeSearchText(p.description);
      return (
        name.includes(normalizedKeyword) || desc.includes(normalizedKeyword)
      );
    })
    .slice(0, 8);

  if (!matches.length) {
    hideHeaderSearchDropdown();
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
      const selected = btn.getAttribute("data-name") || "";
      navigateToShopWithKeyword(selected);
    });
  });

  dropdown.style.display = "block";
}

async function ensureHeaderSearchProducts() {
  if (headerSearchProducts.length) return;
  try {
    const data = await apiFetch(
      "/thuoc/paged?page=1&size=200&includeImage=false&sortBy=name-asc",
    );
    const items = Array.isArray(data?.items) ? data.items : [];
    headerSearchProducts = items.map((x) => ({
      name: x.tenThuoc || "",
      description: x.donViTinh || "",
      price: Number(x.giaBan || 0),
    }));
  } catch {
    headerSearchProducts = [];
  }
}

async function initializeHeaderSearch() {
  if (headerSearchInitialized) return;

  const searchInput = getHeaderSearchInput();
  const searchForm = document.getElementById("searchForm");
  const searchBox = searchInput?.closest(".search-box");
  if (!searchInput || !searchForm || !searchBox) return;

  headerSearchInitialized = true;
  await ensureHeaderSearchProducts();

  searchInput.addEventListener("input", () => {
    renderHeaderSearchDropdown(searchInput.value);
  });

  searchInput.addEventListener("focus", () => {
    renderHeaderSearchDropdown(searchInput.value);
  });

  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      hideHeaderSearchDropdown();
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      navigateToShopWithKeyword(searchInput.value);
    }
  });

  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    navigateToShopWithKeyword(searchInput.value);
  });

  document.addEventListener("click", (e) => {
    if (!searchBox.contains(e.target)) {
      hideHeaderSearchDropdown();
    }
  });
}

function initializeHeaderSearchWhenReady() {
  initializeHeaderSearch();
  if (headerSearchInitialized) return;

  const observer = new MutationObserver(() => {
    initializeHeaderSearch();
    if (headerSearchInitialized) {
      observer.disconnect();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  initializeHeaderSearchWhenReady();
});
