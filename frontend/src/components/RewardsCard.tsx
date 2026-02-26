import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { useBalances } from '../hooks/useBalances';
import { useBalanceVisibility } from '../context/BalanceVisibilityContext';
import BalanceEditModal from './BalanceEditModal';

function formatNumber(num: number): string {
  return num.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

export default function RewardsCard() {
  const { balances, isLoading } = useBalances();
  const { isVisible } = useBalanceVisibility();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div 
        onClick={() => setIsModalOpen(true)}
        className="bg-[#2a2a2a] rounded-[24px] p-6 cursor-pointer hover:bg-[#333333] transition-colors"
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="text-gray-400 text-sm mb-2">Rewards</div>
            {isLoading ? (
              <div className="text-white text-xl font-semibold">Loading...</div>
            ) : (
              <div className="text-white text-xl font-semibold flex items-center gap-2">
                <img 
                  src="/assets/generated/coin-icon.dim_64x64.png" 
                  alt="DLY" 
                  className="w-6 h-6"
                />
                <span>ĐLY {isVisible ? formatNumber(balances?.rewards || 0) : '****'}</span>
              </div>
            )}
          </div>
          <ChevronRight className="w-6 h-6 text-gray-400" />
        </div>
      </div>

      <BalanceEditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        balanceType="rewards"
        currentValue={balances?.rewards || 0}
      />
    </>
  );
}
