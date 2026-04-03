import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CartItem from '../components/CartItem';

export default function Cart() {
    const [cart, setCart] = useState([]);
    const router = useRouter();

    useEffect(() => {
        loadCart();
    }, []);

    const loadCart = () => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }
    };

    const updateQuantity = (id, newQuantity) => {
        if (newQuantity < 1) {
            removeItem(id);
            return;
        }

        const newCart = cart.map(item =>
            item.id === id ? { ...item, quantity: newQuantity } : item
        );
        setCart(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
    };

    const removeItem = (id) => {
        const newCart = cart.filter(item => item.id !== id);
        setCart(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
    };

    const getTotalPrice = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const proceedToCheckout = () => {
        if (cart.length > 0) {
            router.push('/order');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
            <Header cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)} />

            <div className="container mx-auto px-4 py-16">
                <h1 className="text-4xl font-bold text-gray-800 mb-8">Your Cart</h1>

                {cart.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="text-6xl mb-4">🛒</div>
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Your cart is empty</h2>
                        <p className="text-gray-500 mb-8">Add some delicious dosas to your cart!</p>
                        <button
                            onClick={() => router.push('/')}
                            className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
                        >
                            Browse Menu
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-lg shadow-md p-6">
                                {cart.map(item => (
                                    <CartItem
                                        key={item.id}
                                        item={item}
                                        updateQuantity={updateQuantity}
                                        removeItem={removeItem}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                                <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Summary</h2>

                                <div className="space-y-2 mb-4">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal ({cart.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                                        <span>₹{getTotalPrice()}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Delivery Fee</span>
                                        <span>₹40</span>
                                    </div>
                                    <div className="border-t pt-2 mt-2">
                                        <div className="flex justify-between font-bold text-lg">
                                            <span>Total</span>
                                            <span className="text-orange-600">₹{getTotalPrice() + 40}</span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={proceedToCheckout}
                                    className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition-colors font-semibold"
                                >
                                    Proceed to Checkout
                                </button>

                                <button
                                    onClick={() => router.push('/')}
                                    className="w-full mt-3 text-orange-600 py-2 rounded-lg hover:bg-orange-50 transition-colors"
                                >
                                    Continue Shopping
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}