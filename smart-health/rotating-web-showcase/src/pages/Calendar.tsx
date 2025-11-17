import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import sleepCharacter from "@/assets/sleep-character.png";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const sleepData = [
  { date: "Oct 15", hours: 2.2, quality: 30 },
  { date: "Oct 16", hours: 8.2, quality: 85 },
  { date: "Oct 17", hours: 5.2, quality: 60 },
  { date: "Oct 18", hours: 7.5, quality: 75 },
  { date: "Oct 19", hours: 6.8, quality: 70 },
  { date: "Oct 20", hours: 8.0, quality: 90 },
  { date: "Oct 21", hours: 7.2, quality: 80 },
];

const Calendar = () => {
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const calendarDays = [17, 18, 19, 20, 21, 22, 23];

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
          <Button variant="ghost" size="icon" className="rounded-full">
            <CalendarIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Calendar */}
      <div className="px-6 mb-6">
        <Card className="p-5 bg-card border-0 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">October 2025</h2>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-primary text-primary-foreground">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-primary text-primary-foreground">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Days of week */}
          <div className="grid grid-cols-7 gap-2 mb-3">
            {daysOfWeek.map((day) => (
              <div key={day} className="text-center text-xs font-medium text-muted-foreground">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar dates */}
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((day) => (
              <button
                key={day}
                className={`
                  aspect-square rounded-full flex items-center justify-center text-sm font-medium
                  ${day === 20 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-foreground hover:bg-secondary'
                  }
                `}
              >
                {day}
              </button>
            ))}
          </div>
        </Card>
      </div>

      {/* Sleep Overview */}
      <div className="px-6 mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-semibold text-foreground">Sleep Overview</h2>
          <Button variant="ghost" className="text-xs text-primary h-auto p-0">
            See All
          </Button>
        </div>
        <Card className="p-5 bg-gradient-to-br from-green-200 to-green-100 border-0 rounded-2xl relative overflow-hidden">
          <div className="flex items-start justify-between mb-4 relative z-10">
            <div>
              <div className="text-2xl font-bold text-foreground mb-1">126+</div>
              <p className="text-sm text-foreground/80">Sleep Irregularities</p>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-white/50">
              <span className="text-xl">+</span>
            </Button>
          </div>
          <div className="absolute bottom-0 right-0 w-32 h-32">
            <img src={sleepCharacter} alt="Sleep character" className="w-full h-full object-contain" />
          </div>
        </Card>
      </div>

      {/* Sleep Trends Chart */}
      <div className="px-6 mb-6">
        <Card className="p-5 bg-card border-0 rounded-2xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-foreground">Sleep Trends</h3>
            <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={sleepData}>
              <defs>
                <linearGradient id="sleepGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis 
                dataKey="date" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={10}
                tickLine={false}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={10}
                tickLine={false}
                label={{ value: 'Hours', angle: -90, position: 'insideLeft', style: { fontSize: 10 } }}
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
                dataKey="hours" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                fill="url(#sleepGradient)"
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Sleep Quality Chart */}
      <div className="px-6 mb-6">
        <Card className="p-5 bg-card border-0 rounded-2xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-foreground">Sleep Quality</h3>
            <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={sleepData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis 
                dataKey="date" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={10}
                tickLine={false}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={10}
                tickLine={false}
                domain={[0, 100]}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.5rem',
                  fontSize: '12px'
                }}
              />
              <Bar 
                dataKey="quality" 
                fill="hsl(var(--success))"
                radius={[8, 8, 0, 0]}
                animationDuration={1500}
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Disease Risks */}
      <div className="px-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-semibold text-foreground">Disease Ricks</h2>
          <Button variant="ghost" className="text-xs text-primary h-auto p-0">
            See All
          </Button>
        </div>
        <Card className="p-5 bg-card border-0 rounded-2xl">
          <div className="space-y-3">
            {[
              { date: "Oct 17", title: "Your slept for 5.2h", badge: "Low", badgeColor: "bg-success", progress: 60 },
              { date: "Oct 16", title: "Your slept for 8.2h", badge: "Med", badgeColor: "bg-warning", progress: 85 },
              { date: "Oct 15", title: "Your slept for 2.2h", badge: "Insomnia", badgeColor: "bg-foreground", progress: 30 },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between pb-3 border-b border-border last:border-0">
                <div className="flex items-center gap-3 flex-1">
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground">{item.date.split(" ")[0]}</div>
                    <div className="text-lg font-bold text-foreground">{item.date.split(" ")[1]}</div>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-foreground mb-1">{item.title}</div>
                    <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-warning rounded-full transition-all duration-1000"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {item.badge === "Insomnia" ? "78 AI Suggest..." : item.badge === "Med" ? "8 AI Suggest..." : "No Suggestion"}
                    </p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium text-white ${item.badgeColor} ml-2`}>
                  {item.badge}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Calendar;
