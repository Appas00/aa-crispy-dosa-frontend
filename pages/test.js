export default function Test() {
    return (
        <div className="min-h-screen p-8">
            <div className="bg-orange-600 text-white p-4 rounded-lg mb-4">
                If you see orange background with white text, Tailwind CSS is working!
            </div>
            <div className="bg-green-600 text-white p-4 rounded-lg">
                This should be green.
            </div>
            <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Test Button
            </button>
        </div>
    );
}