
import { cn } from "@/lib/utils";

type StatusType = "clear" | "warning" | "danger";

interface StatusIndicatorProps {
  status: StatusType;
  label?: string;
  showLabel?: boolean;
  className?: string;
}

const statusConfig = {
  clear: {
    label: "All Clear",
    class: "status-clear"
  },
  warning: {
    label: "Warning",
    class: "status-warning"
  },
  danger: {
    label: "Intrusion Detected",
    class: "status-danger"
  }
};

const StatusIndicator = ({ 
  status, 
  label, 
  showLabel = true, 
  className 
}: StatusIndicatorProps) => {
  const config = statusConfig[status];
  
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className={cn("status-indicator", config.class)} />
      {showLabel && (
        <span className="text-sm font-medium">
          {label || config.label}
        </span>
      )}
    </div>
  );
};

export default StatusIndicator;
