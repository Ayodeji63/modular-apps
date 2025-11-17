import { Heart, Activity, MoreVertical, Stethoscope, FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import patientPhoto from "@/assets/patient-photo.jpg";

const PatientSidebar = () => {
  return (
    <div className="w-80 p-6 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Stethoscope className="h-4 w-4" />
            <span>CONSULTATIONS</span>
          </div>
          <div className="text-xs text-muted-foreground">27 AUGUST, 2025</div>
          <div className="text-sm font-medium">Initial examination</div>
        </Card>

        <Card className="p-4 space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <FileText className="h-4 w-4" />
            <span>PROTOCOLS</span>
          </div>
          <div className="text-xs text-muted-foreground">27 AUGUST, 2025</div>
          <div className="text-sm font-medium">Ultrasound Right knee</div>
        </Card>
      </div>

      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Patient Info</h3>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex items-start gap-4">
          <img
            src={patientPhoto}
            alt="Patient"
            className="w-20 h-20 rounded-xl object-cover"
          />
          <div className="flex-1">
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-xs text-muted-foreground">ID 1g</span>
              <span className="text-xs text-muted-foreground">6'4"</span>
            </div>
            <h4 className="text-xl font-semibold mb-1">Hudson Dylan</h4>
            <p className="text-sm text-muted-foreground">Male · 49 years old</p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Activity className="h-4 w-4" />
              <span>Blood Pressure</span>
            </div>
            <p className="text-lg font-semibold">120/80 <span className="text-xs text-muted-foreground">mm Hg</span></p>
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Heart className="h-4 w-4" />
              <span>Heart rate</span>
            </div>
            <p className="text-lg font-semibold">120/80 <span className="text-xs text-muted-foreground">mm Hg</span></p>
          </div>
        </div>
      </Card>

      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Activity className="h-4 w-4" />
          <span>Patient Body</span>
        </div>

        <div className="flex flex-col items-center justify-center py-8">
          <div className="relative w-40 h-40">
            <svg className="transform -rotate-90 w-40 h-40">
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="hsl(var(--muted))"
                strokeWidth="12"
                fill="none"
              />
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="hsl(var(--primary))"
                strokeWidth="12"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 70 * 0.96} ${2 * Math.PI * 70}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-3xl font-bold">96%</div>
              <div className="text-xs text-success font-medium">Health</div>
              <div className="text-xs text-muted-foreground">Body Condition</div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-primary">
          <div className="w-2 h-2 rounded-full bg-primary"></div>
          <span>Conditional report based on real-time situation</span>
        </div>
      </Card>
    </div>
  );
};

export default PatientSidebar;
