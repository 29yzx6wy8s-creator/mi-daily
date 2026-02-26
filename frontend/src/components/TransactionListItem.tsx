import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { Transaction } from '../backend';

interface TransactionListItemProps {
  transaction: Transaction;
  currentUserPhone: string;
}

export default function TransactionListItem({ transaction, currentUserPhone }: TransactionListItemProps) {
  const isSent = transaction.fromUserId === currentUserPhone;
  const otherParty = isSent ? transaction.toUserId : transaction.fromUserId;
  const amount = Number(transaction.amount);

  // Format timestamp
  const date = new Date(Number(transaction.timestamp) / 1000000); // Convert nanoseconds to milliseconds
  const formattedDate = date.toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
  const formattedTime = date.toLocaleTimeString('es-CO', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="bg-[#2a2a2a] rounded-2xl p-4 flex items-center gap-4">
      {/* Icon */}
      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
        isSent ? 'bg-red-500/20' : 'bg-green-500/20'
      }`}>
        {isSent ? (
          <ArrowUpRight className="w-6 h-6 text-red-400" />
        ) : (
          <ArrowDownLeft className="w-6 h-6 text-green-400" />
        )}
      </div>

      {/* Transaction Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
            isSent 
              ? 'bg-red-500/20 text-red-400' 
              : 'bg-green-500/20 text-green-400'
          }`}>
            {isSent ? 'Enviado' : 'Recibido'}
          </span>
        </div>
        <p className="text-white text-sm font-medium truncate">
          {isSent ? 'Para: ' : 'De: '}{otherParty}
        </p>
        <p className="text-gray-400 text-xs">
          {formattedDate} • {formattedTime}
        </p>
      </div>

      {/* Amount */}
      <div className="text-right">
        <p className={`text-lg font-semibold ${
          isSent ? 'text-red-400' : 'text-green-400'
        }`}>
          {isSent ? '-' : '+'}{amount.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
        </p>
        <p className="text-gray-400 text-xs">DLY</p>
      </div>
    </div>
  );
}
