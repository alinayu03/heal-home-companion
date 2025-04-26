
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import PhotoAnalysis from '@/components/symptoms/PhotoAnalysis';
import ChatInterface from '@/components/chat/ChatInterface';
import DailyCheckIn from '@/components/checkIn/DailyCheckIn';
import WellnessTips from '@/components/wellness/WellnessTips';
import ProfileInfo from '@/components/profile/ProfileInfo';

const Index = () => {
  const [activeTab, setActiveTab] = useState('analyze');

  // Render the active component based on selected tab
  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'analyze':
        return <PhotoAnalysis />;
      case 'chat':
        return <ChatInterface />;
      case 'checkin':
        return <DailyCheckIn />;
      case 'wellness':
        return <WellnessTips />;
      case 'profile':
        return <ProfileInfo />;
      default:
        return <PhotoAnalysis />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex flex-1">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <main className="flex-1 bg-gray-50 p-6">
          <div className="max-w-5xl mx-auto">
            {renderActiveComponent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
