// hospital-nav-frontend/src/component/BlueprintAnnotator.js
import React, { useState } from 'react';
import { MapContainer, ImageOverlay, Marker, Popup, useMapEvent } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import mapImage from './MAP.jpg';
import markerIconPng from './marker.png'; // Make sure the path is correct

// Create a custom marker icon
const customMarkerIcon = L.icon({
  iconUrl: markerIconPng,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
  shadowSize: [41, 41]
});

function ClickableMap({ onMapClick }) {
  useMapEvent('click', (e) => {
    onMapClick(e.latlng);
  });
  return null;
}

const convertMarkersToRoomDetails = (markersArray) => {
  return markersArray.reduce((acc, marker) => {
    acc[marker.roomName] = { lat: marker.lat, lng: marker.lng };
    return acc;
  }, {});
};

const BlueprintAnnotator = () => {
  const bounds = [
    [0, 0],
    [617, 610],
  ];
  const [markers, setMarkers] = useState([]);

  const handleMapClick = (latlng) => {
    const roomName = prompt("Enter room name:", `Room${markers.length + 1}`);
    if (roomName) {
      setMarkers([...markers, { roomName, lat: latlng.lat, lng: latlng.lng }]);
    }
  };

  const saveBlueprintData = async () => {
    const roomDetails = convertMarkersToRoomDetails(markers);
    const connectivityGraph = {}; // Optionally build your connectivity graph

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL || "http://localhost:8000/api"}/blueprints/1/annotate/`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ room_details: roomDetails, connectivity_graph: connectivityGraph }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to save blueprint data");
      }
      
      const data = await response.json();
      alert("Blueprint data saved successfully!");
      console.log("Saved data:", data);
    } catch (error) {
      console.error("Error saving blueprint data:", error);
      alert("Error saving data", error);
    }
  };

  return (
    <div>
      <h3>Blueprint Annotator</h3>
      <p>Click on the image to add room coordinates.</p>
      <MapContainer bounds={bounds} style={{ height: '600px', width: '100%' }}>
        <ImageOverlay url={mapImage} bounds={bounds} />
        <ClickableMap onMapClick={handleMapClick} />
        {markers.map((marker, index) => (
          <Marker key={index} position={[marker.lat, marker.lng]} icon={customMarkerIcon}>
            <Popup>{marker.roomName}</Popup>
          </Marker>
        ))}
      </MapContainer>
      <h4>Extracted Room Data (room_details):</h4>
      <pre>{JSON.stringify(convertMarkersToRoomDetails(markers), null, 2)}</pre>
      <button onClick={saveBlueprintData} style={{ marginTop: '20px', padding: '10px 20px' }}>
        Save Blueprint Data
      </button>
    </div>
  );
};

export default BlueprintAnnotator;
