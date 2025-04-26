import React, { useState, useRef } from 'react';
import { Send, Upload, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

type Message = {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  type: 'text' | 'image';
};

const CallInterface: React.FC = () => {
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
  const cameraInputRef = useRef<HTMLInputElement>(null);
  
  const callAnthropicAPI = async (userInput: string, imageData?: string) => {
    setIsTyping(true);
    
    try {
      // Prepare the messages for the API
      const apiMessages = messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.type === 'image' && msg.sender === 'user' 
          ? [
              { type: "image", source: { type: "base64", media_type: "image/jpeg", data: msg.content.split(',')[1] } }
            ]
          : [{ type: "text", text: msg.content }]
      }));
      
      // Add the new user message
      if (imageData) {
        apiMessages.push({
          role: 'user',
          content: [
            { type: "image", source: { type: "base64", media_type: "image/jpeg", data: imageData.split(',')[1] } }
          ]
        });
      } else {
        apiMessages.push({
          role: 'user',
          content: [{ type: "text", text: userInput }]
        });
      }
      
      // Make the API request
      const response = await fetch('/api/anthropic', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: apiMessages }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get response from Anthropic API');
      }
      
      const data = await response.json();
      
      // Add the assistant's response to the messages
      const assistantMessage: Message = {
        id: Date.now().toString(),
        content: data.response,
        sender: 'assistant',
        timestamp: new Date(),
        type: 'text',
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error calling Anthropic API:', error);
      
      // Add an error message
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: "I'm sorry, there was an error processing your request. Please try again later.",
        sender: 'assistant',
        timestamp: new Date(),
        type: 'text',
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };
  
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
    
    // Call the Anthropic API
    callAnthropicAPI(inputValue);
    
    setInputValue('');
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const imageData = reader.result as string;
        
        const userMessage: Message = {
          id: Date.now().toString(),
          content: imageData,
          sender: 'user',
          timestamp: new Date(),
          type: 'image',
        };
        
        setMessages(prev => [...prev, userMessage]);
        
        // Call the Anthropic API with the image
        callAnthropicAPI("Please analyze this image related to my health concern.", imageData);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const imageData = reader.result as string;
        
        const userMessage: Message = {
          id: Date.now().toString(),
          content: imageData,
          sender: 'user',
          timestamp: new Date(),
          type: 'image',
        };
        
        setMessages(prev => [...prev, userMessage]);
        
        // Call the Anthropic API with the image
        callAnthropicAPI("Please analyze this image I just captured related to my health concern.", imageData);
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
                      ? 'bg-blue-600 text-white' 
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
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-150"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-300"></div>
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
              title="Upload image"
            >
              <Upload className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => cameraInputRef.current?.click()}
              className="flex-shrink-0"
              title="Take photo"
            >
              <Camera className="h-4 w-4" />
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleCameraCapture}
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
              className="bg-blue-600 hover:bg-blue-700 h-10 w-10 p-0 rounded-full flex-shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CallInterface;