import { useState } from 'react';
import TransferModal from './TransferModal';
import { useBalances } from '../hooks/useBalances';

export default function FloatingActionButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { balances } = useBalances();

  return (
    <>
      <button 
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-24 right-6 w-32 h-32 bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 ease-out hover:scale-105 hover:shadow-[0_20px_60px_rgba(234,179,8,0.5)] active:scale-95 z-40"
      >
        <img 
          src="/assets/EDD5B96E-65C8-4396-B13D-60441938E0F3-1.png" 
          alt="Daily" 
          className="w-24 h-24 object-contain"
        />
      </button>

      <TransferModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        availableBalance={balances?.available || 0}
      />
    </>
  );
}
