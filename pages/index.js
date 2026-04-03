import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import DosaCard from '../components/DosaCard';
import VideoBanner from '../components/VideoBanner';
import FeedbackForm from '../components/FeedbackForm';
import Testimonials from '../components/Testimonials';

export default function Home() {
    const [menuItems, setMenuItems] = useState([]);
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);

    const API_URL = 'http://localhost:5000/api';

    useEffect(() => {
        loadMenuItems();
        loadCart();
    }, []);

    const loadMenuItems = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/dosa`);
            const data = await response.json();

            if (data.success && data.data && data.data.length > 0) {
                const items = data.data.map(item => ({
                    id: item._id || item.id,
                    name: item.name,
                    price: item.price,
                    image: item.image,
                    description: item.description,
                    type: item.type
                }));
                setMenuItems(items);
            } else {
                // Default menu when backend has no data
                const defaultMenu = [
                    { id: 1, name: 'Cheese Dosa', price: 120, image: '/images/Cheese Dosa.png', description: 'Crispy dosa filled with melted cheese', type: 'veg' },
                    { id: 2, name: 'Curry Dosa', price: 100, image: '/images/Curry Dosa.png', description: 'Spicy chicken curry filled dosa', type: 'non-veg' },
                    { id: 3, name: 'Egg Dosa', price: 110, image: '/images/Egg Dosa.png', description: 'Protein-rich egg dosa with masala', type: 'non-veg' },
                    { id: 4, name: 'Masala Dosa', price: 90, image: '/images/Masala Dosa.png', description: 'Classic masala potato filling', type: 'veg' },
                    { id: 5, name: 'Mutton Dosa', price: 180, image: '/images/Mutton Dosa.png', description: 'Premium mutton keema dosa', type: 'non-veg' },
                    { id: 6, name: 'Variety Dosa', price: 130, image: '/images/Variety Dosa.png', description: 'Mix of delicious fillings', type: 'veg' }
                ];
                setMenuItems(defaultMenu);
            }
        } catch (error) {
            console.error('Error loading menu:', error);
            // Fallback default menu
            const defaultMenu = [
                { id: 1, name: 'Cheese Dosa', price: 120, image: '/images/Cheese Dosa.png', description: 'Crispy dosa filled with melted cheese', type: 'veg' },
                { id: 2, name: 'Curry Dosa', price: 100, image: '/images/Curry Dosa.png', description: 'Spicy chicken curry filled dosa', type: 'non-veg' },
                { id: 3, name: 'Egg Dosa', price: 110, image: '/images/Egg Dosa.png', description: 'Protein-rich egg dosa with masala', type: 'non-veg' },
                { id: 4, name: 'Masala Dosa', price: 90, image: '/images/Masala Dosa.png', description: 'Classic masala potato filling', type: 'veg' },
                { id: 5, name: 'Mutton Dosa', price: 180, image: '/images/Mutton Dosa.png', description: 'Premium mutton keema dosa', type: 'non-veg' },
                { id: 6, name: 'Variety Dosa', price: 130, image: '/images/Variety Dosa.png', description: 'Mix of delicious fillings', type: 'veg' }
            ];
            setMenuItems(defaultMenu);
        } finally {
            setLoading(false);
        }
    };

    const loadCart = () => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }
    };

    const addToCart = (item) => {
        const existingItem = cart.find(cartItem => cartItem.id === item.id);
        let newCart;

        if (existingItem) {
            newCart = cart.map(cartItem =>
                cartItem.id === item.id
                    ? { ...cartItem, quantity: cartItem.quantity + 1 }
                    : cartItem
            );
        } else {
            newCart = [...cart, { ...item, quantity: 1 }];
        }

        setCart(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
            <Header cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)} />

            <VideoBanner />

            {/* Menu Section */}
            <section id="menu-section" className="container mx-auto px-4 py-16">
                <h2 className="text-4xl font-bold text-center text-gray-800 mb-4">
                    Our Signature Dosas
                </h2>
                <p className="text-center text-gray-600 mb-12 text-lg">
                    Authentic South Indian flavors made with love
                </p>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="loading-spinner mx-auto"></div>
                        <p className="text-gray-500 mt-4">Loading menu...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {menuItems.map(item => (
                            <DosaCard key={item.id} item={item} addToCart={addToCart} />
                        ))}
                    </div>
                )}
            </section>

            {/* Customer Feedback Section */}
            <section className="container mx-auto px-4 py-16 bg-gradient-to-b from-orange-50 to-white">
                <h2 className="text-4xl font-bold text-center text-gray-800 mb-4">
                    Customer Reviews
                </h2>
                <p className="text-center text-gray-600 mb-12 text-lg">
                    What our customers say about us
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <Testimonials />
                    </div>
                    <div>
                        <FeedbackForm />
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}