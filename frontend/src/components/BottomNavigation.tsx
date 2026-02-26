import { Home, FileText, User } from 'lucide-react';
import { useNavigate, useRouterState } from '@tanstack/react-router';

export default function BottomNavigation() {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#1a1a1a] border-t border-gray-800 px-6 py-4 z-50">
      <div className="flex items-center justify-around max-w-md mx-auto">
        <button 
          onClick={() => navigate({ to: '/dashboard' })}
          className={`flex flex-col items-center gap-1 transition-colors ${
            currentPath === '/dashboard' ? 'text-[#F4E500]' : 'text-gray-400 hover:text-white'
          }`}
        >
          <Home className="w-6 h-6" />
          <span className="text-xs font-medium">Home</span>
        </button>
        
        <button 
          onClick={() => navigate({ to: '/transactions' })}
          className={`flex flex-col items-center gap-1 transition-colors ${
            currentPath === '/transactions' ? 'text-[#F4E500]' : 'text-gray-400 hover:text-white'
          }`}
        >
          <FileText className="w-6 h-6" />
          <span className="text-xs">Movements</span>
        </button>
        
        <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors">
          <User className="w-6 h-6" />
          <span className="text-xs">Profile</span>
        </button>
      </div>
    </nav>
  );
}
