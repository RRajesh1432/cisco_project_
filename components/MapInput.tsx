import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet-draw';

interface MapInputProps {
    onFieldDrawn: (data: { area: number; location: string; }) => void;
}

const MapInput: React.FC<MapInputProps> = ({ onFieldDrawn }) => {
    const mapRef = useRef<L.Map | null>(null);
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const drawnLayerRef = useRef<L.Polygon | null>(null);

    useEffect(() => {
        if (mapRef.current || !mapContainerRef.current) return;

        const map = L.map(mapContainerRef.current).setView([20.5937, 78.9629], 5);
        mapRef.current = map;

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        const drawnItems = new L.FeatureGroup();
        map.addLayer(drawnItems);

        // FIX: Property 'Draw' does not exist on type 'typeof Control'. Cast to any to access leaflet-draw properties.
        const drawControl = new (L.Control as any).Draw({
            edit: {
                featureGroup: drawnItems,
                remove: true,
            },
            draw: {
                polygon: {
                    allowIntersection: false,
                    showArea: true,
                    shapeOptions: {
                        color: '#16a34a'
                    }
                },
                polyline: false,
                rectangle: false,
                circle: false,
                marker: false,
                circlemarker: false
            }
        });
        map.addControl(drawControl);

        const handleDraw = (event: any, action: 'create' | 'edit' | 'delete') => {
             if (action === 'create') {
                if (drawnLayerRef.current) {
                    drawnItems.removeLayer(drawnLayerRef.current);
                }
                const layer = event.layer;
                drawnLayerRef.current = layer;
                drawnItems.addLayer(layer);
             }

            if (drawnLayerRef.current) {
                // FIX: Property 'GeometryUtil' does not exist on type 'typeof L'. Cast to any to access leaflet-draw properties.
                const areaInSqMeters = (L as any).GeometryUtil.geodesicArea((drawnLayerRef.current.getLatLngs() as L.LatLng[][])[0]);
                const areaInHectares = areaInSqMeters / 10000;
                const center = drawnLayerRef.current.getBounds().getCenter();
                const locationString = `Lat: ${center.lat.toFixed(4)}, Lng: ${center.lng.toFixed(4)}`;

                onFieldDrawn({
                    area: parseFloat(areaInHectares.toFixed(2)),
                    location: locationString,
                });
            }
        }

        // FIX: Property 'Draw' does not exist on type 'typeof L'. Replaced L.Draw.Event with string literals for events.
        map.on('draw:created', (e) => handleDraw(e, 'create'));
        map.on('draw:edited', (e) => handleDraw(e, 'edit'));
        
        map.on('draw:deleted', () => {
             drawnLayerRef.current = null;
             onFieldDrawn({ area: 0, location: '' });
        });

        return () => {
            map.remove();
            mapRef.current = null;
        };
    }, [onFieldDrawn]);

    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          1. Draw Field on Map
        </label>
        <div ref={mapContainerRef} className="leaflet-container" />
        <p className="text-xs text-gray-500 mt-1">Use the polygon tool on the left to draw your cultivation area. You can edit or delete the shape after drawing.</p>
      </div>
    );
};

export default MapInput;