import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin, Locate } from "lucide-react";

// Fix default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

interface MapPickerProps {
  position: [number, number] | null;
  onPositionChange: (pos: [number, number]) => void;
}

function ClickHandler({ onPositionChange }: { onPositionChange: (pos: [number, number]) => void }) {
  useMapEvents({
    click(e) {
      onPositionChange([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

const MapPicker = ({ position, onPositionChange }: MapPickerProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const [loading, setLoading] = useState(true);

  const centerOnMe = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        onPositionChange(loc);
        mapRef.current?.setView(loc, 15);
      },
      () => {},
      { enableHighAccuracy: true }
    );
  };

  const defaultCenter: [number, number] = [-6.2088, 106.8456]; // Jakarta

  return (
    <div className="relative w-full h-64 rounded-xl overflow-hidden border-2 border-input">
      {loading && (
        <div className="absolute inset-0 z-20 bg-muted animate-pulse flex items-center justify-center">
          <MapPin className="w-6 h-6 text-muted-foreground" />
        </div>
      )}
      <MapContainer
        center={position || defaultCenter}
        zoom={12}
        className="w-full h-full z-10"
        ref={mapRef}
        whenReady={() => setLoading(false)}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        <ClickHandler onPositionChange={onPositionChange} />
        {position && <Marker position={position} />}
      </MapContainer>
      <button
        type="button"
        onClick={centerOnMe}
        className="absolute bottom-3 right-3 z-20 bg-card border border-input rounded-lg p-2.5 shadow-md hover:bg-secondary transition-colors"
        title="Center on my location"
      >
        <Locate className="w-4 h-4 text-foreground" />
      </button>
    </div>
  );
};

export default MapPicker;
