import React from 'react';
import { Bell, User, Phone } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Notification } from './Notification';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavbarProps {
  setActiveTab: (tab: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ setActiveTab }) => {
  const handleNewCallClick = () => {
    setActiveTab('profile');
  };

  return (
    <nav className="w-full h-16 px-6 border-b border-slate-200 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <div className="h-8 w-8 rounded-full bg-health-primary flex items-center justify-center">
          <span className="text-white font-bold text-sm">R</span>
        </div>
        <h1 className="text-lg font-medium">Relief</h1>
      </div>

      <div className="flex items-center space-x-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="relative">
              <Bell className="h-5 w-5 text-slate-600" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-health-primary text-white rounded-full text-xs flex items-center justify-center">
                1
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72" style={{ width: 'inherit' }}>
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="flex items-center space-x-2 cursor-pointer"
              onClick={handleNewCallClick}
            >
              <div className="w-full">
                <Notification />
              </div>
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-blue-500 hover:bg-blue-50">
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative rounded-full h-8 w-8 p-0">
              <Avatar className="h-8 w-8">
                <AvatarImage src="" />
                <AvatarFallback className="bg-health-secondary text-health-primary">
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Medical Information</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default Navbar;
