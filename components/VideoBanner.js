import { useRef, useEffect } from 'react';

export default function VideoBanner() {
    const videoRef = useRef(null);

    useEffect(() => {
        // Autoplay video when component mounts
        if (videoRef.current) {
            videoRef.current.play().catch(error => {
                console.log("Autoplay prevented:", error);
            });
        }
    }, []);

    return (
        <div className="relative w-full bg-black overflow-hidden">
            {/* Video Element */}
            <video
                ref={videoRef}
                className="w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
                poster="/images/video-poster.jpg"
            >
                <source src="/videos/frontpage.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            {/* Overlay Content */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-center justify-center">
                <div className="text-center text-white px-4">
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 animate-fade-in">
                        Welcome to AA Crispy Dosa
                    </h1>
                    <p className="text-lg md:text-2xl mb-8 max-w-2xl mx-auto">
                        Experience the authentic taste of South Indian cuisine
                    </p>
                    <button
                        onClick={() => {
                            document.getElementById('menu-section')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                        Explore Our Menu
                    </button>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
                    <div className="w-1 h-3 bg-white rounded-full mt-2 animate-scroll"></div>
                </div>
            </div>

            {/* Custom CSS for animations */}
            <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        
        @keyframes scroll {
          0% {
            opacity: 1;
            transform: translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateY(10px);
          }
        }
        
        .animate-scroll {
          animation: scroll 1.5s infinite;
        }
        
        @keyframes bounce {
          0%, 100% {
            transform: translateY(-25%);
            animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
          }
          50% {
            transform: translateY(0);
            animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
          }
        }
        
        .animate-bounce {
          animation: bounce 2s infinite;
        }
      `}</style>
        </div>
    );
}