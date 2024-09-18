import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";

export default function SavedDistances() {
  const [locations, setLocations] = useState<any[]>([]);

  useEffect(() => {
    const getDetails = async () => {
      const response = await axios.post("http://localhost:3000/getSaved", {
        username: sessionStorage.getItem("user"),
      });
      setLocations(response.data.details.locations);
    };
    getDetails();
  }, []);

  return (
    <div>
      <div className="flex flex-col gap-4">
        {locations.map((item, index) => (
          <div className="border shadow-md p-4 m-4" key={index}>
            <p>{index}</p>
            <p>Destination: {item.destination}</p>
            <p>Origin: {item.origin}</p>
            <p>LAT1: {item.lat1}</p>
            <p>LON1: {item.lon1}</p>
            <p>LAT2: {item.lat2}</p>
            <p>LON2: {item.lon2}</p>
            <p>Note: {item.note}</p>
            <p>Distance: {(item.distance / 1000).toFixed(2)} kilometers</p>
          </div>
        ))}
      </div>
    </div>
  );
}
