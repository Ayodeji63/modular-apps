import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Settings, Droplets } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const historyData = [
  { time: "Mon", value: 65 },
  { time: "Tue", value: 62 },
  { time: "Wed", value: 58 },
  { time: "Thu", value: 55 },
  { time: "Fri", value: 52 },
  { time: "Sat", value: 50 },
  { time: "Sun", value: 48 },
];

const SensorDetails = () => {
  const { id } = useParams();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/sensors">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold">Sector A - Soil Moisture</h2>
                <Badge className="bg-success hover:bg-success">Active</Badge>
              </div>
              <p className="text-muted-foreground">Capacitive Soil Moisture Sensor</p>
            </div>
          </div>
          <Button variant="outline" className="gap-2">
            <Settings className="h-4 w-4" />
            Configure
          </Button>
        </div>

        {/* Current Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm font-medium text-muted-foreground">Current Value</div>
              <div className="text-3xl font-bold text-primary">50%</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm font-medium text-muted-foreground">Average (7d)</div>
              <div className="text-3xl font-bold">56%</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm font-medium text-muted-foreground">Minimum (7d)</div>
              <div className="text-3xl font-bold">48%</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm font-medium text-muted-foreground">Maximum (7d)</div>
              <div className="text-3xl font-bold">65%</div>
            </CardContent>
          </Card>
        </div>

        {/* Historical Chart */}
        <Card>
          <CardHeader>
            <CardTitle>7-Day History</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={historyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  name="Moisture %"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Alerts Log */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  time: "2 hours ago",
                  message: "Soil moisture dropped below 55% threshold",
                  type: "warning",
                },
                {
                  time: "1 day ago",
                  message: "Sensor readings normalized after irrigation",
                  type: "success",
                },
                {
                  time: "3 days ago",
                  message: "Low moisture detected - irrigation recommended",
                  type: "warning",
                },
              ].map((alert, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 rounded-lg border border-border p-4"
                >
                  <Droplets
                    className={`h-5 w-5 mt-0.5 ${
                      alert.type === "warning" ? "text-warning" : "text-success"
                    }`}
                  />
                  <div className="flex-1">
                    <p className="font-medium">{alert.message}</p>
                    <p className="text-sm text-muted-foreground">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SensorDetails;
