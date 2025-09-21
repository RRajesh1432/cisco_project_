import React, { useEffect, useState, useMemo, useRef } from 'react';
import { getHistory } from '../services/historyService';
import { HistoricalPrediction } from '../types';
import L from 'leaflet';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

const parseLocation = (location: string): L.LatLng | null => {
    const match = location.match(/Lat: ([-.\d]+), Lng: ([-.\d]+)/);
    if (match && match.length === 3) {
        return L.latLng(parseFloat(match[1]), parseFloat(match[2]));
    }
    return null;
};

const AnalyticsPage: React.FC = () => {
    const [history, setHistory] = useState<HistoricalPrediction[]>([]);
    const mapRef = useRef<L.Map | null>(null);
    const mapContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setHistory(getHistory());
    }, []);
    
    useEffect(() => {
        if (!mapContainerRef.current || history.length === 0) return;

        const map = L.map(mapContainerRef.current).setView([20.5937, 78.9629], 4);
        mapRef.current = map;
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        const markers: L.Marker[] = [];
        history.forEach(item => {
            const latLng = parseLocation(item.formData.location);
            if (latLng) {
                const marker = L.marker(latLng)
                    .addTo(map)
                    .bindPopup(`<b>${item.formData.cropType}</b><br>Yield: ${item.result.predictedYield.toFixed(2)} ${item.result.yieldUnit}`);
                markers.push(marker);
            }
        });
        
        const featureGroup = L.featureGroup(markers);
        if (markers.length > 0) {
            map.fitBounds(featureGroup.getBounds(), { padding: [50, 50] });
        }

        return () => {
            map.remove();
            mapRef.current = null;
        };
    }, [history]);

    const yieldData = useMemo(() => history.map((h, i) => ({
        name: `${h.formData.cropType.substring(0, 10)} (${new Date(h.date).getFullYear()}) #${i+1}`,
        'Predicted Yield (tons/ha)': h.result.predictedYield,
    })).reverse(), [history]);

    const cropDistribution = useMemo(() => {
        const counts = history.reduce((acc, h) => {
            acc[h.formData.cropType] = (acc[h.formData.cropType] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }, [history]);

    if (history.length === 0) {
        return (
            <div className="bg-white p-6 rounded-xl shadow-lg text-center py-12 text-gray-500">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No Analytics Data</h3>
                <p className="mt-1 text-sm text-gray-500">Make some predictions first to see your analytics dashboard.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="bg-white p-6 rounded-xl shadow-lg">
                 <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-3">Field Analytics Dashboard</h2>
                 <p className="text-gray-600">An overview of your past predictions, comparing yields, crops, and locations.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Predicted Fields Location</h3>
                <div ref={mapContainerRef} className="leaflet-container" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Yield Comparison</h3>
                    <div className="w-full h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={yieldData} margin={{ top: 5, right: 20, left: 5, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="Predicted Yield (tons/ha)" fill="#16a34a" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                 <div className="bg-white p-6 rounded-xl shadow-lg">
                     <h3 className="text-xl font-semibold text-gray-800 mb-4">Crop Distribution</h3>
                     <div className="w-full h-80">
                        <ResponsiveContainer width="100%" height="100%">
                           <PieChart>
                                <Pie data={cropDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                                    {cropDistribution.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                </Pie>
                                <Tooltip />
                                <Legend />
                           </PieChart>
                        </ResponsiveContainer>
                     </div>
                 </div>
            </div>
        </div>
    );
};

export default AnalyticsPage;