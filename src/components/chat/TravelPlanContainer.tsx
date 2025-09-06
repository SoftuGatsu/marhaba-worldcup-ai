import React, { useState } from 'react';
import { TravelPlanForm } from './TravelPlanForm';
import { TravelWelcome } from './TravelWelcome';
import { ChatMessage } from './ChatMessage';
import { UserMessage } from './UserMessage';
import { TypingIndicator } from './TypingIndicator';
import { ErrorMessage } from './ErrorMessage';
import { ConversationSidebar } from '../conversation/ConversationSidebar';
import { useConversations } from '@/hooks/useConversations';
import { marhabaApi } from '@/services/api';
import { Message } from '@/types/api';
import { Button } from '@/components/ui/button';
import { MessageSquare, FileText } from 'lucide-react';

interface ChatState {
  isLoading: boolean;
  hasError: boolean;
  sessionId: string;
}

type ViewMode = 'welcome' | 'form' | 'chat';

export const TravelPlanContainer: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('welcome');
  const [formSubmitted, setFormSubmitted] = useState(false);
  
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

  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [currentConversation?.messages, chatState.isLoading]);

  const sendMessage = async (message: string, formData?: any) => {
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
      const response = await marhabaApi.sendMessageSmart(message, chatState.sessionId, formData);
      
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

  const [pendingApiCall, setPendingApiCall] = useState<{message: string, sessionId: string, formData?: any} | null>(null);

  // Effect to handle API call after state updates
  React.useEffect(() => {
    if (pendingApiCall && viewMode === 'chat') {
      const handleApiCall = async () => {
        setChatState(prev => ({
          ...prev,
          isLoading: true,
          hasError: false
        }));

        try {
          // Call the API
          const response = await marhabaApi.sendMessageSmart(pendingApiCall.message, pendingApiCall.sessionId, pendingApiCall.formData);
          
          const aiMessage = {
            id: `ai_${Date.now()}`,
            type: 'ai' as const,
            content: response.messages,
            timestamp: new Date()
          };

          const currentMessages = currentConversation?.messages || [];
          const finalMessages = [...currentMessages, aiMessage];
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
        } finally {
          setPendingApiCall(null);
        }
      };

      // Small delay to ensure UI has rendered
      const timeoutId = setTimeout(handleApiCall, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [pendingApiCall, viewMode, currentConversation?.messages]);

  const handleFormSubmit = async (formData: any) => {
    console.log('handleFormSubmit called with:', formData);
    
    // Send the generated prompt from the form
    if (formData.message) {
      console.log('Sending message:', formData.message);
      
      let conversationId = currentConversationId;
      let existingMessages = currentConversation?.messages || [];
      
      // Create new conversation if none exists
      if (!conversationId) {
        conversationId = createNewConversation();
        existingMessages = []; // New conversation has no existing messages
      }

      // Add the user message first
      const userMessage = {
        id: `user_${Date.now()}`,
        type: 'user' as const,
        content: formData.message,
        timestamp: new Date()
      };

      const newMessages = [...existingMessages, userMessage];
      updateCurrentConversation(newMessages);
      
      // Switch to chat view after adding the message
      setFormSubmitted(true);
      setViewMode('chat');
      
      // Set up pending API call
      setPendingApiCall({
        message: formData.message,
        sessionId: chatState.sessionId,
        formData: formData.formData
      });
    } else {
      console.error('No message found in formData:', formData);
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
    setFormSubmitted(false);
    setViewMode('welcome');
    setChatState(prev => ({
      ...prev,
      hasError: false,
      sessionId: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }));
  };

  const handleStartPlanning = () => {
    setViewMode('form');
  };

  const handleNewTravelPlan = () => {
    setFormSubmitted(false);
    setViewMode('form');
  };

  const currentMessages = currentConversation?.messages || [];
  const showWelcome = viewMode === 'welcome' && !formSubmitted;
  const showForm = viewMode === 'form' && !formSubmitted;
  const showChat = viewMode === 'chat' || formSubmitted;

  // Debug logging
  React.useEffect(() => {
    console.log('TravelPlanContainer state update:', {
      viewMode,
      formSubmitted,
      currentConversationId,
      currentConversation,
      messageCount: currentMessages.length,
      showChat,
      showForm,
      showWelcome
    });
  }, [viewMode, formSubmitted, currentConversationId, currentConversation, currentMessages.length, showChat, showForm, showWelcome]);

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar - only show when we have conversations or not on welcome */}
      {(conversations.length > 0 || viewMode !== 'welcome') && (
        <ConversationSidebar
          conversations={conversations}
          currentConversationId={currentConversationId}
          onNewConversation={handleNewConversation}
          onSwitchConversation={switchToConversation}
          onDeleteConversation={deleteConversation}
          onClearAll={clearAllConversations}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col moroccan-pattern min-h-screen">
        {/* Header with view toggle */}
        {formSubmitted && (
          <div className="border-b border-border/50 bg-background/80 backdrop-blur-lg p-4">
            <div className="max-w-4xl mx-auto flex justify-between items-center">
              <div className="flex items-center gap-4">
                <Button
                  variant={viewMode === 'form' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('form')}
                  className="flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Travel Form
                </Button>
                <Button
                  variant={viewMode === 'chat' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('chat')}
                  className="flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  Chat Results
                </Button>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNewTravelPlan}
                className="text-primary hover:text-primary"
              >
                New Travel Plan
              </Button>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {showWelcome && (
            <div className="p-6">
              <TravelWelcome onStartPlanning={handleStartPlanning} />
            </div>
          )}

          {showForm && (
            <div className="p-6">
              <TravelPlanForm
                onSubmit={handleFormSubmit}
                onBack={() => setViewMode('welcome')}
                disabled={chatState.isLoading}
              />
            </div>
          )}

          {showChat && (
            <div className="flex-1 pb-6 pt-6 md:pt-6">
              <div className="max-w-4xl mx-auto px-4">
                {currentMessages.length === 0 && (
                  <div className="text-center text-muted-foreground p-4">
                    No messages yet. Check console for debugging info.
                  </div>
                )}
                {currentMessages.map((message) => {
                  console.log('Rendering message:', message);
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
          )}
        </div>
      </div>
    </div>
  );
};
