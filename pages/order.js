import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Order() {
    const [cart, setCart] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        landmark: '',
        paymentMethod: 'cod'
    });
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [orderId, setOrderId] = useState('');
    const [loading, setLoading] = useState(false);
    const [isGettingLocation, setIsGettingLocation] = useState(false);
    const [locationError, setLocationError] = useState('');
    const [locationDetails, setLocationDetails] = useState(null);
    const router = useRouter();

    const API_URL = 'http://localhost:5000/api';

    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart && JSON.parse(savedCart).length > 0) {
            const parsedCart = JSON.parse(savedCart);
            console.log('Cart loaded:', parsedCart);
            setCart(parsedCart);
        } else {
            router.push('/');
        }
    }, []);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const getLiveLocation = () => {
        setIsGettingLocation(true);
        setLocationError('');

        if (!navigator.geolocation) {
            setLocationError('Geolocation is not supported by your browser');
            setIsGettingLocation(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude, accuracy } = position.coords;

                setLocationDetails({
                    lat: latitude,
                    lng: longitude,
                    accuracy: Math.round(accuracy)
                });

                // Try to get address from coordinates using reverse geocoding
                try {
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
                    );
                    const data = await response.json();

                    if (data.display_name) {
                        const addressParts = [];
                        if (data.address.road) addressParts.push(data.address.road);
                        if (data.address.suburb) addressParts.push(data.address.suburb);
                        if (data.address.city || data.address.town) {
                            addressParts.push(data.address.city || data.address.town);
                        }
                        if (data.address.state) addressParts.push(data.address.state);
                        if (data.address.postcode) addressParts.push(data.address.postcode);

                        const formattedAddress = addressParts.join(', ');
                        setFormData(prev => ({
                            ...prev,
                            address: formattedAddress || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
                        }));
                    } else {
                        setFormData(prev => ({
                            ...prev,
                            address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
                        }));
                    }
                } catch (error) {
                    setFormData(prev => ({
                        ...prev,
                        address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
                    }));
                }

                setIsGettingLocation(false);
                alert('📍 Location detected! Address has been auto-filled. Please verify and update if needed.');
            },
            (error) => {
                let errorMessage = '';
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = 'Please allow location access. Click "Allow" in the browser popup.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = 'Unable to get your location. Please check your GPS/network.';
                        break;
                    case error.TIMEOUT:
                        errorMessage = 'Location request timed out. Please try again.';
                        break;
                    default:
                        errorMessage = 'Unable to get location. Please enter address manually.';
                }
                setLocationError(errorMessage);
                alert(errorMessage);
                setIsGettingLocation(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 0
            }
        );
    };

    const getTotalPrice = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const placeOrder = async (e) => {
        e.preventDefault();

        if (!formData.address) {
            alert('Please enter your delivery address or use live location');
            return;
        }

        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(formData.phone)) {
            alert('Please enter a valid 10-digit phone number');
            return;
        }

        setLoading(true);

        try {
            const subtotal = getTotalPrice();
            const deliveryFee = 40;
            const total = subtotal + deliveryFee;

            const orderItems = cart.map((item, index) => {
                let itemId = item.id;
                if (!itemId) {
                    itemId = `item_${Date.now()}_${index}`;
                }

                return {
                    id: String(itemId),
                    name: String(item.name || 'Dosa'),
                    price: Number(item.price || 0),
                    quantity: Number(item.quantity || 1),
                    image: String(item.image || ''),
                    type: String(item.type || 'veg')
                };
            });

            const orderData = {
                items: orderItems,
                customer: {
                    name: String(formData.name),
                    phone: String(formData.phone),
                    address: String(formData.address),
                    landmark: String(formData.landmark || ''),
                    paymentMethod: String(formData.paymentMethod)
                },
                location: locationDetails || {},
                subtotal: Number(subtotal),
                deliveryFee: Number(deliveryFee),
                total: Number(total)
            };

            const response = await fetch(`${API_URL}/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData)
            });

            const data = await response.json();

            if (data.success) {
                setOrderId(data.data.orderId);
                localStorage.removeItem('cart');
                setOrderPlaced(true);
            } else {
                const errorMsg = data.message || data.errors || 'Validation error';
                alert('Failed to place order: ' + errorMsg);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Network error. Make sure backend is running on port 5000');
        } finally {
            setLoading(false);
        }
    };

    if (orderPlaced) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
                <Header cartCount={0} />
                <div className="container mx-auto px-4 py-16">
                    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8 text-center">
                        <div className="text-6xl mb-4">✅</div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-4">Order Placed Successfully!</h1>
                        <p className="text-gray-600 mb-2">Your order ID is: <strong className="text-orange-600">{orderId}</strong></p>
                        <p className="text-gray-600 mb-8">We'll deliver your delicious dosas soon!</p>
                        <button
                            onClick={() => router.push('/')}
                            className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition-colors"
                        >
                            Order More Dosas
                        </button>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
            <Header cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)} />

            <div className="container mx-auto px-4 py-16">
                <h1 className="text-4xl font-bold text-gray-800 mb-8">Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Delivery Information</h2>

                        <form onSubmit={placeOrder}>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold mb-2">Full Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                                    placeholder="Enter your name"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold mb-2">Phone Number *</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    required
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    maxLength="10"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                                    placeholder="9876543210"
                                />
                                <p className="text-xs text-gray-500 mt-1">Enter 10-digit mobile number</p>
                            </div>

                            {/* Live Location Button */}
                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold mb-2">Live Location</label>
                                <button
                                    type="button"
                                    onClick={getLiveLocation}
                                    disabled={isGettingLocation}
                                    className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-4 py-3 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 text-sm disabled:from-blue-400 disabled:to-blue-400"
                                >
                                    {isGettingLocation ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <span>Getting Your Location...</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <span>📍 Get My Current Location</span>
                                        </>
                                    )}
                                </button>
                                {locationError && (
                                    <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                                        <p className="text-red-600 text-xs flex items-center">
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            {locationError}
                                        </p>
                                    </div>
                                )}
                                <p className="text-xs text-gray-500 mt-1">
                                    💡 Click the button above to auto-fill your current address
                                </p>
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold mb-2">Landmark (Optional)</label>
                                <input
                                    type="text"
                                    name="landmark"
                                    value={formData.landmark}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                                    placeholder="Nearby landmark (e.g., near temple, bus stop)"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold mb-2">Complete Address *</label>
                                <textarea
                                    name="address"
                                    required
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    rows="3"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                                    placeholder="House/Flat No., Street, Area, City, Pincode"
                                />
                                <div className="mt-2 text-xs text-gray-500 space-y-1">
                                    <p>💡 <strong>Tips for accurate delivery:</strong></p>
                                    <p>• Include house/flat number and street name</p>
                                    <p>• Add area name and landmark for easy finding</p>
                                    <p>• Mention nearby famous locations</p>
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block text-gray-700 font-semibold mb-2">Payment Method</label>
                                <div className="space-y-2">
                                    <label className="flex items-center cursor-pointer p-3 border rounded-lg hover:bg-gray-50">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="cod"
                                            checked={formData.paymentMethod === 'cod'}
                                            onChange={handleInputChange}
                                            className="mr-3 w-4 h-4 text-orange-600"
                                        />
                                        <div className="flex-1">
                                            <span className="font-semibold">Cash on Delivery</span>
                                            <p className="text-xs text-gray-500">Pay when you receive your order</p>
                                        </div>
                                    </label>
                                    <label className="flex items-center cursor-pointer p-3 border rounded-lg opacity-50">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="online"
                                            disabled
                                            className="mr-3 w-4 h-4"
                                        />
                                        <div className="flex-1">
                                            <span className="font-semibold">Online Payment</span>
                                            <p className="text-xs text-gray-500">Credit/Debit Card, UPI, NetBanking</p>
                                        </div>
                                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                                            Coming Soon
                                        </span>
                                    </label>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-orange-600 to-orange-500 text-white py-3 rounded-lg hover:from-orange-700 hover:to-orange-600 transition-all duration-300 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        Placing Order...
                                    </span>
                                ) : (
                                    `Place Order • ₹${getTotalPrice() + 40}`
                                )}
                            </button>
                        </form>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6 h-fit sticky top-24">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Summary</h2>
                        <div className="max-h-80 overflow-y-auto mb-4">
                            {cart.map((item, idx) => (
                                <div key={item.id || idx} className="flex justify-between py-2 border-b">
                                    <div>
                                        <span className="font-semibold">{item.name}</span>
                                        <span className="text-gray-600 text-sm ml-2">x{item.quantity}</span>
                                    </div>
                                    <span>₹{item.price * item.quantity}</span>
                                </div>
                            ))}
                        </div>
                        <div className="space-y-2 pt-4 border-t">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>₹{getTotalPrice()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Delivery Fee</span>
                                <span>₹40</span>
                            </div>
                            <div className="border-t pt-2 mt-2">
                                <div className="flex justify-between font-bold text-xl">
                                    <span>Total</span>
                                    <span className="text-orange-600">₹{getTotalPrice() + 40}</span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                            <p className="text-sm text-orange-800 flex items-start">
                                <span className="text-lg mr-2">🍽️</span>
                                <span>Your delicious dosas will be delivered to the address provided. Keep your phone handy for delivery updates!</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}