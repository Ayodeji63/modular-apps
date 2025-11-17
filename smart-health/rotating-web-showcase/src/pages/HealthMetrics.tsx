import { ChevronLeft, Activity, Heart, Droplet, TrendingUp, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const heartRateData = [
  { time: "6AM", rate: 65 },
  { time: "9AM", rate: 72 },
  { time: "12PM", rate: 78 },
  { time: "3PM", rate: 85 },
  { time: "6PM", rate: 92 },
  { time: "9PM", rate: 75 },
  { time: "12AM", rate: 68 },
];

const bloodPressureData = [
  { day: "Mon", systolic: 120, diastolic: 80 },
  { day: "Tue", systolic: 118, diastolic: 78 },
  { day: "Wed", systolic: 122, diastolic: 82 },
  { day: "Thu", systolic: 121, diastolic: 80 },
  { day: "Fri", systolic: 119, diastolic: 79 },
  { day: "Sat", systolic: 120, diastolic: 80 },
  { day: "Sun", systolic: 121, diastolic: 81 },
];

const oxygenData = [
  { time: "12AM", level: 98 },
  { time: "3AM", level: 97 },
  { time: "6AM", level: 98 },
  { time: "9AM", level: 99 },
  { time: "12PM", level: 98 },
  { time: "3PM", level: 97 },
  { time: "6PM", level: 98 },
  { time: "9PM", level: 99 },
];

const HealthMetrics = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Status Bar */}
      <div className="px-4 pt-3 pb-2 flex justify-between items-center text-xs text-foreground">
        <span>9:30</span>
        <div className="flex items-center gap-1">
          <div className="w-4 h-3 bg-foreground/20 rounded-sm" />
          <div className="w-4 h-3 bg-foreground/40 rounded-sm" />
          <div className="w-4 h-3 bg-foreground/60 rounded-sm" />
          <div className="w-4 h-3 bg-foreground/80 rounded-sm" />
        </div>
      </div>

      {/* Header */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-lg font-semibold text-foreground">Health Metrics</h1>
          <Button variant="ghost" size="icon" className="rounded-full">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="px-6 mb-6">
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-4 bg-card border-0 rounded-2xl text-center">
            <Heart className="h-5 w-5 text-chart-2 mx-auto mb-2" />
            <div className="text-xl font-bold text-foreground">72</div>
            <div className="text-xs text-muted-foreground">BPM</div>
          </Card>
          <Card className="p-4 bg-card border-0 rounded-2xl text-center">
            <Droplet className="h-5 w-5 text-info mx-auto mb-2" />
            <div className="text-xl font-bold text-foreground">121/80</div>
            <div className="text-xs text-muted-foreground">BP</div>
          </Card>
          <Card className="p-4 bg-card border-0 rounded-2xl text-center">
            <Activity className="h-5 w-5 text-success mx-auto mb-2" />
            <div className="text-xl font-bold text-foreground">98%</div>
            <div className="text-xs text-muted-foreground">O2</div>
          </Card>
        </div>
      </div>

      {/* Heart Rate Trend */}
      <div className="px-6 mb-6">
        <Card className="p-5 bg-card border-0 rounded-2xl">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-chart-2" />
              <h3 className="font-semibold text-foreground">Heart Rate</h3>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-success" />
              <span className="text-sm text-success font-medium">+5%</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={heartRateData}>
              <defs>
                <linearGradient id="heartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis 
                dataKey="time" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={10}
                tickLine={false}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={10}
                tickLine={false}
                domain={[60, 100]}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.5rem',
                  fontSize: '12px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="rate" 
                stroke="hsl(var(--chart-2))" 
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--chart-2))', r: 4 }}
                activeDot={{ r: 6 }}
                animationDuration={1500}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Blood Pressure Trend */}
      <div className="px-6 mb-6">
        <Card className="p-5 bg-card border-0 rounded-2xl">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Droplet className="h-5 w-5 text-info" />
              <h3 className="font-semibold text-foreground">Blood Pressure</h3>
            </div>
            <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={bloodPressureData}>
              <defs>
                <linearGradient id="systolicGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--info))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--info))" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="diastolicGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis 
                dataKey="day" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={10}
                tickLine={false}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={10}
                tickLine={false}
                domain={[70, 130]}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.5rem',
                  fontSize: '12px'
                }}
              />
              <Legend 
                wrapperStyle={{ fontSize: '12px' }}
                iconType="circle"
              />
              <Area 
                type="monotone" 
                dataKey="systolic" 
                stroke="hsl(var(--info))" 
                strokeWidth={2}
                fill="url(#systolicGradient)"
                animationDuration={1500}
              />
              <Area 
                type="monotone" 
                dataKey="diastolic" 
                stroke="hsl(var(--success))" 
                strokeWidth={2}
                fill="url(#diastolicGradient)"
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Oxygen Level */}
      <div className="px-6 mb-6">
        <Card className="p-5 bg-card border-0 rounded-2xl">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-success" />
              <h3 className="font-semibold text-foreground">Oxygen Level</h3>
            </div>
            <span className="text-sm text-success font-medium">Normal</span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={oxygenData}>
              <defs>
                <linearGradient id="oxygenGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis 
                dataKey="time" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={10}
                tickLine={false}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={10}
                tickLine={false}
                domain={[95, 100]}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.5rem',
                  fontSize: '12px'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="level" 
                stroke="hsl(var(--success))" 
                strokeWidth={2}
                fill="url(#oxygenGradient)"
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};

export default HealthMetrics;
