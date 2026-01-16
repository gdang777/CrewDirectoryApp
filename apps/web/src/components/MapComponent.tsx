import React from 'react';
import Map, { Marker, Popup, NavigationControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { POI } from '@crewdirectoryapp/shared';

interface MapComponentProps {
  pois: POI[];
}

const MAPBOX_TOKEN =
  import.meta.env.VITE_MAPBOX_TOKEN || 'pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJjbH...'; // Default placeholder

const MapComponent: React.FC<MapComponentProps> = ({ pois }) => {
  const [popupInfo, setPopupInfo] = React.useState<POI | null>(null);

  const initialViewState = {
    latitude: pois.length > 0 ? pois[0].coordinates.coordinates[1] : 40.7128,
    longitude: pois.length > 0 ? pois[0].coordinates.coordinates[0] : -74.006,
    zoom: 11,
  };

  return (
    <div
      style={{
        height: '400px',
        width: '100%',
        marginBottom: '20px',
        borderRadius: '8px',
        overflow: 'hidden',
      }}
    >
      <Map
        initialViewState={initialViewState}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
      >
        <NavigationControl position="top-right" />

        {pois.map((poi) => (
          <Marker
            key={poi.id}
            longitude={poi.coordinates.coordinates[0]}
            latitude={poi.coordinates.coordinates[1]}
            anchor="bottom"
            onClick={(e: mapboxgl.MapLayerMouseEvent) => {
              e.originalEvent.stopPropagation();
              setPopupInfo(poi);
            }}
          >
            <div style={{ fontSize: '24px', cursor: 'pointer' }}>📍</div>
          </Marker>
        ))}

        {popupInfo && (
          <Popup
            anchor="top"
            longitude={popupInfo.coordinates.coordinates[0]}
            latitude={popupInfo.coordinates.coordinates[1]}
            onClose={() => setPopupInfo(null)}
          >
            <div>
              <strong>{popupInfo.name}</strong>
              <p>{popupInfo.category}</p>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
};

export default MapComponent;
