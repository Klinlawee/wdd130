// Consolidated script for both index.html and cart.html

// Cart array initialization
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Elements
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalEl = document.getElementById('cart-total');
const cartCountEls = document.querySelectorAll('.shop-cart span');
const bars = document.querySelector('.bars');
const menu = document.querySelector('.menu');

// Update cart count and navbar total
function updateCartCount() {
    cartCountEls.forEach(el => el.textContent = cart.length);
    const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);
    document.querySelectorAll('nav h3').forEach(el => el.textContent = `$${totalPrice.toFixed(2)}`);
}

// Render cart page items
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

// Remove item on cart page
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

// Add to cart on product pages (index.html)
document.querySelectorAll('.product-box .fa-cart-shopping').forEach(icon => {
    icon.addEventListener('click', () => {
        const box = icon.closest('.product-box');
        const title = box.querySelector('p').innerText;
        const priceText = [...box.querySelectorAll('span')]
            .find(span => !span.querySelector('strike')).innerText;
        const price = parseFloat(priceText.replace('$','')) || 0;
        cart.push({ title, price });
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        alert(`${title} added to cart!`);
    });
});

// Quick view placeholder
document.querySelectorAll('.product-box .fa-eye').forEach(icon => {
    icon.addEventListener('click', () => alert('Quick view coming soon!'));
});

// Cart icon click navigates to cart page
document.querySelectorAll('.shop-cart').forEach(el => {
    el.style.cursor = 'pointer';
    el.addEventListener('click', () => window.location.href = 'cart.html');
});

// Responsive menu toggle
if (bars && menu) {
    bars.addEventListener('click', () => menu.classList.toggle('active'));
}

// Loader with minimum display time
window.addEventListener('load', () => {
    const MIN_LOAD_TIME = 2000;
    const loader = document.querySelector('.loader');
    const loaderBg = document.querySelector('.loader-bg');
    const elapsed = performance.now() - window.performance.timing.navigationStart;
    const delay = MIN_LOAD_TIME - elapsed;
    setTimeout(() => {
        loader && loader.classList.add('hidden');
        loaderBg && loaderBg.classList.add('hidden');
    }, delay > 0 ? delay : 0);
});

// Initial calls
renderCart();
updateCartCount();
