import React from 'react';
import { Page } from '../App';

interface NavbarProps {
    currentPage: Page;
    setCurrentPage: (page: Page) => void;
}

const navItems: { page: Page; label: string }[] = [
    { page: 'predict', label: 'Predict Yield' },
    { page: 'analytics', label: 'Field Analytics' },
    { page: 'explorer', label: 'Crop Explorer' },
    { page: 'history', label: 'Prediction History' },
    { page: 'about', label: 'About' },
];

const Navbar: React.FC<NavbarProps> = ({ currentPage, setCurrentPage }) => {
    const baseClasses = "px-3 py-2 text-sm font-medium rounded-md cursor-pointer transition-colors duration-200";
    const activeClasses = "bg-green-100 text-green-700";
    const inactiveClasses = "text-gray-600 hover:bg-gray-100 hover:text-gray-900";

    return (
        <nav className="bg-white border-t border-gray-200">
            <div className="container mx-auto px-4">
                <div className="flex items-center space-x-4 overflow-x-auto">
                    {navItems.map(item => (
                        <a
                            key={item.page}
                            onClick={() => setCurrentPage(item.page)}
                            className={`${baseClasses} ${currentPage === item.page ? activeClasses : inactiveClasses}`}
                            aria-current={currentPage === item.page ? 'page' : undefined}
                        >
                            {item.label}
                        </a>
                    ))}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;