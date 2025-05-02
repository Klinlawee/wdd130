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
// =======================
// Mobile Menu Functionality(Hamburger Menu)
// =======================//
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuList = document.querySelector('.mobile-menu-list');

    if (menuToggle && mobileMenu && mobileMenuList) {
        // Toggle menu when clicking the hamburger icon
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            mobileMenuList.classList.toggle('active');
            mobileMenu.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.mobile-menu') && 
                !e.target.closest('#menu-toggle') &&
                !e.target.classList.contains('bars')) {
                mobileMenuList.classList.remove('active');
                mobileMenu.classList.remove('active');
            }
        });

        // Close menu when clicking a menu item (optional)
        mobileMenuList.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                mobileMenuList.classList.remove('active');
                mobileMenu.classList.remove('active');
            }
        });
    }
});
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

// ======================= Product Preview functionality =======================//
// ======================= Product Preview functionality =======================//
document.addEventListener('DOMContentLoaded', () => {
    // Initialize product preview modal
    const productPreviewModal = document.getElementById('productPreviewModal');
    const closeModalBtn = document.querySelector('.close-modal');
    
    // Close modal when clicking close button
    closeModalBtn.addEventListener('click', () => {
        productPreviewModal.classList.remove('active');
    });
    
    // Close modal when clicking outside content
    productPreviewModal.addEventListener('click', (e) => {
        if (e.target === productPreviewModal) {
            productPreviewModal.classList.remove('active');
        }
    });

    // Sample product data with multiple images (in a real app, this would come from a database)
    const productData = {
        "Shirt": {
            name: "Shirt",
            price: "$40.00",
            oldPrice: "$56.00",
            discount: "-29%",
            description: "Stylish and comfortable shirt for all occasions.",
            images: [
                "images/shirt-top.jpg",
                "images/shirt-alt1.jpg", // These would be actual additional images
                "images/shirt-alt2.jpg"
            ]
        },
        "Sun Glass": {
            name: "Sun Glass",
            price: "$5.00",
            oldPrice: "$10.00",
            discount: "-50%",
            description: "Premium quality sunglasses with UV protection.",
            images: [
                "images/spectacle.jpg",
                "images/spectacle-alt1.jpg",
                "images/spectacle-alt2.jpg"
            ]
        },
        // Add data for other products similarly
    };

    // Quick View button functionality
    document.querySelectorAll('.product-box .fa-eye').forEach(icon => {
        icon.addEventListener('click', (e) => {
            e.preventDefault();
            const box = icon.closest('.product-box');
            const productName = box.querySelector('p').innerText;
            const product = productData[productName] || {
                name: productName,
                price: box.querySelector('span:not([class]):not(strike)').innerText,
                oldPrice: box.querySelector('strike')?.innerText || '',
                discount: box.querySelector('.product-off')?.innerText || '',
                description: "Product details not available.",
                images: [
                    box.querySelector('img').src
                ]
            };

            // Set modal content
            document.getElementById('previewProductName').textContent = product.name;
            document.getElementById('previewProductPrice').textContent = product.price;
            document.getElementById('previewProductOldPrice').textContent = product.oldPrice;
            document.getElementById('previewProductDiscount').textContent = product.discount;
            document.getElementById('previewProductDescription').textContent = product.description;
            
            // Set main image
            const mainImage = document.getElementById('previewProductImage');
            mainImage.src = product.images[0];
            mainImage.alt = product.name;
            
            // Set up gallery thumbnails
            const thumbnailsContainer = document.querySelector('.image-thumbnails');
            thumbnailsContainer.innerHTML = '';
            
            product.images.forEach((imgSrc, index) => {
                const thumbnail = document.createElement('img');
                thumbnail.src = imgSrc;
                thumbnail.alt = `${product.name} - ${index + 1}`;
                thumbnail.dataset.index = index;
                if (index === 0) thumbnail.classList.add('active');
                
                thumbnail.addEventListener('click', () => {
                    // Update main image
                    mainImage.src = imgSrc;
                    // Update active thumbnail
                    document.querySelectorAll('.image-thumbnails img').forEach(img => {
                        img.classList.remove('active');
                    });
                    thumbnail.classList.add('active');
                });
                
                thumbnailsContainer.appendChild(thumbnail);
            });
            
            // Gallery navigation controls
            document.querySelector('.prev-image').addEventListener('click', () => {
                const activeIndex = parseInt(document.querySelector('.image-thumbnails img.active')?.dataset.index || 0);
                const prevIndex = (activeIndex - 1 + product.images.length) % product.images.length;
                document.querySelector(`.image-thumbnails img[data-index="${prevIndex}"]`).click();
            });
            
            document.querySelector('.next-image').addEventListener('click', () => {
                const activeIndex = parseInt(document.querySelector('.image-thumbnails img.active')?.dataset.index || 0);
                const nextIndex = (activeIndex + 1) % product.images.length;
                document.querySelector(`.image-thumbnails img[data-index="${nextIndex}"]`).click();
            });
            
            // Toggle gallery view
            document.querySelector('.view-more-images').addEventListener('click', () => {
                thumbnailsContainer.classList.toggle('active');
            });
            
            // Show modal
            productPreviewModal.classList.add('active');
        });
    });

    // Add to cart from preview modal
    document.querySelector('.modal .add-to-cart').addEventListener('click', () => {
        const name = document.getElementById('previewProductName').textContent;
        const priceText = document.getElementById('previewProductPrice').textContent;
        const price = parseFloat(priceText.replace('$', '')) || 0;
        const image = document.getElementById('previewProductImage').src;
        const id = 'preview-' + name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();

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
        showNotification(`${name} added to cart!`);
    });

    // Add to wishlist from preview modal
    document.querySelector('.modal .add-to-wishlist').addEventListener('click', () => {
        const name = document.getElementById('previewProductName').textContent;
        const priceText = document.getElementById('previewProductPrice').textContent;
        const price = parseFloat(priceText.replace('$', '')) || 0;
        const image = document.getElementById('previewProductImage').src;
        const id = 'preview-' + name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
        
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
        } else {
            showNotification('Already in wishlist!');
        }
    });
});