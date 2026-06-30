// --- Cart & LocalStorage Functionality ---
// Load cart from local storage, or start with an empty array if it doesn't exist
let cart = JSON.parse(localStorage.getItem('adAstraCart')) || [];

function updateCartIcon() {
    const countElement = document.getElementById('cart-count');
    if (countElement) {
        // Calculate total items (sum of all quantities)
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        countElement.innerText = totalItems;
    }
}

// Upgraded to take name, price, and image so we can display them in the cart
function addToCart(name, price, image_url) {
    // Check if item is already in the cart
    const existingItemIndex = cart.findIndex(item => item.name === name);

    if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity += 1; // Increase amount
    } else {
        cart.push({ name, price, image_url, quantity: 1 }); // Add new item
    }

    // Save the updated cart back to the browser's memory
    localStorage.setItem('adAstraCart', JSON.stringify(cart));

    updateCartIcon();

    // Pop animation
    const countElement = document.getElementById('cart-count');
    if (countElement) {
        countElement.style.transform = 'scale(1.5)';
        setTimeout(() => { countElement.style.transform = 'scale(1)'; }, 200);
    }

    showToast(`${name} added to your cargo!`);
}

function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.innerText = message;
    toast.classList.add('show');
    setTimeout(() => { toast.classList.remove('show'); }, 3000);
}

// --- Fetch Products from Python API ---
async function loadStoreProducts() {
    const productGrid = document.querySelector('.product-grid');
    if (!productGrid) return;

    try {
        const response = await fetch('/api/products');
        if (!response.ok) throw new Error('Network response was not ok');

        const products = await response.json();
        productGrid.innerHTML = '';

       products.forEach(product => {
            // THE FIX: This safely converts quotes so they don't break the HTML!
            const safeName = product.name.replace(/"/g, '&quot;').replace(/'/g, '\\\'');
            
            productGrid.innerHTML += `
                <div class="product-card">
                    <div class="product-image" style="background-image: url('${product.image_url}');"></div>
                    <div class="product-info">
                        <h3>${product.name}</h3>
                        <p class="product-desc">${product.description}</p>
                        <div class="product-bottom">
                            <span class="price">$${product.price}</span>
                            <button class="btn-buy" onclick="addToCart('${safeName}', ${product.price}, '${product.image_url}')">Add to Cart</button>
                        </div>
                    </div>
                </div>
            `;
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        productGrid.innerHTML = '<p style="text-align: center; color: var(--accent); width: 100%;">Failed to load communications with the server. Is your Python backend running?</p>';
    }
}

// --- Render Cart Page ---
function renderCartPage() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');

    if (!cartItemsContainer) return; // Stop if we aren't on the cart page

    cartItemsContainer.innerHTML = '';
    let grandTotal = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align: center; color: var(--text-muted); padding: 40px;">Your cargo bay is empty.</p>';
        cartTotalElement.innerText = '$0.00';
        return;
    }

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        grandTotal += itemTotal;

        cartItemsContainer.innerHTML += `
            <div class="cart-item">
                <img src="${item.image_url}" alt="${item.name}">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p class="price">$${item.price} x ${item.quantity}</p>
                </div>
                <div class="cart-item-total">
                    <p>$${itemTotal.toFixed(2)}</p>
                    <button class="btn-remove" onclick="removeFromCart(${index})"><i class="fa-solid fa-trash"></i></button>
                </div>
            </div>
        `;
    });

    cartTotalElement.innerText = `$${grandTotal.toFixed(2)}`;
}

function removeFromCart(index) {
    cart.splice(index, 1); // Remove item from array
    localStorage.setItem('adAstraCart', JSON.stringify(cart)); // Update memory
    updateCartIcon();
    renderCartPage(); // Re-draw the page
}

// --- Awesome Fact Generator for Main Page ---
const astroFacts = [
    "Neutron stars can spin at a rate of 600 rotations per second.",
    "One million Earths could fit inside the Sun.",
    "Apollo astronauts' footprints on the moon will probably stay there for at least 100 million years.",
    "99% of our solar system's mass is the sun.",
    "More energy from the sun hits Earth every hour than humanity uses in a year."
];

function generateFact() {
    const displayElement = document.getElementById('fact-display');
    if (!displayElement) return;
    const randomIndex = Math.floor(Math.random() * astroFacts.length);

    displayElement.style.opacity = 0;
    setTimeout(() => {
        displayElement.innerText = astroFacts[randomIndex];
        displayElement.style.color = "var(--text-main)";
        displayElement.style.opacity = 1;
        displayElement.style.transition = "opacity 0.5s ease";
    }, 300);
}

// Initialize everything when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    updateCartIcon(); // Always check local storage for cart count on every page
    loadStoreProducts(); // Loads store if on store.html
    renderCartPage(); // Loads cart if on cart.html
});