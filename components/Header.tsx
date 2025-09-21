import React from 'react';
import Navbar from './Navbar';
import { Page } from '../App';

interface HeaderProps {
    currentPage: Page;
    setCurrentPage: (page: Page) => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, setCurrentPage }) => {
    return (
        <header className="bg-white shadow-sm sticky top-0 z-10">
            <div className="container mx-auto px-4 py-3">
                <div className="flex items-center space-x-3">
                    <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
                        AgriYield <span className="text-green-600">AI</span>
                    </h1>
                </div>
            </div>
            <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
        </header>
    );
};

export default Header;
