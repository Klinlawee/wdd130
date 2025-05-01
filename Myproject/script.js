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
document.querySelectorAll('.product-box .add-to-wishlist').forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        const box = button.closest('.product-box');
        const name = box.querySelector('p').innerText;
        const priceText = [...box.querySelectorAll('span')]
            .find(span => !span.querySelector('strike'))?.innerText || '$0';
        const price = parseFloat(priceText.replace('$', '')) || 0;
        const image = box.querySelector('img')?.src || '';
        const id = 'home-' + name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
        
        // Get existing wishlist or create new one
        let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        
        // Check if product already exists in wishlist
        const existingItem = wishlist.find(item => item.id === id);
        
        if (!existingItem) {
            // Add new item to wishlist
            wishlist.push({
                id,
                name,
                price,
                image
            });
            
            // Save to localStorage
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
            
            // Update wishlist count display
            updateWishlistCount();
            
            // Show notification
            showNotification('Added to wishlist!');
        }
    });
});

// Add this helper function somewhere in your script
function updateWishlistCount() {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const countElements = document.querySelectorAll('#wishlist-count, #wishlist-total-count');
    
    countElements.forEach(el => {
        if (el.id === 'wishlist-count') {
            el.textContent = wishlist.length;
        }
    });
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }, 10);
}
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
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileMenuList = document.querySelector('.mobile-menu-list');

if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent event bubbling
        mobileMenuList.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.mobile-menu') && !e.target.closest('#menu-toggle')) {
            mobileMenuList.classList.remove('active');
        }
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