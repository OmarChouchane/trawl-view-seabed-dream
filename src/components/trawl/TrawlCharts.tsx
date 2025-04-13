// components/TrawlMap.tsx
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix marker icon path
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png'
});



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
  { ...boatPath[100], depth: 3.4 },
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
    <div className="h-[600px] rounded-md overflow-hidden border border-slate-600">
      <MapContainer center={[35.8, 10.7]} zoom={11} className="h-full w-full">
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
              color: point.depth > 3 ? '#ef4444' : point.depth > 2 ? '#f59e0b' : '#10b981',
              fillColor: '#000',
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

        {/* Boat marker */}
        {boatPos && (
          <Marker position={[boatPos.lat, boatPos.lng]}>
            <Popup>
              🚢 <strong>Boat Position</strong><br />
              Lat: {boatPos.lat.toFixed(4)}<br />
              Lng: {boatPos.lng.toFixed(4)}
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
