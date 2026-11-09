const WHATSAPP_NUMBER = "234XXXXXXXXXX";

const products = [
  { id: "1", name: "Gentleman bow tie set", category: "boys",        price: 18500, image: "IMG_3573.JPG", isNew: true },
  { id: "2", name: "Bunny walk sandals",    category: "accessories", price: 14900, image: "IMG_3587.JPG", isNew: false },
  { id: "3", name: "Princess floral set",   category: "girls",       price: 12500, image: "IMG_3590.JPG", isNew: true },
  { id: "4", name: "Sweetheart cotton top", category: "girls",       price: 8900,  image: "IMG_3575.JPG", isNew: false },
  { id: "5", name: "Gentleman bow tie set", category: "boys",        price: 16900, image: "IMG_3573.JPG", isNew: false },
  { id: "6", name: "Princess floral set",   category: "girls",       price: 13900, image: "IMG_3590.JPG", isNew: false },
  { id: "7", name: "Sweetheart cotton top", category: "girls",       price: 9500,  image: "IMG_3575.JPG", isNew: true },
  { id: "8", name: "Princess floral set",   category: "girls",       price: 15500, image: "IMG_3590.JPG", isNew: false }
];

function formatPrice(number) {
  return "₦" + number.toLocaleString("en-NG");
}

function findProduct(id) {
  return products.find(function (p) { return p.id === id; });
}

function openWhatsApp(text) {
  window.open("https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(text), "_blank");
}

const menuLinks = [
  ["Home", "index.html"],
  ["Shop", "shop.html"],
  ["Categories", "index.html#categories"],
  ["About us", "about.html"],
  ["Contact", "contact.html"]
];

const currentPage = location.pathname.split("/").pop() || "index.html";

let menuHtml = "";
menuLinks.forEach(function (link) {
  const current = link[1] === currentPage ? ' class="is-current"' : "";
  menuHtml += '<li><a href="' + link[1] + '"' + current + ">" + link[0] + "</a></li>";
});

document.getElementById("site-header").innerHTML =
  '<a href="index.html" class="brand" aria-label="Qimah home">Qimah</a>' +
  '<button class="nav-toggle" aria-expanded="false" aria-controls="nav" aria-label="Open menu"><span></span><span></span></button>' +
  '<nav id="nav" class="nav"><ul>' + menuHtml + "</ul></nav>" +
  '<button id="cart-btn" class="cart-btn" aria-label="Open cart">Cart <span id="cart-count" class="cart-count">0</span></button>';

document.getElementById("cart-panel").innerHTML =
  '<div class="cart-header"><h2>Your cart</h2><button id="cart-close" class="cart-close" aria-label="Close cart">&times;</button></div>' +
  '<ul id="cart-items" class="cart-items"></ul>' +
  '<p id="cart-empty" class="cart-empty">Your cart is empty.</p>' +
  '<div class="cart-footer"><span>Total</span><strong id="cart-total">&#8358;0</strong></div>' +
  '<a href="checkout.html" id="cart-checkout" class="btn btn-solid cart-checkout">Checkout</a>';

document.getElementById("site-footer").innerHTML =
  '<a href="index.html" class="brand">Qimah</a>' +
  "<p>Style, comfort and love for your little ones.</p>" +
  "<ul>" + menuHtml + '<li><a href="https://wa.me/' + WHATSAPP_NUMBER + '" target="_blank" rel="noopener">WhatsApp</a></li></ul>' +
  "<small>&copy; 2026 Qimah. All rights reserved.</small>";

document.body.insertAdjacentHTML("beforeend", '<div id="cart-overlay" class="cart-overlay"></div>');

const menuButton = document.querySelector(".nav-toggle");
const menu = document.getElementById("nav");

menuButton.addEventListener("click", function () {
  const isOpen = menu.classList.toggle("is-open");
  menuButton.setAttribute("aria-expanded", isOpen);
});

menu.addEventListener("click", function (event) {
  if (event.target.tagName === "A") {
    menu.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
  }
});

let cart = JSON.parse(localStorage.getItem("qimah-cart")) || [];

const cartPanel = document.getElementById("cart-panel");
const cartOverlay = document.getElementById("cart-overlay");
const cartItems = document.getElementById("cart-items");
const cartEmpty = document.getElementById("cart-empty");
const cartTotal = document.getElementById("cart-total");
const cartCount = document.getElementById("cart-count");
const cartCheckout = document.getElementById("cart-checkout");

function addToCart(id, qty) {
  const existing = cart.find(function (item) { return item.id === id; });
  if (existing) {
    existing.quantity = existing.quantity + qty;
  } else {
    cart.push({ id: id, quantity: qty });
  }
  showCart();
}

function changeQuantity(id, amount) {
  const item = cart.find(function (i) { return i.id === id; });
  item.quantity = item.quantity + amount;
  if (item.quantity < 1) {
    removeFromCart(id);
  } else {
    showCart();
  }
}

function removeFromCart(id) {
  cart = cart.filter(function (item) { return item.id !== id; });
  showCart();
}

function getTotal() {
  let total = 0;
  cart.forEach(function (item) {
    total = total + findProduct(item.id).price * item.quantity;
  });
  return total;
}

function showCart() {
  localStorage.setItem("qimah-cart", JSON.stringify(cart));

  let count = 0;
  let panelHtml = "";
  let summaryHtml = "";

  cart.forEach(function (item) {
    const p = findProduct(item.id);
    count = count + item.quantity;

    panelHtml +=
      "<li><div>" +
        '<div class="cart-item-name">' + p.name + "</div>" +
        '<div class="cart-item-detail">' + formatPrice(p.price) + "</div>" +
        '<div class="cart-qty">' +
          '<button class="qty-btn" data-action="minus" data-id="' + item.id + '" aria-label="One less">&minus;</button>' +
          "<span>" + item.quantity + "</span>" +
          '<button class="qty-btn" data-action="plus" data-id="' + item.id + '" aria-label="One more">+</button>' +
        "</div>" +
      "</div>" +
      '<button class="remove-btn" data-action="remove" data-id="' + item.id + '">Remove</button></li>';

    summaryHtml +=
      "<li><span>" + p.name + " &times; " + item.quantity + "</span><span>" + formatPrice(p.price * item.quantity) + "</span></li>";
  });

  cartItems.innerHTML = panelHtml;
  cartTotal.textContent = formatPrice(getTotal());
  cartCount.textContent = count;
  cartEmpty.style.display = cart.length === 0 ? "block" : "none";
  cartCheckout.style.display = cart.length === 0 ? "none" : "";

  const summary = document.getElementById("order-summary");
  if (summary) {
    summary.innerHTML = cart.length === 0
      ? '<li>Your cart is empty. <a href="shop.html" class="link-more">Go to the shop</a></li>'
      : summaryHtml;
    document.getElementById("order-total").textContent = formatPrice(getTotal());
  }
}

cartItems.addEventListener("click", function (event) {
  const id = event.target.dataset.id;
  const action = event.target.dataset.action;
  if (action === "plus") changeQuantity(id, 1);
  if (action === "minus") changeQuantity(id, -1);
  if (action === "remove") removeFromCart(id);
});

function openCart()  { cartPanel.classList.add("is-open");    cartOverlay.classList.add("is-open"); }
function closeCart() { cartPanel.classList.remove("is-open"); cartOverlay.classList.remove("is-open"); }

document.getElementById("cart-btn").addEventListener("click", openCart);
document.getElementById("cart-close").addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") closeCart();
});

document.addEventListener("click", function (event) {
  const button = event.target.closest(".add-btn");
  if (!button) return;

  const qtyBox = document.getElementById("qty");
  addToCart(button.dataset.id, qtyBox ? Number(qtyBox.value) : 1);

  button.textContent = "Added ✓";
  button.classList.add("is-added");
  setTimeout(function () {
    button.textContent = "Add to cart";
    button.classList.remove("is-added");
  }, 1000);
});

showCart();

function productCard(p) {
  const link = "product.html?id=" + p.id;
  return '<article class="product">' +
    '<a href="' + link + '" class="product-img"><img src="' + p.image + '" alt="' + p.name + '" loading="lazy" /></a>' +
    '<div class="product-info">' +
      '<h3><a href="' + link + '">' + p.name + "</a></h3>" +
      '<p class="price">' + formatPrice(p.price) + "</p>" +
      '<button class="add-btn" data-id="' + p.id + '" aria-label="Add ' + p.name + ' to cart">Add to cart</button>' +
    "</div></article>";
}

const productList = document.getElementById("product-list");
const filterButtons = document.querySelectorAll(".filter-btn");

function showProducts(filter) {
  const shown = products.filter(function (p) {
    return filter === "all" || p.category === filter || (filter === "new" && p.isNew);
  });
  productList.innerHTML = shown.map(productCard).join("");
}

if (productList) {

  const start = new URLSearchParams(location.search).get("category") || "all";

  filterButtons.forEach(function (button) {
    button.classList.toggle("is-active", button.dataset.filter === start);

    button.addEventListener("click", function () {
      filterButtons.forEach(function (b) { b.classList.remove("is-active"); });
      button.classList.add("is-active");
      showProducts(button.dataset.filter);
    });
  });

  showProducts(start);
}

const rowPrev = document.getElementById("row-prev");
const rowNext = document.getElementById("row-next");
if (rowPrev && rowNext) {
  rowPrev.addEventListener("click", function () { productList.scrollBy({ left: -300, behavior: "smooth" }); });
  rowNext.addEventListener("click", function () { productList.scrollBy({ left: 300, behavior: "smooth" }); });
}

const detail = document.getElementById("product-detail");
if (detail) {
  const p = findProduct(new URLSearchParams(location.search).get("id"));

  if (p) {
    document.title = p.name + " | Qimah";
    detail.innerHTML =
      '<div class="detail-photo"><img src="' + p.image + '" alt="' + p.name + '" /></div>' +
      '<div class="detail-info">' +
        '<a href="shop.html" class="link-more">&larr; Back to shop</a>' +
        "<h1>" + p.name + "</h1>" +
        '<p class="price">' + formatPrice(p.price) + "</p>" +
        "<p>Made from soft, breathable fabric that is gentle on your baby's skin and built to last through every wash.</p>" +
        '<div class="qty-row"><label for="qty">Quantity</label>' +
          '<input id="qty" type="number" value="1" min="1" max="20" /></div>' +
        '<div class="detail-actions">' +
          '<button class="add-btn" data-id="' + p.id + '">Add to cart</button>' +
          '<button class="btn btn-solid" id="buy-now">Buy now</button>' +
        "</div></div>";

    document.getElementById("buy-now").addEventListener("click", function () {
      addToCart(p.id, Number(document.getElementById("qty").value));
      location.href = "checkout.html";
    });
  } else {
    detail.innerHTML = '<p>We could not find that product. <a href="shop.html" class="link-more">Go to the shop</a></p>';
  }
}

const checkoutForm = document.getElementById("checkout-form");
if (checkoutForm) {
  checkoutForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (cart.length === 0) {
      alert("Your cart is empty. Add something from the shop first.");
      return;
    }

    const f = checkoutForm.elements;
    let text = "Hello Qimah, I would like to order:\n";
    cart.forEach(function (item) {
      const p = findProduct(item.id);
      text += "- " + p.name + " x" + item.quantity + " (" + formatPrice(p.price * item.quantity) + ")\n";
    });
    text += "Total: " + formatPrice(getTotal()) + "\n\n" +
            "Name: " + f.fullname.value + "\nPhone: " + f.phone.value + "\nAddress: " + f.address.value;
    if (f.note.value) text += "\nNote: " + f.note.value;

    openWhatsApp(text);

    cart = [];
    showCart();
    document.getElementById("checkout-box").innerHTML =
      "<h2>Thank you!</h2><p>WhatsApp has opened with your order. Send the message and we will confirm it with you.</p>" +
      '<a href="shop.html" class="btn btn-solid">Keep shopping</a>';
  });
}

const contactForm = document.getElementById("contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const f = contactForm.elements;
    openWhatsApp("Hello Qimah, I'm " + f.fullname.value + " (" + f.phone.value + ").\n" + f.message.value);
    contactForm.reset();
    document.getElementById("contact-done").textContent = "Thanks! WhatsApp has opened. Send the message and we will reply soon.";
  });
}