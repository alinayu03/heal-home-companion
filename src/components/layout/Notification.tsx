import React from 'react';
import { Phone } from "lucide-react";

export function Notification() {
  return (
    <div className="text-sm font-semibold bg-white rounded-md shadow-sm p-2 flex items-center w-64"> {/* Increased width from w-auto to w-72 */}
      <div className=" cursor-pointer bg-purple-100 text-purple-700 rounded-full p-1 mr-2">
        <Phone className="h-4 w-4" />
      </div>
      <div>
        <p className="text-sm font-semibold">New Call</p>
        <p className="text-xs text-gray-500">John Doe</p>
      </div>
    </div>
  );
}
