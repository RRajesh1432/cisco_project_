import React, { useState, useEffect } from 'react';
import { HistoricalPrediction } from '../types';
import { getHistory, clearHistory } from '../services/historyService';

const HistoryItem: React.FC<{ item: HistoricalPrediction }> = ({ item }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full text-left p-4 flex justify-between items-center bg-gray-50 hover:bg-gray-100 focus:outline-none"
                aria-expanded={isOpen}
            >
                <div>
                    <p className="font-semibold text-green-800">{item.formData.cropType} in {item.formData.location}</p>
                    <p className="text-sm text-gray-500">Predicted on {new Date(item.date).toLocaleDateString()}</p>
                </div>
                 <div className="text-right">
                    <p className="text-lg font-bold text-gray-800">{item.result.predictedYield.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">{item.result.yieldUnit}</p>
                </div>
            </button>
            {isOpen && (
                <div className="p-4 border-t border-gray-200 animate-fade-in-down">
                    <h4 className="font-semibold mb-2">Input Details:</h4>
                    <ul className="text-sm text-gray-600 list-disc list-inside bg-gray-50 p-3 rounded-md mb-4">
                        <li><strong>Area:</strong> {item.formData.area} hectares</li>
                        <li><strong>Soil:</strong> {item.formData.soilType}</li>
                        <li><strong>Rainfall:</strong> {item.formData.rainfall} mm</li>
                        <li><strong>Temperature:</strong> {item.formData.temperature}°C</li>
                        <li><strong>Fertilizer:</strong> {item.formData.fertilizerType}</li>
                        <li><strong>Pesticide Used:</strong> {item.formData.pesticideUsage ? 'Yes' : 'No'}</li>
                    </ul>
                     <h4 className="font-semibold mb-2">Key Recommendations:</h4>
                     <ul className="text-sm text-gray-600 list-disc list-inside bg-green-50 p-3 rounded-md">
                        {item.result.recommendations.slice(0, 3).map(rec => <li key={rec.title}>{rec.title}</li>)}
                     </ul>
                </div>
            )}
        </div>
    );
};


const HistoryPage: React.FC = () => {
    const [history, setHistory] = useState<HistoricalPrediction[]>([]);

    useEffect(() => {
        setHistory(getHistory());
    }, []);
    
    const handleClearHistory = () => {
        if (window.confirm("Are you sure you want to clear your entire prediction history? This action cannot be undone.")) {
            clearHistory();
            setHistory([]);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex justify-between items-center mb-4 border-b pb-3">
                <h2 className="text-xl font-bold text-gray-800">Prediction History</h2>
                {history.length > 0 && (
                     <button 
                        onClick={handleClearHistory}
                        className="px-4 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition"
                     >
                         Clear History
                     </button>
                )}
            </div>
            {history.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No predictions yet</h3>
                    <p className="mt-1 text-sm text-gray-500">Get started by making a new prediction.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {history.map(item => <HistoryItem key={item.id} item={item} />)}
                </div>
            )}
        </div>
    );
};

export default HistoryPage;
