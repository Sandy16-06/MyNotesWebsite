import React, { useState } from 'react';
import { User, LogOut, Settings, ChevronDown } from 'lucide-react';

interface UserMenuProps {
  user: any;
  onSignOut: () => void;
}

export const UserMenu: React.FC<UserMenuProps> = ({ user, onSignOut }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  const handleSignOut = async () => {
    onSignOut();
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all hover-lift ripple"
        style={{
          background: 'rgba(0, 0, 0, 0.4)',
          color: 'white',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)'
        }}
      >
        <User size={18} />
        <span className="text-sm font-medium truncate max-w-32">
          {user.email}
        </span>
        <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div 
            className="absolute right-0 top-full mt-2 w-48 bg-white/20 backdrop-blur-lg border border-white/30 rounded-lg shadow-lg z-20"
            style={{ boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)' }}
          >
            <div className="p-3 border-b border-white/20">
              <p className="text-sm font-medium text-white truncate">
                {user.email}
              </p>
              <p className="text-xs text-white/60">
                Signed in
              </p>
            </div>
            
            <div className="p-2">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-2 px-3 py-2 text-left rounded-lg transition-all hover:bg-white/20 text-white/90 hover:text-white"
              >
                <LogOut size={16} />
                <span className="text-sm">Sign Out</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};