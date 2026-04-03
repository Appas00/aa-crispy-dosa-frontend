import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Admin() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loginId, setLoginId] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [orders, setOrders] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [activeTab, setActiveTab] = useState('orders');
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState({
        totalOrders: 0,
        pendingOrders: 0,
        totalRevenue: 0
    });
    const [feedbacks, setFeedbacks] = useState([]);
    const [feedbackStats, setFeedbackStats] = useState({ pending: 0, approved: 0, total: 0, averageRating: 0 });
    const [newItem, setNewItem] = useState({
        name: '',
        price: '',
        description: '',
        image: '',
        type: 'veg'
    });
    const router = useRouter();

    const API_URL = 'http://localhost:5000/api';

    // Get auth token
    const getAuthToken = () => {
        return localStorage.getItem('adminToken');
    };

    // Check if already logged in
    useEffect(() => {
        const adminAuth = localStorage.getItem('adminAuth');
        const adminToken = localStorage.getItem('adminToken');
        if (adminAuth === 'true' && adminToken) {
            setIsAuthenticated(true);
            loadOrders();
            loadMenu();
            loadStats();
            loadFeedbacks();
            loadFeedbackStats();
        }
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setLoginError('');

        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: loginId, password: password })
            });

            const data = await response.json();

            if (data.success) {
                setIsAuthenticated(true);
                localStorage.setItem('adminAuth', 'true');
                localStorage.setItem('adminToken', data.data.token);
                setLoginError('');
                await loadOrders();
                await loadMenu();
                await loadStats();
                await loadFeedbacks();
                await loadFeedbackStats();
            } else {
                setLoginError('Invalid ID or Password. Please try again.');
            }
        } catch (error) {
            setLoginError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('adminAuth');
        localStorage.removeItem('adminToken');
        setLoginId('');
        setPassword('');
        setOrders([]);
        setMenuItems([]);
        setFeedbacks([]);
    };

    const loadOrders = async () => {
        try {
            const token = getAuthToken();
            if (!token) return;

            const response = await fetch(`${API_URL}/orders`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();

            if (data.success) {
                setOrders(data.data || []);
                console.log('✅ Orders loaded:', data.data?.length || 0, 'orders');
            } else {
                setOrders([]);
            }
        } catch (error) {
            console.error('Error loading orders:', error);
            setOrders([]);
        }
    };

    const loadMenu = async () => {
        try {
            const response = await fetch(`${API_URL}/dosa`);
            const data = await response.json();

            if (data.success) {
                setMenuItems(data.data || []);
                console.log('✅ Menu loaded:', data.data?.length || 0, 'items');
            }
        } catch (error) {
            console.error('Error loading menu:', error);
        }
    };

    const loadStats = async () => {
        try {
            const token = getAuthToken();
            if (!token) return;

            const response = await fetch(`${API_URL}/orders/stats`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();

            if (data.success) {
                setStats(data.data);
            }
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    };

    const loadFeedbacks = async () => {
        try {
            const token = getAuthToken();
            const response = await fetch(`${API_URL}/feedback/admin`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) setFeedbacks(data.data);
        } catch (error) {
            console.error('Error loading feedbacks:', error);
        }
    };

    const loadFeedbackStats = async () => {
        try {
            const token = getAuthToken();
            const response = await fetch(`${API_URL}/feedback/stats`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) setFeedbackStats(data.data);
        } catch (error) {
            console.error('Error loading feedback stats:', error);
        }
    };

    const approveFeedback = async (id) => {
        try {
            const token = getAuthToken();
            const response = await fetch(`${API_URL}/feedback/${id}/approve`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                loadFeedbacks();
                loadFeedbackStats();
                alert('Feedback approved successfully!');
            }
        } catch (error) {
            alert('Failed to approve feedback');
        }
    };

    const deleteFeedback = async (id) => {
        if (confirm('Are you sure you want to delete this feedback?')) {
            try {
                const token = getAuthToken();
                const response = await fetch(`${API_URL}/feedback/${id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                if (data.success) {
                    loadFeedbacks();
                    loadFeedbackStats();
                    alert('Feedback deleted successfully!');
                }
            } catch (error) {
                alert('Failed to delete feedback');
            }
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                alert('Please upload an image file');
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                alert('Image size should be less than 5MB');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result;
                setSelectedImage(base64String);
                setImagePreview(base64String);
                setNewItem({ ...newItem, image: base64String });
            };
            reader.readAsDataURL(file);
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const token = getAuthToken();
            const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            const data = await response.json();

            if (data.success) {
                await loadOrders();
                await loadStats();
                alert(`✅ Order status updated to ${newStatus}`);
            } else {
                alert('Failed to update order status');
            }
        } catch (error) {
            console.error('Error updating order:', error);
            alert('Failed to update order status');
        }
    };

    const addMenuItem = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = getAuthToken();
            const itemData = {
                name: newItem.name,
                price: parseInt(newItem.price),
                description: newItem.description,
                image: newItem.image || 'https://via.placeholder.com/400x300?text=Dosa',
                type: newItem.type
            };

            const response = await fetch(`${API_URL}/dosa`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(itemData)
            });

            const data = await response.json();

            if (data.success) {
                await loadMenu();
                setNewItem({ name: '', price: '', description: '', image: '', type: 'veg' });
                setSelectedImage(null);
                setImagePreview('');
                alert('✅ Menu item added successfully!');
            } else {
                alert('Failed to add menu item');
            }
        } catch (error) {
            console.error('Error adding menu item:', error);
            alert('Failed to add menu item');
        } finally {
            setLoading(false);
        }
    };

    const deleteMenuItem = async (id) => {
        if (confirm('Are you sure you want to delete this item?')) {
            try {
                const token = getAuthToken();
                const response = await fetch(`${API_URL}/dosa/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const data = await response.json();

                if (data.success) {
                    await loadMenu();
                    alert('✅ Menu item deleted successfully!');
                } else {
                    alert('Failed to delete menu item');
                }
            } catch (error) {
                console.error('Error deleting menu item:', error);
                alert('Failed to delete menu item');
            }
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'confirmed': return 'bg-blue-100 text-blue-800';
            case 'preparing': return 'bg-purple-100 text-purple-800';
            case 'ready': return 'bg-indigo-100 text-indigo-800';
            case 'delivered': return 'bg-green-100 text-green-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    // Show login page if not authenticated
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center">
                <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-10 h-10 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800">Admin Login</h2>
                        <p className="text-gray-600 text-sm mt-2">Enter your credentials to access the dashboard</p>
                    </div>

                    <form onSubmit={handleLogin}>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold mb-2">Admin ID</label>
                            <input
                                type="text"
                                value={loginId}
                                onChange={(e) => setLoginId(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                                placeholder="Enter your admin ID"
                                required
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-gray-700 font-semibold mb-2">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                                placeholder="Enter your password"
                                required
                            />
                        </div>

                        {loginError && (
                            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                                {loginError}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition-colors font-semibold disabled:bg-orange-400"
                        >
                            {loading ? 'Logging in...' : 'Login to Dashboard'}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-500">
                        <p>Demo Credentials:</p>

                    </div>
                </div>
            </div>
        );
    }

    // Admin Dashboard (shown after successful login)
    return (
        <div className="min-h-screen bg-gray-100">
            {/* Admin Header */}
            <div className="bg-gradient-to-r from-orange-700 to-orange-600 text-white shadow-lg">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between py-4">
                        <div className="flex items-center space-x-4">
                            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                            <span className="bg-green-500 text-xs px-2 py-1 rounded-full">Logged in</span>
                        </div>
                        <div className="flex space-x-4 items-center">
                            <div className="text-sm hidden md:block">
                                <span className="mr-4">📦 Orders: {stats.totalOrders || orders.length}</span>
                                <span className="mr-4">⏳ Pending: {stats.pendingOrders || orders.filter(o => o.status === 'pending').length}</span>
                                <span>💰 Revenue: ₹{stats.totalRevenue || 0}</span>
                            </div>
                            <span className="text-sm">Welcome, Appas!</span>
                            <button
                                onClick={handleLogout}
                                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors text-sm"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="bg-white shadow-md">
                <div className="container mx-auto px-4">
                    <div className="flex space-x-1">
                        <button
                            onClick={() => setActiveTab('orders')}
                            className={`px-6 py-3 font-semibold transition-colors ${activeTab === 'orders'
                                ? 'text-orange-600 border-b-2 border-orange-600'
                                : 'text-gray-600 hover:text-orange-600'
                                }`}
                        >
                            📦 Orders ({orders.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('menu')}
                            className={`px-6 py-3 font-semibold transition-colors ${activeTab === 'menu'
                                ? 'text-orange-600 border-b-2 border-orange-600'
                                : 'text-gray-600 hover:text-orange-600'
                                }`}
                        >
                            🍽️ Menu Management ({menuItems.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('feedback')}
                            className={`px-6 py-3 font-semibold transition-colors ${activeTab === 'feedback'
                                ? 'text-orange-600 border-b-2 border-orange-600'
                                : 'text-gray-600 hover:text-orange-600'
                                }`}
                        >
                            💬 Feedback ({feedbackStats.pending})
                        </button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {activeTab === 'orders' && (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Manage Orders</h2>
                        <button
                            onClick={loadOrders}
                            className="mb-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                            🔄 Refresh Orders
                        </button>
                        {orders.length === 0 ? (
                            <div className="bg-white rounded-lg shadow-md p-8 text-center">
                                <div className="text-6xl mb-4">📭</div>
                                <p className="text-gray-500 text-lg">No orders yet</p>
                                <p className="text-gray-400 text-sm">Orders will appear here once customers place them</p>
                                <p className="text-gray-400 text-sm mt-2">💡 Make sure your backend server is running on port 5000</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {orders.map(order => (
                                    <div key={order.orderId || order._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-800">Order #{order.orderId || order._id?.slice(-8)}</h3>
                                                <p className="text-gray-600 text-sm">
                                                    {new Date(order.createdAt).toLocaleString()}
                                                </p>
                                            </div>
                                            <select
                                                value={order.status}
                                                onChange={(e) => updateOrderStatus(order.orderId || order._id, e.target.value)}
                                                className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)} border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500`}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="confirmed">Confirmed</option>
                                                <option value="preparing">Preparing</option>
                                                <option value="ready">Ready</option>
                                                <option value="delivered">Delivered</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                                            <div>
                                                <p className="font-semibold text-gray-700 mb-2">Customer Details:</p>
                                                <div className="space-y-1 text-sm">
                                                    <p>👤 Name: {order.customer?.name}</p>
                                                    <p>📞 Phone: {order.customer?.phone}</p>
                                                    <p>📍 Address: {order.customer?.address}</p>
                                                    {order.customer?.landmark && <p>🏠 Landmark: {order.customer.landmark}</p>}
                                                </div>
                                            </div>

                                            <div>
                                                <p className="font-semibold text-gray-700 mb-2">Order Details:</p>
                                                <div className="space-y-1 text-sm">
                                                    {order.items?.map((item, idx) => (
                                                        <p key={idx}>🍽️ {item.name} x{item.quantity} - ₹{item.price * item.quantity}</p>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center pt-4 border-t">
                                            <div>
                                                <p className="font-bold text-lg text-orange-600">Total: ₹{order.total}</p>
                                                <p className="text-xs text-gray-500">Payment: {order.customer?.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online'}</p>
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {order.status === 'pending' && '⏳ Awaiting confirmation'}
                                                {order.status === 'confirmed' && '✅ Order confirmed'}
                                                {order.status === 'preparing' && '👨‍🍳 Being prepared'}
                                                {order.status === 'ready' && '🚀 Ready for delivery'}
                                                {order.status === 'delivered' && '🎉 Delivered'}
                                                {order.status === 'cancelled' && '❌ Cancelled'}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'menu' && (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Menu Management</h2>

                        {/* Add New Item Form */}
                        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                <span className="text-2xl mr-2">➕</span>
                                Add New Dosa Item
                            </h3>
                            <form onSubmit={addMenuItem} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        placeholder="Dosa Name"
                                        value={newItem.name}
                                        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                                        required
                                    />
                                    <input
                                        type="number"
                                        placeholder="Price (₹)"
                                        value={newItem.price}
                                        onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                                        required
                                    />

                                    {/* Image Upload Field */}
                                    <div className="md:col-span-2">
                                        <label className="block text-gray-700 font-semibold mb-2">Dosa Image</label>
                                        <div className="flex items-center space-x-4">
                                            <div className="flex-1">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                                                />
                                                <p className="text-xs text-gray-500 mt-1">Upload JPG, PNG or GIF (Max 5MB)</p>
                                            </div>
                                            {imagePreview && (
                                                <div className="relative">
                                                    <img src={imagePreview} alt="Preview" className="w-20 h-20 object-cover rounded-lg border-2 border-orange-300" />
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setSelectedImage(null);
                                                            setImagePreview('');
                                                            setNewItem({ ...newItem, image: '' });
                                                        }}
                                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <select
                                        value={newItem.type}
                                        onChange={(e) => setNewItem({ ...newItem, type: e.target.value })}
                                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                                    >
                                        <option value="veg">Vegetarian</option>
                                        <option value="non-veg">Non-Vegetarian</option>
                                    </select>
                                    <textarea
                                        placeholder="Description"
                                        value={newItem.description}
                                        onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 md:col-span-2"
                                        rows="2"
                                        required
                                    ></textarea>
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors font-semibold disabled:bg-orange-400"
                                >
                                    {loading ? 'Adding...' : 'Add to Menu'}
                                </button>
                            </form>
                        </div>

                        {/* Existing Menu Items */}
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="px-6 py-4 bg-gray-50 border-b">
                                <h3 className="font-semibold text-gray-700">Current Menu Items ({menuItems.length})</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {menuItems.map(item => (
                                            <tr key={item._id || item.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                                                        <img
                                                            src={item.image}
                                                            alt={item.name}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                e.target.src = 'https://via.placeholder.com/48x48?text=Dosa';
                                                            }}
                                                        />
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="font-medium text-gray-900">{item.name}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${item.type === 'veg' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                        }`}>
                                                        {item.type === 'veg' ? 'VEG' : 'NON-VEG'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">₹{item.price}</td>
                                                <td className="px-6 py-4 max-w-xs truncate">{item.description}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <button
                                                        onClick={() => deleteMenuItem(item._id || item.id)}
                                                        className="text-red-600 hover:text-red-800 transition-colors font-medium"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Preview Section */}
                        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">📸 Preview: Our Signature Dosas</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {menuItems.slice(0, 6).map(item => (
                                    <div key={item._id || item.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                                        <div className="h-48 overflow-hidden">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.src = 'https://via.placeholder.com/400x300?text=Dosa';
                                                }}
                                            />
                                        </div>
                                        <div className="p-4">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-bold text-lg text-gray-800">{item.name}</h4>
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${item.type === 'veg' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {item.type === 'veg' ? 'VEG' : 'NON-VEG'}
                                                </span>
                                            </div>
                                            <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                                            <p className="text-orange-600 font-bold text-xl">₹{item.price}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {menuItems.length === 0 && (
                                <p className="text-center text-gray-500 py-8">No menu items added yet. Add your first dosa above!</p>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'feedback' && (
                    <div>
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                            <div className="bg-white rounded-lg shadow-md p-4 text-center">
                                <div className="text-2xl font-bold text-orange-600">{feedbackStats.total || 0}</div>
                                <div className="text-sm text-gray-600">Total Feedbacks</div>
                            </div>
                            <div className="bg-yellow-50 rounded-lg shadow-md p-4 text-center">
                                <div className="text-2xl font-bold text-yellow-600">{feedbackStats.pending || 0}</div>
                                <div className="text-sm text-gray-600">Pending Approval</div>
                            </div>
                            <div className="bg-green-50 rounded-lg shadow-md p-4 text-center">
                                <div className="text-2xl font-bold text-green-600">{feedbackStats.approved || 0}</div>
                                <div className="text-sm text-gray-600">Approved</div>
                            </div>
                            <div className="bg-blue-50 rounded-lg shadow-md p-4 text-center">
                                <div className="text-2xl font-bold text-blue-600">{feedbackStats.averageRating?.toFixed(1) || 0}</div>
                                <div className="text-sm text-gray-600">Avg Rating</div>
                            </div>
                        </div>

                        {/* Feedback Table */}
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="px-6 py-4 bg-gray-50 border-b">
                                <h3 className="font-semibold text-gray-700">Customer Feedback</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Customer</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Rating</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Message</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Date</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {feedbacks.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                                    No feedback submissions yet
                                                </td>
                                            </tr>
                                        ) : (
                                            feedbacks.map(feedback => (
                                                <tr key={feedback._id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4">
                                                        <div>
                                                            <div className="font-medium text-gray-900">{feedback.customerName}</div>
                                                            {feedback.email && <div className="text-xs text-gray-500">{feedback.email}</div>}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex gap-1">
                                                            {[...Array(5)].map((_, i) => (
                                                                <span key={i} className={i < feedback.rating ? 'text-yellow-400' : 'text-gray-300'}>
                                                                    ★
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 max-w-xs">
                                                        <p className="text-sm text-gray-700 truncate">{feedback.message}</p>
                                                        {feedback.orderId && (
                                                            <p className="text-xs text-gray-500 mt-1">Order: #{feedback.orderId.slice(-8)}</p>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm">{new Date(feedback.createdAt).toLocaleDateString()}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${feedback.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                            {feedback.isApproved ? 'Approved' : 'Pending'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 space-x-2">
                                                        {!feedback.isApproved && (
                                                            <button
                                                                onClick={() => approveFeedback(feedback._id)}
                                                                className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                                                            >
                                                                Approve
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => deleteFeedback(feedback._id)}
                                                            className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}