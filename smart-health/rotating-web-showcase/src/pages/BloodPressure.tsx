import { ChevronLeft, MoreVertical, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import heartImage from "@/assets/heart.png";

const BloodPressure = () => {
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
          <h1 className="text-lg font-semibold text-foreground">Blood Pressure</h1>
          <Button variant="ghost" size="icon" className="rounded-full">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Main Reading */}
      <div className="px-6 mb-8">
        <div className="text-center mb-4">
          <div className="text-5xl font-bold text-foreground mb-1">121/80</div>
          <p className="text-sm text-muted-foreground">sYSmm/hg</p>
        </div>

        {/* Timer Circle with Heart */}
        <div className="relative w-64 h-64 mx-auto mb-4">
          {/* Background circle */}
          <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-br from-green-100 to-green-200/50" />
          
          {/* Timer Arc */}
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 256 256">
            <circle
              cx="128"
              cy="128"
              r="110"
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="8"
              strokeLinecap="round"
              opacity="0.3"
            />
            <circle
              cx="128"
              cy="128"
              r="110"
              fill="none"
              stroke="hsl(var(--foreground))"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray="691"
              strokeDashoffset="518"
            />
          </svg>

          {/* Timer markers */}
          <div className="absolute left-8 top-1/2 -translate-y-1/2 text-sm font-medium text-foreground">0s</div>
          <div className="absolute right-8 top-1/2 -translate-y-1/2 text-sm font-medium text-foreground">20s</div>
          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-sm font-medium text-foreground">15s</div>

          {/* Heart in center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <img src={heartImage} alt="Heart" className="w-24 h-24 animate-heartbeat" />
          </div>

          {/* Timer dot indicator */}
          <div className="absolute top-[15%] left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-4 h-4 bg-foreground rounded-full" />
          </div>
        </div>

        <p className="text-center text-sm font-medium text-foreground">15 Sec Left</p>
      </div>

      {/* Main Overview */}
      <div className="px-6 mb-6">
        <Card className="p-5 bg-card border-0 rounded-2xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-foreground">Main Overview</h2>
            <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 bg-secondary rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center">
                  <svg className="w-4 h-4 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-sm text-foreground">Oxygen</span>
              </div>
            </div>
            <div className="p-4 bg-secondary rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <span className="text-sm text-foreground">Cholest...</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Action Button */}
      <div className="px-6">
        <Button className="w-full h-14 rounded-full bg-foreground text-background hover:bg-foreground/90 flex items-center justify-between px-6">
          <ChevronRight className="h-5 w-5" />
          <span className="flex-1 text-center font-medium">Swipe to start reading</span>
          <div className="flex gap-1">
            <ChevronRight className="h-5 w-5" />
            <ChevronRight className="h-5 w-5" />
          </div>
        </Button>
      </div>
    </div>
  );
};

export default BloodPressure;
