//Giỏ hàng
let cart = JSON.parse(localStorage.getItem("cart")) || [];
//Dữ liệu sản phẩm mẫu
const products=[
    {
        id: 'panadol',
        name: 'Panadol Extra',
        price: 20000,
        category: 'thuoc-dau',
        image: "OIP (2).jpg",
        description: 'Hộp 24 viên - Giảm đau, hạ sốt',
        popular: true
    },
    {
        id: 'vitamin-c',
        name: 'Vitamin C 1000mg',
        price: 70000,
        category: 'vitamin',
        image: "thuoc-vitamin-c-tw3-500mg-dieu-tri-thieu-hut-vitamin-c-65f15f008f538.jpg",
        description: 'Hộp 30 viên - Tăng sức đề kháng',
        popular: true
    },
    {
        id: 'amoxicillin',
        name: 'Amoxicillin',
        price: 25000,
        category: 'khang-sinh',
        image: "OIP.jpg",
        description: 'Hộp 20 viên - Kháng sinh',
        popular: true,
    }
]

function showCart(){
    let html = "";
    let total = 0;
    cart.forEach((item, index) => {
        let sum = item.price * item.quantity;
        total = total - total * discount;
        html += `
        <div style="margin-bottom:10px;">
            <strong>${item.id}</strong> - ${item.price} đ
            <br>
            <button onclick="decrease(${index})">-</button>
            ${item.quantity}
            <button onclick="increase(${index})">+</button>
            = ${sum} đ
            <button onclick="removeItem(${index})">❌</button>
        </div>
        `;
    });
    document.getElementById("cartItems").innerHTML = html;
    document.getElementById("totalPrice").innerText = total;
}


let currentPage = 1;
let itemsPerPage = 4; // mỗi trang 4 sản phẩm

function renderProducts(list){
    let start = (currentPage - 1) * itemsPerPage;
    let end = start + itemsPerPage;
    let pageItems = list.slice(start, end);
    let html = "";
    pageItems.forEach(p => {
        html += `
        <div class="product-item">
            <img src="${p.image}">
            <h3>${p.name}</h3>
            <div class="product-price">${p.price} đ</div>
            <p>${p.description}</p>
            <button class="btn-primary" onclick="addToCart('${p.id}', ${p.price})">
                Thêm giỏ hàng
            </button>
        </div>
        `;
    });

    document.getElementById("productsList").innerHTML = html;
}

//Thêm sản phẩm vào giỏ
function addToCart(id, price){
    let item = cart.find(p => p.id === id);
    if(item){
        item.quantity++;
    } else {
        cart.push({
            id: id,
            price: price,
            quantity: 1
        });
    }
    saveCart();
    updateCartCount();
    alert("Đã thêm vào giỏ!");
}


//Nút xem thêm
function loadMore(){
    currentPage++;
    renderProducts(products);
}

//Tìm kiếm sản phẩm theo tên
function searchProduct(keyword){
    let result = products.filter(p =>
        p.name.toLowerCase().includes(keyword.toLowerCase())
    );

    renderProducts(result);
}
function searchProduct(keyword){
    let result = products.filter(p =>
        p.name.toLowerCase().includes(keyword.toLowerCase())
    );

    renderProducts(result);
}

//Tìm kiếm
let searchBox = document.getElementById("searchInput");
if(searchBox){
    searchBox.addEventListener("keypress", function(e){
        if(e.key === "Enter"){
            searchProduct(this.value);
        }
    });
}

//Lọc theo loại thuốc
function applyFilter(){
    currentPage = 1;

    let cat = document.getElementById("categoryFilter").value;
    let sort = document.getElementById("sortBy").value;

    let list = [...products];

    // Lọc theo loại
    if(cat){
        list = list.filter(p => p.category === cat);
    }

    // Sắp xếp
    if(sort === "price-low"){
        list.sort((a,b) => a.price - b.price);
    }
    else if(sort === "price-high"){
        list.sort((a,b) => b.price - a.price);
    }
    else if(sort === "popular"){
        list.sort((a,b) => b.popular - a.popular);
    }
    else{
        list.sort((a,b) => a.name.localeCompare(b.name));
    }

    renderProducts(list);
}

//Cập nhật số lượng tổng giỏ
function updateCartCount(){
    let count = 0;
    cart.forEach(item => count += item.quantity);
    let box = document.getElementById("cartCount");
    if(box){
        box.innerText = count;
    }
}


function increase(i){
    cart[i].quantity++;
    saveCart();
    showCart();
}

function decrease(i){
    if(cart[i].quantity > 1){
        cart[i].quantity--;
    }
    saveCart();
    showCart();
}

function removeItem(i){
    cart.splice(i,1);
    saveCart();
    showCart();
}

//Nhập mã giảm giá
let discount = 0;
function applyCoupon(){
    let code = document.getElementById("coupon").value;

    if(code === "GIAM10"){
        discount = 0.1;
        alert("Giảm 10%");
    }
    else if(code === "GIAM20"){
        discount = 0.2;
        alert("Giảm 20%");
    }
    else{
        alert("Mã không hợp lệ");
        return;
    }

    showCart();
}

function placeOrder(){
    let orders = JSON.parse(localStorage.getItem("orders")) || [];
    orders.push({
        date: new Date().toLocaleString(),
        items: JSON.parse(localStorage.getItem("cart")),
    });
    localStorage.setItem("orders", JSON.stringify(orders));
    localStorage.removeItem("cart");
    alert("Đặt hàng thành công!");
    window.location.href = "order-history.html";
}

//Lịch sử đơn hàng
let orders = JSON.parse(localStorage.getItem("orders")) || [];
let html="";

orders.forEach(o=>{
    html += `<p>🕒 ${o.date} - ${o.items.length} sản phẩm</p>`;
});

document.getElementById("orderList").innerHTML = html || "Chưa có đơn hàng";

function saveProfile(){
    let profile = {
        name: name.value,
        phone: phone.value,
        address: address.value
    };

    localStorage.setItem("profile", JSON.stringify(profile));

    alert("Đã lưu!");
}

let p = JSON.parse(localStorage.getItem("profile"));
if(p){
    name.value = p.name;
    phone.value = p.phone;
    address.value = p.address;
}

//Load giỏ hàng từ LocalStorage
if (localStorage.getItem('cart')) {
    cart = JSON.parse(localStorage.getItem('cart'));
    updateCartCount();
}

//Lưu giỏ hàng vào LocalStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

//Gọi saveCart mỗi khi thêm sản phẩm
const originalAddToCart = addToCart;
addToCart = function(productId, price) {
    originalAddToCart(productId, price);
    saveCart();
};

