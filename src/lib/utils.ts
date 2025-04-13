import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const generateTunisianCoastalPath = (count: number) => {
  // Base coordinates for Tunisian coast (approximate)
  const basePoints = [
    { lat: 37.2763, lng: 9.8735 },  // Bizerte (North)
    { lat: 36.8189, lng: 10.1658 },  // Tunis
    { lat: 36.4583, lng: 10.7375 },  // Hammamet
    { lat: 35.7833, lng: 10.8 },     // Sousse
    { lat: 35.5, lng: 11.0667 },     // Monastir
    { lat: 35.0381, lng: 10.9889 },  // Mahdia
    { lat: 34.4167, lng: 10.5333 }   // Gabes (South)
  ];

  const coordinates = [];
  for (let i = 0; i < count; i++) {
    // Interpolate between base points
    const segment = i % (basePoints.length - 1);
    const progress = (i % 10) / 10;
    
    const lat = basePoints[segment].lat + 
      (basePoints[segment + 1].lat - basePoints[segment].lat) * progress;
    const lng = basePoints[segment].lng + 
      (basePoints[segment + 1].lng - basePoints[segment].lng) * progress;
    
    // Add some random coastal variation
    coordinates.push({
      lat: lat + (Math.random() * 0.05 - 0.025),
      lng: lng + (Math.random() * 0.05 - 0.025),
    });
  }
  
  return coordinates;
};
