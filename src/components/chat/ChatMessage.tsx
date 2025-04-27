
import React from 'react';
import { cn } from "@/lib/utils";

type MessageType = {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  type: 'text' | 'image';
};

interface ChatMessageProps {
  message: MessageType;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.sender === 'user';
  
  return (
    <div 
      className={cn(
        "flex w-full mb-4 animate-fade-in",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div 
        className={cn(
          "max-w-[85%] rounded-2xl px-4 py-2 shadow-sm",
          isUser 
            ? "bg-primary text-primary-foreground ml-12" 
            : "bg-muted text-foreground mr-12"
        )}
      >
        {message.type === 'image' ? (
          <div className="space-y-2">
            <img 
              src={message.content} 
              alt="Uploaded content"
              className="rounded-lg max-h-60 w-auto object-contain"
            />
          </div>
        ) : (
          <p className="text-sm whitespace-pre-wrap leading-relaxed">
            {message.content}
          </p>
        )}
        <p className="text-[10px] opacity-70 mt-1 text-right">
          {message.timestamp.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </p>
      </div>
    </div>
  );
};

export default ChatMessage;
