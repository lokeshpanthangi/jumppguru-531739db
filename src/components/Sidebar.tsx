import React from 'react';
import { 
  MessageSquarePlus, 
  Grid3X3, 
  Trash2, 
  Settings, 
  ChevronLeft,
  User,
  Circle
} from 'lucide-react';
import { useChatContext } from '../contexts/ChatContext';

const formatChatDate = (date: Date): string => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const chatDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  
  if (chatDate.getTime() === today.getTime()) {
    return 'Today';
  } else if (chatDate.getTime() === yesterday.getTime()) {
    return 'Yesterday';
  } else {
    return chatDate.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: chatDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  }
};

const getTimeOfDayGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

export const Sidebar: React.FC = () => {
  const { 
    state, 
    createNewChat, 
    selectChat, 
    deleteChat, 
    toggleSidebar, 
    setDashboard 
  } = useChatContext();

  const handleNewChat = () => {
    createNewChat();
  };

  const handleChatSelect = (chatId: string) => {
    selectChat(chatId);
  };

  const handleChatDelete = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    deleteChat(chatId);
  };

  const handleDashboard = () => {
    setDashboard(true);
  };

  return (
    <>
      {/* Sidebar */}
      <aside 
        className={`fixed left-0 top-0 h-full bg-sidebar-bg border-r border-sidebar-border transition-all duration-sidebar z-40 ${
          state.sidebarCollapsed ? 'w-0' : 'w-80'
        } overflow-hidden`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-sidebar-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">JG</span>
              </div>
              <h1 className="text-xl font-bold text-text-primary">JumppGuru</h1>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={handleDashboard}
                className="w-full flex items-center gap-3 px-4 py-3 bg-button-secondary hover:bg-button-secondary-hover rounded-lg transition-colors duration-fast text-left"
              >
                <Grid3X3 className="w-5 h-5 text-text-secondary" />
                <span className="text-text-primary font-medium">Dashboard</span>
              </button>
              
              <button
                onClick={handleNewChat}
                className="w-full flex items-center gap-3 px-4 py-3 bg-brand-primary hover:bg-brand-primary-hover text-white rounded-lg transition-colors duration-fast"
              >
                <MessageSquarePlus className="w-5 h-5" />
                <span className="font-medium">New Chat</span>
              </button>
            </div>
          </div>

          {/* Chat History */}
          <div className="flex-1 overflow-hidden">
            <div className="p-4">
              <h3 className="text-sm font-medium text-text-secondary mb-3">Chat History</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto scrollbar-thin px-4 pb-4">
              {state.chats.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-text-muted text-sm">No chats yet</p>
                  <p className="text-text-muted text-xs mt-1">Start a new conversation</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {state.chats.map((chat) => (
                    <div
                      key={chat.id}
                      onClick={() => handleChatSelect(chat.id)}
                      className={`group relative p-3 rounded-lg cursor-pointer transition-colors duration-fast ${
                        state.currentChatId === chat.id
                          ? 'bg-sidebar-item-active'
                          : 'hover:bg-sidebar-item-hover'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-text-primary truncate">
                            {chat.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-text-muted">
                              {formatChatDate(chat.updatedAt)}
                            </span>
                            {chat.messages.length > 0 && (
                              <span className="text-xs text-text-muted">
                                • {chat.messages.length} messages
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <button
                          onClick={(e) => handleChatDelete(e, chat.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-button-secondary-hover rounded transition-all duration-fast"
                          aria-label="Delete chat"
                        >
                          <Trash2 className="w-4 h-4 text-danger" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* User Section */}
          <div className="p-4 border-t border-sidebar-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-8 h-8 bg-brand-primary rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <Circle className="absolute -bottom-0.5 -right-0.5 w-3 h-3 text-brand-primary fill-current" />
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary">{state.userName}</p>
                  <p className="text-xs text-brand-primary">Online</p>
                </div>
              </div>
              
              <button
                className="p-2 hover:bg-button-secondary-hover rounded-lg transition-colors duration-fast"
                aria-label="Settings"
              >
                <Settings className="w-4 h-4 text-text-secondary" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Sidebar Toggle Button */}
      <button
        onClick={toggleSidebar}
        className={`fixed top-1/2 -translate-y-1/2 z-50 p-2 bg-surface-elevated border border-input-border rounded-r-lg shadow-md hover:shadow-lg transition-all duration-sidebar ${
          state.sidebarCollapsed ? 'left-0' : 'left-80'
        }`}
        aria-label={state.sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        <ChevronLeft 
          className={`w-4 h-4 text-text-secondary transition-transform duration-sidebar ${
            state.sidebarCollapsed ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {/* Overlay for mobile */}
      {!state.sidebarCollapsed && (
        <div 
          className="fixed inset-0 bg-black/20 z-30 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};