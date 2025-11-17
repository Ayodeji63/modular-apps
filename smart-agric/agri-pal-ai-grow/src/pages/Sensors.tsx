import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Plus, Droplets, Thermometer, Activity } from "lucide-react";

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
  {
    id: "sensor-2",
    name: "Sector A - Temperature",
    type: "Temperature/Humidity",
    status: "active",
    value: "23°C / 69%",
    lastUpdate: "2 minutes ago",
    icon: Thermometer,
  },
  {
    id: "sensor-3",
    name: "Sector B - Soil Moisture",
    type: "Soil Moisture",
    status: "active",
    value: "65%",
    lastUpdate: "1 minute ago",
    icon: Droplets,
  },
  {
    id: "sensor-4",
    name: "Sector B - Temperature",
    type: "Temperature/Humidity",
    status: "active",
    value: "24°C / 67%",
    lastUpdate: "1 minute ago",
    icon: Thermometer,
  },
  {
    id: "sensor-5",
    name: "Sector C - Soil Moisture",
    type: "Soil Moisture",
    status: "offline",
    value: "N/A",
    lastUpdate: "2 hours ago",
    icon: Droplets,
  },
];

const Sensors = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
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
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Sensors</p>
                  <p className="text-2xl font-bold">8</p>
                </div>
                <Activity className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active</p>
                  <p className="text-2xl font-bold text-success">7</p>
                </div>
                <Activity className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Offline</p>
                  <p className="text-2xl font-bold text-destructive">1</p>
                </div>
                <Activity className="h-8 w-8 text-destructive" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sensors Grid */}
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
                          <CardTitle className="text-base">{sensor.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">{sensor.type}</p>
                        </div>
                      </div>
                      <Badge
                        variant={sensor.status === "active" ? "default" : "destructive"}
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
                        <span className="text-sm text-muted-foreground">Current Value</span>
                        <span className="text-lg font-semibold">{sensor.value}</span>
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
