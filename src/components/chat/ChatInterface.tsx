
import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

type Message = {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
};

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m your health assistant. How can I help you today?',
      sender: 'assistant',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    
    // Simulate AI response
    setTimeout(() => {
      let responseContent = '';
      
      if (inputValue.toLowerCase().includes('pain')) {
        responseContent = "I understand you're experiencing pain. Can you tell me where the pain is located and how severe it is on a scale of 1-10? This will help me provide better guidance.";
      } else if (inputValue.toLowerCase().includes('fever') || inputValue.toLowerCase().includes('temperature')) {
        responseContent = "A fever could indicate your body is fighting an infection. If your temperature is above 101°F (38.3°C) or has lasted more than 2 days, I recommend contacting your healthcare provider. Would you like me to provide some comfort measures for fever?";
      } else if (inputValue.toLowerCase().includes('wound') || inputValue.toLowerCase().includes('cut')) {
        responseContent = "For wound care, it's important to keep the area clean and dry. If you notice increasing redness, swelling, warmth, or discharge, these could be signs of infection. Would you like to upload a photo of the wound for assessment?";
      } else {
        responseContent = "Thank you for sharing that with me. Based on what you've described, I recommend monitoring your symptoms for the next 24 hours. Make sure to stay hydrated and rest. If your symptoms worsen or you develop new ones, please let me know right away or contact your healthcare provider.";
      }
      
      const assistantMessage: Message = {
        id: Date.now().toString(),
        content: responseContent,
        sender: 'assistant',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  return (
    <div className="animate-fade-in">
      <Card className="max-w-2xl mx-auto border-none shadow-lg h-[600px] flex flex-col">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-gray-800">Medical Assistant</CardTitle>
          <CardDescription>
            Describe your symptoms or ask health questions
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto pb-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    message.sender === 'user' 
                      ? 'bg-health-primary text-white' 
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-2xl px-4 py-2 bg-gray-100">
                  <div className="flex space-x-1 items-center h-6">
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse-gentle"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse-gentle delay-150"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse-gentle delay-300"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="border-t p-4 bg-white">
          <div className="flex w-full items-center space-x-2">
            <Textarea
              placeholder="Type your symptoms or questions..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 min-h-[60px] max-h-[120px]"
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={inputValue.trim() === ''}
              className="health-gradient h-10 w-10 p-0 rounded-full"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ChatInterface;
