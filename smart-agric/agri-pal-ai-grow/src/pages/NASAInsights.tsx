import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CloudRain,
  Droplets,
  Sun,
  Wind,
  Calendar,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

const precipitationData = [
  { day: "Mon", rainfall: 0 },
  { day: "Tue", rainfall: 5 },
  { day: "Wed", rainfall: 15 },
  { day: "Thu", rainfall: 8 },
  { day: "Fri", rainfall: 2 },
  { day: "Sat", rainfall: 0 },
  { day: "Sun", rainfall: 0 },
];

const evapotranspirationData = [
  { day: "Mon", et: 4.2 },
  { day: "Tue", et: 4.5 },
  { day: "Wed", et: 3.8 },
  { day: "Thu", et: 4.1 },
  { day: "Fri", et: 4.6 },
  { day: "Sat", et: 4.8 },
  { day: "Sun", et: 4.4 },
];

const NASAInsights = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold mb-2">NASA POWER API Insights</h2>
          <p className="text-muted-foreground">
            Satellite-powered climate data and irrigation recommendations
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Precipitation Prob.</CardTitle>
                <CloudRain className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">75%</div>
              <div className="flex items-center gap-2 mt-1">
                <Badge className="text-xs">Tomorrow</Badge>
                <span className="text-xs text-muted-foreground">15mm expected</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Evapotranspiration</CardTitle>
                <Droplets className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.4 mm/day</div>
              <div className="flex items-center gap-2 mt-1">
                <TrendingDown className="h-3 w-3 text-success" />
                <span className="text-xs text-muted-foreground">Below average</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Solar Radiation</CardTitle>
                <Sun className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">18.5 MJ/m²</div>
              <div className="flex items-center gap-2 mt-1">
                <TrendingUp className="h-3 w-3 text-warning" />
                <span className="text-xs text-muted-foreground">High intensity</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Wind Speed</CardTitle>
                <Wind className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12 km/h</div>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">Moderate</Badge>
                <span className="text-xs text-muted-foreground">NE direction</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                7-Day Precipitation Forecast
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={precipitationData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar
                    dataKey="rainfall"
                    fill="hsl(var(--chart-2))"
                    radius={[8, 8, 0, 0]}
                    name="Rainfall (mm)"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Droplets className="h-5 w-5" />
                Evapotranspiration Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={evapotranspirationData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="day" />
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
                    dataKey="et"
                    stroke="hsl(var(--chart-3))"
                    strokeWidth={2}
                    name="ET (mm/day)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recommendations */}
        <Card className="bg-gradient-to-br from-primary/10 to-success/10 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CloudRain className="h-5 w-5 text-primary" />
              NASA Irrigation Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-primary/20 bg-background/50 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success/20">
                  <TrendingDown className="h-4 w-4 text-success" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold mb-1">Delay Irrigation by 2 Days</p>
                  <p className="text-sm text-muted-foreground">
                    Expected rainfall of 15mm will provide sufficient moisture. Current ET rate 
                    is below average, reducing water demand.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-background/50 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-warning/20">
                  <Sun className="h-4 w-4 text-warning" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold mb-1">Monitor Solar Radiation</p>
                  <p className="text-sm text-muted-foreground">
                    High solar radiation expected Friday-Sunday. Consider evening irrigation 
                    to minimize evaporation losses.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-background/50 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20">
                  <Calendar className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold mb-1">Next Recommended Irrigation</p>
                  <p className="text-sm text-muted-foreground">
                    Thursday, 6:00 PM - 8:00 PM (optimal timing based on temperature and 
                    evapotranspiration forecast)
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default NASAInsights;
