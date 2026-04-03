import { useState } from 'react';

export default function DosaCard({ item, addToCart }) {
    const [isHovered, setIsHovered] = useState(false);

    if (!item) {
        return null;
    }

    return (
        <div
            className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="relative h-56 overflow-hidden bg-gray-100">
                <img
                    src={item.image || 'https://via.placeholder.com/400x300?text=Dosa'}
                    alt={item.name}
                    className={`w-full h-full object-cover transition-transform duration-300 ${isHovered ? 'scale-110' : 'scale-100'}`}
                    onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x300?text=Dosa';
                    }}
                />
                <div className="absolute top-4 right-4 bg-orange-600 text-white px-3 py-1 rounded-full font-bold shadow-lg">
                    ₹{item.price}
                </div>
                <div className="absolute top-4 left-4">
                    {item.type === 'non-veg' ? (
                        <span className="bg-red-600 text-white px-2 py-1 rounded-md text-xs font-bold shadow-md">
                            NON-VEG
                        </span>
                    ) : (
                        <span className="bg-green-600 text-white px-2 py-1 rounded-md text-xs font-bold shadow-md">
                            VEG
                        </span>
                    )}
                </div>
            </div>

            <div className="p-5">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{item.name}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>

                <div className="flex items-center justify-between mb-4 text-sm">
                    <div className={`flex items-center ${item.type === 'non-veg' ? 'text-red-600' : 'text-green-600'}`}>
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>{item.type === 'non-veg' ? 'Non-Vegetarian' : 'Vegetarian'}</span>
                    </div>
                    <div className="flex items-center text-orange-600">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                        </svg>
                        <span>Premium Quality</span>
                    </div>
                </div>

                <button
                    onClick={() => addToCart(item)}
                    className="w-full bg-gradient-to-r from-orange-600 to-orange-500 text-white py-3 rounded-lg font-semibold transition-all duration-300 hover:from-orange-700 hover:to-orange-600 transform hover:scale-105"
                >
                    Add to Cart
                </button>
            </div>
        </div>
    );
}