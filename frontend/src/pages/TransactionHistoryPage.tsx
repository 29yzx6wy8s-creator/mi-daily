import { ArrowLeft, ArrowUpRight, ArrowDownLeft, RefreshCw } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { useTransactionHistory } from '../hooks/useTransactionHistory';
import { useAuth } from '../context/AuthContext';
import TransactionListItem from '../components/TransactionListItem';
import BottomNavigation from '../components/BottomNavigation';
import { Button } from '../components/ui/button';

export default function TransactionHistoryPage() {
  const navigate = useNavigate();
  const { phoneNumber } = useAuth();
  const { transactions, isLoading, error, refetch } = useTransactionHistory(phoneNumber!);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#3a3a3a] flex items-center justify-center">
        <div className="text-center">
          <div className="text-white text-xl mb-4">Cargando movimientos...</div>
          <div className="text-gray-400 text-sm">Obteniendo tu historial</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#3a3a3a] flex items-center justify-center p-4">
        <div className="bg-[#6b6b6b] rounded-3xl p-8 max-w-md w-full text-center">
          <div className="text-red-400 text-xl mb-4">Error al cargar movimientos</div>
          <div className="text-gray-300 text-sm mb-6">
            {error instanceof Error ? error.message : 'No se pudo cargar tu historial. Por favor intenta de nuevo.'}
          </div>
          <Button
            onClick={() => refetch()}
            className="w-full bg-[#F4E500] hover:bg-[#d4c500] text-black font-semibold py-3 rounded-xl mb-3"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reintentar
          </Button>
          <Button
            onClick={() => navigate({ to: '/dashboard' })}
            variant="outline"
            className="w-full border-gray-400 text-gray-300 hover:bg-gray-700"
          >
            Volver al inicio
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#3a3a3a] pb-24">
      {/* Header */}
      <div className="bg-[#2a2a2a] px-4 py-6 sticky top-0 z-10">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => navigate({ to: '/dashboard' })}
            className="text-white hover:text-[#F4E500] transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-semibold text-white">Movimientos</h1>
        </div>
        <p className="text-gray-400 text-sm">Historial de transferencias</p>
      </div>

      {/* Transaction List */}
      <div className="px-4 pt-4">
        {transactions && transactions.length > 0 ? (
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <TransactionListItem
                key={transaction.id.toString()}
                transaction={transaction}
                currentUserPhone={phoneNumber!}
              />
            ))}
          </div>
        ) : (
          <div className="bg-[#2a2a2a] rounded-2xl p-8 text-center mt-8">
            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <ArrowUpRight className="w-8 h-8 text-gray-500" />
            </div>
            <h3 className="text-white text-lg font-semibold mb-2">Sin movimientos</h3>
            <p className="text-gray-400 text-sm">
              Aún no has realizado ninguna transferencia
            </p>
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
}
