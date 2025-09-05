import React from 'react';
import { TextMessagePayload } from '@/types/api';

interface TextMessageProps {
  payload: TextMessagePayload;
}

export const TextMessage: React.FC<TextMessageProps> = ({ payload }) => {
  return (
    <div className="flex justify-start mb-4">
      <div className="chat-bubble-ai">
        <div 
          className="prose prose-sm max-w-none text-foreground"
          dangerouslySetInnerHTML={{
            __html: payload.content
              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
              .replace(/\*(.*?)\*/g, '<em>$1</em>')
              .replace(/\n/g, '<br />')
          }}
        />
      </div>
    </div>
  );
};