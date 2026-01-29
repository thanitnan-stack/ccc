
// Local Order System (No Firebase)
const STORAGE_KEYS = {
    ORDER_HISTORY: 'order_history'
};

function getOrdersFromStorage() {
    const data = localStorage.getItem(STORAGE_KEYS.ORDER_HISTORY);
    return data ? JSON.parse(data) : [];
}

function saveOrdersToStorage(orders) {
    localStorage.setItem(STORAGE_KEYS.ORDER_HISTORY, JSON.stringify(orders));
}

function initOrderListener(onUpdate) {
    // Initial load
    onUpdate(getOrdersFromStorage());

    window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_KEYS.ORDER_HISTORY) {
            onUpdate(getOrdersFromStorage());
        }
    });

    // Custom event for same-tab updates
    window.addEventListener('local-orders-update', () => onUpdate(getOrdersFromStorage()));
}

async function updateOrderStatus(orderId, newStatus) {
    return new Promise((resolve, reject) => {
        try {
            const orders = getOrdersFromStorage();
            const orderIndex = orders.findIndex(o => o.id === orderId);

            if (orderIndex === -1) {
                throw new Error('Order not found');
            }

            orders[orderIndex].status = newStatus;
            saveOrdersToStorage(orders);
            window.dispatchEvent(new Event('local-orders-update'));
            resolve(orders[orderIndex]);
        } catch (error) {
            reject(error);
        }
    });
}

function getAllOrders() {
    return getOrdersFromStorage();
}

export { initOrderListener, updateOrderStatus, getAllOrders };
