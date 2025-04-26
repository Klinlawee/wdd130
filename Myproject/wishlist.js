document.addEventListener('DOMContentLoaded', function() {
    const wishlistItemsContainer = document.getElementById('wishlist-items');
    const suggestedProductsContainer = document.getElementById('suggested-products');
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    
    // Get products from shop if available
    const shopProducts = window.products || [];
    
    // Initialize page
    updateWishlistCount();
    if (wishlist.length > 0) {
        loadWishlistItems();
        loadSuggestedProducts();
    } else {
        showEmptyWishlist();
    }
    
    // Clear wishlist button
    document.querySelector('.clear-wishlist')?.addEventListener('click', clearWishlist);
    
    function loadWishlistItems() {
        let html = '';
        
        wishlist.forEach(product => {
            // Check if it's a full product object or just an ID
            const productData = typeof product === 'object' ? product : 
                shopProducts.find(p => p.id == product);
            
            if (productData) {
                html += `
                    <div class="wishlist-item" data-product-id="${productData.id}">
                        <div class="wishlist-item-image">
                            <img src="${productData.image}" alt="${productData.name}">
                        </div>
                        <div class="wishlist-item-details">
                            <h3 class="wishlist-item-title">${productData.name}</h3>
                            <div class="wishlist-item-price">$${productData.price.toFixed(2)}</div>
                            <div class="wishlist-item-availability">In Stock</div>
                        </div>
                        <div class="wishlist-item-actions">
                            <button class="add-to-cart" data-id="${productData.id}">Add to Cart</button>
                            <button class="remove-from-wishlist" data-product-id="${productData.id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `;
            }
        });
        
        wishlistItemsContainer.innerHTML = html || showEmptyWishlist();
        addItemEventListeners();
    }
    
    function loadSuggestedProducts() {
        const wishlistIds = wishlist.map(item => 
            typeof item === 'object' ? item.id : item
        );
        const suggestedProducts = shopProducts.filter(p => !wishlistIds.includes(p.id));
        
        let html = '';
        suggestedProducts.slice(0, 4).forEach(product => {
            html += `
                <div class="product-card">
                    <div class="product-image">
                        <img src="${product.image}" alt="${product.name}">
                    </div>
                    <div class="product-info">
                        <h3 class="product-title">${product.name}</h3>
                        <div class="product-price">$${product.price.toFixed(2)}</div>
                        <button class="add-to-wishlist" data-id="${product.id}">
                            <i class="far fa-heart"></i>
                        </button>
                    </div>
                </div>
            `;
        });
        
        suggestedProductsContainer.innerHTML = html;
    }
    
    function addItemEventListeners() {
        document.querySelectorAll('.remove-from-wishlist').forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.getAttribute('data-product-id');
                removeFromWishlist(productId);
            });
        });
        
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.getAttribute('data-id');
                addToCart(productId);
            });
        });
    }
    
    function removeFromWishlist(productId) {
        const updatedWishlist = wishlist.filter(item => {
            if (typeof item === 'object') {
                return item.id !== productId;
            }
            return item != productId;
        });
        
        localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
        updateWishlistCount();
        
        if (updatedWishlist.length > 0) {
            loadWishlistItems();
            loadSuggestedProducts();
        } else {
            showEmptyWishlist();
        }
    }
    
    function clearWishlist() {
        if (confirm('Are you sure you want to clear your entire wishlist?')) {
            localStorage.removeItem('wishlist');
            updateWishlistCount();
            showEmptyWishlist();
        }
    }
    
    function showEmptyWishlist() {
        wishlistItemsContainer.innerHTML = `
            <div class="empty-wishlist">
                <i class="far fa-heart"></i>
                <h3>Your wishlist is empty</h3>
                <p>You haven't added any items to your wishlist yet.</p>
                <a href="shop.html" class="shop-btn">Continue Shopping</a>
            </div>
        `;
    }
    
    function updateWishlistCount() {
        const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        const countElements = document.querySelectorAll('#wishlist-count, #wishlist-total-count');
        
        countElements.forEach(el => {
            if (el.id === 'wishlist-count') {
                el.textContent = wishlist.length;
            } else if (el.id === 'wishlist-total-count') {
                el.textContent = `${wishlist.length} ${wishlist.length === 1 ? 'item' : 'items'}`;
            }
        });
    }
    
    function addToCart(productId) {
        // Implement your cart functionality here
        console.log(`Added product ${productId} to cart`);
        showNotification('Added to cart!');
    }
});