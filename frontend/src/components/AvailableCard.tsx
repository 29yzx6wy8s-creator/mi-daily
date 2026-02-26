import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { useBalances } from '../hooks/useBalances';
import { useBalanceVisibility } from '../context/BalanceVisibilityContext';
import BalanceEditModal from './BalanceEditModal';

const DLY_TO_USD = 0.000248;

function formatNumber(num: number): string {
  return num.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 3 }).replace(/,/g, '.');
}

function formatUSD(num: number): string {
  return num.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function AvailableCard() {
  const { balances, isLoading } = useBalances();
  const { isVisible } = useBalanceVisibility();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const availableUSD = (balances?.available || 0) * DLY_TO_USD;

  return (
    <>
      <div 
        onClick={() => setIsModalOpen(true)}
        className="bg-[#2a2a2a] rounded-[24px] p-6 cursor-pointer hover:bg-[#333333] transition-colors border-2 border-[#F4E500]/20"
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="text-gray-400 text-sm mb-3">Available</div>
            {isLoading ? (
              <div className="text-[#F4E500] text-3xl font-bold">Loading...</div>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <img 
                    src="/assets/generated/coin-icon.dim_64x64.png" 
                    alt="DLY" 
                    className="w-8 h-8"
                  />
                  <div className="flex items-baseline gap-2">
                    <span className="text-[#F4E500] text-3xl font-bold">
                      {isVisible ? formatNumber(balances?.available || 0) : '****'}
                    </span>
                    <span className="text-gray-400 text-sm">COP</span>
                  </div>
                </div>
                <div className="text-gray-400 text-sm ml-10">
                  {isVisible ? `≈ $ ${formatUSD(availableUSD)} USD` : '****'}
                </div>
              </>
            )}
          </div>
          <ChevronRight className="w-6 h-6 text-gray-400" />
        </div>
      </div>

      <BalanceEditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        balanceType="available"
        currentValue={balances?.available || 0}
      />
    </>
  );
}
