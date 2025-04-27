import React from 'react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";

interface ProfileSummaryProps {
  onClose: () => void;
}

const ProfileSummary: React.FC<ProfileSummaryProps> = ({ onClose }) => {
  return (
    <Card className="absolute top-12 right-0 w-80 shadow-md border">
      <CardContent className="p-4">
        <div className="flex items-center space-x-4 mb-2">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-health-secondary text-health-primary text-lg">
              OA
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-sm font-semibold">Omer Adam</CardTitle>
            <CardDescription className="text-xs text-gray-500">Patient</CardDescription>

          </div>
        </div>
        <p className="text-xs text-gray-700">
          Brief summary of Omer Adam's profile information could go here.
          Maybe recent activity, a key health metric, or a quick contact option.
        </p>
      </CardContent>
    </Card>
  );
};

export default ProfileSummary;