import React from 'react';
import { PredictionResult, PredictionFormData, Recommendation } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ImpactIcon: React.FC<{ impact: 'High' | 'Medium' | 'Low' }> = ({ impact }) => {
    const baseClass = "w-5 h-5 mr-2 rounded-full flex-shrink-0";
    if (impact === 'High') return <div className={`${baseClass} bg-red-500`}></div>;
    if (impact === 'Medium') return <div className={`${baseClass} bg-yellow-500`}></div>;
    return <div className={`${baseClass} bg-green-500`}></div>;
};

const ResultsDisplay: React.FC<{ result: PredictionResult, formData: PredictionFormData, onReset: () => void }> = ({ result, formData, onReset }) => {
    
    const chartData = result.recommendations.map(rec => ({
      name: rec.title,
      'Potential Yield Increase (%)': rec.potentialYieldIncrease
    }));

    const totalPossibleYield = result.predictedYield * (1 + result.recommendations.reduce((acc, r) => acc + (r.potentialYieldIncrease / 100), 0));
    
    return (
        <div className="space-y-6 bg-white p-6 rounded-xl shadow-lg animate-fade-in">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-2xl font-bold text-green-800">Prediction Results</h2>
                    <p className="text-sm text-gray-500">For {formData.cropType} in {formData.location}</p>
                </div>
                <button onClick={onReset} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition">
                    New Prediction
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50 p-6 rounded-lg text-center">
                    <p className="text-lg font-medium text-green-700">Predicted Yield</p>
                    <p className="text-5xl font-bold text-green-900 my-2">{result.predictedYield.toFixed(2)}</p>
                    <p className="text-md text-green-800">{result.yieldUnit}</p>
                    <div className="mt-4 text-xs text-gray-500">Confidence: {(result.confidenceScore * 100).toFixed(0)}%</div>
                </div>
                <div className="bg-blue-50 p-6 rounded-lg text-center">
                    <p className="text-lg font-medium text-blue-700">Potential Yield with Recommendations</p>
                    <p className="text-5xl font-bold text-blue-900 my-2">{totalPossibleYield.toFixed(2)}</p>
                    <p className="text-md text-blue-800">{result.yieldUnit}</p>
                    <div className="mt-4 text-xs text-gray-500">Based on applying all recommendations</div>
                </div>
            </div>

            <p className="text-gray-700 bg-gray-100 p-4 rounded-md">{result.summary}</p>
            
            {result.weatherImpactAnalysis && (
                 <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                        <svg className="w-6 h-6 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>
                        Weather Impact Analysis
                    </h3>
                    <p className="text-gray-700 bg-blue-50 p-4 rounded-md border border-blue-200">{result.weatherImpactAnalysis}</p>
                </div>
            )}

            <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Actionable Recommendations</h3>
                <div className="space-y-3">
                    {result.recommendations.map((rec, index) => (
                        <div key={index} className="p-4 border border-gray-200 rounded-lg bg-white">
                           <div className="flex items-center mb-1">
                                <ImpactIcon impact={rec.impact} />
                                <h4 className="font-bold text-md text-gray-900">{rec.title}</h4>
                                <span className="ml-auto text-sm font-semibold text-green-600">+{rec.potentialYieldIncrease}% Yield</span>
                           </div>
                           <p className="text-sm text-gray-600 pl-7">{rec.description}</p>
                        </div>
                    ))}
                </div>
            </div>
            
             {result.riskFactors.length > 0 && (
                <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">Potential Risk Factors</h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-700 bg-red-50 p-4 rounded-md">
                        {result.riskFactors.map((risk, index) => <li key={index}>{risk}</li>)}
                    </ul>
                </div>
            )}
            
            <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Yield Increase Potential</h3>
                <div className="w-full h-64 bg-gray-50 p-4 rounded-lg">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="Potential Yield Increase (%)" fill="#16a34a" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

        </div>
    );
};

export default ResultsDisplay;