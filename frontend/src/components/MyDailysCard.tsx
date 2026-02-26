import { useState } from 'react';
import { useBalances } from '../hooks/useBalances';
import { useBalanceVisibility } from '../context/BalanceVisibilityContext';
import BalanceEditModal from './BalanceEditModal';

function formatNumber(num: number): string {
  return num.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 3 }).replace(/,/g, '.');
}

export default function MyDailysCard() {
  const { balances, isLoading } = useBalances();
  const { isVisible } = useBalanceVisibility();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div 
        onClick={() => setIsModalOpen(true)}
        className="bg-[#2a2a2a] rounded-[24px] p-6 cursor-pointer hover:bg-[#333333] transition-colors"
      >
        <div className="flex items-start justify-between mb-6">
          <div className="text-gray-400 text-sm">My Dailys</div>
          <img 
            src="/assets/generated/coin-icon.dim_64x64.png" 
            alt="DLY" 
            className="w-8 h-8"
          />
        </div>

        {isLoading ? (
          <div className="text-[#F4E500] text-4xl font-bold">Loading...</div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="text-[#F4E500] text-4xl font-bold">
              {isVisible ? `Ð ${formatNumber(balances?.myDailys || 0)}` : '****'}
            </div>
            
            <div className="text-right space-y-2">
              <div className="text-gray-400 text-sm flex items-center gap-2 justify-end">
                <span className="text-[#F4E500]">Ð</span>
                <span>TIT {isVisible ? formatNumber(balances?.tit || 0) : '****'}</span>
              </div>
              <div className="text-gray-400 text-sm flex items-center gap-2 justify-end">
                <span className="text-[#F4E500]">Ð</span>
                <span>BEN {isVisible ? formatNumber(balances?.ben || 0) : '****'}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <BalanceEditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        balanceType="myDailys"
        currentValue={balances?.myDailys || 0}
      />
    </>
  );
}
