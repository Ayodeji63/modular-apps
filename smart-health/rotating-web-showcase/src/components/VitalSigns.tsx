import { Activity, Heart, Droplet, Gauge, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";

const VitalSigns = () => {
  return (
    <div className="w-96 p-6 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Droplet className="h-4 w-4" />
            <span>Blood Status</span>
          </div>
          <div className="text-2xl font-bold">116/70</div>
          <div className="h-12 flex items-end gap-0.5">
            {[40, 55, 45, 70, 60, 50, 65, 55, 75, 70].map((height, i) => (
              <div
                key={i}
                className="flex-1 bg-primary/20 rounded-t"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
        </Card>

        <Card className="p-4 space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Heart className="h-4 w-4" />
            <span>Heart Rate</span>
          </div>
          <div className="text-2xl font-bold">120<span className="text-sm text-muted-foreground">bpm</span></div>
          <div className="h-12 relative">
            <svg viewBox="0 0 100 40" className="w-full h-full">
              <polyline
                points="0,20 10,20 15,10 20,30 25,15 30,20 100,20"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="2"
              />
            </svg>
            <div className="absolute right-2 bottom-0 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
              120 bpm
            </div>
          </div>
        </Card>

        <Card className="p-4 space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Droplet className="h-4 w-4" />
            <span>Blood Count</span>
          </div>
          <div className="text-2xl font-bold">80-90</div>
          <div className="h-12 relative">
            <svg viewBox="0 0 100 40" className="w-full h-full">
              <path
                d="M 0 30 Q 25 20 50 25 T 100 30"
                fill="none"
                stroke="hsl(var(--muted-foreground))"
                strokeWidth="2"
                opacity="0.3"
              />
            </svg>
            <div className="absolute right-2 bottom-0 text-xs text-muted-foreground">
              80 /90
            </div>
          </div>
        </Card>

        <Card className="p-4 space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Gauge className="h-4 w-4" />
            <span>Glucose Level</span>
          </div>
          <div className="text-2xl font-bold">230<span className="text-sm text-muted-foreground">/ml</span></div>
          <div className="h-12 relative">
            <svg viewBox="0 0 100 40" className="w-full h-full">
              <path
                d="M 0 25 Q 25 15 50 20 T 100 25"
                fill="none"
                stroke="hsl(var(--muted-foreground))"
                strokeWidth="2"
                opacity="0.3"
              />
            </svg>
            <div className="absolute right-2 bottom-0 text-xs text-muted-foreground">
              230 /90
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6 space-y-4">
        <h3 className="font-semibold">Medical History</h3>

        <div className="space-y-3">
          {[
            { icon: Activity, name: "Backpain Checkup", date: "02/05/2025" },
            { icon: Activity, name: "Neurological Test", date: "02/03/2025" },
            { icon: Activity, name: "Knee Surgery", date: "02/02/2025" },
            { icon: Activity, name: "Health Checkup", date: "02/02/2025" },
          ].map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                  <item.icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <div className="font-medium text-sm">{item.name}</div>
                  <div className="text-xs text-muted-foreground">{item.date}</div>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default VitalSigns;
