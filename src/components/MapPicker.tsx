import { useEffect, useRef, useState } from "react";
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

const DEFAULT_CENTER: [number, number] = [-6.2088, 106.8456];

const MapPicker = ({ position, onPositionChange }: MapPickerProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: position ?? DEFAULT_CENTER,
      zoom: 12,
      zoomControl: true,
      attributionControl: true,
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    map.on("load", () => setLoading(false));

    map.on("click", (event: L.LeafletMouseEvent) => {
      const nextPosition: [number, number] = [event.latlng.lat, event.latlng.lng];
      onPositionChange(nextPosition);
    });

    mapRef.current = map;
    setLoading(false);

    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, [onPositionChange, position]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const nextCenter = position ?? DEFAULT_CENTER;
    map.setView(nextCenter, position ? map.getZoom() : 12);

    if (position) {
      if (!markerRef.current) {
        markerRef.current = L.marker(position, { icon: defaultIcon }).addTo(map);
      } else {
        markerRef.current.setLatLng(position);
      }
    } else if (markerRef.current) {
      map.removeLayer(markerRef.current);
      markerRef.current = null;
    }
  }, [position]);

  const centerOnMe = () => {
    if (!navigator.geolocation || !mapRef.current) return;

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const nextPosition: [number, number] = [coords.latitude, coords.longitude];
        onPositionChange(nextPosition);
        mapRef.current?.setView(nextPosition, 15);
      },
      () => undefined,
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="relative w-full h-64 rounded-xl overflow-hidden border-2 border-input bg-muted">
      {loading && (
        <div className="absolute inset-0 z-[400] bg-muted animate-pulse flex items-center justify-center">
          <MapPin className="w-6 h-6 text-muted-foreground" />
        </div>
      )}
      <div ref={containerRef} className="w-full h-full" aria-label="Interactive map picker" />
      <button
        type="button"
        onClick={centerOnMe}
        className="absolute bottom-3 right-3 z-[500] bg-card border border-input rounded-lg p-2.5 shadow-md hover:bg-secondary transition-colors"
        title="Center on my location"
        aria-label="Center on my location"
      >
        <Locate className="w-4 h-4 text-foreground" />
      </button>
    </div>
  );
};

export default MapPicker;
