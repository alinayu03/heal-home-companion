
import React from 'react';

const TypingIndicator = () => {
  return (
    <div className="flex justify-start mb-4">
      <div className="max-w-[85%] rounded-2xl px-4 py-3 bg-muted/50">
        <div className="flex space-x-2 items-center h-6">
          <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce"></div>
          <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce [animation-delay:0.2s]"></div>
          <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce [animation-delay:0.4s]"></div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
