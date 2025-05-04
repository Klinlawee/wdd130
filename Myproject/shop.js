// JavaScript code for the shop functionality
// Sample product data (should be loaded from external JSON or API)
const products = window.products || [];

// Initialize cart and wishlist from localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
let currentPreviewIndex = 0;
let currentProductImages = [];
let previewKeyHandler = null;

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

// Main initialization function
function initShop() {
    // Auto-fill missing "image" property for all products
    products.forEach(product => {
        if (!product.image && product.images && product.images.length > 0) {
            product.image = product.images[0];
        }
    });

    displayProducts(products);
    setupEventListeners();
    updateCartCount();
    updateWishlistCount();
    initWishlistButtons();
    setupProductPreview();
    setupCategoryFiltering();
    setupPriceFilter();
    setupSizeFilter();
    setupColorFilter();
    setupBrandFilter();
    setupPagination();
    setupSearch();
    setupClearFilters();
}

// =======================
// FILTERING FUNCTIONALITY
// =======================

function setupCategoryFiltering() {
    const categoryLinks = document.querySelectorAll('.category-list a');
    
    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.textContent.trim();
            
            categoryLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            applyAllFilters();
        });
    });
}

function setupPriceFilter() {
    const priceRange = document.getElementById('price-range');
    const filterBtn = document.querySelector('.price-range .filter-btn');
    const priceDisplay = document.createElement('div');
    priceDisplay.className = 'current-price-display';
    priceRange.parentNode.insertBefore(priceDisplay, priceRange.nextSibling);
    
    priceRange.addEventListener('input', function() {
        priceDisplay.textContent = `Max: $${this.value}`;
    });
    
    filterBtn.addEventListener('click', applyAllFilters);
}

function setupSizeFilter() {
    const sizeCheckboxes = document.querySelectorAll('.size-options input[type="checkbox"]');
    
    sizeCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', applyAllFilters);
    });
}

function setupColorFilter() {
    const colorBoxes = document.querySelectorAll('.color-options .color-box');
    
    colorBoxes.forEach(box => {
        box.addEventListener('click', function() {
            this.classList.toggle('active');
            applyAllFilters();
        });
    });
}

function setupBrandFilter() {
    const brandCheckboxes = document.querySelectorAll('.brand-options input[type="checkbox"]');
    
    brandCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', applyAllFilters);
    });
}

function setupPagination() {
    const paginationLinks = document.querySelectorAll('.pagination a');
    const itemsPerPage = 12;
    let currentPage = 1;
    
    function updatePagination() {
        const totalPages = Math.ceil(products.length / itemsPerPage);
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedProducts = products.slice(startIndex, endIndex);
        
        displayProducts(paginatedProducts);
        
        paginationLinks.forEach((link, index) => {
            if (index === currentPage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    
    paginationLinks.forEach((link, index) => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (this.classList.contains('prev') && currentPage > 1) {
                currentPage--;
            } else if (this.classList.contains('next') && currentPage < Math.ceil(products.length / itemsPerPage)) {
                currentPage++;
            } else if (!isNaN(index)) {
                currentPage = index;
            }
            
            updatePagination();
        });
    });
    
    updatePagination();
}

function setupSearch() {
    const searchIcon = document.querySelector('.fa-magnifying-glass');
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search products...';
    searchInput.className = 'search-input';
    
    searchIcon.addEventListener('click', function() {
        this.parentNode.insertBefore(searchInput, this.nextSibling);
        searchInput.focus();
    });
    
    searchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            const searchTerm = this.value.toLowerCase();
            
            if (searchTerm.trim() === '') {
                displayProducts(products);
                return;
            }
            
            const filteredProducts = products.filter(product => 
                product.name.toLowerCase().includes(searchTerm) ||
                product.description.toLowerCase().includes(searchTerm) ||
                product.category.toLowerCase().includes(searchTerm)
            );
            
            displayProducts(filteredProducts);
        }
    });
    
    document.addEventListener('click', function(e) {
        if (!e.target.classList.contains('fa-magnifying-glass') && 
            !e.target.classList.contains('search-input')) {
            if (searchInput.parentNode) {
                searchInput.parentNode.removeChild(searchInput);
            }
        }
    });
}

function applyAllFilters() {
    const activeCategory = document.querySelector('.category-list a.active')?.textContent.trim();
    const maxPrice = parseInt(document.getElementById('price-range').value);
    const selectedSizes = Array.from(document.querySelectorAll('.size-options input[type="checkbox"]:checked'))
        .map(cb => cb.value);
    const activeColors = Array.from(document.querySelectorAll('.color-box.active'))
        .map(el => el.getAttribute('data-color'));
    const selectedBrands = Array.from(document.querySelectorAll('.brand-options input[type="checkbox"]:checked'))
        .map(cb => cb.value);
    
    let filteredProducts = [...products];
    
    if (activeCategory && activeCategory !== 'All Products') {
        filteredProducts = filteredProducts.filter(product => 
            product.category.toLowerCase().includes(activeCategory.toLowerCase())
        );
    }
    
    if (maxPrice < 1000) {
        filteredProducts = filteredProducts.filter(product => product.price <= maxPrice);
    }
    
    if (selectedSizes.length > 0) {
        filteredProducts = filteredProducts.filter(product => 
            product.sizes && product.sizes.some(size => 
                selectedSizes.includes(size.toString())
            )
        );
    }
    
    if (activeColors.length > 0) {
        filteredProducts = filteredProducts.filter(product => 
            product.color && activeColors.includes(product.color.toLowerCase())
        );
    }
    
    if (selectedBrands.length > 0) {
        filteredProducts = filteredProducts.filter(product => 
            product.brand && selectedBrands.includes(product.brand.toLowerCase())
        );
    }
    
    displayProducts(filteredProducts);
}

function setupClearFilters() {
    const clearBtn = document.querySelector('.clear-filters-btn');
    
    clearBtn.addEventListener('click', function() {
        document.querySelectorAll('.category-list a').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector('.category-list a:first-child').classList.add('active');
        
        document.getElementById('price-range').value = 1000;
        document.querySelector('.current-price-display').textContent = '';
        
        document.querySelectorAll('.size-options input[type="checkbox"]').forEach(cb => {
            cb.checked = false;
        });
        
        document.querySelectorAll('.color-box').forEach(box => {
            box.classList.remove('active');
        });
        
        document.querySelectorAll('.brand-options input[type="checkbox"]').forEach(cb => {
            cb.checked = false;
        });
        
        displayProducts(products);
    });
}

// =======================
// PRODUCT DISPLAY FUNCTIONALITY
// =======================

function displayProducts(productsToDisplay) {
    productsContainer.innerHTML = '';
    updateProductCount(productsToDisplay.length);
    
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
                    <button class="add-to-wishlist" data-id="${product.id}" data-product-id="${product.id}">
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

function updateProductCount(filteredCount) {
    const showingCount = document.getElementById('showing-count');
    const totalCount = document.getElementById('total-count');
    
    showingCount.textContent = filteredCount;
    totalCount.textContent = products.length;
}

// =======================
// CART FUNCTIONALITY
// =======================

function setupEventListeners() {
    cartIcon.addEventListener('click', toggleCart);
    closeCartBtn.addEventListener('click', toggleCart);
    sortSelect.addEventListener('change', sortProducts);
    
    viewOptions.forEach(option => {
        option.addEventListener('click', changeView);
    });
    
    priceRange.addEventListener('input', updatePriceRangeValue);
    
    productsContainer.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart') || e.target.closest('.add-to-cart')) {
            const button = e.target.classList.contains('add-to-cart') ? e.target : e.target.closest('.add-to-cart');
            const productId = parseInt(button.getAttribute('data-id'));
            addToCart(productId);
        }
        
        if (e.target.classList.contains('add-to-wishlist') || e.target.closest('.add-to-wishlist')) {
            const button = e.target.classList.contains('add-to-wishlist') ? e.target : e.target.closest('.add-to-wishlist');
            const productId = parseInt(button.getAttribute('data-id'));
            toggleWishlist(productId);
        }
        
        if (e.target.classList.contains('quick-view') || e.target.closest('.quick-view')) {
            const button = e.target.classList.contains('quick-view') ? e.target : e.target.closest('.quick-view');
            const productId = parseInt(button.getAttribute('data-id'));
            quickViewProduct(productId);
        }
    });
    
    cartItemsContainer.addEventListener('click', function(e) {
        if (e.target.classList.contains('remove-item')) {
            const productId = parseInt(e.target.getAttribute('data-id'));
            removeFromCart(productId);
            return;
        }
        
        const quantityBtn = e.target.closest('.decrease-quantity, .increase-quantity');
        if (quantityBtn) {
            const productId = parseInt(quantityBtn.getAttribute('data-id'));
            const isIncrease = quantityBtn.classList.contains('increase-quantity');
            updateQuantity(productId, isIncrease ? 1 : -1);
        }
    });
    
    document.querySelector('.view-cart-btn')?.addEventListener('click', function() {
        saveCartToLocalStorage();
        window.location.href = 'cart.html';
    });
    
    document.querySelector('.checkout-btn')?.addEventListener('click', function() {
        saveCartToLocalStorage();
        window.location.href = 'checkout.html';
    });
}

function toggleCart() {
    cartSidebar.classList.toggle('open');
    if (cartSidebar.classList.contains('open')) {
        renderCartItems();
    }
}

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

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        item.quantity += change;
        
        if (item.quantity < 1) {
            item.quantity = 1;
        }
        
        updateCartCount();
        renderCartItems();
        saveCartToLocalStorage();
    }
}

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

function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = count;
}

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

function updatePriceRangeValue() {
    // Implement if needed
}

// =======================
// WISHLIST FUNCTIONALITY
// =======================

function toggleWishlist(productId) {
    const index = wishlist.indexOf(productId);
    if (index === -1) {
        wishlist.push(productId);
    } else {
        wishlist.splice(index, 1);
    }
    
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    updateWishlistCount();
    
    const buttons = document.querySelectorAll(`[data-product-id="${productId}"]`);
    buttons.forEach(button => {
        button.classList.toggle('active');
        const icon = button.querySelector('i');
        if (icon) {
            icon.className = button.classList.contains('active') ? 'fas fa-heart' : 'far fa-heart';
        }
    });
    
    showNotification(index === -1 ? 'Added to wishlist!' : 'Removed from wishlist!');
}

function updateWishlistCount() {
    const countElements = document.querySelectorAll('#wishlist-count, #wishlist-total-count');
    countElements.forEach(el => {
        if (el.id === 'wishlist-count') {
            el.textContent = wishlist.length;
        } else if (el) {
            el.textContent = `${wishlist.length} ${wishlist.length === 1 ? 'item' : 'items'}`;
        }
    });
}

function initWishlistButtons() {
    document.querySelectorAll('.add-to-wishlist').forEach(button => {
        const productId = parseInt(button.getAttribute('data-id'));
        if (wishlist.includes(productId)) {
            button.classList.add('active');
            const icon = button.querySelector('i');
            if (icon) icon.className = 'fas fa-heart';
        }
        
        button.addEventListener('click', (e) => {
            e.preventDefault();
            toggleWishlist(productId);
        });
    });
}

// =======================
// FIXED PRODUCT PREVIEW FUNCTIONALITY
// =======================

let previewKeyHandlerAdded = false;

function setupProductPreview() {
    // Setup product image click preview
    document.querySelectorAll('.product-image img').forEach(img => {
        if (!img.dataset.listener) { // prevent duplicate listener
            img.style.cursor = 'pointer';
            img.addEventListener('click', function(e) {
                const productCard = this.closest('.product-card');
                const productId = parseInt(productCard.querySelector('.add-to-cart').getAttribute('data-id'));
                showProductPreview(productId);
            });
            img.dataset.listener = 'true';
        }
    });

    // Keyboard navigation (add only once)
    if (!previewKeyHandlerAdded) {
        document.addEventListener('keydown', function(e) {
            const modal = document.querySelector('.product-preview-modal');
            if (modal?.classList.contains('active')) {
                if (e.key === 'ArrowLeft') {
                    navigatePreview(-1);
                } else if (e.key === 'ArrowRight') {
                    navigatePreview(1);
                } else if (e.key === 'Escape') {
                    closeProductPreview();
                }
            }
        });
        previewKeyHandlerAdded = true;
    }

    // Close modal
    const closeModalBtn = document.querySelector('.product-preview-modal .close-modal');
    if (closeModalBtn && !closeModalBtn.dataset.listener) {
        closeModalBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            closeProductPreview();
        }, true);
        closeModalBtn.dataset.listener = 'true';
    }

    // Quantity decrease
    const decreaseBtn = document.querySelector('.quantity-btn.decrease');
    if (decreaseBtn && !decreaseBtn.dataset.listener) {
        decreaseBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            const input = this.nextElementSibling;
            if (parseInt(input.value) > 1) {
                input.value = parseInt(input.value) - 1;
            }
        }, true);
        decreaseBtn.dataset.listener = 'true';
    }

    // Quantity increase
    const increaseBtn = document.querySelector('.quantity-btn.increase');
    if (increaseBtn && !increaseBtn.dataset.listener) {
        increaseBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            const input = this.previousElementSibling;
            input.value = parseInt(input.value) + 1;
        }, true);
        increaseBtn.dataset.listener = 'true';
    }

    // Add to cart
    const addToCartBtn = document.querySelector('.add-to-cart-btn');
    if (addToCartBtn && !addToCartBtn.dataset.listener) {
        addToCartBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            const productId = parseInt(this.closest('.product-preview-modal')?.getAttribute('data-product-id'));
            const quantity = parseInt(document.querySelector('.quantity-input')?.value || 1);
            if (productId) {
                addToCartFromPreview(productId, quantity);
            }
        }, true);
        addToCartBtn.dataset.listener = 'true';
    }

    // Add to wishlist (FIXED no more cloneNode freezes)
    const addToWishlistBtn = document.querySelector('.add-to-wishlist-btn');
    if (addToWishlistBtn && !addToWishlistBtn.dataset.listener) {
        addToWishlistBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            const productId = parseInt(this.closest('.product-preview-modal')?.getAttribute('data-product-id'));
            if (!productId) return;

            const index = wishlist.indexOf(productId);
            if (index === -1) {
                wishlist.push(productId);
            } else {
                wishlist.splice(index, 1);
            }

            localStorage.setItem('wishlist', JSON.stringify(wishlist));
            updateWishlistCount();

            this.classList.toggle('active');
            const icon = this.querySelector('i');
            if (icon) {
                icon.className = this.classList.contains('active') ? 'fas fa-heart' : 'far fa-heart';
            }

            document.querySelectorAll(`[data-product-id="${productId}"]`).forEach(btn => {
                btn.classList.toggle('active');
                const btnIcon = btn.querySelector('i');
                if (btnIcon) {
                    btnIcon.className = btn.classList.contains('active') ? 'fas fa-heart' : 'far fa-heart';
                }
            });

            showModalNotification(index === -1 ? 'Added to wishlist!' : 'Removed from wishlist!');
        });
        addToWishlistBtn.dataset.listener = 'true';
    }

    // Continue shopping
    const continueBtn = document.querySelector('.continue-shopping-btn');
    if (continueBtn && !continueBtn.dataset.listener) {
        continueBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            closeProductPreview();
        }, true);
        continueBtn.dataset.listener = 'true';
    }

    // Click outside modal closes it
    const modal = document.querySelector('.product-preview-modal');
    if (modal && !modal.dataset.listener) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeProductPreview();
            }
        });
        modal.dataset.listener = 'true';
    }
}


function showProductPreview(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const modal = document.querySelector('.product-preview-modal');
    modal.setAttribute('data-product-id', productId);

    currentProductImages = [product.image, ...(product.images || [])];
    currentPreviewIndex = 0;

    updateMainPreviewImage();

    const thumbnailsContainer = document.getElementById('thumbnail-images');
    thumbnailsContainer.innerHTML = '';

    currentProductImages.forEach((imgSrc, index) => {
        const thumbnail = document.createElement('img');
        thumbnail.src = imgSrc;
        if (index === 0) thumbnail.classList.add('active');
        thumbnail.addEventListener('click', () => {
            currentPreviewIndex = index;
            updateMainPreviewImage();
            updateActiveThumbnail();
        });
        thumbnailsContainer.appendChild(thumbnail);
    });

    document.getElementById('preview-product-name').textContent = product.name;

    const priceElement = document.getElementById('preview-product-price');
    priceElement.innerHTML = `$${product.price.toFixed(2)}`;
    if (product.oldPrice) {
        priceElement.innerHTML += ` <span class="old-price">$${product.oldPrice.toFixed(2)}</span>`;
    }

    document.getElementById('preview-product-description').textContent =
        product.description || 'No description available.';
    document.getElementById('preview-product-category').textContent = product.category || 'Uncategorized';
    document.getElementById('preview-product-availability').textContent = 'In Stock';

    const wishlistBtn = document.querySelector('.add-to-wishlist-btn');
    const isInWishlist = wishlist.includes(productId);
    wishlistBtn.classList.toggle('active', isInWishlist);
    const icon = wishlistBtn.querySelector('i');
    if (icon) {
        icon.className = isInWishlist ? 'fas fa-heart' : 'far fa-heart';
    }

    document.querySelector('.quantity-input').value = 1;

    const mainImageContainer = document.querySelector('.main-image');
    if (!mainImageContainer.querySelector('.preview-prev')) {
        const prevBtn = document.createElement('button');
        prevBtn.className = 'preview-nav-btn preview-prev';
        prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            navigatePreview(-1);
        });

        const nextBtn = document.createElement('button');
        nextBtn.className = 'preview-nav-btn preview-next';
        nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            navigatePreview(1);
        });

        mainImageContainer.appendChild(prevBtn);
        mainImageContainer.appendChild(nextBtn);
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeProductPreview() {
    const modal = document.querySelector('.product-preview-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        currentProductImages = [];
        currentPreviewIndex = 0;
    }
}

function updateMainPreviewImage() {
    const mainImage = document.getElementById('preview-main-image');
    if (currentProductImages.length > 0 && currentProductImages[currentPreviewIndex]) {
        mainImage.src = currentProductImages[currentPreviewIndex];
        mainImage.alt = `Product preview ${currentPreviewIndex + 1}`;
        mainImage.onerror = function() {
            this.src = 'images/placeholder.jpg';
            console.error('Failed to load product image');
        };
    } else {
        mainImage.src = 'images/placeholder.jpg';
        mainImage.alt = 'Image not available';
    }
}

function updateActiveThumbnail() {
    const thumbnails = document.querySelectorAll('#thumbnail-images img');
    thumbnails.forEach((thumb, index) => {
        thumb.classList.toggle('active', index === currentPreviewIndex);
    });
}

function navigatePreview(direction) {
    currentPreviewIndex += direction;

    if (currentPreviewIndex < 0) {
        currentPreviewIndex = currentProductImages.length - 1;
    } else if (currentPreviewIndex >= currentProductImages.length) {
        currentPreviewIndex = 0;
    }

    updateMainPreviewImage();
    updateActiveThumbnail();
}

function quickViewProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        showProductPreview(productId);
    }
}

function addToCartFromPreview(productId, quantity) {
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
    
    updateCartCount();
    renderCartItems();
    saveCartToLocalStorage();
    showModalNotification(`${product.name} (${quantity}) added to cart`);
}

// =======================
// UTILITY FUNCTIONS
// =======================

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

function showModalNotification(message) {
    const modal = document.querySelector('.product-preview-modal');
    if (!modal) return;

    const existingNotification = modal.querySelector('.modal-notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = 'modal-notification';
    notification.textContent = message;
    modal.querySelector('.preview-content').appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 2000);
}

// =======================
// MOBILE MENU FUNCTIONALITY
// =======================

function setupMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuList = document.querySelector('.mobile-menu-list');

    if (menuToggle && mobileMenu && mobileMenuList) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            mobileMenuList.classList.toggle('active');
            mobileMenu.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.mobile-menu') && 
                !e.target.closest('#menu-toggle') &&
                !e.target.classList.contains('bars')) {
                mobileMenuList.classList.remove('active');
                mobileMenu.classList.remove('active');
            }
        });

        mobileMenuList.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                mobileMenuList.classList.remove('active');
                mobileMenu.classList.remove('active');
            }
        });
    }
}

// =======================
// INITIALIZATION
// =======================

document.addEventListener('DOMContentLoaded', () => {
    initShop();
    setupMobileMenu();
});

window.addEventListener('load', () => {
    const loader = document.querySelector('.loader');
    const loaderBg = document.querySelector('.loader-bg');
    
    if (loader && loaderBg) {
        loader.classList.add('hidden');
        loaderBg.classList.add('hidden');
    }
});