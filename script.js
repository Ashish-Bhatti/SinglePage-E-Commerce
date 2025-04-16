// Features:
// -- Show a list of products (fetched from an API)
// -- Add products to a cart
// -- Save cart in Local Storage
// -- Apply discount using Operators & Conditions
// -- Checkout with a Form Validation system

// DOM Elements
const productList = document.getElementById("product-list");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const cartCount = document.getElementById("cart-count");
const discountInput = document.getElementById("discount-code");
const applyDiscountBtn = document.getElementById("apply-discount");
const checkoutBtn = document.getElementById("checkout-btn");
const checkoutFormDiv = document.getElementById("checkout-form");
const form = document.getElementById("form");

let cart = [];
let amountList = [];

// ✅ Calculate and update total price
function totalAmount() {
  const total = amountList.reduce((a, b) => a + b, 0);
  cartTotal.innerText = total.toFixed(2);
}

// ✅ Fetch and display products from API
async function fetchData() {
  const res = await fetch("https://fakestoreapi.com/products");
  const data = await res.json();
  displayProducts(data);
}

function displayProducts(products) {
  productList.innerHTML = "";
  products.forEach((p) => {
    const card = document.createElement("div");
    card.className = "product";
    card.innerHTML = `
      <img src="${p.image}" width="100" height="100"/>
      <h3>${p.title.slice(0, 20)}...</h3>
      <p>${p.rating.rate}⭐ (${p.rating.count} reviews)</p>
      <p>₹${p.price}</p>
      <button onclick="addToCart(${p.id}, '${p.title}', ${p.price})">Add to Cart</button>
    `;
    productList.append(card);
  });
}

// ✅ Add to Cart
function addToCart(id, title, price) {
  const item = { id, title, price };
  cart.push(item);
  amountList.push(price);
  saveCart();
  renderCartItem(item);
  updateCartUI();
}

// ✅ Render a single cart item
function renderCartItem(item) {
  const li = document.createElement("li");
  li.className = "product";
  li.dataset.id = item.id;
  li.innerHTML = `
    <h3>${item.title.slice(0, 20)}...</h3>
    <p><span>₹</span><span>${item.price}</span></p>
    <button onclick="remove(this)">Remove</button>
  `;
  cartItems.append(li);
}

// ✅ Remove item from cart
function remove(button) {
  const item = button.parentElement;
  const price = Number(button.previousElementSibling.lastElementChild.innerText);
  const index = amountList.indexOf(price);

  cart.splice(index, 1);
  amountList.splice(index, 1);
  item.remove();

  saveCart();
  updateCartUI();
}

// ✅ Save cart in localStorage
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// ✅ Restore cart from localStorage
function cartLoad() {
  const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
  cart = savedCart;
  amountList = cart.map((item) => item.price);
  cart.forEach(renderCartItem);
  updateCartUI();
}

// ✅ Update cart count and total
function updateCartUI() {
  cartCount.innerText = cart.length;
  totalAmount();
}

// ✅ Discount
const coupons = ["WELCOME10", "FLAT50"];
applyDiscountBtn.addEventListener("click", () => {
  let code = discountInput.value;
  let total = Number(cartTotal.innerText);

  if (code == coupons[0]) {
    total = total - (total * 10) / 100;
    cartTotal.innerText = total.toFixed(2);
    coupons.splice(0)
  }
  else if (code == coupons[1]) {
    total = total - 50;
    cartTotal.innerText = total.toFixed(2);
    coupons.splice(0)
  }
  else {
    discountInput.value = "Incorrect code";
  }
});

// ✅ Checkout
checkoutBtn.addEventListener("click",checkout);

function checkout(){
  checkoutFormDiv.classList.remove("hidden"); // show the form
  checkoutFormDiv.scrollIntoView({ behavior: "smooth" });
}

form.addEventListener("submit", (e) => {
  e.preventDefault(); // prevent page reload

  localStorage.clear();
  alert("Order placed successfully! 🎉");

  // Optionally reset form and cart
  form.reset();
  cartItems.innerHTML = "";
  cartCount.innerText = "0";
  cartTotal.innerText = "0";
  amountList = [];
  cart = [];
});


// 🔁 Initial Load
window.onload = () => {
  fetchData();
  cartLoad();
};


// (function repeat() {
//   eat();
//   code();
//   sleep();
//   repeat();
// })();