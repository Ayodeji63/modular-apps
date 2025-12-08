import { useState } from "react";
import { Link } from "react-router-dom";
import { Bell, Camera, History, Settings } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import FarmStatusCard from "@/components/FarmStatusCard";
import CameraFeed from "@/components/CameraFeed";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { mockFarms, mockIntrusions } from "@/lib/mock-data";

const Security = () => {
  const [farm, setFarm] = useState(() => mockFarms[0]);
  // const farmIntrusions = mockIntrusions.filter((i) => i.farmId === farm.id); // Uncomment if using AlertPanel
  const { toast } = useToast();

  const handleActivateDeterrent = (farmId: string) => {
    // In a real app, this would send a command to the IoT device
    toast({
      title: "Deterrent Activated",
      description: "Ultrasonic deterrent has been activated remotely",
    });

    if (farm.status === "danger") {
      setFarm((prev) => ({ ...prev, status: "warning" }));
      setTimeout(() => {
        setFarm((prev) => ({ ...prev, status: "clear" }));
        toast({
          title: "All Clear",
          description: "Intrusion has been successfully deterred",
        });
      }, 5000);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header Section - Mobile: Stacked / Desktop: Row */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Security Node</h2>
            <p className="text-muted-foreground text-sm">
              Real-time surveillance and deterrent system
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button
              size="sm"
              variant="outline"
              className="w-full sm:w-auto"
              asChild
            >
              <Link to="/history">
                <History className="mr-2 h-4 w-4" />
                View History
              </Link>
            </Button>
            <Button size="sm" className="w-full sm:w-auto" asChild>
              <Link to="/camera">
                <Camera className="mr-2 h-4 w-4" />
                Live Feed
              </Link>
            </Button>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
          {/* Left Column: Camera & Quick Actions (Takes 2/3 width on Desktop) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Camera Feed - The 'Hero' Element */}
            <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
              <CameraFeed farmId={farm.id} farmName={farm.name} />
            </div>

            {/* Quick Action Buttons */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
              <Button
                variant="outline"
                size="lg"
                className="h-auto py-6 flex flex-col items-start gap-2 hover:bg-accent/50 transition-colors"
                asChild
              >
                <Link to="/notifications" className="w-full">
                  <div className="p-2 bg-primary/10 rounded-full mb-1">
                    <Bell className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <span className="block font-semibold">
                      Notification Rules
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Configure threshold alerts
                    </span>
                  </div>
                </Link>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="h-auto py-6 flex flex-col items-start gap-2 hover:bg-accent/50 transition-colors"
                asChild
              >
                <Link to="/settings" className="w-full">
                  <div className="p-2 bg-primary/10 rounded-full mb-1">
                    <Settings className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <span className="block font-semibold">System Settings</span>
                    <span className="text-xs text-muted-foreground">
                      Manage hardware config
                    </span>
                  </div>
                </Link>
              </Button>
            </div>
          </div>

          {/* Right Column: Status & Health (Takes 1/3 width on Desktop) */}
          <div className="space-y-6">
            <FarmStatusCard
              farm={farm}
              onActivateDeterrent={handleActivateDeterrent}
            />

            {/* System Health Card */}
            <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                  Node Health
                </h3>

                <div className="space-y-6">
                  {/* Battery */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Battery Status
                      </span>
                      <span className="font-medium text-emerald-500">85%</span>
                    </div>
                    <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 w-[85%] rounded-full" />
                    </div>
                  </div>

                  {/* Storage */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Local Storage
                      </span>
                      <span className="font-medium text-blue-500">42%</span>
                    </div>
                    <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 w-[42%] rounded-full" />
                    </div>
                  </div>

                  {/* Signal */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">
                        Signal Strength
                      </span>
                      <span className="font-medium">Good</span>
                    </div>
                    <div className="flex gap-1.5">
                      {[1, 2, 3].map((_, i) => (
                        <div
                          key={i}
                          className="h-2 flex-1 bg-emerald-500 rounded-sm"
                        />
                      ))}
                      {[1, 2].map((_, i) => (
                        <div
                          key={i}
                          className="h-2 flex-1 bg-secondary rounded-sm"
                        />
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t mt-4">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground">Last Sync</span>
                      <span className="font-mono bg-secondary px-2 py-1 rounded">
                        {new Date().toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Security;
