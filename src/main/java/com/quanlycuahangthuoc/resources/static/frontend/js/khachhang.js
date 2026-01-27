const API_URL = "http://localhost:8080/api";

// ================= PRODUCTS =================

let products = [];
let currentPage = 1;
const itemsPerPage = 4;

async function loadProducts(){
  try{
    const res = await fetch(API_URL + "/products");
    products = await res.json();
    renderProducts(products);
  }catch(e){
    console.error("Load products error:", e);
  }
}

function renderProducts(list){
  const box = document.getElementById("productsList");
  if(!box) return;

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  const pageItems = list.slice(start, end);

  let html = "";

  pageItems.forEach(p=>{
    html += `
      <div class="product-item">
        <img src="${p.image}">
        <h3>${p.name}</h3>
        <div class="product-price">${p.price.toLocaleString()}đ</div>
        <p>${p.description}</p>
        <button class="btn-primary" onclick="addToCart(${p.id})">
          Thêm giỏ hàng
        </button>
      </div>
    `;
  });

  box.innerHTML = html;
}

function loadMore(){
  currentPage++;
  renderProducts(products);
}

// ================= SEARCH =================

function searchProduct(keyword){
  const result = products.filter(p =>
    p.name.toLowerCase().includes(keyword.toLowerCase())
  );

  currentPage = 1;
  renderProducts(result);
}

const searchBox = document.getElementById("searchInput");
if(searchBox){
  searchBox.addEventListener("keypress", e=>{
    if(e.key === "Enter"){
      searchProduct(searchBox.value);
    }
  });
}

// ================= FILTER =================

function applyFilter(){
  const cat = document.getElementById("categoryFilter")?.value;
  const sort = document.getElementById("sortBy")?.value;

  let list = [...products];

  if(cat){
    list = list.filter(p => p.category === cat);
  }

  if(sort === "price-low"){
    list.sort((a,b)=>a.price-b.price);
  }
  else if(sort === "price-high"){
    list.sort((a,b)=>b.price-a.price);
  }
  else if(sort === "popular"){
    list.sort((a,b)=>b.popular - a.popular);
  }
  else{
    list.sort((a,b)=>a.name.localeCompare(b.name));
  }

  currentPage = 1;
  renderProducts(list);
}

// ================= CART =================

async function addToCart(productId){
  try{
    await fetch(API_URL + "/cart/add", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify({
        productId: productId,
        quantity: 1
      })
    });

    updateCartCount();
    alert("Đã thêm vào giỏ!");
  }catch(e){
    console.error("Add cart error:", e);
  }
}

async function loadCart(){
  try{
    const res = await fetch(API_URL + "/cart");
    const cart = await res.json();
    showCart(cart);
  }catch(e){
    console.error("Load cart error:", e);
  }
}

function showCart(cart){
  const box = document.getElementById("cartItems");
  const totalBox = document.getElementById("totalPrice");
  if(!box) return;

  let html = "";
  let total = 0;

  if(cart.length === 0){
    box.innerHTML = "🛒 Giỏ hàng trống";
    totalBox.innerText = "0";
    return;
  }

  cart.forEach(item=>{
    const sum = item.price * item.quantity;
    total += sum;

    html += `
      <div class="cart-row">
        <strong>${item.name}</strong><br>
        ${item.quantity} × ${item.price.toLocaleString()}đ =
        <b>${sum.toLocaleString()}đ</b><br>

        <button onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
        <button onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
        <button onclick="removeItem(${item.id})">❌</button>
      </div>
    `;
  });

  totalBox.innerText = total.toLocaleString();
  box.innerHTML = html;
}

async function updateQuantity(productId, qty){
  if(qty <= 0){
    removeItem(productId);
    return;
  }

  await fetch(API_URL + "/cart/update", {
    method:"PUT",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify({
      productId: productId,
      quantity: qty
    })
  });

  loadCart();
  updateCartCount();
}

async function removeItem(productId){
  await fetch(API_URL + "/cart/" + productId, {
    method:"DELETE"
  });

  loadCart();
  updateCartCount();
}

async function updateCartCount(){
  try{
    const res = await fetch(API_URL + "/cart");
    const cart = await res.json();

    const count = cart.reduce((sum,i)=>sum+i.quantity,0);
    const box = document.getElementById("cartCount");

    if(box) box.innerText = count;
  }catch(e){}
}

// ================= ORDERS =================

async function loadOrders(){
  const box = document.getElementById("orderList");
  if(!box) return;

  try{
    const res = await fetch(API_URL + "/orders");
    const orders = await res.json();

    if(orders.length === 0){
      box.innerHTML = "Chưa có đơn hàng";
      return;
    }

    let html = "";

    orders.forEach(o=>{
      html += `<p>🕒 ${o.createdAt} - ${o.items.length} sản phẩm</p>`;
    });

    box.innerHTML = html;
  }catch(e){
    console.error("Load orders error:", e);
  }
}

// ================= INIT =================

loadProducts();
updateCartCount();
loadCart();
loadOrders();
