import React, { useState, useRef, useEffect } from 'react';
import { WelcomeMessage } from './WelcomeMessage';
import { ChatMessage } from './ChatMessage';
import { UserMessage } from './UserMessage';
import { TypingIndicator } from './TypingIndicator';
import { ErrorMessage } from './ErrorMessage';
import { ChatInput } from './ChatInput';
import { ConversationSidebar } from '../conversation/ConversationSidebar';
import { useConversations } from '@/hooks/useConversations';
import { marhabaApi } from '@/services/api';
import { Message } from '@/types/api';

interface ChatState {
  isLoading: boolean;
  hasError: boolean;
  sessionId: string;
}

export const ChatContainer: React.FC = () => {
  const {
    conversations,
    currentConversation,
    currentConversationId,
    createNewConversation,
    switchToConversation,
    updateCurrentConversation,
    deleteConversation,
    clearAllConversations
  } = useConversations();

  const [chatState, setChatState] = useState<ChatState>({
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
  }, [currentConversation?.messages, chatState.isLoading]);

  const sendMessage = async (message: string) => {
    // Create new conversation if none exists
    if (!currentConversationId) {
      createNewConversation();
    }

    const userMessage = {
      id: `user_${Date.now()}`,
      type: 'user' as const,
      content: message,
      timestamp: new Date()
    };

    const newMessages = [...(currentConversation?.messages || []), userMessage];
    updateCurrentConversation(newMessages);

    setChatState(prev => ({
      ...prev,
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

      const finalMessages = [...newMessages, aiMessage];
      updateCurrentConversation(finalMessages);

      setChatState(prev => ({
        ...prev,
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
    const messages = currentConversation?.messages || [];
    const lastUserMessage = [...messages].reverse().find(m => m.type === 'user');
    if (lastUserMessage) {
      sendMessage(lastUserMessage.content as string);
    }
  };

  const handleNewConversation = () => {
    createNewConversation();
    setChatState(prev => ({
      ...prev,
      hasError: false,
      sessionId: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }));
  };

  const showWelcome = !currentConversation || currentConversation.messages.length === 0;
  const currentMessages = currentConversation?.messages || [];

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <ConversationSidebar
        conversations={conversations}
        currentConversationId={currentConversationId}
        onNewConversation={handleNewConversation}
        onSwitchConversation={switchToConversation}
        onDeleteConversation={deleteConversation}
        onClearAll={clearAllConversations}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col moroccan-pattern min-h-screen">
        {/* Chat Messages */}
        <div className="flex-1 pb-6 pt-6 md:pt-6 overflow-y-auto custom-scrollbar">
          <div className="max-w-4xl mx-auto px-4">
            {showWelcome && (
              <WelcomeMessage onSuggestionClick={sendMessage} />
            )}

            {currentMessages.map((message) => {
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
    </div>
  );
};