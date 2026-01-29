import { DEFAULT_PRODUCTS } from './products-data.js';

const STORAGE_KEY = 'products_db';

function getLocalProducts() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
        saveLocalProducts(DEFAULT_PRODUCTS);
        return DEFAULT_PRODUCTS;
    }
    return JSON.parse(data);
}

function saveLocalProducts(products) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

function initProductListener(onUpdate) {
    // Initial load
    onUpdate(getLocalProducts());

    // Listen for cross-tab or same-tab updates
    const handleUpdate = () => {
        onUpdate(getLocalProducts());
    };

    window.addEventListener('local-product-update', handleUpdate);
    window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_KEY) handleUpdate();
    });

    // Return unsubscribe function
    return () => {
        window.removeEventListener('local-product-update', handleUpdate);
    };
}

async function saveProduct(product) {
    const products = getLocalProducts();

    // Simulate network delay
    await new Promise(r => setTimeout(r, 300));

    if (product.id) {
        // Update
        const index = products.findIndex(p => p.id === product.id);
        if (index !== -1) {
            products[index] = {
                ...product,
                price: Number(product.price) // Ensure number
            };
        }
    } else {
        // Create
        const newProduct = {
            ...product,
            id: 'LOC-' + Date.now(),
            createdAt: new Date().toISOString(),
            price: Number(product.price)
        };
        products.unshift(newProduct);
    }

    saveLocalProducts(products);
    window.dispatchEvent(new Event('local-product-update'));
}

async function deleteProduct(id) {
    // Simulate delay
    await new Promise(r => setTimeout(r, 300));

    let products = getLocalProducts();
    products = products.filter(p => p.id !== id);

    saveLocalProducts(products);
    window.dispatchEvent(new Event('local-product-update'));
}

async function restoreDefaultProducts() {
    await new Promise(r => setTimeout(r, 500));
    saveLocalProducts(DEFAULT_PRODUCTS);
    window.dispatchEvent(new Event('local-product-update'));
}

export { initProductListener, saveProduct, deleteProduct, restoreDefaultProducts };
