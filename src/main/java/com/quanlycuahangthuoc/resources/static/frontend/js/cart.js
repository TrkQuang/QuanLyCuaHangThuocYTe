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
    alert(`Da them \"${title}\" vao gio hang`);
  } catch (e) {
    alert(e.message || "Khong the them vao gio hang");
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

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();

  const searchInput = document.getElementById("searchInput");
  const searchForm = document.getElementById("searchForm");

  if (searchInput) {
    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const keyword = searchInput.value.trim();
        if (keyword) {
          window.location.href = `search.html?q=${encodeURIComponent(keyword)}`;
        }
      }
    });
  }

  if (searchForm) {
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const keyword = searchInput?.value?.trim() || "";
      if (keyword) {
        window.location.href = `search.html?q=${encodeURIComponent(keyword)}`;
      }
    });
  }
});
