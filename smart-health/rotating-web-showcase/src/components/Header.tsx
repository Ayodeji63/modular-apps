import { Settings, Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Header = () => {
  return (
    <header className="bg-card border-b border-border px-8 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <div className="grid grid-cols-2 gap-0.5">
                <div className="w-2 h-2 bg-white rounded-sm"></div>
                <div className="w-2 h-2 bg-white rounded-sm"></div>
                <div className="w-2 h-2 bg-white rounded-sm"></div>
                <div className="w-2 h-2 bg-white rounded-sm"></div>
              </div>
            </div>
            <span className="text-xl font-semibold text-foreground">Medicare</span>
          </div>
        </div>

        <nav className="flex items-center gap-8">
          <a href="#" className="text-foreground font-medium hover:text-primary transition-colors">
            Homepage
          </a>
          <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
            Statistics
          </a>
          <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
            Analytics
          </a>
          <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
            Appointment
          </a>
          <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
            Message
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" className="rounded-full">
            <Settings className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon" className="rounded-full">
            <Bell className="h-5 w-5" />
          </Button>
          <Avatar>
            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=doctor" />
            <AvatarFallback>DR</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};

export default Header;
