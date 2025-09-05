import React from 'react';

interface UserMessageProps {
  message: string;
}

export const UserMessage: React.FC<UserMessageProps> = ({ message }) => {
  return (
    <div className="flex justify-end mb-4">
      <div className="chat-bubble-user">
        <p className="text-sm md:text-base">{message}</p>
      </div>
    </div>
  );
};