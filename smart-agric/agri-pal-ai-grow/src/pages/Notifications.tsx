import { useEffect, useMemo, useState, useCallback } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertCircle,
  CheckCircle,
  CloudRain,
  Droplets,
  Info,
  Radio,
  Satellite,
  Settings,
  Sprout,
  Thermometer,
  TrendingDown,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useSensorData } from "@/hooks/useSensorData";
import { gemini_ai } from "@/lib/gemini";
import { supabase } from "@/lib/supabase";

type Notification = {
  id: string;
  type: "sensor" | "weather" | "irrigation" | "system" | "ai";
  priority: "low" | "medium" | "high";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  icon: any;
  actionLink?: string;
};

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const { sensors, connected, latestReading } = useSensorData();

  // ✅ Generate AI notification and ADD it to state
  const generateAINotification = useCallback(async () => {
    if (!latestReading || isGeneratingAI) return;

    const moisture = Number(latestReading.soil_moisture);

    // Only generate if moisture is actually low
    if (moisture >= 25) return;

    setIsGeneratingAI(true);

    try {
      const prompt = `You are AgriPal AI, a friendly agricultural assistant.

CURRENT SITUATION:
- Soil moisture: ${moisture}%
- Status: Critical (below 25% threshold)
- Farmer needs to irrigate soon

Create a SHORT, funny, and personalized notification (max 2 sentences) to remind the farmer to water their crops. Make it engaging and not boring. Be creative but clear about the urgency.

Example tone: "🌵 Your soil is drier than a stand-up comedian's humor! Time to give those thirsty plants a drink before they start a rebellion. 💧"`;

      const response = await gemini_ai.models.generateContent({
        model: "gemini-2.5-flash-lite",
        contents: prompt,
      });

      const aiMessage = response.text;

      // ✅ Add the AI notification to state
      const newNotification: Notification = {
        id: `ai-${Date.now()}`,
        type: "ai",
        priority: "high",
        title: "🤖 AI Irrigation Alert",
        message: aiMessage,
        timestamp: new Date(),
        read: false,
        icon: Sprout,
        actionLink: "/ai-assistant",
      };

      await upload_to_supabase(newNotification);

      setNotifications((prev) => [newNotification, ...prev]);

      console.log("✅ AI notification generated:", aiMessage);
    } catch (error) {
      console.error("❌ AI notification error:", error);

      // Fallback notification if AI fails
      const fallbackNotification: Notification = {
        id: `fallback-${Date.now()}`,
        type: "sensor",
        priority: "high",
        title: "Low Soil Moisture Alert",
        message: `🌱 Critical: Soil moisture at ${moisture}%. Immediate irrigation recommended!`,
        timestamp: new Date(),
        read: false,
        icon: Droplets,
      };

      setNotifications((prev) => [fallbackNotification, ...prev]);
    } finally {
      setIsGeneratingAI(false);
    }
  }, [latestReading, isGeneratingAI]);

  const upload_to_supabase = async (notification: Notification) => {
    try {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      if (userError || !userData?.user) throw userError;

      const { error: dbError } = await supabase.from("notifications").insert({
        device_id: "sensor_1",
        farm_id: "farm1",
        message_id: notification.id,
        type: notification.type,
        notification: notification.message,
      });

      if (dbError) throw dbError;
    } catch (error) {
      throw error;
    }
  };
  // ✅ Check sensor data and generate notifications automatically
  useEffect(() => {
    if (!latestReading) return;

    const moisture = Number(latestReading.soil_moisture);
    const temp = Number(latestReading.temperature);

    // Check for low moisture
    if (moisture < 25 && !isGeneratingAI) {
      // Check if we already have a recent notification
      const recentAlert = notifications.find(
        (n) => n.type === "ai" && Date.now() - n.timestamp.getTime() < 60 // * 60 * 1000 // Within last hour
      );

      if (!recentAlert) {
        generateAINotification();
      }
    }

    // Check for high temperature
    if (temp > 35) {
      const recentTempAlert = notifications.find(
        (n) =>
          n.title.includes("Temperature") &&
          Date.now() - n.timestamp.getTime() < 3 * 60 * 60 * 1000 // Within 3 hours
      );

      if (!recentTempAlert) {
        const tempNotification: Notification = {
          id: `temp-${Date.now()}`,
          type: "weather",
          priority: "medium",
          title: "High Temperature Alert",
          message: `🌡️ Temperature is ${temp}°C (above 35°C). Increased evaporation expected. Monitor soil moisture closely.`,
          timestamp: new Date(),
          read: false,
          icon: Thermometer,
        };
        setNotifications((prev) => [tempNotification, ...prev]);
      }
    }

    // Check for sensor connection
    if (!connected) {
      const recentConnectionAlert = notifications.find(
        (n) =>
          n.title.includes("Disconnected") &&
          Date.now() - n.timestamp.getTime() < 30 * 60 * 1000 // Within 30 minutes
      );

      if (!recentConnectionAlert) {
        const connectionNotification: Notification = {
          id: `connection-${Date.now()}`,
          type: "system",
          priority: "high",
          title: "Sensor Connection Lost",
          message: "⚠️ Cannot reach sensors. Please check your connection.",
          timestamp: new Date(),
          read: false,
          icon: Radio,
        };
        setNotifications((prev) => [connectionNotification, ...prev]);
      }
    }
  }, [
    latestReading,
    connected,
    generateAINotification,
    isGeneratingAI,
    notifications,
  ]);

  // ✅ Load initial dummy data (optional)
  useEffect(() => {
    const initialNotifications: Notification[] = [
      {
        id: "welcome",
        type: "system",
        priority: "low",
        title: "Welcome to AgriPal Notifications",
        message:
          "✅ You'll receive real-time alerts about your crops here. All sensors are online.",
        timestamp: new Date(),
        read: false,
        icon: CheckCircle,
      },
    ];

    setNotifications(initialNotifications);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const filteredNotifications = notifications.filter((notif) => {
    if (filter === "unread") return !notif.read;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive";
      case "medium":
        return "default";
      case "low":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const getNotificationsByType = (type: string) => {
    return notifications.filter((n) => n.type === type);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Notifications</h2>
            <p className="text-muted-foreground">
              {unreadCount > 0
                ? `${unreadCount} unread notifications`
                : "All caught up!"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link to="/settings">
                <Settings className="h-4 w-4 mr-2" />
                Preferences
              </Link>
            </Button>
            {unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={markAllAsRead}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark All Read
              </Button>
            )}
          </div>
        </div>

        {/* Connection Status Banner */}
        {!connected && (
          <Card className="border-destructive bg-destructive/5">
            <CardContent className="p-4 flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <div>
                <p className="font-semibold text-destructive">
                  Sensors Disconnected
                </p>
                <p className="text-sm text-muted-foreground">
                  Cannot receive real-time updates. Check your connection.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="all" onClick={() => setFilter("all")}>
              All ({notifications.length})
            </TabsTrigger>
            <TabsTrigger value="unread" onClick={() => setFilter("unread")}>
              Unread ({unreadCount})
            </TabsTrigger>
            <TabsTrigger value="sensor">
              Sensor ({getNotificationsByType("sensor").length})
            </TabsTrigger>
            <TabsTrigger value="weather">
              Weather ({getNotificationsByType("weather").length})
            </TabsTrigger>
            <TabsTrigger value="irrigation">
              Irrigation ({getNotificationsByType("irrigation").length})
            </TabsTrigger>
            <TabsTrigger value="ai">
              AI ({getNotificationsByType("ai").length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <NotificationList
              notifications={filteredNotifications}
              onMarkAsRead={markAsRead}
              onRemove={removeNotification}
              getPriorityColor={getPriorityColor}
            />
          </TabsContent>

          <TabsContent value="unread" className="mt-6">
            <NotificationList
              notifications={filteredNotifications}
              onMarkAsRead={markAsRead}
              onRemove={removeNotification}
              getPriorityColor={getPriorityColor}
            />
          </TabsContent>

          <TabsContent value="sensor" className="mt-6">
            <NotificationList
              notifications={getNotificationsByType("sensor")}
              onMarkAsRead={markAsRead}
              onRemove={removeNotification}
              getPriorityColor={getPriorityColor}
            />
          </TabsContent>

          <TabsContent value="weather" className="mt-6">
            <NotificationList
              notifications={getNotificationsByType("weather")}
              onMarkAsRead={markAsRead}
              onRemove={removeNotification}
              getPriorityColor={getPriorityColor}
            />
          </TabsContent>

          <TabsContent value="irrigation" className="mt-6">
            <NotificationList
              notifications={getNotificationsByType("irrigation")}
              onMarkAsRead={markAsRead}
              onRemove={removeNotification}
              getPriorityColor={getPriorityColor}
            />
          </TabsContent>

          <TabsContent value="ai" className="mt-6">
            <NotificationList
              notifications={getNotificationsByType("ai")}
              onMarkAsRead={markAsRead}
              onRemove={removeNotification}
              getPriorityColor={getPriorityColor}
            />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

// NotificationList component stays the same...
type NotificationListProps = {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onRemove: (id: string) => void;
  getPriorityColor: (priority: string) => any;
};

const NotificationList = ({
  notifications,
  onMarkAsRead,
  onRemove,
  getPriorityColor,
}: NotificationListProps) => {
  if (notifications.length === 0) {
    return (
      <Card className="p-12">
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
              <Info className="h-8 w-8 text-muted-foreground" />
            </div>
          </div>
          <h3 className="text-lg font-semibold">No notifications</h3>
          <p className="text-muted-foreground">
            You're all caught up! Check back later for updates.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-16rem)]">
      <div className="space-y-3">
        {notifications.map((notification) => {
          const Icon = notification.icon;
          return (
            <Card
              key={notification.id}
              className={`transition-all hover:shadow-md ${
                !notification.read ? "border-primary/50 bg-primary/5" : ""
              }`}
            >
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div
                    className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${
                      !notification.read ? "bg-primary/20" : "bg-muted"
                    }`}
                  >
                    <Icon
                      className={`h-5 w-5 ${
                        !notification.read
                          ? "text-primary"
                          : "text-muted-foreground"
                      }`}
                    />
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">
                            {notification.title}
                          </h4>
                          <Badge
                            variant={getPriorityColor(notification.priority)}
                            className="text-xs"
                          >
                            {notification.priority}
                          </Badge>
                          {!notification.read && (
                            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {notification.message}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 flex-shrink-0"
                        onClick={() => onRemove(notification.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {formatTimestamp(notification.timestamp)}
                      </span>
                      <div className="flex items-center gap-2">
                        {notification.actionLink && (
                          <Button variant="outline" size="sm" asChild>
                            <Link to={notification.actionLink}>
                              View Details
                            </Link>
                          </Button>
                        )}
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onMarkAsRead(notification.id)}
                          >
                            Mark as Read
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </ScrollArea>
  );
};

const formatTimestamp = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);

  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
  return date.toLocaleDateString();
};

export default Notifications;
