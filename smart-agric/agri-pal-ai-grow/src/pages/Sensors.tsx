import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Plus, Droplets, Thermometer, Activity } from "lucide-react";
import { useState } from "react";
import WaterLevelCylinder from "@/components/WaterLevel";

// ... (Your sensors array remains the same) ...
const sensors = [
  {
    id: "sensor-1",
    name: "Sector A - Soil Moisture",
    type: "Soil Moisture",
    status: "active",
    value: "50%",
    lastUpdate: "2 minutes ago",
    icon: Droplets,
  },
];

const Sensors = () => {
  const [isOn, setIsOn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false); // To prevent double-clicking

  // --- NEW FUNCTION: Handes the API Call ---
  const togglePump = async () => {
    setIsLoading(true);
    const newAction = isOn ? "OFF" : "ON"; // Determine what we want to do

    try {
      // UPDATE THIS URL if your backend is not on localhost:3001
      const response = await fetch("http://localhost:3001/api/control/pump", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          farmId: "farm1", // Must match what the Pi expects
          deviceId: "sensor_1", // Must match what the Pi expects
          action: newAction,
        }),
      });

      const data = await response.json();

      if (data.success) {
        console.log(`Pump turned ${newAction}`);
        setIsOn(!isOn); // Only update UI if server says OK
      } else {
        console.error("Failed to toggle pump:", data.error);
        alert("Failed to toggle pump. Check console.");
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("Cannot connect to backend server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* ... (Header code remains the same) ... */}

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">IoT Sensors</h2>
            <p className="text-muted-foreground">
              Manage and monitor all your connected devices
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add New Sensor
          </Button>
        </div>

        {/* Summary Stats */}
        <div>
          <div className="grid gap-4 md:grid-cols-3 mb-4">
            {/* ... (Other cards remain the same) ... */}

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Total Sensors
                    </p>
                    <p className="text-2xl font-bold">{sensors.length}</p>
                  </div>
                  <Activity className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Active
                    </p>
                    <p className="text-2xl font-bold text-success">
                      {sensors.length}
                    </p>
                  </div>
                  <Activity className="h-8 w-8 text-success" />
                </div>
              </CardContent>
            </Card>

            {/* --- PUMP CONTROL CARD --- */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-medium"> Pump </p>
                  </div>

                  <div className={`flex items-center justify-center`}>
                    <span
                      className={`text-lg ml-4 font-medium ${
                        isOn ? "text-gray-400" : "text-white"
                      }`}
                    >
                      OFF
                    </span>

                    <button
                      onClick={togglePump} // <--- CONNECTED HERE
                      disabled={isLoading} // <--- Disable while fetching
                      className={`relative w-20 h-10 rounded-full transition-colors duration-300 ease-in-out mx-4 focus:outline focus:ring-4 focus:ring-offset-2 focus:ring-offset-slate-900 ${
                        isOn
                          ? "bg-emerald-500 focus:ring-emerald-400"
                          : "bg-gray-600 focus:ring-gray-500"
                      } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                      aria-pressed={isOn}
                      aria-label="Toggle switch"
                    >
                      <span
                        className={`absolute top-1 left-1 w-8 h-8 bg-white rounded-full shadow-lg transform transition-transform duration-300 ease-in-out ${
                          isOn ? "translate-x-10" : "translate-x-0"
                        }`}
                      />
                    </button>

                    <span
                      className={`text-lg mx-auto font-medium ${
                        isOn ? "text-white" : "text-gray-400"
                      }`}
                    >
                      ON
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <WaterLevelCylinder />
        </div>

        {/* ... (Sensors Grid remains the same) ... */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sensors.map((sensor) => {
            const Icon = sensor.icon;
            return (
              <Link key={sensor.id} to={`/sensors/${sensor.id}`}>
                <Card className="transition-all hover:shadow-lg hover:border-primary/50 cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-base">
                            {sensor.name}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {sensor.type}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant={
                          sensor.status === "active" ? "default" : "destructive"
                        }
                        className={
                          sensor.status === "active"
                            ? "bg-success hover:bg-success"
                            : ""
                        }
                      >
                        {sensor.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Current Value
                        </span>
                        <span className="text-lg font-semibold">
                          {sensor.value}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Last update: {sensor.lastUpdate}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Sensors;
