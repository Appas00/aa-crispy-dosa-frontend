import { useState, useEffect } from 'react';

export default function Testimonials() {
    const [feedbacks, setFeedbacks] = useState([]);
    const [stats, setStats] = useState({ averageRating: 0, totalFeedbacks: 0 });
    const [loading, setLoading] = useState(true);

    const API_URL = 'http://localhost:5000/api';

    useEffect(() => {
        loadFeedbacks();
    }, []);

    const loadFeedbacks = async () => {
        try {
            const response = await fetch(`${API_URL}/feedback/approved`);
            const data = await response.json();

            if (data.success) {
                setFeedbacks(data.data);
                setStats(data.stats);
            }
        } catch (error) {
            console.error('Error loading feedbacks:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderStars = (rating) => {
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className="text-lg">
                        {star <= rating ? (
                            <span className="text-yellow-400">★</span>
                        ) : (
                            <span className="text-gray-300">☆</span>
                        )}
                    </span>
                ))}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="text-center py-12">
                <div className="loading-spinner mx-auto"></div>
                <p className="text-gray-500 mt-4">Loading reviews...</p>
            </div>
        );
    }

    return (
        <div>
            {/* Rating Summary */}
            {stats.totalFeedbacks > 0 && (
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-4 bg-orange-50 px-6 py-3 rounded-full">
                        <div>
                            <span className="text-3xl font-bold text-orange-600">{stats.averageRating}</span>
                            <span className="text-gray-600">/5</span>
                        </div>
                        <div>
                            {renderStars(Math.round(stats.averageRating))}
                            <p className="text-sm text-gray-500 mt-1">
                                Based on {stats.totalFeedbacks} reviews
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Testimonials Grid */}
            {feedbacks.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl shadow-md">
                    <p className="text-gray-500">No reviews yet. Be the first to share your experience!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {feedbacks.map((feedback, index) => (
                        <div
                            key={feedback._id}
                            className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all duration-300"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h4 className="font-bold text-gray-800 text-lg">{feedback.customerName}</h4>
                                    <p className="text-xs text-gray-500">
                                        {new Date(feedback.createdAt).toLocaleDateString('en-IN', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric',
                                        })}
                                    </p>
                                </div>
                                <div className="text-4xl">
                                    {feedback.rating >= 4 ? '😊' : feedback.rating >= 3 ? '😐' : '😞'}
                                </div>
                            </div>
                            <div className="mb-3">
                                {renderStars(feedback.rating)}
                            </div>
                            <p className="text-gray-600 italic">"{feedback.message}"</p>
                            <div className="mt-4 pt-3 border-t border-gray-100">
                                <div className="flex items-center gap-1 text-orange-500">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-xs">Verified Customer</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}