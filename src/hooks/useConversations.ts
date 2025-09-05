import { useState, useEffect } from 'react';
import { Message } from '@/types/api';

export interface Conversation {
  id: string;
  title: string;
  messages: Array<{
    id: string;
    type: 'user' | 'ai';
    content: string | Message[];
    timestamp: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export interface ConversationState {
  conversations: Conversation[];
  currentConversationId: string | null;
  currentConversation: Conversation | null;
}

const STORAGE_KEY = 'marhaba_conversations';
const MAX_CONVERSATIONS = 50; // Limit to prevent memory issues

export const useConversations = () => {
  const [state, setState] = useState<ConversationState>({
    conversations: [],
    currentConversationId: null,
    currentConversation: null
  });

  // Load conversations from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const conversations = parsed.map((conv: any) => ({
          ...conv,
          createdAt: new Date(conv.createdAt),
          updatedAt: new Date(conv.updatedAt),
          messages: conv.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        }));
        
        setState(prev => ({
          ...prev,
          conversations
        }));
      }
    } catch (error) {
      console.error('Failed to load conversations:', error);
    }
  }, []);

  // Save conversations to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.conversations));
    } catch (error) {
      console.error('Failed to save conversations:', error);
    }
  }, [state.conversations]);

  const generateTitle = (firstMessage: string): string => {
    const words = firstMessage.split(' ').slice(0, 6);
    return words.join(' ') + (firstMessage.split(' ').length > 6 ? '...' : '');
  };

  const createNewConversation = (): string => {
    const id = `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newConversation: Conversation = {
      id,
      title: 'New conversation',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setState(prev => {
      // Keep only the most recent conversations
      const conversations = [newConversation, ...prev.conversations].slice(0, MAX_CONVERSATIONS);
      
      return {
        conversations,
        currentConversationId: id,
        currentConversation: newConversation
      };
    });

    return id;
  };

  const switchToConversation = (conversationId: string) => {
    const conversation = state.conversations.find(c => c.id === conversationId);
    if (conversation) {
      setState(prev => ({
        ...prev,
        currentConversationId: conversationId,
        currentConversation: conversation
      }));
    }
  };

  const updateCurrentConversation = (messages: Conversation['messages']) => {
    if (!state.currentConversationId) return;

    setState(prev => {
      const updatedConversations = prev.conversations.map(conv => {
        if (conv.id === state.currentConversationId) {
          const updatedConv = {
            ...conv,
            messages,
            updatedAt: new Date()
          };
          
          // Update title if this is the first user message
          if (messages.length === 1 && messages[0].type === 'user') {
            updatedConv.title = generateTitle(messages[0].content as string);
          }
          
          return updatedConv;
        }
        return conv;
      });

      const currentConversation = updatedConversations.find(c => c.id === state.currentConversationId) || null;

      return {
        ...prev,
        conversations: updatedConversations,
        currentConversation
      };
    });
  };

  const deleteConversation = (conversationId: string) => {
    setState(prev => {
      const filteredConversations = prev.conversations.filter(c => c.id !== conversationId);
      const isCurrentDeleted = prev.currentConversationId === conversationId;
      
      return {
        conversations: filteredConversations,
        currentConversationId: isCurrentDeleted ? null : prev.currentConversationId,
        currentConversation: isCurrentDeleted ? null : prev.currentConversation
      };
    });
  };

  const clearAllConversations = () => {
    setState({
      conversations: [],
      currentConversationId: null,
      currentConversation: null
    });
  };

  return {
    conversations: state.conversations,
    currentConversation: state.currentConversation,
    currentConversationId: state.currentConversationId,
    createNewConversation,
    switchToConversation,
    updateCurrentConversation,
    deleteConversation,
    clearAllConversations
  };
};
