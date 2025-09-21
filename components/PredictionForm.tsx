import React, { useState, useEffect } from 'react';
import { PredictionFormData } from '../types';
import { CROP_TYPES, SOIL_TYPES, FERTILIZER_TYPES } from '../constants';
import MapInput from './MapInput';

interface PredictionFormProps {
  onSubmit: (data: PredictionFormData) => void;
  isLoading: boolean;
  onLocationSet: (location: { type: 'coords' | 'text', value: string } | null) => void;
}

interface FieldData {
    area: number;
    location: string;
}

const PredictionForm: React.FC<PredictionFormProps> = ({ onSubmit, isLoading, onLocationSet }) => {
  const [formData, setFormData] = useState({
    cropType: CROP_TYPES[0],
    soilType: SOIL_TYPES[0],
    rainfall: 1000,
    temperature: 25,
    pesticideUsage: false,
    fertilizerType: FERTILIZER_TYPES[0],
  });
  
  const [inputMode, setInputMode] = useState<'map' | 'manual'>('map');
  const [fieldData, setFieldData] = useState<FieldData | null>(null);
  const [manualData, setManualData] = useState({ location: '', area: 0 });

  useEffect(() => {
    if (inputMode === 'map') {
        if (fieldData?.location) {
            const coordsMatch = fieldData.location.match(/Lat: ([-.\d]+), Lng: ([-.\d]+)/);
            if (coordsMatch) {
                onLocationSet({ type: 'coords', value: `${coordsMatch[1]},${coordsMatch[2]}` });
            }
        } else {
            onLocationSet(null);
        }
    }
  }, [fieldData, inputMode, onLocationSet]);

  useEffect(() => {
      if (inputMode === 'manual') {
          if (manualData.location.trim()) {
              onLocationSet({ type: 'text', value: manualData.location.trim() });
          } else {
              onLocationSet(null);
          }
      }
  }, [manualData.location, inputMode, onLocationSet]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
        const { checked } = e.target as HTMLInputElement;
        setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
        setFormData(prev => ({ ...prev, [name]: type === 'number' ? Number(value) : value }));
    }
  };
  
  const handleManualChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value, type } = e.target;
      setManualData(prev => ({
          ...prev,
          [name]: type === 'number' ? Number(value) : value
      }));
  };

  const handleFieldDrawn = (data: { area: number; location: string; }) => {
    if (data.area > 0) {
        setFieldData({ area: data.area, location: data.location });
    } else {
        setFieldData(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let submissionData: { location: string; area: number; };

    if (inputMode === 'map') {
        if (!fieldData || fieldData.area <= 0) {
            alert("Please draw the field area on the map before submitting.");
            return;
        }
        submissionData = fieldData;
    } else {
        if (!manualData.location.trim() || manualData.area <= 0) {
            alert("Please enter a valid location and cultivation area.");
            return;
        }
        submissionData = {
            ...manualData,
            area: Number(manualData.area)
        };
    }
    
    const completeFormData: PredictionFormData = {
        ...formData,
        location: submissionData.location,
        area: submissionData.area,
    };
    onSubmit(completeFormData);
  };
  
  const formControlClass = "w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  const isMapDataInvalid = inputMode === 'map' && (!fieldData || fieldData.area <= 0);
  const isManualDataInvalid = inputMode === 'manual' && (!manualData.location.trim() || manualData.area <= 0);
  const isFormInvalid = isMapDataInvalid || isManualDataInvalid;

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-3">Farm Details</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div className="flex justify-center my-4 border border-gray-200 rounded-lg p-1 bg-gray-100 w-full md:w-2/3 mx-auto">
            <button type="button" onClick={() => setInputMode('map')} className={`w-1/2 py-2 text-sm font-medium rounded-md transition-colors ${inputMode === 'map' ? 'bg-white text-green-700 shadow' : 'text-gray-600'}`}>Map Input</button>
            <button type="button" onClick={() => setInputMode('manual')} className={`w-1/2 py-2 text-sm font-medium rounded-md transition-colors ${inputMode === 'manual' ? 'bg-white text-green-700 shadow' : 'text-gray-600'}`}>Manual Input</button>
        </div>

        {inputMode === 'map' ? (
            <>
                <MapInput onFieldDrawn={handleFieldDrawn} />
                {fieldData ? (
                    <div className="grid grid-cols-2 gap-4 p-3 bg-green-50 rounded-md border border-green-200">
                        <div>
                            <p className="text-xs font-medium text-gray-700">Calculated Area</p>
                            <p className="font-semibold text-green-700">{fieldData.area} hectares</p>
                        </div>
                         <div>
                            <p className="text-xs font-medium text-gray-700">Field Location (Center)</p>
                            <p className="font-semibold text-green-700 truncate">{fieldData.location}</p>
                        </div>
                    </div>
                ) : (
                    <div className="p-3 bg-gray-50 rounded-md border text-center text-gray-600">
                        <p>Please draw your field on the map to continue.</p>
                    </div>
                )}
            </>
        ) : (
             <div className="space-y-4 p-3 bg-gray-50 rounded-md border">
                <div>
                    <label htmlFor="location" className={labelClass}>Location (e.g., "Central Valley, California")</label>
                    <input type="text" id="location" name="location" value={manualData.location} onChange={handleManualChange} className={formControlClass} placeholder="Enter location name"/>
                </div>
                <div>
                    <label htmlFor="area" className={labelClass}>Cultivation Area (hectares)</label>
                    <input type="number" id="area" name="area" value={manualData.area || ''} onChange={handleManualChange} className={formControlClass} placeholder="e.g., 15.5" min="0" step="0.1"/>
                </div>
            </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="cropType" className={labelClass}>Crop Type</label>
                <select id="cropType" name="cropType" value={formData.cropType} onChange={handleChange} className={formControlClass}>
                    {CROP_TYPES.map(crop => <option key={crop} value={crop}>{crop}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="soilType" className={labelClass}>Soil Type</label>
                <select id="soilType" name="soilType" value={formData.soilType} onChange={handleChange} className={formControlClass}>
                    {SOIL_TYPES.map(soil => <option key={soil} value={soil}>{soil}</option>)}
                </select>
            </div>
        </div>
        <div>
          <label htmlFor="rainfall" className={labelClass}>Annual Rainfall (mm)</label>
          <input type="range" id="rainfall" name="rainfall" min="100" max="3000" step="50" value={formData.rainfall} onChange={handleChange} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600" />
          <div className="text-right text-sm text-gray-600">{formData.rainfall} mm</div>
        </div>
        <div>
          <label htmlFor="temperature" className={labelClass}>Average Temperature (°C)</label>
          <input type="range" id="temperature" name="temperature" min="-10" max="50" step="1" value={formData.temperature} onChange={handleChange} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600" />
          <div className="text-right text-sm text-gray-600">{formData.temperature}°C</div>
        </div>
        <div>
            <label htmlFor="fertilizerType" className={labelClass}>Fertilizer Type</label>
            <select id="fertilizerType" name="fertilizerType" value={formData.fertilizerType} onChange={handleChange} className={formControlClass}>
                {FERTILIZER_TYPES.map(fert => <option key={fert} value={fert}>{fert}</option>)}
            </select>
        </div>
        <div className="flex items-center">
            <input id="pesticideUsage" name="pesticideUsage" type="checkbox" checked={formData.pesticideUsage} onChange={handleChange} className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded" />
            <label htmlFor="pesticideUsage" className="ml-2 block text-sm text-gray-900">Pesticide Used</label>
        </div>
        <button type="submit" disabled={isLoading || isFormInvalid} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-150 ease-in-out">
          {isLoading ? 'Analyzing...' : 'Get Prediction'}
        </button>
      </form>
    </div>
  );
};

export default PredictionForm;