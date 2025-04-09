
import TrawlDashboard from "@/components/TrawlDashboard";
import { Toaster } from "@/components/ui/toaster";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <TrawlDashboard />
      <Toaster />
    </div>
  );
};

export default Index;
