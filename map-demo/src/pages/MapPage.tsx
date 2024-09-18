import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  MapMouseEvent,
} from "@vis.gl/react-google-maps";

export default function MapPage() {
  const navigate = useNavigate();
  const [markerA, setMarkerA] = useState<google.maps.LatLngLiteral | null>(
    null
  );
  const [markerB, setMarkerB] = useState<google.maps.LatLngLiteral | null>(
    null
  );
  const [distance, setDistance] = useState<number>(0);
  const [note, setNote] = useState<string>("");
  const [destination, setDestination] = useState<string>("");
  const [origin, setOrigin] = useState<string>("");

  useEffect(() => {
    if (markerA && markerB) {
      const calculateDistance = async () => {
        try {
          const response = await axios.get(
            "http://localhost:3000/distance", // Replace with your server's address if different
            {
              params: {
                origins: `${markerA.lat},${markerA.lng}`,
                destinations: `${markerB.lat},${markerB.lng}`,
              },
            }
          );

          const distanceValue = response.data.distance;
          const destinationValue = response.data.destination;
          const originValue = response.data.origin;
          console.log(response.data);
          setDistance(distanceValue); // Distance is in meters
          setDestination(destinationValue);
          setOrigin(originValue);
          console.log("Distance Value:", distanceValue);
        } catch (error) {
          alert("Invalid location specified. Please select proper locations");
          handleReset();
        }
      };

      calculateDistance();
    }
  }, [markerA, markerB]); // Trigger effect when markerA or markerB changes

  const handleClick = (event: MapMouseEvent) => {
    const latLng = event.detail.latLng;
    console.log("Clicked LatLng:", latLng);

    if (latLng) {
      if (!markerA) {
        setMarkerA(latLng);
        console.log("Setting Marker A:", latLng);
      } else if (!markerB) {
        setMarkerB(latLng);
        console.log("Setting Marker B:", latLng);
      }
    }
  };

  const handleSubmit = async () => {
    if (markerA && markerB && distance !== 0 && note) {
      const data = {
        ownerName: sessionStorage.getItem("user"),
        lat1: markerA.lat.toString(),
        lon1: markerA.lng.toString(),
        lat2: markerB.lat.toString(),
        lon2: markerB.lng.toString(),
        distance: distance.toString(),
        destination,
        origin,
        note,
      };
      console.log("Data to be saved:", data);
      try {
        const response = await axios.post("http://localhost:3000/saveDetails", {
          data,
        });
        console.log(response.data);
        navigate("/myDistances");
      } catch (error) {
        console.log(error);
      }
    } else {
      alert(
        "Please place both markers and add a note. Also make sure distance is not 0"
      );
    }
  };

  const handleReset = () => {
    setMarkerA(null);
    setMarkerB(null);
    setDistance(0);
    setNote("");
    setOrigin("");
    setDestination("");
  };

  const handleSaved = () => {
    navigate("/myDistances");
  };

  return (
    <APIProvider apiKey={import.meta.env.VITE_MAPS_API}>
      <div className="h-[100vh] w-[100vw]">
        <Map
          mapId={"d22d5d67292751ef"}
          defaultZoom={3}
          defaultCenter={{ lat: 10.16, lng: 76.64 }}
          onClick={handleClick}
        >
          {markerA && <AdvancedMarker position={markerA} />}
          {markerB && <AdvancedMarker position={markerB} />}
        </Map>

        <div className="popup">
          <p>Distance: {(distance / 1000).toFixed(2)} kilometers</p>
          <p>Destination: {destination}</p>
          <p>Origin: {origin}</p>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a note"
          />
          <button className="m-4 p-4 border" onClick={handleSubmit}>
            Submit
          </button>
          <button className="m-4 p-4 border" onClick={handleReset}>
            Reset
          </button>
          <button className="m-4 p-4 border" onClick={handleSaved}>
            Saved Distances
          </button>
        </div>
      </div>
    </APIProvider>
  );
}
