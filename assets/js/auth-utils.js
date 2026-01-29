// Local Auth System (No Firebase)

// Local Auth System (No Firebase)
const STORAGE_KEYS = {
    IS_LOGGED_IN: 'isLoggedIn',
    CURRENT_USER: 'current_user',
    USERS_DB: 'users_db'
};

// Mock Database
const MOCK_USERS = [
    {
        id: 'user_admin_001',
        username: 'admin',
        password: '123',
        role: 'admin',
        name: 'Admin',
        surname: 'User',
        email: 'admin@cg.com',
        phone: '000-000-0000',
        createdAt: new Date().toISOString()
    }
];

function initAuthSystem() {
    console.log("Local Auth System Initialized");
    // Ensure admin exists
    const users = getUsersFromStorage();
    if (!users.find(u => u.username === 'admin')) {
        users.unshift(MOCK_USERS[0]);
        saveUsersToStorage(users);
    }
}

function getUsersFromStorage() {
    const data = localStorage.getItem(STORAGE_KEYS.USERS_DB);
    return data ? JSON.parse(data) : [...MOCK_USERS];
}

function saveUsersToStorage(users) {
    localStorage.setItem(STORAGE_KEYS.USERS_DB, JSON.stringify(users));
}

// Renamed from 'initUserListener' to avoid reassignment error if it was previously declared as function
function initUserListener(onUpdate) {
    // Initial load
    onUpdate(getUsersFromStorage());

    window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_KEYS.USERS_DB) {
            onUpdate(getUsersFromStorage());
        }
    });

    window.addEventListener('local-users-update', () => onUpdate(getUsersFromStorage()));
}

function registerUser(userData) {
    return new Promise((resolve, reject) => {
        const users = getUsersFromStorage();

        if (users.find(u => u.username === userData.username)) {
            reject(new Error('Username already exists'));
            return;
        }

        const newUser = {
            ...userData,
            id: 'user_' + Date.now(),
            role: 'member',
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        saveUsersToStorage(users);
        resolve(newUser);
    });
}

function loginUser(usernameInput, password) {
    return new Promise((resolve, reject) => {
        const users = getUsersFromStorage();
        // Check username OR email
        const user = users.find(u =>
            (u.username === usernameInput || u.email === usernameInput) && u.password === password
        );

        if (user) {
            saveSession(user);
            resolve(user);
        } else {
            resolve(null);
        }
    });
}

function saveSession(user) {
    localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, 'true');
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    updateAuthUI();
}

function getCurrentUser() {
    const userRaw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return userRaw ? JSON.parse(userRaw) : null;
}

function logout() {
    if (confirm('ต้องการออกจากระบบใช่หรือไม่?')) {
        localStorage.removeItem(STORAGE_KEYS.IS_LOGGED_IN);
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
        window.location.href = 'index.html';
    }
}

async function deleteUser(userId) {
    if (!userId) return;
    if (confirm('ยืนยันการลบผู้ใช้นี้?')) {
        let users = getUsersFromStorage();
        users = users.filter(u => u.id !== userId);
        saveUsersToStorage(users);
        window.dispatchEvent(new Event('local-users-update'));
    }
}

function updateAuthUI() {
    const isLoggedIn = localStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN);
    const currentUser = getCurrentUser();
    const authContainer = document.getElementById('auth-buttons');

    if (!authContainer) return;

    if (isLoggedIn === 'true' && currentUser) {
        const isAdmin = currentUser.role === 'admin';

        authContainer.innerHTML = `
            <div class="flex items-center gap-3">
                <div class="hidden md:flex flex-col items-end mr-2">
                    <span class="text-sm font-bold text-primary dark:text-white">${currentUser.username} ${currentUser.surname || ''}</span>
                    <span class="text-[10px] text-gray-500 uppercase tracking-wider flex items-center gap-1 justify-end">
                        ${isAdmin ? '<span class="text-red-500 font-bold">ADMIN</span>' : 'Member'}
                    </span>
                </div>

                <div class="h-9 w-9 rounded-full ${isAdmin ? 'bg-red-600' : 'bg-primary'} text-white flex items-center justify-center font-bold text-lg shadow-sm">
                    ${currentUser.username ? currentUser.username.charAt(0).toUpperCase() : '?'}
                </div>

                <div class="relative group">
                     <button class="flex items-center justify-center h-9 w-9 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors">
                        <span class="material-symbols-outlined">more_vert</span>
                     </button>
                     <div class="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-800 rounded-lg shadow-xl border border-gray-100 dark:border-neutral-700 py-1 hidden group-hover:block z-50">
                        ${isAdmin ? `
                        <a href="admin.html" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-700 flex items-center gap-2">
                            <span class="material-symbols-outlined text-lg">admin_panel_settings</span>
                            จัดการระบบ
                        </a>
                        <div class="border-t border-gray-100 dark:border-neutral-700 my-1"></div>
                        ` : ''}
                        <button onclick="logout()" class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2">
                            <span class="material-symbols-outlined text-lg">logout</span>
                            ออกจากระบบ
                        </button>
                     </div>
                </div>
            </div>
        `;
    } else {
        authContainer.innerHTML = `
            <a href="login.html" class="hidden md:flex text-sm font-bold text-primary dark:text-white hover:text-primary/70 transition-colors">
                เข้าสู่ระบบ
            </a>
            <a href="register.html" class="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white transition-transform hover:scale-105 hover:bg-primary-hover shadow-lg">
                <span class="material-symbols-outlined text-lg">person_add</span>
                สมัครสมาชิก
            </a>
        `;
    }
}

// Global scope for legacy inline onclicks
window.logout = logout;
window.authSystem = {
    initAuthSystem,
    initUserListener,
    registerUser,
    loginUser,
    getCurrentUser,
    updateAuthUI,
    deleteUser
};

// Initial run
document.addEventListener('DOMContentLoaded', () => {
    updateAuthUI();
});

export { initAuthSystem, initUserListener, registerUser, loginUser, getCurrentUser, updateAuthUI, logout, deleteUser };
