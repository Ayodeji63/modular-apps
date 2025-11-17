import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import {
  Droplets,
  Thermometer,
  Cloud,
  MessageSquare,
  Satellite,
  Radio,
  CheckCircle2,
  ArrowRight,
  Sprout,
} from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center animate-fade-in">
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Smart Agriculture for
              <span className="text-primary"> Modern Farmers</span>
            </h1>
            <p className="mb-8 text-lg text-muted-foreground">
              Monitor soil moisture, temperature, and humidity in real-time. Get
              AI-powered recommendations and NASA API insights for optimal
              irrigation and crop management.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" asChild className="gap-2">
                <Link to="/register">
                  Start Monitoring Now
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/ai-assistant">Try AI Assistant</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="mb-4 text-3xl font-bold">
              Comprehensive Farming Tools
            </h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to make data-driven decisions for your farm
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="p-6 transition-all hover:shadow-lg">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Droplets className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">
                Real-Time Soil Monitoring
              </h3>
              <p className="text-muted-foreground">
                Track soil moisture levels with IoT sensors connected to your
                Raspberry Pi. Get instant alerts when irrigation is needed.
              </p>
            </Card>

            <Card className="p-6 transition-all hover:shadow-lg">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Thermometer className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Weather Monitoring</h3>
              <p className="text-muted-foreground">
                Monitor temperature and humidity in real-time. Analyze trends
                and patterns to optimize your farming operations.
              </p>
            </Card>

            <Card className="p-6 transition-all hover:shadow-lg">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">
                AI-Powered Assistant
              </h3>
              <p className="text-muted-foreground">
                Chat with your personal AI farming assistant. Get instant
                answers about irrigation, soil conditions, and weather
                forecasts.
              </p>
            </Card>

            <Card className="p-6 transition-all hover:shadow-lg">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Satellite className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">
                NASA API Integration
              </h3>
              <p className="text-muted-foreground">
                Access NASA's POWER API for precipitation forecasts,
                evapotranspiration rates, and solar radiation data.
              </p>
            </Card>

            <Card className="p-6 transition-all hover:shadow-lg">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Radio className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">IoT Sensor Alerts</h3>
              <p className="text-muted-foreground">
                Receive real-time notifications when sensors detect changes.
                Stay informed about disconnections and critical conditions.
              </p>
            </Card>

            <Card className="p-6 transition-all hover:shadow-lg">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Cloud className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">
                Irrigation Recommendations
              </h3>
              <p className="text-muted-foreground">
                Get smart irrigation suggestions based on weather forecasts,
                soil conditions, and historical data analysis.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <div>
              <h2 className="mb-4 text-3xl font-bold">Why Choose AgriPal?</h2>
              <p className="mb-6 text-lg text-muted-foreground">
                Make informed decisions with real-time data and AI-powered
                insights
              </p>
              <ul className="space-y-4">
                {[
                  "Reduce water waste with precision irrigation",
                  "Increase crop yields through data-driven farming",
                  "Monitor multiple farms from a single dashboard",
                  "Get 7-day weather forecasts powered by NASA",
                  "Chat with AI for instant farming advice",
                  "Easy integration with Raspberry Pi sensors",
                ].map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gradient-to-br from-primary/10 to-success/10 rounded-2xl p-12 flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <Satellite className="h-32 w-32 text-primary mx-auto mb-6" />
                <p className="text-xl font-semibold">
                  Smart Farming Technology
                </p>
                <p className="text-muted-foreground mt-2">
                  Powered by IoT & NASA APIs
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold">
              Ready to Transform Your Farm?
            </h2>
            <p className="mb-8 text-lg opacity-90">
              Join thousands of farmers already using AgriPal to optimize their
              operations
            </p>
            <Button size="lg" variant="secondary" asChild className="gap-2">
              <Link to="/register">
                Get Started Free
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <Sprout className="h-6 w-6 text-primary" />
              <span className="font-bold">AgriPal</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 AgriPal. Smart Agriculture Platform.
            </p>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
