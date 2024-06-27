// src/Map.js
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Map.css';
import busIconUrl from './icons/bus.png'; // Asegúrate de que esta ruta es correcta

const center = { lat: 0, lng: 0 };

const RecenterMap = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], map.getZoom());
  }, [lat, lng, map]);
  return null;
};

const busIcon = new L.Icon({
  iconUrl: busIconUrl,
  iconSize: [32, 32], // Tamaño del icono
  iconAnchor: [16, 32], // Punto donde se ancla el icono (mitad del fondo)
  className: 'marker-icon' // Agregar clase CSS al icono
});

const Map = () => {
  const [location, setLocation] = useState(center);

  const fetchLocation = async () => {
    try {
      const response = await fetch('https://fffb-38-25-34-82.ngrok-free.app/api/gps', {
        headers: {
          'ngrok-skip-browser-warning': 'true'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new TypeError("No se recibió JSON");
      }

      const data = await response.json();
      if (data.latitud && data.longitud) {
        setLocation({ lat: data.latitud, lng: data.longitud });
      }
    } catch (error) {
      console.error('Error fetching location:', error);
    }
  };

  useEffect(() => {
    fetchLocation();
    const interval = setInterval(fetchLocation, 5000); // Actualizar cada 5 segundos
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app-container">
      <h1 className="map-title">Localización del Bus</h1>
      <MapContainer center={location} zoom={15} className="map-container">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={location} icon={busIcon}></Marker>
        <RecenterMap lat={location.lat} lng={location.lng} />
      </MapContainer>
      <button className="refresh-button" onClick={fetchLocation}>Actualizar</button>
    </div>
  );
};

export default Map;
