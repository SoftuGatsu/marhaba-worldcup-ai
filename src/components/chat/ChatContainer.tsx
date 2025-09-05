import React, { useState, useRef, useEffect } from 'react';
import { WelcomeMessage } from './WelcomeMessage';
import { ChatMessage } from './ChatMessage';
import { UserMessage } from './UserMessage';
import { TypingIndicator } from './TypingIndicator';
import { ErrorMessage } from './ErrorMessage';
import { ChatInput } from './ChatInput';
import { marhabaApi } from '@/services/api';
import { Message } from '@/types/api';

interface ChatState {
  messages: Array<{
    id: string;
    type: 'user' | 'ai';
    content: string | Message[];
    timestamp: Date;
  }>;
  isLoading: boolean;
  hasError: boolean;
  sessionId: string;
}

export const ChatContainer: React.FC = () => {
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    hasError: false,
    sessionId: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatState.messages, chatState.isLoading]);

  const sendMessage = async (message: string) => {
    const userMessage = {
      id: `user_${Date.now()}`,
      type: 'user' as const,
      content: message,
      timestamp: new Date()
    };

    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
      hasError: false
    }));

    try {
      // Use mock API for demo - replace with real API call
      const response = await marhabaApi.sendMessageMock(message, chatState.sessionId);
      
      const aiMessage = {
        id: `ai_${Date.now()}`,
        type: 'ai' as const,
        content: response.messages,
        timestamp: new Date()
      };

      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, aiMessage],
        isLoading: false
      }));
    } catch (error) {
      console.error('Failed to send message:', error);
      setChatState(prev => ({
        ...prev,
        isLoading: false,
        hasError: true
      }));
    }
  };

  const retryLastMessage = () => {
    const lastUserMessage = [...chatState.messages].reverse().find(m => m.type === 'user');
    if (lastUserMessage) {
      sendMessage(lastUserMessage.content as string);
    }
  };

  const showWelcome = chatState.messages.length === 0;

  return (
    <div className="min-h-screen bg-background moroccan-pattern">
      {/* Chat Messages */}
      <div className="pb-24 pt-6">
        <div className="max-w-4xl mx-auto px-4 custom-scrollbar">
          {showWelcome && (
            <WelcomeMessage onSuggestionClick={sendMessage} />
          )}

          {chatState.messages.map((message) => {
            if (message.type === 'user') {
              return (
                <UserMessage
                  key={message.id}
                  message={message.content as string}
                />
              );
            } else {
              const aiMessages = message.content as Message[];
              return (
                <div key={message.id}>
                  {aiMessages.map((aiMessage, index) => (
                    <ChatMessage
                      key={`${message.id}_${index}`}
                      message={aiMessage}
                    />
                  ))}
                </div>
              );
            }
          })}

          {chatState.isLoading && <TypingIndicator />}
          {chatState.hasError && <ErrorMessage onRetry={retryLastMessage} />}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Chat Input */}
      <ChatInput
        onSendMessage={sendMessage}
        disabled={chatState.isLoading}
      />
    </div>
  );
};