import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Sprout } from "lucide-react";

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Sprout className="h-7 w-7 text-primary" />
          <span className="text-xl font-bold">AgriPal</span>
        </Link>

        {/* <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link to="/dashboard" className="transition-colors hover:text-primary">
            Dashboard
          </Link>
          <Link to="/sensors" className="transition-colors hover:text-primary">
            Sensors
          </Link>
          <Link to="/ai-assistant" className="transition-colors hover:text-primary">
            AI Assistant
          </Link>
          <Link to="/nasa-insights" className="transition-colors hover:text-primary">
            NASA Insights
          </Link>
        </nav> */}

        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <Button asChild>
            <Link to="/register">Get Started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};
