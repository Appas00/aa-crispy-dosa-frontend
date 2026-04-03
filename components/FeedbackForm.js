import { useState } from 'react';

export default function FeedbackForm() {
    const [formData, setFormData] = useState({
        customerName: '',
        rating: 5,
        message: '',
    });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const API_URL = 'http://localhost:5000/api';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch(`${API_URL}/feedback`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (data.success) {
                setSubmitted(true);
                setFormData({ customerName: '', rating: 5, message: '' });
                setTimeout(() => setSubmitted(false), 5000);
            } else {
                setError(data.message || 'Failed to submit feedback');
            }
        } catch (error) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const renderStars = () => {
        return (
            <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => setFormData({ ...formData, rating: star })}
                        className="text-3xl focus:outline-none transition-transform hover:scale-110"
                    >
                        {star <= formData.rating ? (
                            <span className="text-yellow-400">★</span>
                        ) : (
                            <span className="text-gray-300">☆</span>
                        )}
                    </button>
                ))}
            </div>
        );
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Share Your Feedback</h3>
            <p className="text-gray-600 mb-6">Your feedback helps us serve you better!</p>

            {submitted && (
                <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg animate-fade-in-up">
                    ✅ Thank you for your feedback! It will appear after admin approval.
                </div>
            )}

            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                    ❌ {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-700 font-semibold mb-2">Your Name *</label>
                    <input
                        type="text"
                        required
                        value={formData.customerName}
                        onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                        placeholder="Enter your name"
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-semibold mb-2">Rating *</label>
                    {renderStars()}
                    <p className="text-sm text-gray-500 mt-1">
                        {formData.rating === 5 && "Excellent! 🌟"}
                        {formData.rating === 4 && "Very Good! 👍"}
                        {formData.rating === 3 && "Good! 😊"}
                        {formData.rating === 2 && "Fair! 😐"}
                        {formData.rating === 1 && "Poor! 😞"}
                    </p>
                </div>

                <div>
                    <label className="block text-gray-700 font-semibold mb-2">Your Message *</label>
                    <textarea
                        required
                        rows="4"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                        placeholder="Share your experience with us..."
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition-colors font-semibold disabled:opacity-50"
                >
                    {loading ? 'Submitting...' : 'Submit Feedback'}
                </button>
            </form>
        </div>
    );
}