import React, { useState, useRef, useEffect } from 'react';
import { Send, Upload, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';

type Message = {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  type: 'text' | 'image';
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
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const callAnthropicAPI = async (userInput: string, imageData?: string) => {
    setIsTyping(true);
    
    try {
      const apiMessages = messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.type === 'image' && msg.sender === 'user' 
          ? [
              { type: "image", source: { type: "base64", media_type: "image/jpeg", data: msg.content.split(',')[1] } }
            ]
          : [{ type: "text", text: msg.content }]
      }));
      
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
    <div className="w-full max-w-3xl mx-auto">
      <Card className="border-none shadow-lg rounded-xl">
        <CardHeader className="border-b bg-card px-6">
          <CardTitle className="text-xl font-medium">Health Assistant</CardTitle>
          <CardDescription>
            Share your health concerns through text or images
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-[500px] overflow-y-auto p-6 space-y-4 scroll-smooth">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isTyping && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        </CardContent>
        <CardFooter className="border-t p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }} 
            className="flex w-full items-end gap-2"
          >
            <div className="flex-shrink-0 flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                className="rounded-full"
                title="Upload image"
              >
                <Upload className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => cameraInputRef.current?.click()}
                className="rounded-full"
                title="Take photo"
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
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
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="flex-1 min-h-[44px] max-h-[144px] resize-none"
              rows={1}
            />
            <Button 
              type="submit"
              size="icon" 
              disabled={inputValue.trim() === ''} 
              className="rounded-full h-11 w-11 flex-shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ChatInterface;
