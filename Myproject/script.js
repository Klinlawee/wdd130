// Consolidated script for both index.html (product pages) and cart.html (cart page)

// =======================
// Cart Initialization
// =======================
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// =======================
// Element References
// =======================
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalEl = document.getElementById('cart-total');
const cartCountEls = document.querySelectorAll('.shop-cart span');
const bars = document.querySelector('.bars');
const menu = document.querySelector('.menu');
const mobileMenu = document.querySelector('.mobile-menu');
const menuToggle = document.getElementById('menu-toggle');

// =======================
// Cart Count & Total Update
// =======================
function updateCartCount() {
    cartCountEls.forEach(el => el.textContent = cart.length);
    const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);
    document.querySelectorAll('nav h3').forEach(el => el.textContent = `$${totalPrice.toFixed(2)}`);
}

// =======================
// Render Cart Page
// =======================
function renderCart() {
    if (!cartItemsContainer) return;
    cartItemsContainer.innerHTML = '';
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
        cartTotalEl.textContent = '$0.00';
        updateCartCount();
        return;
    }
    let total = 0;
    cart.forEach((item, idx) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        itemDiv.innerHTML = `
            <span class="cart-item-title">${item.title}</span>
            <span class="cart-item-price">$${item.price.toFixed(2)}</span>
            <button class="remove-btn" data-index="${idx}"><i class="fa-solid fa-trash"></i></button>
        `;
        cartItemsContainer.appendChild(itemDiv);
        total += item.price;
    });
    cartTotalEl.textContent = `$${total.toFixed(2)}`;
    updateCartCount();
}

// =======================
// Remove & Clear Cart Handlers
// =======================
if (cartItemsContainer) {
    cartItemsContainer.addEventListener('click', e => {
        const btn = e.target.closest('.remove-btn');
        if (!btn) return;
        cart.splice(btn.dataset.index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
    });
    document.getElementById('clear-cart').addEventListener('click', () => {
        if (confirm('Are you sure you want to clear your cart?')) {
            cart = [];
            localStorage.setItem('cart', JSON.stringify(cart));
            renderCart();
        }
    });
}

// =======================
// Add to Cart on Product Pages
// =======================
document.querySelectorAll('.product-box .fa-cart-shopping').forEach(icon => {
    icon.addEventListener('click', () => {
        const box = icon.closest('.product-box');
        const title = box.querySelector('p').innerText;
        const priceText = [...box.querySelectorAll('span')]
            .find(span => !span.querySelector('strike')).innerText;
        const price = parseFloat(priceText.replace('$', '')) || 0;
        cart.push({ title, price });
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        alert(`${title} added to cart!`);
    });
});

// =======================
// Quick View Placeholder
// =======================
document.querySelectorAll('.product-box .fa-eye').forEach(icon => {
    icon.addEventListener('click', () => alert('Quick view coming soon!'));
});

// =======================
// Cart Icon Click Navigation
// =======================
document.querySelectorAll('.shop-cart').forEach(el => {
    el.style.cursor = 'pointer';
    el.addEventListener('click', () => window.location.href = 'cart.html');
});

// =======================
// Responsive Desktop Menu Toggle
// =======================
if (bars && menu) {
    bars.addEventListener('click', () => menu.classList.toggle('active'));
}

// =======================
// Responsive Mobile Menu Toggle
// =======================
if (mobileMenu && menuToggle) {
    mobileMenu.classList.add('hidden');
    menuToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('show');
        mobileMenu.classList.toggle('hidden');
    });
}

// =======================
// Loader: Hide Immediately on Load
// =======================
window.addEventListener('load', () => {
    document.querySelector('.loader')?.classList.add('hidden');
    document.querySelector('.loader-bg')?.classList.add('hidden');
});

// =======================
// Initial Calls
// =======================
renderCart();
updateCartCount();
// Update cart count on page load
updateCartCount();  