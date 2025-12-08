
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Intrusion } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface AlertPanelProps {
  intrusions: Intrusion[];
  title?: string;
  maxItems?: number;
  farmName?: string;
}

const AlertPanel = ({ 
  intrusions, 
  title = "Recent Alerts", 
  maxItems = 5,
  farmName
}: AlertPanelProps) => {
  const [alerts, setAlerts] = useState<Intrusion[]>([]);
  const { toast } = useToast();
  
  // Format the timestamp for display
  const formatTime = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      hour: '2-digit', 
      minute: '2-digit',
      month: 'short',
      day: 'numeric'
    };
    return new Date(dateString).toLocaleString('en-US', options);
  };
  
  // Get alert styling based on severity
  const getAlertStyle = (severity: string) => {
    switch (severity) {
      case 'high': return 'alert-danger';
      case 'medium': return 'alert-warning';
      case 'low': return 'alert-info';
      default: return 'alert-info';
    }
  };
  
  // Get severity badge variant
  const getSeverityVariant = (severity: string) => {
    switch (severity) {
      case 'high': return 'destructive';
      case 'medium': return 'warning';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };
  
  // Set up initial alerts
  useEffect(() => {
    setAlerts(intrusions
      .filter(i => !i.resolved)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, maxItems)
    );
  }, [intrusions, maxItems]);
  
  // Demo: Show a new alert notification after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (intrusions.length > 0) {
        // Create a fake new alert based on the first unresolved intrusion
        const unresolved = intrusions.find(i => !i.resolved);
        if (unresolved) {
          toast({
            title: "New Intrusion Detected!",
            description: `${farmName ? `${farmName} - ` : ''}${unresolved.location}`,
            variant: "destructive",
          });
        }
      }
    }, 10000);
    
    return () => clearTimeout(timer);
  }, [intrusions, toast, farmName]);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          {alerts.length === 0 
            ? "No active alerts at this time" 
            : "Recent intrusion alerts that require attention"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            <p>All clear! No intrusions detected.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div 
                key={alert.id} 
                className={cn("alert-item", getAlertStyle(alert.severity))}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">
                    {alert.location}
                    {farmName && ` - ${farmName}`}
                  </h4>
                  <Badge variant={getSeverityVariant(alert.severity) as any}>
                    {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                  </Badge>
                </div>
                <p className="text-sm mb-2">{alert.details}</p>
                <div className="text-xs text-muted-foreground">
                  {formatTime(alert.timestamp)}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AlertPanel;
