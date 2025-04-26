
import React, { useState, useRef } from 'react';
import { Send, Upload, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

type Message = {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  type: 'text' | 'image';
  analysis?: string;
};

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your health assistant. You can describe your symptoms or share photos of visible concerns like wounds, rashes, or other symptoms for analysis.",
      sender: 'assistant',
      timestamp: new Date(),
      type: 'text',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
      type: 'text',
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    
    // Simulate AI response
    setTimeout(() => {
      let responseContent = '';
      
      if (inputValue.toLowerCase().includes('pain')) {
        responseContent = "I understand you're experiencing pain. Can you tell me where the pain is located and how severe it is on a scale of 1-10? You can also share a photo if there's any visible swelling or discoloration.";
      } else if (inputValue.toLowerCase().includes('fever')) {
        responseContent = "A fever could indicate your body is fighting an infection. If your temperature is above 101°F (38.3°C) or has lasted more than 2 days, I recommend contacting your healthcare provider. Would you like me to provide some comfort measures for fever?";
      } else if (inputValue.toLowerCase().includes('wound')) {
        responseContent = "For wound care, it's important to keep the area clean and dry. Could you share a photo of the wound so I can better assess its condition?";
      } else {
        responseContent = "Thank you for sharing that with me. Would you like to provide any additional details or share a photo to help me better understand your symptoms?";
      }
      
      const assistantMessage: Message = {
        id: Date.now().toString(),
        content: responseContent,
        sender: 'assistant',
        timestamp: new Date(),
        type: 'text',
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const userMessage: Message = {
          id: Date.now().toString(),
          content: reader.result as string,
          sender: 'user',
          timestamp: new Date(),
          type: 'image',
        };
        
        setMessages(prev => [...prev, userMessage]);
        setIsTyping(true);
        
        // Simulate AI analysis
        setTimeout(() => {
          const analysis = "Based on the image analysis, this appears to be a healing wound with no signs of infection. The tissue color is healthy, and there's no excessive redness or swelling. Continue to:\n\n" +
            "• Keep the area clean and dry\n" +
            "• Monitor for any increased redness, swelling, or discharge\n" +
            "• Follow your prescribed wound care routine\n\n" +
            "Would you like more specific guidance about wound care?";
          
          const assistantMessage: Message = {
            id: Date.now().toString(),
            content: analysis,
            sender: 'assistant',
            timestamp: new Date(),
            type: 'text',
          };
          
          setMessages(prev => [...prev, assistantMessage]);
          setIsTyping(false);
        }, 2000);
      };
      reader.readAsDataURL(file);
    }
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
          <CardTitle className="text-2xl font-semibold text-gray-800">Health Assistant</CardTitle>
          <CardDescription>
            Describe your symptoms or share photos for analysis
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
                  {message.type === 'image' ? (
                    <div className="space-y-2">
                      <img 
                        src={message.content} 
                        alt="Uploaded symptom" 
                        className="rounded-lg max-h-48 w-auto"
                      />
                      {message.analysis && (
                        <p className="text-sm mt-2">{message.analysis}</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  )}
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
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              className="flex-shrink-0"
            >
              <Image className="h-4 w-4" />
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
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
              className="health-gradient h-10 w-10 p-0 rounded-full flex-shrink-0"
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
