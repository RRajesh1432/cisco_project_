import React, { useState, useCallback } from 'react';
import { CROP_TYPES } from '../constants';
import { getCropInfo } from '../services/geminiService';
import { CropInfo } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';

const CropExplorerPage: React.FC = () => {
    const [selectedCrop, setSelectedCrop] = useState<string | null>(null);
    const [cropInfo, setCropInfo] = useState<CropInfo | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleCropSelect = useCallback(async (crop: string) => {
        setSelectedCrop(crop);
        setIsLoading(true);
        setError(null);
        setCropInfo(null);
        try {
            const result = await getCropInfo(crop);
            setCropInfo(result);
        } catch (err) {
            setError(`Failed to load information for ${crop}. Please try again later.`);
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, []);
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-3">Select a Crop</h2>
                    <div className="space-y-2">
                        {CROP_TYPES.map(crop => (
                            <button
                                key={crop}
                                onClick={() => handleCropSelect(crop)}
                                disabled={isLoading && selectedCrop === crop}
                                className={`w-full text-left px-4 py-2 rounded-md transition duration-150 ease-in-out ${selectedCrop === crop ? 'bg-green-600 text-white font-semibold' : 'bg-gray-100 hover:bg-gray-200'} disabled:opacity-50 disabled:cursor-wait`}
                            >
                                {crop}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            <div className="md:col-span-2">
                 <div className="bg-white p-6 rounded-xl shadow-lg min-h-[400px] flex flex-col justify-center">
                    {isLoading && (
                        <div className="text-center">
                            <LoadingSpinner />
                            <p className="mt-4 text-lg font-medium text-green-700">Fetching details for {selectedCrop}...</p>
                        </div>
                    )}
                    {error && <div className="text-center text-red-600 bg-red-50 p-4 rounded-md">{error}</div>}
                    {!isLoading && !error && !cropInfo && (
                        <div className="text-center text-gray-500">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">Select a crop</h3>
                            <p className="mt-1 text-sm text-gray-500">Choose a crop from the list to see its profile.</p>
                        </div>
                    )}
                    {cropInfo && (
                        <div className="animate-fade-in space-y-4">
                            <h2 className="text-3xl font-bold text-green-800">{cropInfo.cropName}</h2>
                            <p className="text-gray-700">{cropInfo.description}</p>
                            
                            <div className="p-4 bg-green-50 rounded-lg">
                                <h3 className="font-semibold text-lg text-green-900 mb-2">Ideal Growing Conditions</h3>
                                <ul className="space-y-1 text-gray-800 text-sm">
                                    <li><strong>Soil Types:</strong> {cropInfo.idealConditions.soilType.join(', ')}</li>
                                    <li><strong>Temperature:</strong> {cropInfo.idealConditions.temperatureRange}</li>
                                    <li><strong>Rainfall:</strong> {cropInfo.idealConditions.annualRainfall}</li>
                                    <li><strong>Growing Cycle:</strong> {cropInfo.growingCycle}</li>
                                </ul>
                            </div>
                             <div className="p-4 bg-red-50 rounded-lg">
                                <h3 className="font-semibold text-lg text-red-900 mb-2">Common Pests & Diseases</h3>
                                <ul className="list-disc list-inside space-y-1 text-gray-800 text-sm">
                                    {cropInfo.commonPests.map(pest => <li key={pest}>{pest}</li>)}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CropExplorerPage;
