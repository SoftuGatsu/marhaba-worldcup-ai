import React from 'react';
import { LinkCardPayload } from '@/types/api';
import { ExternalLink, Globe } from 'lucide-react';

interface LinkCardProps {
  payload: LinkCardPayload;
}

export const LinkCard: React.FC<LinkCardProps> = ({ payload }) => {
  return (
    <div className="chat-card">
      <a
        href={payload.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block bg-gradient-to-r from-white to-blue-50/50 rounded-xl p-5 border border-primary/20 hover:border-primary/40 transition-all duration-300 group hover:shadow-lg"
      >
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            {payload.favicon_url ? (
              <img
                src={payload.favicon_url}
                alt=""
                className="w-6 h-6 rounded"
              />
            ) : (
              <div className="w-6 h-6 bg-primary/20 rounded flex items-center justify-center">
                <Globe className="w-4 h-4 text-primary" />
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                {payload.title}
              </h3>
              <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 ml-2" />
            </div>
            
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {payload.description}
            </p>
            
            <div className="text-xs text-primary/70 mt-2 truncate">
              {new URL(payload.url).hostname}
            </div>
          </div>
        </div>
      </a>
    </div>
  );
};