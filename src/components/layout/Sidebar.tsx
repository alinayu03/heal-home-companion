
import React from 'react';
import { 
  Home,
  Camera, 
  MessageCircle, 
  Calendar, 
  Heart, 
  Info, 
  Upload,
  User
} from 'lucide-react';
import { cn } from '@/lib/utils';

type NavItemProps = {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick?: () => void;
};

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, active, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center p-3 rounded-lg w-full transition-colors",
        active 
          ? "text-health-primary bg-health-secondary/50" 
          : "text-gray-500 hover:bg-gray-100"
      )}
    >
      <Icon className="h-5 w-5 mb-1" />
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
};

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { icon: Home, label: "Home", id: "home" },
    { icon: MessageCircle, label: "Chat", id: "chat" },
    { icon: Calendar, label: "Check-in", id: "checkin" },
    { icon: Heart, label: "Wellness", id: "wellness" },
    { icon: User, label: "Profile", id: "profile" }
  ];

  return (
    <div className="min-h-screen w-20 bg-white border-r border-gray-200 flex flex-col items-center py-6">
      <div className="flex-1 w-full flex flex-col items-center gap-4 mt-6">
        {navItems.map((item) => (
          <NavItem 
            key={item.id}
            icon={item.icon} 
            label={item.label} 
            active={activeTab === item.id}
            onClick={() => setActiveTab(item.id)}
          />
        ))}
      </div>
      
      <div className="mt-auto w-full px-2">
        <NavItem icon={Info} label="Help" />
      </div>
    </div>
  );
};

export default Sidebar;
