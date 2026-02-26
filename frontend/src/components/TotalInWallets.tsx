import { useBalances } from '../hooks/useBalances';
import { useBalanceVisibility } from '../context/BalanceVisibilityContext';

const DLY_TO_USD = 0.000248;

function formatNumber(num: number): string {
  return num.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 3 }).replace(/,/g, '.');
}

function formatUSD(num: number): string {
  return num.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function TotalInWallets() {
  const { balances, isLoading } = useBalances();
  const { isVisible } = useBalanceVisibility();

  const totalDLY = balances ? balances.myDailys + balances.rewards + balances.available + balances.tit + balances.ben : 0;
  const totalUSD = totalDLY * DLY_TO_USD;

  return (
    <div className="bg-[#2a2a2a] rounded-2xl p-6 border-l-4 border-[#F4E500]">
      <div className="text-gray-400 text-sm mb-2">Total in Wallets</div>
      
      {isLoading ? (
        <div className="text-[#F4E500] text-3xl font-bold">Loading...</div>
      ) : (
        <>
          <div className="text-white text-3xl font-bold mb-1">
            {isVisible ? `ĐLY ${formatNumber(totalDLY)}` : '****'}
          </div>
          <div className="text-gray-400 text-sm mb-3">
            {isVisible ? `≈ $ ${formatUSD(totalUSD)} USD` : '****'}
          </div>
          <div className="text-gray-500 text-xs">1 Wallet</div>
        </>
      )}
    </div>
  );
}
