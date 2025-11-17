import { useCallback, useEffect, useMemo, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AlertCircle, Send, Sprout, User } from "lucide-react";
import { gemini_ai } from "@/lib/gemini";
import ReactMarkdown from "react-markdown";
import { useSupabaseSensors } from "@/hooks/useSupabaseSensors";
import { timeStamp } from "console";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/lib/supabase";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

const AIAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hello! I'm your AgriPal AI assistant. I can help you with irrigation recommendations, soil analysis, weather forecasts, and farming advice. What would you like to know?",
      timestamp: new Date(),
    },
  ]);

  const {
    data: sensorData,
    loading: sensorLoading,
    error: sensorError,
  } = useSupabaseSensors("sensor_1", 200);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sensorSummary = useMemo(() => {
    if (!sensorData || sensorData.length === 0) {
      return {
        available: false,
        message: "No sensor data available",
      };
    }

    const latest = sensorData[0];

    const recent = sensorData.slice(0, 10);
    const avgMoisture =
      recent.reduce((sum: number, d) => sum + (d.moisture ?? 0), 0) /
      recent.length;
    const avgTemp =
      recent.reduce((sum: number, d) => sum + (d?.tempearture ?? 0), 0) /
      recent.length;
    const avgHumidity =
      recent.reduce((sum: number, d) => sum + d?.humidity, 0) / recent.length;

    // Detect trends
    const moistureTrend =
      recent[0].moisture > recent[recent.length - 1].moisture
        ? "decreasing"
        : "increasing";

    return {
      available: true,
      latest: {
        moisture: latest.moisture,
        temperature: latest.tempearture,
        humidity: latest.humidity,
        status: latest.status,
        timeStamp: latest.timestamp,
      },
      averages: {
        moisture: avgMoisture.toFixed(1),
        temperature: avgTemp.toFixed(1),
        humidity: avgHumidity.toFixed(1),
      },
      trends: {
        moisture: moistureTrend,
      },
      dataPoints: sensorData.length,
      timeRange: `${Math.round(
        (Date.now() -
          new Date(sensorData[sensorData.length - 1].timestamp).getTime()) /
          (1000 * 60 * 60)
      )} hours`,
      count: recent.length,
    };
  }, [sensorData]);

  const buildPrompt = useCallback(
    (userQuestion: string) => {
      let prompt = `You are Agripal AI, an expert agricultural assistant helping farmers optimize their irrigation and crop management.
      
      CURRENT SENSOR DATA:
      `;

      if (sensorSummary.available) {
        prompt += `
        Latest Reading (${new Date(
          sensorSummary.latest?.timeStamp
        ).toLocaleDateString()}):
        - Soil Moisture: ${sensorSummary.latest?.moisture} %
        - Temperature: ${sensorSummary.latest?.moisture} C
        - Humidity: ${sensorSummary.latest?.humidity} %
        - Status: ${sensorSummary.latest?.status}

        Recent Averages (last 10 readings):
        - Avg Moisture: ${sensorSummary?.averages?.moisture} %
        - Avg Temperature: ${sensorSummary.averages?.temperature} C
        - Avg Humidity: ${sensorSummary?.averages.humidity} %

        Trends:
        - Moisture trend: ${sensorSummary.trends?.moisture}

        Data collected over: ${sensorSummary.timeRange} (${
          sensorSummary?.dataPoints
        } readings)
        `;
      } else {
        prompt += sensorSummary.message + "\n";
      }

      // Add recent conversation context (last 3 exchanges)
      const recentMessages = messages.slice(-6);
      if (recentMessages.length > 1) {
        prompt += `\nRECENT CONVERSATION:\n`;
        recentMessages.forEach((msg) => {
          prompt += `${msg.role === "user" ? "User" : "Agripal"}: ${
            msg.content
          } \n`;
        });
      }

      // Add current question
      prompt += `\nCURRENT QUESTION"\n${userQuestion}\n`;
      prompt += `\nPlease provide a helpful, specific answer based on the sensor data. Include actionable recommendations when appropriate. Keep responses concise but informatice`;

      return prompt;
    },
    [sensorSummary, messages]
  );

  const askAiPal = async (userQuestion: string) => {
    try {
      const prompt = buildPrompt(userQuestion);
      const response = await gemini_ai.models.generateContent({
        model: "gemini-2.5-flash-lite",
        contents: prompt,
      });

      console.log(response.text);
      return response.text;
    } catch (error) {
      console.error("AI Error:", error);
      throw new Error("Failed to get AI response. Please try again.");
    }
  };

  const upload_to_supabase = async (message: Message) => {
    try {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      if (userError || !userData.user) throw userError;

      const { error: dbError } = await supabase.from("chat").insert({
        user_id: userData?.user.id || null, // Optional: from auth
        device_id: "sensor_1",
        farm_id: "farm1",
        message_id: message.id, // Your generated ID
        role: message.role,
        message: message.content, // ✅ Column name matches
        timestamp: message.timestamp.toISOString(),
      });

      if (dbError) throw dbError;
    } catch (error) {
      throw error;
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    await upload_to_supabase(userMessage);

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput("");
    setIsLoading(true);

    try {
      const content = await askAiPal(currentInput);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: content,
        timestamp: new Date(),
      };
      await upload_to_supabase(aiMessage);
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestedQuestions = [
    "What's the irrigation recommendation based on current moisture?",
    "Is my soil moisture level optimal?",
    "What do the recent trends suggest?",
    "Should I water my crops today?",
  ];

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const { data: userData, error: userError } =
          await supabase.auth.getUser();

        if (userError || !userData?.user) {
          console.warn("No authenticated user, skipping chat fetch.");
          return;
        }

        const { data, error } = await supabase
          .from("chat")
          .select("*")
          .eq("user_id", userData.user.id);

        if (error) {
          console.error("Failed to fetch chats:", error);
          return;
        }

        if (data && data.length) {
          const chats: Message[] = data.map((row: any) => ({
            id: row.message_id || String(row.id || Date.now()),
            role: row.role as "user" | "assistant",
            content: row.message,
            timestamp: new Date(row.timestamp),
          }));
          setMessages((prev) => [...prev, ...chats]);
        }
      } catch (err) {
        console.error("Error fetching chats:", err);
      }
    };

    fetchChats();
  }, []);

  const MessageContent = ({ content }: { content: string }) => {
    return (
      <div className="prose prose-sm max-w-none">
        <ReactMarkdown
          components={{
            // Customize component rendering
            strong: ({ children }) => (
              <strong className="font-bold text-gray-900">{children}</strong>
            ),
            em: ({ children }) => <em className="italic">{children}</em>,
            h2: ({ children }) => (
              <h2 className="text-xl font-bold text-blue-700 mt-6 mb-3">
                {children}
              </h2>
            ),
            ul: ({ children }) => (
              <ul className="ml-8 space-y-2 text-gray-700">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="ml-4 space-y-3">{children}</ol>
            ),
            p: ({ children }) => (
              <p className="mb-4 text-gray-800 leading-relaxed">{children}</p>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-8rem)] flex flex-col">
        <Card className="flex-1 flex flex-col">
          {sensorError && (
            <Alert variant="destructive" className="m-4">
              <AlertDescription>
                Unable to load sensor data: {sensorError}
              </AlertDescription>
            </Alert>
          )}

          {!sensorError && !sensorSummary.available && (
            <Alert className="m-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No sensor data available. Connect your sensors to get
                personalized recommendations
              </AlertDescription>
            </Alert>
          )}
          {/* Messages Area */}
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-6 max-w-3xl mx-auto">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-4 ${
                    message.role === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <Avatar
                    className={
                      message.role === "assistant"
                        ? "bg-primary/10"
                        : "bg-secondary"
                    }
                  >
                    <AvatarFallback>
                      {message.role === "assistant" ? (
                        <Sprout className="h-5 w-5 text-primary" />
                      ) : (
                        <User className="h-5 w-5" />
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`flex-1 space-y-2 ${
                      message.role === "user" ? "text-right" : "text-left"
                    }`}
                  >
                    <div
                      className={`inline-block rounded-2xl px-4 py-3 max-w-[80%] ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <MessageContent content={message.content} />
                    </div>
                    <p className="text-xs text-muted-foreground px-2">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-4 items-center">
                  <Avatar className="bg-primary/10">
                    <AvatarFallback>
                      <Sprout className="h-5 w-5 text-primary animate-pulse" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" />
                      <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce delay-100" />
                      <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Suggested Questions */}
          {messages.length === 1 && (
            <div className="border-t border-border px-6 py-4">
              <p className="text-sm font-medium mb-3">Suggested questions:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setInput(question)}
                    className="text-xs"
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <CardContent className="border-t border-border p-4">
            <div className="flex gap-2 max-w-3xl mx-auto">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Ask me anything about your farm..."
                className="min-h-[60px] resize-none"
              />
              <Button
                onClick={handleSend}
                size="icon"
                className="h-[60px] w-[60px]"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AIAssistant;
