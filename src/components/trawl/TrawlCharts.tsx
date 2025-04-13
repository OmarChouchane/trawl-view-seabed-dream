// components/TrawlMap.tsx
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom boat icon
const boatIcon = new L.Icon({
  iconUrl: '/boat.png', // Free boat icon
  iconSize: [32, 32], // Size of the icon
  iconAnchor: [16, 16], // Point of the icon which will correspond to marker's location
  popupAnchor: [0, -16], // Point from which the popup should open relative to the iconAnchor
});

// Fix default marker icon path
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png'
});

// Legend component
const DepthLegend = () => {
  const legendStyles = {
    backgroundColor: 'white',
    padding: '10px',
    borderRadius: '5px',
    boxShadow: '0 0 10px rgba(0,0,0,0.2)',
    lineHeight: '1.5',
    fontSize: '14px',
    color: '#333',
    
  };

  const legendTitleStyles = {
    margin: '0 0 5px 0',
    fontWeight: 'bold'
  };

  const legendItemStyles = {
    display: 'flex',
    alignItems: 'center',
    margin: '5px 0'
  };

  const colorBoxStyles = (color: string) => ({
    width: '20px',
    height: '20px',
    backgroundColor: color,
    marginRight: '8px',
    border: '1px solid #333'
  });

  return (
    <div style={legendStyles}>
      <h4 style={legendTitleStyles}>Depth Legend (meters)</h4>
      <div style={legendItemStyles}>
        <div style={colorBoxStyles('#ef4444')}></div>
        <span>Danger ({'<'} 2m)</span>
      </div>
      <div style={legendItemStyles}>
        <div style={colorBoxStyles('#f59e0b')}></div>
        <span>Warning (2m - 3m)</span>
      </div>
      <div style={legendItemStyles}>
        <div style={colorBoxStyles('#10b981')}></div>
        <span>Safe ({'>'} 3m)</span>
      </div>
    </div>
  );
};

// Boat path from Sousse to Monastir (interpolated)
const generatePath = (steps: number) => {
  const start = { lat: 35.9, lng: 10.601 }; // Sousse
  const end = { lat: 35.73, lng: 10.69 };   // Monastir

  return Array.from({ length: steps }, (_, i) => ({
    lat: start.lat + (end.lat - start.lat) * (i / (steps - 1)),
    lng: start.lng + (end.lng - start.lng) * (i / (steps - 1))
  }));
};

const boatPath = generatePath(50000); // more steps = smoother

// Simulated depth data (pick points from the path)
const depthPoints = [
  { ...boatPath[100], depth: 1.9 },
  { ...boatPath[400], depth: 2.7 },
  { ...boatPath[700], depth: 1.2 },
  { ...boatPath[1000], depth: 4.0 },
];

export default function TrawlMap() {
  const [boatIndex, setBoatIndex] = useState(0);
  const boatPos = boatPath[boatIndex];

  // Animate boat slowly
  useEffect(() => {
    const interval = setInterval(() => {
      setBoatIndex((i) => (i < boatPath.length - 1 ? i + 1 : i));
    }, 100); // 300ms per move = slow

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-[600px] rounded-md overflow-hidden border border-slate-600 relative">
      <MapContainer center={[35.9,10.601]} zoom={15} className="h-full w-full">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />

        {/* Depth Points as colored circles */}
        {depthPoints.map((point, i) => (
            <Circle
            key={i}
            center={[point.lat, point.lng]}
            radius={50}
            pathOptions={{
              color: point.depth < 2 ? '#ef4444' : point.depth <= 3 ? '#f59e0b' : '#10b981',
              fillColor: point.depth < 2 ? '#ef4444' : point.depth <= 3 ? '#f59e0b' : '#10b981',
              fillOpacity: 0.6,
            }}
            >
            <Popup>
              <strong>Depth:</strong> {point.depth}m<br />
              <strong>Lat:</strong> {point.lat.toFixed(4)}<br />
              <strong>Lng:</strong> {point.lng.toFixed(4)}
            </Popup>
            </Circle>
        ))}

        {/* Boat marker with custom icon */}
        {boatPos && (
          <Marker position={[boatPos.lat, boatPos.lng]} icon={boatIcon}>
            <Popup>
              <strong>Boat Position</strong><br />
              Lat: {boatPos.lat.toFixed(4)}<br />
              Lng: {boatPos.lng.toFixed(4)}
            </Popup>
          </Marker>
        )}

        {/* Legend - positioned in bottom right */}
        <div className="absolute bottom-4 right-4 z-[1000]">
          <DepthLegend />
        </div>
      </MapContainer>
    </div>
  );
}