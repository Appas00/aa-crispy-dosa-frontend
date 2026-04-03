// ==================== STRING HELPERS ====================

/**
 * Capitalizes the first letter of a string
 * @param {string} str - Input string
 * @returns {string} Capitalized string
 */
export const capitalizeFirstLetter = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Truncates a string to a specified length
 * @param {string} str - Input string
 * @param {number} length - Maximum length
 * @param {string} suffix - Suffix to add (default: '...')
 * @returns {string} Truncated string
 */
export const truncateString = (str, length = 50, suffix = '...') => {
    if (!str) return '';
    if (str.length <= length) return str;
    return str.substring(0, length) + suffix;
};

/**
 * Converts a string to slug format (URL friendly)
 * @param {string} str - Input string
 * @returns {string} Slugified string
 */
export const slugify = (str) => {
    return str
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
};

// ==================== NUMBER HELPERS ====================

/**
 * Formats currency in Indian Rupees
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

/**
 * Formats a number with commas
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
export const formatNumber = (num) => {
    return new Intl.NumberFormat('en-IN').format(num);
};

/**
 * Calculates discount percentage
 * @param {number} originalPrice - Original price
 * @param {number} discountedPrice - Discounted price
 * @returns {number} Discount percentage
 */
export const calculateDiscount = (originalPrice, discountedPrice) => {
    if (originalPrice <= 0) return 0;
    const discount = ((originalPrice - discountedPrice) / originalPrice) * 100;
    return Math.round(discount);
};

// ==================== DATE HELPERS ====================

/**
 * Formats a date to readable format
 * @param {Date|string} date - Date to format
 * @param {string} format - Format type ('full', 'date', 'time', 'datetime')
 * @returns {string} Formatted date string
 */
export const formatDate = (date, format = 'full') => {
    const d = new Date(date);

    const options = {
        full: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
        date: { year: 'numeric', month: 'long', day: 'numeric' },
        time: { hour: '2-digit', minute: '2-digit' },
        datetime: { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }
    };

    return d.toLocaleDateString('en-IN', options[format]);
};

/**
 * Returns relative time (e.g., "2 hours ago")
 * @param {Date|string} date - Date to compare
 * @returns {string} Relative time string
 */
export const getRelativeTime = (date) => {
    const now = new Date();
    const past = new Date(date);
    const diffInSeconds = Math.floor((now - past) / 1000);

    if (diffInSeconds < 60) return 'just now';
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
    const diffInYears = Math.floor(diffInDays / 365);
    return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
};

// ==================== CART HELPERS ====================

/**
 * Calculates total price of cart items
 * @param {Array} cartItems - Array of cart items
 * @returns {number} Total price
 */
export const calculateCartTotal = (cartItems) => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
};

/**
 * Calculates total number of items in cart
 * @param {Array} cartItems - Array of cart items
 * @returns {number} Total item count
 */
export const calculateTotalItems = (cartItems) => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
};

/**
 * Updates item quantity in cart
 * @param {Array} cart - Current cart
 * @param {Object} item - Item to update
 * @param {number} newQuantity - New quantity
 * @returns {Array} Updated cart
 */
export const updateCartItemQuantity = (cart, item, newQuantity) => {
    if (newQuantity <= 0) {
        return cart.filter(cartItem => cartItem.id !== item.id);
    }

    return cart.map(cartItem =>
        cartItem.id === item.id
            ? { ...cartItem, quantity: newQuantity }
            : cartItem
    );
};

/**
 * Adds item to cart
 * @param {Array} cart - Current cart
 * @param {Object} item - Item to add
 * @returns {Array} Updated cart
 */
export const addToCartHelper = (cart, item) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);

    if (existingItem) {
        return cart.map(cartItem =>
            cartItem.id === item.id
                ? { ...cartItem, quantity: cartItem.quantity + 1 }
                : cartItem
        );
    }

    return [...cart, { ...item, quantity: 1 }];
};

// ==================== VALIDATION HELPERS ====================

/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {boolean} Is valid email
 */
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Validates phone number (Indian format)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} Is valid phone number
 */
export const isValidPhone = (phone) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
};

/**
 * Validates pincode (Indian format)
 * @param {string} pincode - Pincode to validate
 * @returns {boolean} Is valid pincode
 */
export const isValidPincode = (pincode) => {
    const pincodeRegex = /^[1-9][0-9]{5}$/;
    return pincodeRegex.test(pincode);
};

/**
 * Validates if string is empty
 * @param {string} str - String to check
 * @returns {boolean} Is empty
 */
export const isEmpty = (str) => {
    return !str || str.trim().length === 0;
};

// ==================== LOCAL STORAGE HELPERS ====================

/**
 * Save data to localStorage
 * @param {string} key - Storage key
 * @param {any} data - Data to save
 */
export const saveToLocalStorage = (key, data) => {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        return false;
    }
};

/**
 * Load data from localStorage
 * @param {string} key - Storage key
 * @param {any} defaultValue - Default value if not found
 * @returns {any} Loaded data
 */
export const loadFromLocalStorage = (key, defaultValue = null) => {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultValue;
    } catch (error) {
        console.error('Error loading from localStorage:', error);
        return defaultValue;
    }
};

/**
 * Remove data from localStorage
 * @param {string} key - Storage key
 */
export const removeFromLocalStorage = (key) => {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error('Error removing from localStorage:', error);
        return false;
    }
};

// ==================== ORDER HELPERS ====================

/**
 * Generates unique order ID
 * @returns {string} Order ID
 */
export const generateOrderId = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `ORD${timestamp}${random}`;
};

/**
 * Calculates estimated delivery time
 * @returns {string} Estimated delivery time
 */
export const getEstimatedDeliveryTime = () => {
    const now = new Date();
    const deliveryTime = new Date(now.getTime() + 30 * 60000); // 30 minutes
    return formatDate(deliveryTime, 'time');
};

/**
 * Gets order status badge color
 * @param {string} status - Order status
 * @returns {string} CSS class for badge
 */
export const getOrderStatusColor = (status) => {
    const statusColors = {
        pending: 'bg-yellow-100 text-yellow-800',
        confirmed: 'bg-blue-100 text-blue-800',
        preparing: 'bg-purple-100 text-purple-800',
        ready: 'bg-indigo-100 text-indigo-800',
        delivered: 'bg-green-100 text-green-800',
        cancelled: 'bg-red-100 text-red-800'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
};

// ==================== FILTER HELPERS ====================

/**
 * Filters menu items by category
 * @param {Array} items - Menu items
 * @param {string} category - Category to filter
 * @returns {Array} Filtered items
 */
export const filterByCategory = (items, category) => {
    if (!category || category === 'all') return items;
    return items.filter(item => item.category === category);
};

/**
 * Searches menu items by name or description
 * @param {Array} items - Menu items
 * @param {string} query - Search query
 * @returns {Array} Filtered items
 */
export const searchItems = (items, query) => {
    if (!query) return items;
    const searchTerm = query.toLowerCase();
    return items.filter(item =>
        item.name.toLowerCase().includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm)
    );
};

/**
 * Sorts items by price or name
 * @param {Array} items - Items to sort
 * @param {string} sortBy - Sort criteria ('price-asc', 'price-desc', 'name')
 * @returns {Array} Sorted items
 */
export const sortItems = (items, sortBy) => {
    const sorted = [...items];
    switch (sortBy) {
        case 'price-asc':
            return sorted.sort((a, b) => a.price - b.price);
        case 'price-desc':
            return sorted.sort((a, b) => b.price - a.price);
        case 'name':
            return sorted.sort((a, b) => a.name.localeCompare(b.name));
        default:
            return sorted;
    }
};

// ==================== NOTIFICATION HELPERS ====================

/**
 * Shows a toast notification
 * @param {string} message - Notification message
 * @param {string} type - Type ('success', 'error', 'info')
 */
export const showNotification = (message, type = 'info') => {
    // This can be integrated with a toast library
    if (typeof window !== 'undefined') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
};

// ==================== RANDOM HELPERS ====================

/**
 * Generates random number between min and max
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random number
 */
export const randomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Debounces a function
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, delay = 300) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
};

/**
 * Throttles a function
 * @param {Function} func - Function to throttle
 * @param {number} limit - Limit in milliseconds
 * @returns {Function} Throttled function
 */
export const throttle = (func, limit = 300) => {
    let inThrottle;
    return (...args) => {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
};

/**
 * Copies text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} Success status
 */
export const copyToClipboard = async (text) => {
    try {
        await navigator.clipboard.writeText(text);
        showNotification('Copied to clipboard!', 'success');
        return true;
    } catch (error) {
        console.error('Failed to copy:', error);
        showNotification('Failed to copy', 'error');
        return false;
    }
};

// ==================== EXPORT ALL ====================
export default {
    // String helpers
    capitalizeFirstLetter,
    truncateString,
    slugify,

    // Number helpers
    formatCurrency,
    formatNumber,
    calculateDiscount,

    // Date helpers
    formatDate,
    getRelativeTime,

    // Cart helpers
    calculateCartTotal,
    calculateTotalItems,
    updateCartItemQuantity,
    addToCartHelper,

    // Validation helpers
    isValidEmail,
    isValidPhone,
    isValidPincode,
    isEmpty,

    // Storage helpers
    saveToLocalStorage,
    loadFromLocalStorage,
    removeFromLocalStorage,

    // Order helpers
    generateOrderId,
    getEstimatedDeliveryTime,
    getOrderStatusColor,

    // Filter helpers
    filterByCategory,
    searchItems,
    sortItems,

    // Random helpers
    randomNumber,
    debounce,
    throttle,
    copyToClipboard,
};