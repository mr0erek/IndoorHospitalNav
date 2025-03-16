// src/components/IndoorMap.js
import React, { useEffect, useState } from 'react';
import { MapContainer, ImageOverlay, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { fetchBlueprints } from '../services/api';
import mapImage from './MAP.jpg';

const IndoorMap = () => {
  const [blueprints, setBlueprints] = useState([]);
  const [selectedBlueprint, setSelectedBlueprint] = useState(null);
  const [selectedFloor, setSelectedFloor] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRooms, setFilteredRooms] = useState([]);
  // States for route navigation
  const [startRoom, setStartRoom] = useState('');
  const [endRoom, setEndRoom] = useState('');
  const [routeCoordinates, setRouteCoordinates] = useState([]);

  // Fetch all blueprints from backend on mount
  useEffect(() => {
    const loadBlueprints = async () => {
      const data = await fetchBlueprints();
      console.log('Fetched blueprint data:', data);
      if (data && data.length > 0) {
        setBlueprints(data);
        setSelectedBlueprint(data[0]);
        setSelectedFloor(data[0].floor_number);
      }
    };
    loadBlueprints();
  }, []);

  // Update selected blueprint when floor changes
  useEffect(() => {
    if (blueprints.length > 0 && selectedFloor !== '') {
      const bp = blueprints.find(bp => bp.floor_number === parseInt(selectedFloor));
      if (bp) {
        setSelectedBlueprint(bp);
        // Initialize filtered rooms from the new blueprint data
        setFilteredRooms(Object.entries(bp.room_details));
      }
    }
  }, [selectedFloor, blueprints]);

  // Filter rooms based on search term
  useEffect(() => {
    if (selectedBlueprint && selectedBlueprint.room_details) {
      const filtered = Object.entries(selectedBlueprint.room_details).filter(([roomId]) =>
        roomId.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredRooms(filtered);
    }
  }, [searchTerm, selectedBlueprint]);

  // Define bounds based on your image dimensions (adjust as needed)
  const bounds = [
    [0, 0],
    [617, 610],
  ];

  // Function for voice guidance using the Web Speech API
  const speakInstruction = (message) => {
    if ('speechSynthesis' in window) {
      const synth = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(message);
      synth.speak(utterance);
    } else {
      console.warn("Speech Synthesis not supported on this browser.");
    }
  };

  // Simulate route finding by drawing a line from start room to end room
  const findRoute = () => {
    if (selectedBlueprint && selectedBlueprint.room_details && startRoom && endRoom) {
      const startCoords = selectedBlueprint.room_details[startRoom];
      const endCoords = selectedBlueprint.room_details[endRoom];
      if (startCoords && endCoords) {
        // For now, create a simple polyline from start to end
        setRouteCoordinates([[startCoords.lat, startCoords.lng], [endCoords.lat, endCoords.lng]]);
        // Optionally, you can trigger voice guidance here
        speakInstruction(`Route from ${startRoom} to ${endRoom} is highlighted`);
      }
    }
  };

  return (
    <div>
      {/* Floor selection */}
      <div style={{ margin: '20px 0', textAlign: 'center' }}>
        <label>
          Select Floor:
          <select
            value={selectedFloor}
            onChange={(e) => setSelectedFloor(e.target.value)}
            style={{ marginLeft: '10px', padding: '5px' }}
          >
            {blueprints.map(bp => (
              <option key={bp.floor_number} value={bp.floor_number}>
                Floor {bp.floor_number}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Room search */}
      <div style={{ margin: '20px 0', textAlign: 'center' }}>
        <input
          type="text"
          placeholder="Search for a room..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '10px', width: '300px', fontSize: '16px' }}
        />
      </div>

      {/* Route selection controls */}
      <div style={{ margin: '20px 0', textAlign: 'center' }}>
        <label>
          Start Room:
          <select
            value={startRoom}
            onChange={(e) => setStartRoom(e.target.value)}
            style={{ marginLeft: '10px', padding: '5px' }}
          >
            <option value="">Select a room</option>
            {filteredRooms.map(([roomId]) => (
              <option key={roomId} value={roomId}>{roomId}</option>
            ))}
          </select>
        </label>
        <label style={{ marginLeft: '20px' }}>
          End Room:
          <select
            value={endRoom}
            onChange={(e) => setEndRoom(e.target.value)}
            style={{ marginLeft: '10px', padding: '5px' }}
          >
            <option value="">Select a room</option>
            {filteredRooms.map(([roomId]) => (
              <option key={roomId} value={roomId}>{roomId}</option>
            ))}
          </select>
        </label>
        <button onClick={findRoute} style={{ marginLeft: '20px', padding: '10px 20px' }}>
          Find Route
        </button>
      </div>

      {/* Map Container */}
      <MapContainer bounds={bounds} style={{ height: '600px', width: '100%' }}>
        <ImageOverlay url={mapImage} bounds={bounds} />
        {filteredRooms.map(([roomId, coords]) => (
          <Marker
            key={roomId}
            position={[coords.lat, coords.lng]}
            eventHandlers={{
              click: () => speakInstruction(`You are near ${roomId}`),
            }}
          >
            <Popup>{roomId}</Popup>
          </Marker>
        ))}
        {routeCoordinates.length > 0 && (
          <Polyline positions={routeCoordinates} color="blue" />
        )}
      </MapContainer>
    </div>
  );
};

export default IndoorMap;
