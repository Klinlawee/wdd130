// JavaScript code for the shop functionality
// Sample product data
const products = [
    {
        id: 1,
        name: "Classic Leather Boots",
        category: "Men's Footwear",
        price: 120.00,
        oldPrice: 150.00,
        image: "images/men_1.jpg",
        colors: ["black", "brown"],
        sizes: [7, 8, 9, 10],
        brand: "timberland",
        rating: 4.5,
        badge: "Sale"
    },
    {
        id: 2,
        name: "Winter Snow Boots",
        category: "Women's Footwear",
        price: 99.99,
        oldPrice: 129.99,
        image: "images/men_3.jpg",
        colors: ["black", "white"],
        sizes: [5, 6, 7, 8],
        brand: "nike",
        rating: 4.2,
        badge: "New"
    },
    {
        id: 3,
        name: "Urban Sneakers",
        category: "Men's Footwear",
        price: 75.50,
        image: "images/men_1.jpg",
        colors: ["black", "blue", "white"],
        sizes: [7, 8, 9, 10, 11],
        brand: "adidas",
        rating: 4.7,
        badge: "Popular"
    },
    {
        id: 4,
        name: "Hiking Boots",
        category: "Men's Footwear",
        price: 145.00,
        oldPrice: 180.00,
        image: "images/women-1.jpg",
        colors: ["brown"],
        sizes: [8, 9, 10, 11],
        brand: "timberland",
        rating: 4.8,
        badge: "Sale"
    },
    {
        id: 5,
        name: "Casual Loafers",
        category: "Men's Footwear",
        price: 65.00,
        image: "images/women-2.jpg",
        colors: ["black", "brown"],
        sizes: [7, 8, 9, 10],
        brand: "clarks",
        rating: 4.3
    },
    {
        id: 6,
        name: "Ankle Boots",
        category: "Women's Footwear",
        price: 89.99,
        oldPrice: 110.00,
        image: "images/women-3.jpg",
        colors: ["black", "red"],
        sizes: [5, 6, 7, 8],
        brand: "puma",
        rating: 4.1,
        badge: "Sale"
    },
    {
        id: 7,
        name: "Running Shoes",
        category: "Men's Footwear",
        price: 95.00,
        image: "images/men-side-pocket.jpg",
        colors: ["blue", "white"],
        sizes: [7, 8, 9, 10, 11],
        brand: "nike",
        rating: 4.6
    },
    {
        id: 8,
        name: "Fashion Heels",
        category: "Women's Footwear",
        price: 110.00,
        oldPrice: 135.00,
        image: "images/women-fashion.jpg",
        colors: ["black", "red"],
        sizes: [5, 6, 7],
        brand: "puma",
        rating: 4.4,
        badge: "Sale"
    },
    {
        id: 9,
        name: "Canvas Sneakers",
        category: "Women's Footwear",
        price: 55.00,
        image: "images/women-red.jpg",
        colors: ["white", "blue"],
        sizes: [5, 6, 7, 8],
        brand: "adidas",
        rating: 4.0
    }
    // ... (keep all your other product objects as they are)
];

// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let wishlist = [];

// DOM elements
const productsContainer = document.getElementById('products-container');
const cartSidebar = document.getElementById('cart-sidebar');
const cartItemsContainer = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const wishlistCount = document.getElementById('wishlist-count');
const cartTotal = document.getElementById('cart-total');
const sidebarCartTotal = document.getElementById('sidebar-cart-total');
const cartIcon = document.querySelector('.shop-cart');
const closeCartBtn = document.getElementById('close-cart');
const sortSelect = document.getElementById('sort');
const viewOptions = document.querySelectorAll('.view-options span');
const priceRange = document.getElementById('price-range');

// Initialize the shop
function initShop() {
    // Load cart from localStorage
    cart = JSON.parse(localStorage.getItem('cart')) || [];
    wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    
    displayProducts(products);
    setupEventListeners();
    updateCartCount();
    updateWishlistCount();
}

// Display products
function displayProducts(productsToDisplay) {
    productsContainer.innerHTML = '';
    
    productsToDisplay.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
            </div>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-title">${product.name}</h3>
                <div class="product-price">
                    <span class="current-price">$${product.price.toFixed(2)}</span>
                    ${product.oldPrice ? `<span class="old-price">$${product.oldPrice.toFixed(2)}</span>` : ''}
                </div>
                <div class="product-actions">
                    <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
                    <button class="add-to-wishlist" data-id="${product.id}">
                        <i class="far fa-heart"></i>
                    </button>
                    <button class="quick-view" data-id="${product.id}">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
        `;
        
        productsContainer.appendChild(productCard);
    });
}

// Setup event listeners
function setupEventListeners() {
    // Cart icon click
    cartIcon.addEventListener('click', toggleCart);
    
    // Close cart button
    closeCartBtn.addEventListener('click', toggleCart);
    
    // Sort products
    sortSelect.addEventListener('change', sortProducts);
    
    // View options
    viewOptions.forEach(option => {
        option.addEventListener('click', changeView);
    });
    
    // Price range filter
    priceRange.addEventListener('input', updatePriceRangeValue);
    
    // Delegate events for dynamic elements
    productsContainer.addEventListener('click', function(e) {
        // Add to cart
        if (e.target.classList.contains('add-to-cart') || e.target.closest('.add-to-cart')) {
            const button = e.target.classList.contains('add-to-cart') ? e.target : e.target.closest('.add-to-cart');
            const productId = parseInt(button.getAttribute('data-id'));
            addToCart(productId);
        }
        
        // Add to wishlist
        if (e.target.classList.contains('add-to-wishlist') || e.target.closest('.add-to-wishlist')) {
            const button = e.target.classList.contains('add-to-wishlist') ? e.target : e.target.closest('.add-to-wishlist');
            const productId = parseInt(button.getAttribute('data-id'));
            addToWishlist(productId);
        }
        
        // Quick view
        if (e.target.classList.contains('quick-view') || e.target.closest('.quick-view')) {
            const button = e.target.classList.contains('quick-view') ? e.target : e.target.closest('.quick-view');
            const productId = parseInt(button.getAttribute('data-id'));
            quickViewProduct(productId);
        }
    });
    
    // Cart items container events
    // Cart items container events
cartItemsContainer.addEventListener('click', function(e) {
    // Handle remove item
    if (e.target.classList.contains('remove-item')) {
        const productId = parseInt(e.target.getAttribute('data-id'));
        removeFromCart(productId);
        return;
    }
    
    // Handle quantity changes
    const quantityBtn = e.target.closest('.decrease-quantity, .increase-quantity');
    if (quantityBtn) {
        const productId = parseInt(quantityBtn.getAttribute('data-id'));
        const isIncrease = quantityBtn.classList.contains('increase-quantity');
        updateQuantity(productId, isIncrease ? 1 : -1);
    }
});
    
    // Navigation buttons
    document.querySelector('.view-cart-btn')?.addEventListener('click', function() {
        saveCartToLocalStorage();
        window.location.href = 'cart.html';
    });
    
    document.querySelector('.checkout-btn')?.addEventListener('click', function() {
        saveCartToLocalStorage();
        window.location.href = 'checkout.html';
    });
}

// Toggle cart sidebar
function toggleCart() {
    cartSidebar.classList.toggle('open');
    if (cartSidebar.classList.contains('open')) {
        renderCartItems();
    }
}

// Add to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    updateCartCount();
    renderCartItems();
    saveCartToLocalStorage();
    showNotification(`${product.name} added to cart`);
}

// Remove from cart
function removeFromCart(productId) {
    const product = products.find(p => p.id === productId);
    cart = cart.filter(item => item.id !== productId);
    updateCartCount();
    renderCartItems();
    saveCartToLocalStorage();
    
    if (product) {
        showNotification(`${product.name} removed from cart`);
    }
}

// Update quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        item.quantity += change;
        
        // Ensure quantity doesn't go below 1
        if (item.quantity < 1) {
            item.quantity = 1;
        }
        
        updateCartCount();
        renderCartItems();
        saveCartToLocalStorage();
    }
}

// Render cart items
function renderCartItems() {
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        sidebarCartTotal.textContent = '$0.00';
        cartTotal.textContent = '0.00';
        return;
    }
    
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
                <h4 class="cart-item-title">${item.name}</h4>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                <div class="cart-item-quantity">
                    <button class="decrease-quantity" data-id="${item.id}">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="increase-quantity" data-id="${item.id}">+</button>
                </div>
                <div class="cart-item-total">$${itemTotal.toFixed(2)}</div>
                <button class="remove-item" data-id="${item.id}">Remove</button>
            </div>
        `;
        
        cartItemsContainer.appendChild(cartItem);
    });
    
    sidebarCartTotal.textContent = `$${total.toFixed(2)}`;
    cartTotal.textContent = total.toFixed(2);
}

// Add to wishlist
function addToWishlist(productId) {
    const product = products.find(p => p.id === productId);
    
    if (!product) return;
    
    const existingItem = wishlist.find(item => item.id === productId);
    
    if (!existingItem) {
        wishlist.push(product);
        updateWishlistCount();
        saveWishlistToLocalStorage();
        showNotification(`${product.name} added to wishlist`);
    } else {
        showNotification(`${product.name} is already in your wishlist`);
    }
}

// Save cart to localStorage
function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Save wishlist to localStorage
function saveWishlistToLocalStorage() {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

// Update cart count
function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = count;
}

// Update wishlist count
function updateWishlistCount() {
    wishlistCount.textContent = wishlist.length;
}

// Sort products
function sortProducts() {
    const sortValue = sortSelect.value;
    let sortedProducts = [...products];
    
    switch (sortValue) {
        case 'price-low':
            sortedProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            sortedProducts.sort((a, b) => b.price - a.price);
            break;
        case 'name':
            sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'popularity':
            sortedProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            break;
        case 'newest':
            sortedProducts.sort((a, b) => b.id - a.id);
            break;
        default:
            sortedProducts.sort((a, b) => a.id - b.id);
    }
    
    displayProducts(sortedProducts);
}

// Change view (grid/list)
function changeView(e) {
    const view = e.currentTarget.getAttribute('data-view');
    
    viewOptions.forEach(option => {
        option.classList.remove('active');
    });
    
    e.currentTarget.classList.add('active');
    
    if (view === 'grid') {
        productsContainer.classList.remove('list-view');
    } else {
        productsContainer.classList.add('list-view');
    }
}

// Update price range value display
function updatePriceRangeValue() {
    // Implement price range display if needed
}

// Quick view product
function quickViewProduct(productId) {
    const product = products.find(p => p.id === productId);
    
    if (product) {
        alert(`Quick view: ${product.name}\nPrice: $${product.price.toFixed(2)}\n${product.category}`);
    }
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}
window.addEventListener('load', () => {
    const loader = document.querySelector('.loader');
    const loaderBg = document.querySelector('.loader-bg');
    
    if (loader && loaderBg) {
        loader.classList.add('hidden');
        loaderBg.classList.add('hidden');
    }
});

// Initialize the shop when DOM is loaded
document.addEventListener('DOMContentLoaded', initShop);
