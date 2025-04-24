import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  Marker,
  useJsApiLoader,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { getShipmentByOrderId } from "../services/api";

const containerStyle = {
  width: "80%",
  height: "450px",
  borderRadius: "10px",
  overflow: "hidden",
};

const mapWrapperStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  minHeight: "600px", // Per evitare sovrapposizioni
};
const HEADQUARTERS_ADDRESS = "Via Festa del Perdono 7, 20122 Milano, Italia";
function ShipmentMap({ orderId }) {
  const [shipment, setShipment] = useState(null);
  const [directions, setDirections] = useState(null);
  const [hqCoords, setHqCoords] = useState(null);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  // Recupera la spedizione in base all'orderId
  useEffect(() => {
    const fetchShipment = async () => {
      try {
        if (orderId) {
          const data = await getShipmentByOrderId(orderId);
          if (data?.shipment) {
            setShipment(data.shipment);
          }
        }
      } catch (error) {
        console.error("Errore nel recupero della spedizione:", error);
      }
    };
    fetchShipment();
  }, [orderId]);

  // Una volta caricata la mappa e la spedizione, geocodifica la sede centrale e calcola il percorso
  useEffect(() => {
    if (isLoaded && shipment) {
      // Estrai le coordinate della destinazione (ricorda che sono salvate come [lng, lat])
      const coordinates = shipment?.currentLocation?.coordinates || [0, 0];
      const destination = { lat: coordinates[1], lng: coordinates[0] };

      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: HEADQUARTERS_ADDRESS }, (results, status) => {
        if (status === "OK" && results[0]) {
          const hq = results[0].geometry.location;
          setHqCoords(hq);
          // Calcola il percorso con il DirectionsService
          const directionsService = new window.google.maps.DirectionsService();
          directionsService.route(
            {
              origin: hq,
              destination: destination,
              travelMode: window.google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
              if (status === "OK") {
                setDirections(result);
              } else {
                console.error("Errore nel calcolo delle direzioni:", status);
              }
            }
          );
        } else {
          console.error("Geocode per la sede centrale fallito:", status);
        }
      });
    }
  }, [isLoaded, shipment]);

  if (!isLoaded) return <div style={mapWrapperStyle}>Caricamento mappa...</div>;
  if (!shipment)
    return <div style={mapWrapperStyle}>Nessuna spedizione trovata...</div>;

  const coordinates = shipment?.currentLocation?.coordinates || [0, 0];
  const destination = { lat: coordinates[1], lng: coordinates[0] };
  
  // Centro la mappa a metà strada tra sede e destinazione, se disponibili
  const center = hqCoords
    ? {
        lat: (hqCoords.lat() + destination.lat) / 2,
        lng: (hqCoords.lng() + destination.lng) / 2,
      }
    : destination;

  return (
    <div style={mapWrapperStyle}>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={10}>
        {hqCoords && <Marker position={hqCoords} label="Sede Centrale" />}
        <Marker position={destination} label="Destinazione" />
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>
    </div>
  );
}

export default ShipmentMap;
