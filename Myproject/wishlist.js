// Wishlist functionality
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

// Sample product data (should match your shop.js products)
const products = [
    {
        id: 1,
        name: "Premium Running Shoes",
        category: "Sneakers",
        price: 89.99,
        oldPrice: 120.00,
        image: "images/product1.jpg",
        badge: "New",
        colors: ["black", "blue"],
        sizes: [7, 8, 9, 10],
        brand: "nike"
    },
    {
        id: 2,
        name: "Leather Winter Boots",
        category: "Boots",
        price: 129.99,
        oldPrice: 180.00,
        image: "images/product2.jpg",
        badge: "Sale",
        colors: ["brown", "black"],
        sizes: [7, 8, 9, 10, 11],
        brand: "timberland"
    },
    {
        id: 3,
        name: "Canvas Slip-Ons",
        category: "Casual",
        price: 49.99,
        image: "images/product3.jpg",
        colors: ["blue", "white"],
        sizes: [6, 7, 8, 9],
        brand: "vans"
    },
    {
        id: 4,
        name: "Oxford Dress Shoes",
        category: "Formal",
        price: 99.99,
        oldPrice: 150.00,
        image: "images/product4.jpg",
        badge: "Popular",
        colors: ["black", "brown"],
        sizes: [7, 8, 9, 10],
        brand: "clarks"
    },
    {
        id: 5,
        name: "Summer Beach Sandals",
        category: "Sandals",
        price: 29.99,
        image: "images/product5.jpg",
        colors: ["blue", "white"],
        sizes: [6, 7, 8, 9],
        brand: "adidas"
    },
    {
        id: 6,
        name: "Basketball High-Tops",
        category: "Athletic",
        price: 119.99,
        image: "images/product6.jpg",
        badge: "Limited",
        colors: ["black", "red"],
        sizes: [8, 9, 10, 11, 12],
        brand: "nike"
    }
];

function saveWishlistToLocalStorage() {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

function updateWishlistCount() {
    const count = wishlist.length;
    document.getElementById('wishlist-count').textContent = count;
    document.getElementById('wishlist-total-count').textContent = `${count} ${count === 1 ? 'item' : 'items'}`;
    return count;
}

function addToWishlist(productId) {
    if (!wishlist.includes(productId)) {
        wishlist.push(productId);
        saveWishlistToLocalStorage();
        updateWishlistCount();
        renderWishlistItems();
    }
}

function removeFromWishlist(productId) {
    wishlist = wishlist.filter(id => id !== productId);
    saveWishlistToLocalStorage();
    updateWishlistCount();
    renderWishlistItems();
    renderSuggestedProducts();
}

function clearWishlist() {
    if (wishlist.length > 0 && confirm('Are you sure you want to clear your entire wishlist?')) {
        wishlist = [];
        saveWishlistToLocalStorage();
        updateWishlistCount();
        renderWishlistItems();
        renderSuggestedProducts();
    }
}

function renderWishlistItems() {
    const wishlistContainer = document.getElementById('wishlist-items');
    wishlistContainer.innerHTML = '';

    if (wishlist.length === 0) {
        wishlistContainer.innerHTML = `
            <div class="empty-wishlist">
                <div class="empty-wishlist-icon">
                    <i class="far fa-heart"></i>
                </div>
                <p class="empty-wishlist-message">Your wishlist is empty</p>
                <a href="shop.html" class="browse-products-btn">Browse Products</a>
            </div>
        `;
        return;
    }

    wishlist.forEach(productId => {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        const wishlistItem = document.createElement('div');
        wishlistItem.className = 'wishlist-item';
        wishlistItem.dataset.id = product.id;

        let badgeHtml = '';
        if (product.badge) {
            badgeHtml = `<span class="wishlist-item-badge">${product.badge}</span>`;
        }

        let oldPriceHtml = '';
        if (product.oldPrice) {
            oldPriceHtml = `<span class="wishlist-item-old-price">$${product.oldPrice.toFixed(2)}</span>`;
        }

        wishlistItem.innerHTML = `
            <div class="wishlist-item-image">
                <img src="${product.image}" alt="${product.name}">
                ${badgeHtml}
            </div>
            <div class="wishlist-item-info">
                <span class="wishlist-item-category">${product.category}</span>
                <h3 class="wishlist-item-title">${product.name}</h3>
                <div class="wishlist-item-price">
                    <span class="wishlist-item-current-price">$${product.price.toFixed(2)}</span>
                    ${oldPriceHtml}
                </div>
                <div class="wishlist-item-actions">
                    <button class="add-to-cart-from-wishlist">
                        <i class="fas fa-cart-plus"></i> Add to Cart
                    </button>
                    <button class="remove-from-wishlist">
                        <i class="fas fa-trash"></i> Remove
                    </button>
                </div>
            </div>
        `;

        wishlistContainer.appendChild(wishlistItem);
    });

    // Add event listeners to the new buttons
    document.querySelectorAll('.add-to-cart-from-wishlist').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.closest('.wishlist-item').dataset.id);
            addToCart(productId);
            
            // Show feedback
            this.innerHTML = '<i class="fas fa-check"></i> Added!';
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-cart-plus"></i> Add to Cart';
            }, 1000);
        });
    });

    document.querySelectorAll('.remove-from-wishlist').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.closest('.wishlist-item').dataset.id);
            removeFromWishlist(productId);
        });
    });
}

function renderSuggestedProducts() {
    const suggestedContainer = document.getElementById('suggested-products');
    suggestedContainer.innerHTML = '';

    if (wishlist.length === 0) {
        // If wishlist is empty, show some featured products
        const featuredProducts = products.slice(0, 4);
        
        featuredProducts.forEach(product => {
            const productCard = createProductCard(product);
            suggestedContainer.appendChild(productCard);
        });
    } else {
        // Show products from the same categories as wishlist items
        const wishlistCategories = [];
        
        wishlist.forEach(productId => {
            const product = products.find(p => p.id === productId);
            if (product && !wishlistCategories.includes(product.category)) {
                wishlistCategories.push(product.category);
            }
        });

        // Filter products that are not already in the wishlist
        const suggestedProducts = products
            .filter(product => 
                wishlistCategories.includes(product.category) && 
                !wishlist.includes(product.id)
            )
            .slice(0, 4);

        // If not enough suggestions, add some random products
        if (suggestedProducts.length < 4) {
            const needed = 4 - suggestedProducts.length;
            const additionalProducts = products
                .filter(product => 
                    !wishlist.includes(product.id) && 
                    !suggestedProducts.includes(product)
                )
                .slice(0, needed);
            
            suggestedProducts.push(...additionalProducts);
        }

        suggestedProducts.forEach(product => {
            const productCard = createProductCard(product);
            suggestedContainer.appendChild(productCard);
        });
    }
}

function createProductCard(product) {
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    productCard.dataset.id = product.id;

    let badgeHtml = '';
    if (product.badge) {
        badgeHtml = `<span class="product-badge">${product.badge}</span>`;
    }

    let oldPriceHtml = '';
    if (product.oldPrice) {
        oldPriceHtml = `<span class="old-price">$${product.oldPrice.toFixed(2)}</span>`;
    }

    productCard.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}">
            ${badgeHtml}
        </div>
        <div class="product-info">
            <span class="product-category">${product.category}</span>
            <h3 class="product-title">${product.name}</h3>
            <div class="product-price">
                <span class="current-price">$${product.price.toFixed(2)}</span>
                ${oldPriceHtml}
            </div>
            <div class="product-actions">
                <button class="add-to-cart">Add to Cart</button>
                <button class="add-to-wishlist"><i class="far fa-heart"></i></button>
            </div>
        </div>
    `;

    // Add event listeners
    productCard.querySelector('.add-to-cart').addEventListener('click', function() {
        addToCart(product.id);
        this.textContent = 'Added!';
        setTimeout(() => {
            this.textContent = 'Add to Cart';
        }, 1000);
    });

    productCard.querySelector('.add-to-wishlist').addEventListener('click', function() {
        addToWishlist(product.id);
        this.innerHTML = '<i class="fas fa-heart"></i>';
        renderSuggestedProducts();
    });

    return productCard;
}

// Share wishlist functionality
function shareWishlist() {
    if (wishlist.length === 0) {
        alert('Your wishlist is empty. Add some items to share!');
        return;
    }

    const shareText = `Check out my wishlist from ByNeX Import:\n\n` +
        wishlist.map(id => {
            const product = products.find(p => p.id === id);
            return product ? `${product.name} - $${product.price.toFixed(2)}` : '';
        }).filter(Boolean).join('\n') +
        `\n\nView more at: ${window.location.href}`;

    if (navigator.share) {
        navigator.share({
            title: 'My ByNeX Import Wishlist',
            text: shareText,
            url: window.location.href
        }).catch(err => {
            console.log('Error sharing:', err);
            fallbackShare(shareText);
        });
    } else {
        fallbackShare(shareText);
    }
}

function fallbackShare(text) {
    // Copy to clipboard
    navigator.clipboard.writeText(text).then(() => {
        alert('Wishlist copied to clipboard! You can now paste it to share.');
    }).catch(err => {
        console.error('Could not copy text: ', err);
        prompt('Copy this wishlist to share:', text);
    });
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Load wishlist from localStorage
    wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    
    // Update counts and render
    updateWishlistCount();
    renderWishlistItems();
    renderSuggestedProducts();
    
    // Add event listeners
    document.querySelector('.share-wishlist').addEventListener('click', shareWishlist);
    document.querySelector('.clear-wishlist').addEventListener('click', clearWishlist);
});

// Cart functions (from shop.js - needed for add to cart functionality)
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(productId, quantity = 1) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity
        });
    }
    
    saveCartToLocalStorage();
    updateCartCount();
}

function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartCount() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cart-count').textContent = totalItems;
    document.getElementById('cart-total').textContent = getCartTotal().toFixed(2);
    document.getElementById('sidebar-cart-total').textContent = `$${getCartTotal().toFixed(2)}`;
}

function getCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}
