import { supabase } from "@/lib/supabase";
import { useEffect, useRef, useState } from "react";

type SensorData = {
  created_at: string;
  device_id: string;
  farm_id: string;
  humidity: number;
  id: number;
  moisture: number;
  raw_value: number;
  status: string;
  tempearture: number;
  timestamp: string;
};
export function useSupabaseSensors(deviceId, limit = 100) {
  const [data, setData] = useState<SensorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [range, setRange] = useState("24h");
  const lastTimestamp = useRef(null);

  const getTimeRange = (range) => {
    const now = new Date();
    switch (range) {
      case "24h":
        return new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
      case "1w":
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
      case "4w":
        return new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000).toISOString();
      default:
        return new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
    }
  };

  useEffect(() => {
    fetchSensorData(range);

    // Poll every 10 seconds
    const interval = setInterval(() => fetchSensorData(range), 10000);
    return () => clearInterval(interval);
  }, [deviceId, range]);

  const fetchSensorData = async (timeRange) => {
    const since = getTimeRange(timeRange);

    try {
      const { data: fetchedData, error } = await supabase
        .from("sensor_readings")
        .select("*")
        .eq("device_id", deviceId)
        .gte("timestamp", since)
        .order("timestamp", { ascending: false }) // ✅ Newest first
        .limit(limit);

      if (error) throw error;

      setData(fetchedData); // ✅ Replace data completely

      if (fetchedData.length > 0) {
        lastTimestamp.current = fetchedData[0]?.timestamp;
      }
      setError(null);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchNewData = async () => {
    if (!lastTimestamp.current) return;

    try {
      const { data: newData, error } = await supabase
        .from("sensor_readings")
        .select("*")
        .eq("devicd_id", deviceId)
        .gt("timestamp", lastTimestamp.current)
        .order("timestamp", { ascending: false });

      if (error) throw error;

      if (newData && fetchNewData.length > 0) {
        setData((prev) => {
          const combined = [...newData, ...prev];
          return combined.slice(0, limit);
        });

        lastTimestamp.current = newData[0].timestamp;
      }
    } catch (error) {
      console.error("Error fetching new data:", error);
    }
  };

  return {
    data,
    loading,
    error,
    refetch: fetchSensorData,
    setRange, // Allow changing time range from component
  };
}
