import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CameraFeedProps {
  farmId: string;
  farmName: string;
}

const CameraFeed = ({ farmId, farmName }: CameraFeedProps) => {
  // For a real implementation, you'd connect to actual camera feeds
  const cameraLocations = [
    { location: "North Fence", video: "vid1.mp4" },
    { location: "East Gate", video: "vid2.mp4" },
    { location: "South Pasture", video: "vid1.mp4" },
    { location: "Main Entrance", video: "vid2.mp4" },
  ];

  const eventsAsTheyOccur = [
    {
      event: "Intrusion",
      video: "vid3.mp4",
      status: "alert",
      description: "Security breach detected"
    }
  ];

  return (
    <Card className="h-full overflow-hidden flex-1">
      <CardHeader>
        <CardTitle>Live Camera Feed</CardTitle>
        <CardDescription>Monitoring {farmName}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="locations" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="locations">Location Feeds</TabsTrigger>
            <TabsTrigger value="events">Intrusion</TabsTrigger>
          </TabsList>

          {/* Locations Tab Content */}
          <TabsContent value="locations" className="space-y-4">
            <Tabs defaultValue="camera-0">
              <TabsList className="mb-4">
                {cameraLocations.map((location, index) => (
                  <TabsTrigger key={index} value={`camera-${index}`}>
                    <span className="flex items-center gap-2">
                      {location.location}
                    </span>
                  </TabsTrigger>
                ))}
              </TabsList>

              {cameraLocations.map((location, index) => (
                <TabsContent key={index} value={`camera-${index}`} className="space-y-4">
                  <div className="relative bg-muted rounded-md aspect-video overflow-hidden">
                    <video width="640" height="360" controls autoPlay muted className="w-full h-full object-cover">
                      <source src={location.video} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>

                    {/* Overlay with timestamp and location */}
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 flex justify-between text-xs">
                      <span>{location.location}</span>
                      <span>{new Date().toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="p-3">
                        <CardTitle className="text-sm">Motion Detection</CardTitle>
                      </CardHeader>
                      <CardContent className="p-3 pt-0">
                        <div className="text-sm">
                          <div className="flex justify-between mb-1">
                            <span>Status:</span>
                            <span className="font-medium text-green-600">Active</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Sensitivity:</span>
                            <span>High</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="p-3">
                        <CardTitle className="text-sm">Night Vision</CardTitle>
                      </CardHeader>
                      <CardContent className="p-3 pt-0">
                        <div className="text-sm">
                          <div className="flex justify-between mb-1">
                            <span>Status:</span>
                            <span className="font-medium text-green-600">Active</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Current Mode:</span>
                            <span>Auto</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </TabsContent>

          {/* Events Tab Content */}
          <TabsContent value="events" className="space-y-4">
            <Tabs defaultValue="event-0">
              {eventsAsTheyOccur.map((eventItem, index) => (
                <TabsContent key={index} value={`event-${index}`} className="space-y-4">
                  <div className="relative bg-muted rounded-md aspect-video overflow-hidden">
                    <video width="640" height="360" controls autoPlay muted className="w-full h-full object-cover">
                      <source src={eventItem.video} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>

                    {/* Overlay with event info and timestamp */}
                    <div className="absolute top-0 left-0 right-0 bg-black/70 text-white p-2 flex justify-between text-xs">
                      <span className="font-medium">{eventItem.event}</span>
                      <span className={`px-2 py-1 rounded text-xs ${eventItem.status === 'alert' ? 'bg-red-600' : 'bg-green-600'}`}>
                        {eventItem.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 flex justify-between text-xs">
                      <span>{eventItem.description}</span>
                      <span>{new Date().toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="p-3">
                        <CardTitle className="text-sm">Event Status</CardTitle>
                      </CardHeader>
                      <CardContent className="p-3 pt-0">
                        <div className="text-sm">
                          <div className="flex justify-between mb-1">
                            <span>Type:</span>
                            <span className="font-medium">{eventItem.event}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Priority:</span>
                            <span className={eventItem.status === 'alert' ? 'text-red-600 font-medium' : 'text-green-600'}>
                              {eventItem.status === 'alert' ? 'High' : 'Normal'}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="p-3">
                        <CardTitle className="text-sm">Detection Settings</CardTitle>
                      </CardHeader>
                      <CardContent className="p-3 pt-0">
                        <div className="text-sm">
                          <div className="flex justify-between mb-1">
                            <span>AI Analysis:</span>
                            <span className="font-medium text-blue-600">Active</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Confidence:</span>
                            <span>{eventItem.status === 'alert' ? '95%' : '78%'}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="p-3">
                        <CardTitle className="text-sm">Response</CardTitle>
                      </CardHeader>
                      <CardContent className="p-3 pt-0">
                        <div className="text-sm">
                          <div className="flex justify-between mb-1">
                            <span>Alert Sent:</span>
                            <span className="font-medium">
                              {eventItem.status === 'alert' ? 'Yes' : 'No'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Action:</span>
                            <span>{eventItem.status === 'alert' ? 'Monitor' : 'Normal'}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CameraFeed;