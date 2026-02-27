import Sidebar from "@/components/Sidebar";
import ChatArea from "@/components/ChatArea";

const Index = () => {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      <Sidebar />
      <ChatArea />
    </div>
  );
};

export default Index;
