import React from 'react';

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex justify-start mb-4">
      <div className="chat-bubble-ai">
        <div className="typing-indicator">
          <div className="typing-dot" style={{ '--delay': 0 } as any}></div>
          <div className="typing-dot" style={{ '--delay': 1 } as any}></div>
          <div className="typing-dot" style={{ '--delay': 2 } as any}></div>
        </div>
        <p className="text-sm text-muted-foreground mt-2">Marhaba is thinking...</p>
      </div>
    </div>
  );
};