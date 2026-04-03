export default function CartItem({ item, updateQuantity, removeItem }) {
    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-4 border-b border-gray-200 last:border-0">
            {/* Item Image and Info */}
            <div className="flex items-center space-x-4 mb-3 sm:mb-0">
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/80x80?text=Dosa';
                        }}
                    />
                </div>

                <div>
                    <h3 className="font-semibold text-gray-800 text-lg">{item.name}</h3>
                    <p className="text-orange-600 font-bold">₹{item.price}</p>
                    <p className="text-gray-500 text-sm">per piece</p>
                </div>
            </div>

            {/* Quantity Controls and Price */}
            <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto space-x-6">
                {/* Quantity Selector */}
                <div className="flex items-center space-x-3">
                    <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold transition-colors flex items-center justify-center"
                    >
                        -
                    </button>

                    <span className="font-semibold text-gray-800 min-w-[30px] text-center">
                        {item.quantity}
                    </span>

                    <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold transition-colors flex items-center justify-center"
                    >
                        +
                    </button>
                </div>

                {/* Item Total */}
                <div className="text-right">
                    <p className="font-bold text-gray-800 text-lg">
                        ₹{item.price * item.quantity}
                    </p>
                    <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-700 text-sm transition-colors"
                    >
                        Remove
                    </button>
                </div>
            </div>
        </div>
    );
}