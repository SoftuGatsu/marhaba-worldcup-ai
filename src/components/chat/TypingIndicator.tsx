import React, { useState, useEffect } from 'react';

interface TypingIndicatorProps {
  loadingStartTime?: number | null;
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({ loadingStartTime }) => {
  const [message, setMessage] = useState("Marhaba is thinking...");
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!loadingStartTime) return;

    const interval = setInterval(() => {
      const elapsedSeconds = Math.floor((Date.now() - loadingStartTime) / 1000);
      setElapsed(elapsedSeconds);

      if (elapsedSeconds <= 5) {
        setMessage("Marhaba is thinking...");
      } else if (elapsedSeconds <= 10) {
        setMessage("Processing your request...");
      } else if (elapsedSeconds <= 20) {
        setMessage("This is taking longer than usual...");
      } else if (elapsedSeconds <= 30) {
        setMessage("Still working on your request...");
      } else {
        setMessage("The request is taking a while. The service might be under heavy load...");
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [loadingStartTime]);

  return (
    <div className="flex justify-start mb-4">
      <div className="chat-bubble-ai">
        <div className="typing-indicator">
          <div className="typing-dot" style={{ '--delay': 0 } as any}></div>
          <div className="typing-dot" style={{ '--delay': 1 } as any}></div>
          <div className="typing-dot" style={{ '--delay': 2 } as any}></div>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          {message}
          {elapsed > 5 && <span className="text-xs block mt-1">({elapsed}s elapsed)</span>}
        </p>
      </div>
    </div>
  );
};