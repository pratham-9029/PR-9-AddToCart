
let products = JSON.parse(localStorage.getItem('products')) || [
    {
        id: 1,
        name: "Laptop",
        price: 999.99,
        emoji: "💻"
    },
    {
        id: 2,
        name: "Smartphone",
        price: 599.99,
        emoji: "📱"
    },
    {
        id: 3,
        name: "Headphones",
        price: 199.99,
        emoji: "🎧"
    }
];

let cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveProductsToLocalStorage() {
    localStorage.setItem('products', JSON.stringify(products));
}

function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

const productsContainer = document.getElementById('productsContainer');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const totalItems = document.getElementById('totalItems');
const totalPrice = document.getElementById('totalPrice');
const clearCartBtn = document.getElementById('clearCart');
const checkoutBtn = document.getElementById('checkout');
const cartIcon = document.getElementById('cartIcon');

const productForm = document.getElementById('productForm');
const productIdInput = document.getElementById('productId');
const productNameInput = document.getElementById('productName');
const productPriceInput = document.getElementById('productPrice');
const productEmojiInput = document.getElementById('productEmoji');
const saveProductBtn = document.getElementById('saveProduct');
const cancelEditBtn = document.getElementById('cancelEdit');

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCartDisplay();
    
    clearCartBtn.addEventListener('click', clearCart);
    checkoutBtn.addEventListener('click', checkout);
    cartIcon.addEventListener('click', toggleCartVisibility);
    productForm.addEventListener('submit', handleProductFormSubmit);
    cancelEditBtn.addEventListener('click', cancelEdit);
});

// Handle product form submission
function handleProductFormSubmit(e) {
    e.preventDefault();
    
    const id = productIdInput.value ? parseInt(productIdInput.value) : null;
    const name = productNameInput.value.trim();
    const price = parseFloat(productPriceInput.value);
    const emoji = productEmojiInput.value || "📦";
    
    if (!name || isNaN(price) || price <= 0) {
        alert('Please enter valid product details');
        return;
    }
    
    if (id) {
        updateProduct(id, { name, price, emoji });
    } else {
        createProduct({ name, price, emoji });
    }
    
    resetProductForm();
}

// Create a new product
function createProduct(productData) {
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    const newProduct = {
        id: newId,
        ...productData
    };
    
    products.push(newProduct);
    saveProductsToLocalStorage();
    renderProducts();
    showNotification(`Product "${productData.name}" added successfully!`);
}

// Update an existing product
function updateProduct(productId, productData) {
    const index = products.findIndex(p => p.id === productId);
    
    if (index !== -1) {
        products[index] = { ...products[index], ...productData };
        saveProductsToLocalStorage();
        renderProducts();
        showNotification(`Product "${productData.name}" updated successfully!`);
    }
}

// Delete a product
function deleteProduct(productId) {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    const product = products.find(p => p.id === productId);
    if (!product) return;

    products = products.filter(p => p.id !== productId);
 
    cart = cart.filter(item => item.id !== productId);
    saveCartToLocalStorage();
    
    saveProductsToLocalStorage();
    renderProducts();
    updateCartDisplay();
    showNotification(`Product "${product.name}" deleted!`);
}

// Edit a product
function editProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    productIdInput.value = product.id;
    productNameInput.value = product.name;
    productPriceInput.value = product.price;
    productEmojiInput.value = product.emoji;
    
    cancelEditBtn.style.display = 'inline-block';
    
    
    document.querySelector('.product-management').scrollIntoView({ behavior: 'smooth' });
}

// Cancel edit operation
function cancelEdit() {
    resetProductForm();
}

// Reset product form
function resetProductForm() {
    productForm.reset();
    productIdInput.value = '';
    cancelEditBtn.style.display = 'none';
}

// Render products to the page
function renderProducts() {
    productsContainer.innerHTML = '';
    
    if (products.length === 0) {
        productsContainer.innerHTML = '<p class="empty-cart-message">No products available. Add some products!</p>';
        return;
    }
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <button class="edit-product-btn" data-id="${product.id}">✏️</button>
            <button class="delete-product-btn" data-id="${product.id}">❌</button>
            <div class="product-image">${product.emoji}</div>
            <div class="product-name">${product.name}</div>
            <div class="product-price">$${product.price.toFixed(2)}</div>
            <button class="add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
        `;
        
        productsContainer.appendChild(productCard);
    });
    
    // Add event listeners to all action buttons
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.dataset.id);
            addToCart(productId);
        });
    });
    
    document.querySelectorAll('.edit-product-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.dataset.id);
            editProduct(productId);
        });
    });
    
    document.querySelectorAll('.delete-product-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.dataset.id);
            deleteProduct(productId);
        });
    });
}

// Add product to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        showNotification('Product not found!');
        return;
    }
    
    // Check if product is already in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    saveCartToLocalStorage();
    updateCartDisplay();
    showNotification(`${product.name} added to cart!`);
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCartToLocalStorage();
    updateCartDisplay();
    showNotification('Item removed from cart!');
}

// Update item quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        item.quantity += change;
        
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCartToLocalStorage();
            updateCartDisplay();
            showNotification(`Quantity updated!`);
        }
    }
}

// Clear the entire cart
function clearCart() {
    if (cart.length === 0) return;
    
    if (confirm('Are you sure you want to clear the cart?')) {
        cart = [];
        saveCartToLocalStorage();
        updateCartDisplay();
        showNotification('Cart cleared!');
    }
}

// Checkout function
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    alert(`Thank you for your purchase!\nTotal: $${total.toFixed(2)}\nItems: ${getTotalItems()}`);
    
    cart = [];
    saveCartToLocalStorage();
    updateCartDisplay();
}

// Toggle cart visibility
function toggleCartVisibility() {
    const cartSection = document.querySelector('.cart-section');
    cartSection.style.display = cartSection.style.display === 'none' ? 'block' : 'none';
}

// Update cart display
function updateCartDisplay() {
    // Update cart items
    if (cart.length === 0) {
        cartItems.innerHTML = '<li class="empty-cart-message">Your cart is empty</li>';
    } else {
        cartItems.innerHTML = '';
        cart.forEach(item => {
            const cartItem = document.createElement('li');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="item-info">
                    <div class="item-image">${item.emoji}</div>
                    <div class="item-details">
                        <h3>${item.name}</h3>
                        <div class="item-price">$${item.price.toFixed(2)}</div>
                    </div>
                </div>
                <div class="item-quantity">
                    <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn increase" data-id="${item.id}">+</button>
                </div>
                <button class="remove-btn" data-id="${item.id}">Remove</button>
            `;
            cartItems.appendChild(cartItem);
        });
        
        document.querySelectorAll('.decrease').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = parseInt(e.target.dataset.id);
                updateQuantity(productId, -1);
            });
        });
        
        document.querySelectorAll('.increase').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = parseInt(e.target.dataset.id);
                updateQuantity(productId, 1);
            });
        });
        
        document.querySelectorAll('.remove-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = parseInt(e.target.dataset.id);
                removeFromCart(productId);
            });
        });
    }
    // Update cart summary
    const totalItemsCount = getTotalItems();
    const totalPriceValue = getTotalPrice();
    
    cartCount.textContent = totalItemsCount;
    totalItems.textContent = totalItemsCount;
    totalPrice.textContent = totalPriceValue.toFixed(2);
}

// Get total number of items in cart
function getTotalItems() {
    return cart.reduce((total, item) => total + item.quantity, 0);
}

// Get total price of items in cart
function getTotalPrice() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.backgroundColor = '#4CAF50';
    notification.style.color = 'white';
    notification.style.padding = '10px 20px';
    notification.style.borderRadius = '4px';
    notification.style.zIndex = '1000';
    notification.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    notification.style.opacity = '0';
    notification.style.transition = 'opacity 0.3s';
    
    document.body.appendChild(notification);
    
    // Fade in
    setTimeout(() => {
        notification.style.opacity = '1';
    }, 10);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}