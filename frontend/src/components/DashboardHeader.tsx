import { Eye, EyeOff } from 'lucide-react';
import { useBalanceVisibility } from '../context/BalanceVisibilityContext';

export default function DashboardHeader() {
  const { isVisible, toggle } = useBalanceVisibility();

  return (
    <header className="bg-[#1a1a1a] px-4 py-4 flex items-center justify-between border-b border-gray-800">
      <div className="flex items-center gap-2">
        <img 
          src="/assets/A897D764-DFF5-480F-AAB2-0EBADDF712DF-2.png" 
          alt="Daily" 
          className="h-20 w-auto object-contain"
        />
      </div>
      
      <button
        onClick={toggle}
        className="p-2 hover:bg-gray-800 rounded-full transition-colors"
      >
        {isVisible ? (
          <Eye className="w-6 h-6 text-white" />
        ) : (
          <EyeOff className="w-6 h-6 text-white" />
        )}
      </button>
    </header>
  );
}
