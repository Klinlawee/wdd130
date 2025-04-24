// =======================
// Cart Initialization
// =======================
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let wishlistCount = parseInt(localStorage.getItem('wishlistCount')) || 0;

// =======================
// Element References
// =======================
const cartCountEls = document.querySelectorAll('.shop-cart span');
const wishlistOutput = document.getElementById('wishlist-count');
const bars = document.querySelector('.bars');
const menu = document.querySelector('.menu');
const mobileMenu = document.querySelector('.mobile-menu');
const menuToggle = document.getElementById('menu-toggle');

// =======================
// Cart Functions
// =======================
function updateCartCount() {
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountEls.forEach(el => el.textContent = totalCount);
    
    // Update cart total in navigation if exists
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.querySelectorAll('nav h3').forEach(el => {
        el.textContent = `$${totalPrice.toFixed(2)}`;
    });
}

function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// =======================
// Add to Cart Functionality
// =======================
document.querySelectorAll('.product-box .fa-cart-shopping').forEach(icon => {
    icon.addEventListener('click', () => {
        const box = icon.closest('.product-box');
        const name = box.querySelector('p').innerText;
        const priceText = [...box.querySelectorAll('span')]
            .find(span => !span.querySelector('strike'))?.innerText || '$0';
        const price = parseFloat(priceText.replace('$', '')) || 0;
        const image = box.querySelector('img')?.src || '';
        
        // Generate a consistent ID for home page products
        const id = 'home-' + name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();

        // Check if item already exists in cart
        const existingItem = cart.find(item => item.id === id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id,
                name,
                price,
                image,
                quantity: 1
            });
        }

        saveCartToLocalStorage();
        updateCartCount();
        
        // Show added notification
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = `${name} added to cart!`;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }, 2000);
        }, 10);
    });
});

// =======================
// Wishlist Functionality
// =======================
document.querySelectorAll('.product-box .fa-heart').forEach(icon => {
    icon.addEventListener('click', () => {
        wishlistCount++;
        if (wishlistOutput) {
            wishlistOutput.textContent = wishlistCount;
        }
        localStorage.setItem('wishlistCount', wishlistCount);
        
        // Show wishlist notification
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = 'Added to wishlist!';
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }, 2000);
        }, 10);
    });
});

// =======================
// Navigation Handlers
// =======================
document.querySelectorAll('.shop-cart').forEach(el => {
    el.style.cursor = 'pointer';
    el.addEventListener('click', (e) => {
        e.preventDefault();
        saveCartToLocalStorage();
        window.location.href = 'cart.html';
    });
});

document.querySelectorAll('.view-cart-btn, .checkout-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        saveCartToLocalStorage();
    });
});

// =======================
// Quick View Functionality
// =======================
document.querySelectorAll('.product-box .fa-eye').forEach(icon => {
    icon.addEventListener('click', () => {
        const box = icon.closest('.product-box');
        const name = box.querySelector('p').innerText;
        const priceText = [...box.querySelectorAll('span')]
            .find(span => !span.querySelector('strike'))?.innerText || '$0';
        
        // Show quick view modal or alert
        alert(`Quick View:\n${name}\nPrice: ${priceText}`);
    });
});

// =======================
// Responsive Menu Toggles
// =======================
if (bars && menu) {
    bars.addEventListener('click', () => {
        menu.classList.toggle('active');
        // Close mobile menu if open
        mobileMenu.querySelector('.mobile-menu-list').classList.remove('active');
    });
}

if (menuToggle && mobileMenu) {
    const mobileMenuList = mobileMenu.querySelector('.mobile-menu-list');
    mobileMenuList.classList.add('hidden');
    
    menuToggle.addEventListener('click', () => {
        mobileMenuList.classList.toggle('active');
        mobileMenuList.classList.toggle('hidden');
        // Close desktop menu if open
        menu.classList.remove('active');
    });
}

// =======================
// Page Loader
// =======================
window.addEventListener('load', () => {
    const loader = document.querySelector('.loader');
    const loaderBg = document.querySelector('.loader-bg');
    
    if (loader && loaderBg) {
        loader.classList.add('hidden');
        loaderBg.classList.add('hidden');
    }
});

// =======================
// Initialize Page
// =======================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize cart count
    updateCartCount();
    
    // Initialize wishlist count
    if (wishlistOutput) {
        wishlistOutput.textContent = wishlistCount;
    }
    
    // Close all menus when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.menu') && !e.target.closest('.bars')) {
            menu.classList.remove('active');
        }
        if (!e.target.closest('.mobile-menu') && !e.target.closest('#menu-toggle')) {
            mobileMenu.querySelector('.mobile-menu-list').classList.remove('active');
        }
    });
});