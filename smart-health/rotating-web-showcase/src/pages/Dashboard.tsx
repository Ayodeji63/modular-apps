import { Search, MoreVertical, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import userAvatar from "@/assets/user-avatar.jpg";
import heartImage from "@/assets/heart.png";

const Dashboard = () => {
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
      <div className="px-6 pt-4 pb-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src={userAvatar} alt="Michelle" />
              <AvatarFallback>M</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-lg font-semibold text-foreground flex items-center gap-1">
                Hey, Michelle 👋
              </h1>
              <p className="text-xs text-muted-foreground flex items-center gap-2">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-success rounded-full"></span>
                  88%
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-chart-2 rounded-full"></span>
                  Pro Member
                </span>
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search asclepios..."
            className="pl-10 bg-card border-0 rounded-xl h-12"
          />
        </div>
      </div>

      {/* Health Score */}
      <div className="px-6 mb-6">
        <Card className="p-5 bg-secondary border-0 rounded-2xl">
          <div className="flex justify-between items-start mb-4">
            <h2 className="font-semibold text-foreground">Health Score</h2>
            <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between items-center mb-2">
                <div>
                  <p className="text-sm font-medium text-foreground">Asclepios Score</p>
                  <p className="text-xs text-muted-foreground">Based on your data, we think your health status is above average</p>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs text-muted-foreground">87</span>
                  <span className="text-3xl font-bold text-foreground">88</span>
                  <span className="text-xs text-muted-foreground">89</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Smart Health Metrics */}
      <div className="px-6 mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-semibold text-foreground">Smart Health Metrics</h2>
          <Link to="/health-metrics">
            <Button variant="ghost" className="text-xs text-primary h-auto p-0">
              See All
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4 bg-card border-0 rounded-2xl">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-info/10 flex items-center justify-center">
                <svg className="w-4 h-4 text-info" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <span className="text-sm text-foreground">Heart Rate</span>
            </div>
            <div className="relative">
              <img src={heartImage} alt="Heart" className="w-16 h-16 mx-auto mb-2 animate-heartbeat" />
              <div className="absolute bottom-2 right-2 flex flex-col items-end">
                <span className="text-2xl font-bold text-foreground">70</span>
                <span className="text-xs text-muted-foreground">bpm</span>
              </div>
            </div>
          </Card>

          <Link to="/blood-pressure">
            <Card className="p-4 bg-card border-0 rounded-2xl h-full">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-chart-2/10 flex items-center justify-center">
                  <svg className="w-4 h-4 text-chart-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <span className="text-sm text-foreground">Blood P</span>
              </div>
              <div className="relative">
                <img src={heartImage} alt="Heart" className="w-16 h-16 mx-auto mb-2 opacity-80" />
                <div className="absolute bottom-2 right-2 flex flex-col items-end">
                  <span className="text-2xl font-bold text-foreground">120</span>
                  <span className="text-xs text-muted-foreground">bpm</span>
                </div>
              </div>
            </Card>
          </Link>
        </div>
      </div>

      {/* Calories */}
      <div className="px-6 mb-6">
        <Card className="p-5 bg-card border-0 rounded-2xl">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-foreground">Smart Health Metrics</h3>
            <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-4xl">🔥</div>
            <div className="flex-1">
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-sm text-foreground font-medium">Calories Burned</span>
                <div className="text-right">
                  <span className="text-lg font-bold text-foreground">2000</span>
                  <span className="text-xs text-muted-foreground ml-1">kcal</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Not Suggested</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
