import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Droplets,
  Thermometer,
  Wind,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  CloudRain,
  Sprout,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useSensorData } from "@/hooks/useSensorData";
import { useSupabaseSensors } from "@/hooks/useSupabaseSensors";
import { timeStamp } from "console";

// const sensorData = [
//   { time: "00:00", moisture: 65, temp: 22, humidity: 70 },
//   { time: "04:00", moisture: 62, temp: 21, humidity: 72 },
//   { time: "08:00", moisture: 58, temp: 24, humidity: 68 },
//   { time: "12:00", moisture: 55, temp: 28, humidity: 65 },
//   { time: "16:00", moisture: 52, temp: 26, humidity: 67 },
//   { time: "20:00", moisture: 50, temp: 23, humidity: 69 },
// ];

const alerts = [
  {
    id: 1,
    type: "info",
    icon: CloudRain,
    message: "🌧 Rain forecasted tomorrow — irrigation not needed today.",
    time: "2 hours ago",
  },
  {
    id: 2,
    type: "warning",
    icon: AlertCircle,
    message: "🌱 Soil moisture low in Sector A, consider watering.",
    time: "5 hours ago",
  },
  {
    id: 3,
    type: "success",
    icon: CheckCircle,
    message: "✅ All sensors operating normally.",
    time: "1 day ago",
  },
];

const Dashboard = () => {
  const { sensors, connected, latestReading } = useSensorData();
  const {
    data: sensorData,
    loading,
    error,
  } = useSupabaseSensors("sensor_1", 50);

  console.log(sensorData);
  const formattedData = sensorData.map((item) => ({
    timestamp: item?.timestamp,
    moisture: item?.moisture,
    temp: item?.tempearture,
    humidity: item?.humidity,
  }));
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Soil Moisture
              </CardTitle>
              <Droplets className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {latestReading?.soil_moisture
                  ? Number(latestReading?.soil_moisture).toFixed(1)
                  : 0.0}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="destructive" className="text-xs">
                  Low
                </Badge>
                <span className="text-xs text-muted-foreground">
                  -5% from yesterday
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Temperature</CardTitle>
              <Thermometer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {latestReading?.temperature
                  ? Number(latestReading?.temperature).toFixed(1)
                  : 0.0}
                °C
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Badge className="text-xs bg-success">Normal</Badge>
                <span className="text-xs text-muted-foreground">
                  Optimal range
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Humidity</CardTitle>
              <Wind className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {latestReading?.humidity
                  ? Number(latestReading?.humidity).toFixed(1)
                  : 0.0}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Badge className="text-xs bg-success">Normal</Badge>
                <span className="text-xs text-muted-foreground">
                  +2% from yesterday
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Active Sensors
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8/8</div>
              <div className="flex items-center gap-2 mt-1">
                <Badge className="text-xs bg-success">Online</Badge>
                <span className="text-xs text-muted-foreground">
                  All operational
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Sensor Trends Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>24-Hour Sensor Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={formattedData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted"
                  />
                  <XAxis
                    dataKey="timestamp"
                    className="text-xs"
                    tickFormatter={(t) =>
                      new Date(t).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    }
                  />
                  <YAxis className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="moisture"
                    stroke="hsl(var(--chart-1))"
                    strokeWidth={2}
                    name="Moisture %"
                  />
                  <Line
                    type="monotone"
                    dataKey="temp"
                    stroke="hsl(var(--chart-3))"
                    strokeWidth={2}
                    name="Temp °C"
                  />
                  <Line
                    type="monotone"
                    dataKey="humidity"
                    stroke="hsl(var(--chart-2))"
                    strokeWidth={2}
                    name="Humidity %"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* AI Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sprout className="h-5 w-5 text-primary" />
                AI Alerts & Updates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-4">
                  {alerts.map((alert) => {
                    const Icon = alert.icon;
                    return (
                      <div
                        key={alert.id}
                        className="flex gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted/50"
                      >
                        <Icon className="h-5 w-5 flex-shrink-0 mt-0.5 text-muted-foreground" />
                        <div className="flex-1 space-y-1">
                          <p className="text-sm leading-relaxed">
                            {alert.message}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {alert.time}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Irrigation Recommendation */}
        <Card className="bg-gradient-to-br from-primary/10 to-success/10 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplets className="h-5 w-5 text-primary" />
              NASA Irrigation Recommendation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-lg font-medium">Delay irrigation by 2 days</p>
              <p className="text-muted-foreground">
                Sufficient rain predicted (15mm expected). Current soil moisture
                at 50% will recover naturally. Next recommended irrigation:
                Thursday, 11:00 AM.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
