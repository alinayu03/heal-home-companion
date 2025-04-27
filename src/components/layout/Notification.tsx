import React from 'react';
import { Phone } from "lucide-react";
// import { useRouter } from 'next/router'; // For Next.js
// For React Router, use: import { useNavigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export function Notification() {
  // For Next.js
  // const router = useRouter();
  
  // For React Router
  const navigate = useNavigate();
  
  const handleClick = () => {
    // For Next.js
    // router.push('/profile');
    
    // For React Router
    navigate('/profile');
  };

  return (
    <div 
      className="text-sm font-semibold bg-white rounded-md shadow-sm p-2 flex items-center w-64 cursor-pointer hover:bg-gray-50 transition-colors" 
      onClick={handleClick}
    >
      <div className="bg-purple-100 text-purple-700 rounded-full p-1 mr-2">
        <Phone className="h-4 w-4" />
      </div>
      <div>
        <p className="text-sm font-semibold">New Result from Agent Call</p>
        <p className="text-xs text-gray-500">John Doe</p>
      </div>
    </div>
  );
}