import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export function useSensorData() {
  const [sensors, setSensors] = useState([]);
  const [connected, setConnected] = useState(false);
  const [latestReading, setLatestReading] = useState(null);

  useEffect(() => {
    const socket = io("http://localhost:3001");

    socket.on("connect", () => {
      console.log("Connected to backend");
      setConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from backend");
      setConnected(false);
    });

    // Receive initial data when connecting

    socket.on("initial-data", (data) => {
      console.log("Received initial data:", data);
      setSensors(data);
    });

    socket.on("sensor-data", ({ topic, data }) => {
      // console.log("Real-time update:", data);

      setLatestReading(data);

      // Update sensors list
      setSensors((prevSensors) => {
        const key = `${data.farm_id}_${data.device_id}`;
        const exists = prevSensors.find(
          (s) => `${s.farm_id}_${s.device_id}` == key
        );

        if (exists) {
          return prevSensors.map((s) =>
            `${s.farm_id}_${s.device_id}` === key ? data : s
          );
        } else {
          return [...prevSensors, data];
        }
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return { sensors, connected, latestReading };
}
