import { useState } from "react";
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Locate, MapPin } from "lucide-react";

const defaultIcon = L.icon({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface MapPickerProps {
  position: [number, number] | null;
  onPositionChange: (pos: [number, number]) => void;
}

function ClickHandler({ onPositionChange }: { onPositionChange: (pos: [number, number]) => void }) {
  useMapEvents({
    click(event) {
      onPositionChange([event.latlng.lat, event.latlng.lng]);
    },
  });

  return null;
}

function MapReadyHandler({ onReady }: { onReady: () => void }) {
  const map = useMap();

  map.whenReady(() => {
    onReady();
  });

  return null;
}

function RecenterButton({ onPositionChange }: { onPositionChange: (pos: [number, number]) => void }) {
  const map = useMap();

  const centerOnMe = () => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const nextPosition: [number, number] = [coords.latitude, coords.longitude];
        onPositionChange(nextPosition);
        map.setView(nextPosition, 15);
      },
      () => undefined,
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <button
      type="button"
      onClick={centerOnMe}
      className="absolute bottom-3 right-3 z-[500] bg-card border border-input rounded-lg p-2.5 shadow-md hover:bg-secondary transition-colors"
      title="Center on my location"
      aria-label="Center on my location"
    >
      <Locate className="w-4 h-4 text-foreground" />
    </button>
  );
}

const MapPicker = ({ position, onPositionChange }: MapPickerProps) => {
  const [loading, setLoading] = useState(true);
  const defaultCenter: [number, number] = [-6.2088, 106.8456];

  return (
    <div className="relative w-full h-64 rounded-xl overflow-hidden border-2 border-input bg-muted">
      {loading && (
        <div className="absolute inset-0 z-[400] bg-muted animate-pulse flex items-center justify-center">
          <MapPin className="w-6 h-6 text-muted-foreground" />
        </div>
      )}

      <MapContainer center={position ?? defaultCenter} zoom={12} className="w-full h-full z-10">
        <MapReadyHandler onReady={() => setLoading(false)} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        <ClickHandler onPositionChange={onPositionChange} />
        <RecenterButton onPositionChange={onPositionChange} />
        {position && <Marker position={position} icon={defaultIcon} />}
      </MapContainer>
    </div>
  );
};

export default MapPicker;
