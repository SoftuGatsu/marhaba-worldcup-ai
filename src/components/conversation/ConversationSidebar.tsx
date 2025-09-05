import React, { useState } from 'react';
import { Conversation } from '@/hooks/useConversations';
import { MessageSquare, Plus, Trash2, X, Menu, MoreVertical } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ConversationSidebarProps {
  conversations: Conversation[];
  currentConversationId: string | null;
  onNewConversation: () => void;
  onSwitchConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  onClearAll: () => void;
}

export const ConversationSidebar: React.FC<ConversationSidebarProps> = ({
  conversations,
  currentConversationId,
  onNewConversation,
  onSwitchConversation,
  onDeleteConversation,
  onClearAll
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const formatTime = (date: Date) => {
    return formatDistanceToNow(date, { addSuffix: true });
  };

  const handleDelete = (e: React.MouseEvent, conversationId: string) => {
    e.stopPropagation();
    onDeleteConversation(conversationId);
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 z-40 md:hidden bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg border border-border/50"
      >
        <Menu className="w-5 h-5 text-foreground" />
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-80 bg-white/95 backdrop-blur-lg border-r border-border/50 z-50
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:relative md:w-80
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-border/50">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading text-lg font-semibold text-foreground">
                Conversations
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="md:hidden text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <button
              onClick={() => {
                onNewConversation();
                setIsOpen(false);
              }}
              className="w-full btn-moroccan flex items-center justify-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>New Chat</span>
            </button>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {conversations.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No conversations yet</p>
              </div>
            ) : (
              <div className="p-2">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => {
                      onSwitchConversation(conversation.id);
                      setIsOpen(false);
                    }}
                    className={`
                      group relative p-3 rounded-lg cursor-pointer transition-all duration-200 mb-1
                      ${conversation.id === currentConversationId 
                        ? 'bg-primary/10 border border-primary/20' 
                        : 'hover:bg-muted/50'
                      }
                    `}
                  >
                    <div className="flex items-start space-x-3">
                      <MessageSquare className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {conversation.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatTime(conversation.updatedAt)}
                        </p>
                      </div>
                      
                      <button
                        onClick={(e) => handleDelete(e, conversation.id)}
                        className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all p-1"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {conversations.length > 0 && (
            <div className="p-4 border-t border-border/50">
              {showClearConfirm ? (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">
                    Clear all conversations?
                  </p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        onClearAll();
                        setShowClearConfirm(false);
                        setIsOpen(false);
                      }}
                      className="flex-1 text-xs py-1 px-2 bg-destructive text-destructive-foreground rounded"
                    >
                      Clear All
                    </button>
                    <button
                      onClick={() => setShowClearConfirm(false)}
                      className="flex-1 text-xs py-1 px-2 bg-muted text-muted-foreground rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowClearConfirm(true)}
                  className="w-full text-xs text-muted-foreground hover:text-destructive transition-colors py-2"
                >
                  Clear all conversations
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};