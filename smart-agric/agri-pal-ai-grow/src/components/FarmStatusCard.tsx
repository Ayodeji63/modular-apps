import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import StatusIndicator from "./StatusIndicator";
import { Farm } from "@/types";
// import { Clock, Shield } from "lucide-react";
import AlertPanel from "./AlertPanel";
import { mockFarms, mockIntrusions } from "@/lib/mock-data";
import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import {
  Bell,
  Camera,
  Clock,
  AlertTriangle,
  Wifi,
  WifiOff,
  Shield,
  X,
  ZoomIn,
} from "lucide-react";

interface FarmStatusCardProps {
  farm: Farm;
  onActivateDeterrent: (farmId: string) => void;
}

const FarmStatusCard = ({ farm, onActivateDeterrent }: FarmStatusCardProps) => {
  // Calculate time since last update for display
  const getTimeSince = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60)
      return `${diffMins} minute${diffMins === 1 ? "" : "s"} ago`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24)
      return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;

    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
  };

  const farmIntrusions = mockIntrusions.filter((i) => i.farmId === farm.id);

  // const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
  // const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

  console.log(import.meta.env.VITE_SUPABASE_ANON_KEY);

  const supabaseUrl = "https://axqvbzzyesfnapezmzph.supabase.co";
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const [detections, setDetections] = useState([]);
  const [isConnected, setIsConnected] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [newDetectionCount, setNewDetectionCount] = useState(0);

  // Modal state for fullscreen preview
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch images from Supabase storage
  const fetchDetections = async () => {
    try {
      const { data, error } = await supabase.storage
        .from("cow-detections")
        .list("", {
          limit: 3,
          sortBy: { column: "created_at", order: "desc" },
        });

      if (error) {
        console.error("Error fetching images:", error);
        setIsConnected(false);
        return;
      }

      console.log("Detections fetched:", data);

      setIsConnected(true);

      // Get public URLs for images
      const detectionsWithUrls = await Promise.all(
        data.map(async (file) => {
          const { data: urlData } = supabase.storage
            .from("cow-detections")
            .getPublicUrl(file.name);

          return {
            id: file.id,
            name: file.name,
            url: urlData.publicUrl,
            created_at: file.created_at,
            size: file.metadata?.size || 0,
            // Extract timestamp from filename if available
            timestamp: extractTimestampFromFilename(file.name),
          };
        })
      );

      // Check for new detections
      const currentCount = detectionsWithUrls.length;
      if (detections.length > 0 && currentCount > detections.length) {
        setNewDetectionCount(currentCount - detections.length);
        // Show browser notification if supported
        if (Notification.permission === "granted") {
          new Notification("Farm Alert!", {
            body: `${
              currentCount - detections.length
            } new intrusion(s) detected`,
            icon: "/api/placeholder/64/64",
          });
        }
      }

      setDetections(detectionsWithUrls);
      setLastUpdate(new Date());
    } catch (error) {
      console.error("Error in fetchDetections:", error);
      setIsConnected(false);
    }
  };

  // Extract timestamp from filename like "detection_20250522_035518.jpg"
  const extractTimestampFromFilename = (filename) => {
    const match = filename.match(/detection_(\d{8})_(\d{6})/);
    if (match) {
      const [, dateStr, timeStr] = match;
      const year = dateStr.substring(0, 4);
      const month = dateStr.substring(4, 6);
      const day = dateStr.substring(6, 8);
      const hour = timeStr.substring(0, 2);
      const minute = timeStr.substring(2, 4);
      const second = timeStr.substring(4, 6);

      return new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}`);
    }
    return new Date();
  };

  const timeAgo = (date) => {
    const now = new Date();
    const dateObj = date instanceof Date ? date : new Date(date);
    const diffInSeconds = Math.floor(
      (now.getTime() - dateObj.getTime()) / 1000
    );

    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  // Request notification permission
  const requestNotificationPermission = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        console.log("Notification permission granted");
      }
    }
  };

  // Handle image click for fullscreen preview
  const handleImageClick = (detection) => {
    setSelectedImage(detection);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === "Escape" && isModalOpen) {
        closeModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "hidden"; // Prevent scrolling
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  // Set up real-time updates and periodic fetching
  useEffect(() => {
    // Request notification permission on load
    requestNotificationPermission();

    // Initial fetch
    fetchDetections();

    // Set up periodic refresh every 30 seconds
    const interval = setInterval(fetchDetections, 30000);

    // Set up real-time subscription for new files
    const subscription = supabase
      .channel("storage-changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "storage",
          table: "objects",
          filter: "bucket_id=eq.cow-detections",
        },
        () => {
          console.log("New file detected via real-time");
          fetchDetections();
        }
      )
      .subscribe();

    return () => {
      clearInterval(interval);
      supabase.removeChannel(subscription);
    };
  }, []);

  // Clear new detection notification
  const clearNewNotifications = () => {
    setNewDetectionCount(0);
  };

  return (
    <>
      <Card className="dashboard-card flex w-full flex-col">
        <div>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{farm.name}</CardTitle>
                <CardDescription>{farm.address}</CardDescription>
              </div>
              <StatusIndicator status={farm.status} />
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="space-y-2">
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="mr-1 h-4 w-4" />
                <span>Last updated: {getTimeSince(farm.lastUpdated)}</span>
              </div>
              <div className="flex items-center text-sm">
                <span
                  className={`mr-2 h-2 w-2 rounded-full ${
                    farm.deviceStatus === "online"
                      ? "bg-alert-success"
                      : "bg-alert-danger"
                  }`}
                ></span>
                <span>System {farm.deviceStatus}</span>
                {farm.deviceStatus === "offline" && (
                  <span className="ml-1 text-muted-foreground">
                    (Last seen: {getTimeSince(farm.lastOnline)})
                  </span>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              variant={farm.status === "danger" ? "destructive" : "outline"}
              className="w-full"
              onClick={() => onActivateDeterrent(farm.id)}
              disabled={farm.deviceStatus === "offline"}
            >
              <Shield className="mr-2 h-4 w-4" />
              Activate Deterrent
            </Button>
          </CardFooter>
        </div>

        <div className=" bg-gray-50 p-4">
          {/* Detection Images Grid */}
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Recent Detections
              </h2>

              {detections.length === 0 ? (
                <div className="text-center py-12">
                  <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No detections yet</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Images will appear here when intrusions are detected
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
                  {detections
                    .sort((a, b) => a - b)
                    .map((detection, index) => (
                      <div
                        key={detection.id}
                        className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                      >
                        {/* Image with hover overlay */}
                        <div
                          className="aspect-video bg-gray-100 relative group cursor-pointer"
                          onClick={() => handleImageClick(detection)}
                        >
                          <img
                            src={detection.url}
                            alt={`Detection ${index + 1}`}
                            className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "/api/placeholder/400/300";
                            }}
                          />
                          {/* Hover overlay */}
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center text-white">
                              <ZoomIn className="w-8 h-8 mb-2" />
                              <span className="text-sm font-medium">
                                Click to preview
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Details */}
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-900">
                              Detection #{detections.length - index}
                            </span>
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              Intrusion
                            </span>
                          </div>

                          <div className="text-sm text-gray-600 space-y-1">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span>{timeAgo(detection.timestamp)}</span>
                            </div>
                            <div className="text-xs text-gray-500">
                              {detection.timestamp.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Fullscreen Modal */}
      {isModalOpen && selectedImage && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
          <div className="relative max-w-7xl max-h-full w-full h-full flex items-center justify-center">
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-2 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Image */}
            <div className="relative max-w-full max-h-full">
              <img
                src={selectedImage.url}
                alt={`Detection ${selectedImage.name}`}
                className="max-w-full max-h-full object-contain rounded-lg"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "/api/placeholder/800/600";
                }}
              />

              {/* Image info overlay */}
              <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-70 text-white p-4 rounded-lg">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {selectedImage.name}
                    </h3>
                    <p className="text-sm opacity-90">
                      Detected: {selectedImage.timestamp.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-500 text-white">
                      <AlertTriangle className="w-4 h-4 mr-1" />
                      Intrusion Alert
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Click outside to close */}
            <div className="absolute inset-0 -z-10" onClick={closeModal} />
          </div>
        </div>
      )}
    </>
  );
};

export default FarmStatusCard;
