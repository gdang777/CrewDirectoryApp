import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Place, City } from '../services/api';
import 'leaflet/dist/leaflet.css';

// Fix for Leaflet's default icon not showing in React builds
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

interface MapComponentProps {
  places: Place[];
  city: City;
}

const MapComponent = ({ places, city }: MapComponentProps) => {
  // Determine center: prioritizing city coordinates if available
  const centerLatitude = city.coordinates?.coordinates?.[1] || 51.505;
  const centerLongitude = city.coordinates?.coordinates?.[0] || -0.09;

  // Filter places with valid coordinates
  const placesWithCoords = places.filter(
    (p) =>
      p.latitude !== undefined &&
      p.latitude !== null &&
      p.longitude !== undefined &&
      p.longitude !== null
  );

  return (
    <div
      className="map-container-wrapper"
      style={{
        height: '500px',
        width: '100%',
        borderRadius: '12px',
        overflow: 'hidden',
        zIndex: 0,
      }}
    >
      <MapContainer
        center={[centerLatitude, centerLongitude]}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {placesWithCoords.map((place) => (
          <Marker key={place.id} position={[place.latitude!, place.longitude!]}>
            <Popup>
              <div className="map-popup-content">
                <strong>{place.name}</strong>
                <br />
                <span className="category-badge">{place.category}</span>
                <br />
                {place.description?.substring(0, 50)}...
                <br />
                <a
                  href={`#place-${place.id}`}
                  onClick={(e) => e.preventDefault()}
                >
                  View Details
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
