document.addEventListener('DOMContentLoaded', () => {
    // Default to the first tab
    document.querySelector('.tab').click();
    loadProducts();
});

// Function to handle tab switching
function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tab");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active-tab", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active-tab";
}

// Set the default active tab
document.getElementById("tab1").style.display = "block";

// Function to load products from JSON
async function loadProducts() {
    try {
        const response = await fetch('products.json');
        if (!response.ok) throw new Error('Failed to load products JSON');
        
        window.products = await response.json();
        console.log('Products loaded:', products); // Debugging

        products.forEach(product => {
            const category = product.Category.toLowerCase();
            const tabId = getTabIdForCategory(category);

            if (tabId) {
                appendProductToTab(tabId, product);
            } else {
                console.error(`Invalid category "${category}" in product data.`);
            }
        });
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

// Get tab ID based on product category
function getTabIdForCategory(category) {
    switch (category) {
        case 'sm': return 1;
        case 'gundam': return 2;
        case 'figure': return 3;
        default: return null;
    }
}

// Append product to the appropriate tab content
function appendProductToTab(tabId, product) {
    const container = document.querySelector(`#tab${tabId} .item-list`);
    if (!container) {
        console.error(`Container for tab ${tabId} not found.`);
        return;
    }

    const listItem = document.createElement('li');
    listItem.classList.add('item');
    listItem.innerHTML = `
        <img src="${product.CoverImg}" alt="${product.Name}" onclick="openProductDetail('${product.SKU}')">
        <div class="attributes">
            <h3>${product.Name}</h3>
            <p style="color: grey;">SKU ${product.SKU}</p>
            <p style="margin-top: 15px; font-family: 'Blinker-Thin', sans-serif;"><strong>$${product.Price}</p>
            <p style="font-size: 20px;  color: #FD7474;">${product.Status}</p>
            <p style="margin-top: 15px; font-size: 20px; font-family: 'Blinker-Thin', sans-serif;"><strong>Color:</strong> ${product.Color}</p>
            <p style="font-size: 20px; font-family: 'Blinker-Thin', sans-serif;"><strong>Size:</strong> 1/${product.Size}</p>
        </div>
    `;
    container.appendChild(listItem);
}

// Function to open product detail page
function openProductDetail(SKU) {
    const product = findProductById(SKU);
    if (product) {
        localStorage.setItem('selectedProduct', JSON.stringify(product));
        window.location.href = 'product-detail.html';
    } else {
        console.error('Product not found:', SKU);
    }
}

// Helper function to find a product by ID
function findProductById(SKU) {
    // Assuming the products array is available globally or passed to this function
    return products.find(p => p.SKU === SKU);
}
