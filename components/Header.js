import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function Header({ cartCount = 0 }) {
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <header className="bg-gradient-to-r from-orange-700 to-orange-600 text-white shadow-lg sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo and Brand */}
                    <Link href="/">
                        <a className="flex items-center space-x-3 hover:opacity-90 transition-opacity">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                                <img
                                    src="/images/Logo.png"
                                    alt="AA crispy dosa Logo"
                                    className="w-10 h-10 object-contain"
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/40x40?text=AD';
                                    }}
                                />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight">AA crispy dosa</h1>
                                <p className="text-xs text-orange-100">Authentic South Indian</p>
                            </div>
                        </a>
                    </Link>

                    {/* Desktop Navigation Links */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <Link href="/">
                            <a className={`hover:text-orange-200 transition-colors duration-200 flex items-center space-x-1 ${router.pathname === '/' ? 'font-bold border-b-2 border-white' : ''}`}>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                                <span>Home</span>
                            </a>
                        </Link>
                        <Link href="/cart">
                            <a className={`hover:text-orange-200 transition-colors duration-200 flex items-center space-x-1 ${router.pathname === '/cart' ? 'font-bold border-b-2 border-white' : ''}`}>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6M17 13l1.5 6M9 21h6M12 18v3" />
                                </svg>
                                <span>Cart</span>
                                {cartCount > 0 && (
                                    <span className="bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 ml-1">
                                        {cartCount}
                                    </span>
                                )}
                            </a>
                        </Link>
                        <Link href="/order">
                            <a className={`hover:text-orange-200 transition-colors duration-200 flex items-center space-x-1 ${router.pathname === '/order' ? 'font-bold border-b-2 border-white' : ''}`}>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span>Orders</span>
                            </a>
                        </Link>
                    </nav>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center space-x-3">
                        {/* Mobile Cart Icon */}
                        <Link href="/cart">
                            <a className="relative">
                                <div className="bg-orange-800 p-2 rounded-full">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6M17 13l1.5 6M9 21h6M12 18v3" />
                                    </svg>
                                    {cartCount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                                            {cartCount}
                                        </span>
                                    )}
                                </div>
                            </a>
                        </Link>

                        {/* Mobile Menu Toggle Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-white focus:outline-none bg-orange-800 p-2 rounded-full"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {isMobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Dropdown */}
                {isMobileMenuOpen && (
                    <div className="md:hidden mt-4 pt-4 border-t border-orange-500">
                        <nav className="flex flex-col space-y-3">
                            <Link href="/">
                                <a
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`hover:bg-orange-700 px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${router.pathname === '/' ? 'bg-orange-800 font-bold' : ''}`}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                    </svg>
                                    <span>Home</span>
                                </a>
                            </Link>
                            <Link href="/cart">
                                <a
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`hover:bg-orange-700 px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${router.pathname === '/cart' ? 'bg-orange-800 font-bold' : ''}`}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6M17 13l1.5 6M9 21h6M12 18v3" />
                                    </svg>
                                    <span>Cart</span>
                                    {cartCount > 0 && (
                                        <span className="bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 ml-1">
                                            {cartCount}
                                        </span>
                                    )}
                                </a>
                            </Link>
                            <Link href="/order">
                                <a
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`hover:bg-orange-700 px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${router.pathname === '/order' ? 'bg-orange-800 font-bold' : ''}`}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <span>My Orders</span>
                                </a>
                            </Link>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
}