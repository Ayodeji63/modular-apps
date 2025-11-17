import { useLocation } from "react-router-dom";
import Dashboard from "./Dashboard";
import BloodPressure from "./BloodPressure";
import Calendar from "./Calendar";

const Index = () => {
  const location = useLocation();

  const renderPage = () => {
    switch (location.pathname) {
      case "/blood-pressure":
        return <BloodPressure />;
      case "/calendar":
        return <Calendar />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="max-w-md mx-auto bg-background min-h-screen">
      {renderPage()}
    </div>
  );
};

export default Index;
