
import React from 'react';
import { User, FileImage, Heart, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const ProfileInfo: React.FC = () => {
  return (
    <div className="animate-fade-in">
      <Card className="max-w-2xl mx-auto border-none shadow-lg">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16 border-2 border-health-primary">
              <AvatarFallback className="bg-health-secondary text-health-primary text-xl">
                JD
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl font-semibold text-gray-800">John Doe</CardTitle>
              <CardDescription>
                Patient ID: 12345678 • DOB: 04/15/1980
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-3 flex items-center">
              <FileImage className="mr-2 h-5 w-5 text-health-primary" />
              Medical Information
            </h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Recent Procedures</h4>
                <p className="text-gray-800">Appendectomy - 2 weeks ago</p>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="text-sm font-medium text-gray-500">Allergies</h4>
                <p className="text-gray-800">Penicillin, Shellfish</p>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="text-sm font-medium text-gray-500">Current Medications</h4>
                <ul className="list-disc list-inside text-gray-800">
                  <li>Amoxicillin 500mg - 3x daily</li>
                  <li>Ibuprofen 400mg - as needed for pain</li>
                  <li>Multivitamin - daily</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3 flex items-center">
              <Heart className="mr-2 h-5 w-5 text-health-primary" />
              Care Team
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <h4 className="font-medium">Dr. Sarah Johnson</h4>
                <p className="text-sm text-gray-600">Primary Surgeon</p>
                <p className="text-sm text-blue-600 mt-1">Contact</p>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg">
                <h4 className="font-medium">Dr. Robert Chen</h4>
                <p className="text-sm text-gray-600">Primary Care Physician</p>
                <p className="text-sm text-blue-600 mt-1">Contact</p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3">Emergency Contacts</h3>
            
            <div className="bg-gray-50 p-3 rounded-lg">
              <h4 className="font-medium">Mary Doe</h4>
              <p className="text-sm text-gray-600">Spouse</p>
              <p className="text-sm">555-123-4567</p>
            </div>
          </div>
        </CardContent>
        
        <CardFooter>
          <Button variant="outline" className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Update Medical Information
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProfileInfo;
