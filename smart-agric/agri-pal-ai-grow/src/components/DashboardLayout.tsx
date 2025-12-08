import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Radio,
  MessageSquare,
  Satellite,
  Bell,
  Settings,
  Sprout,
  ScanEye,
  Menu, // Imported Menu icon
  X, // Imported Close icon
} from "lucide-react";

const sidebarItems = [
  { title: "Overview", icon: LayoutDashboard, href: "/dashboard" },
  { title: "Sensors", icon: Radio, href: "/sensors" },
  { title: "AI Assistant", icon: MessageSquare, href: "/ai-assistant" },
  { title: "NASA Insights", icon: Satellite, href: "/nasa-insights" },
  { title: "Security", icon: ScanEye, href: "/securities" },
  { title: "Notifications", icon: Bell, href: "/notifications" },
  { title: "Settings", icon: Settings, href: "/settings" },
];

export const DashboardLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Automatically close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Mobile Overlay - Only visible when menu is open on mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-screen w-64 border-r border-border bg-card transition-transform duration-300 ease-in-out",
          // Mobile: Slide in/out based on state
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
          // Desktop: Always show (reset transform)
          "md:translate-x-0"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-6">
          <Link to="/" className="flex items-center space-x-2">
            <Sprout className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold">AgriPal</span>
          </Link>
          {/* Close button - Mobile only */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="space-y-1 p-4">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;

            return (
              <Link key={item.href} to={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    isActive && "bg-primary/10 text-primary hover:bg-primary/20"
                  )}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {item.title}
                </Button>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main content wrapper */}
      <div
        className={cn(
          "flex-1 transition-all duration-300 ease-in-out",
          // Mobile: No padding (content is full width)
          "pl-0",
          // Desktop: Push content to right to make room for sidebar
          "md:pl-64"
        )}
      >
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 backdrop-blur px-6">
          <div className="flex items-center gap-4">
            {/* Hamburger Toggle - Mobile only */}
            <Button
              variant="outline"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>

            <h1 className="text-xl font-semibold">
              {sidebarItems.find((item) => item.href === location.pathname)
                ?.title || "Dashboard"}
            </h1>
          </div>
          <ThemeToggle />
        </header>

        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
};
