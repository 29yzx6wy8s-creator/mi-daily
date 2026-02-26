import { useState } from 'react';
import { X, Send } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useTransfer } from '../hooks/useTransfer';
import { useAuth } from '../context/AuthContext';

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableBalance: number;
}

export default function TransferModal({ isOpen, onClose, availableBalance }: TransferModalProps) {
  const { phoneNumber } = useAuth();
  const { transfer, isTransferring, error: transferError } = useTransfer();
  const [recipientPhone, setRecipientPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Validate phone number format (Colombian format: +57 followed by 10 digits)
    const phoneRegex = /^\+57\d{10}$/;
    if (!phoneRegex.test(recipientPhone)) {
      setError('Formato de número inválido. Usa +57 seguido de 10 dígitos.');
      return;
    }

    // Validate amount
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setError('El monto debe ser mayor a 0');
      return;
    }

    if (amountNum > availableBalance) {
      setError('Saldo insuficiente');
      return;
    }

    // Check if trying to send to self
    if (recipientPhone === phoneNumber) {
      setError('No puedes enviarte DLY a ti mismo');
      return;
    }

    try {
      await transfer(phoneNumber!, recipientPhone, Math.floor(amountNum));
      setSuccess(true);
      setRecipientPhone('');
      setAmount('');
      
      // Close modal after 2 seconds
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Error al realizar la transferencia');
    }
  };

  const handleClose = () => {
    if (!isTransferring) {
      setRecipientPhone('');
      setAmount('');
      setError(null);
      setSuccess(false);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-[#2a2a2a] border-gray-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-white flex items-center gap-2">
            <Send className="w-6 h-6 text-[#F4E500]" />
            Enviar DLY
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Transfiere DLY a otro usuario usando su número de teléfono
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="py-8 text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">¡Transferencia exitosa!</h3>
            <p className="text-gray-400">Tu DLY ha sido enviado correctamente</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 pt-4">
            <div className="space-y-2">
              <Label htmlFor="recipientPhone" className="text-sm font-medium text-gray-300">
                Número de teléfono del destinatario
              </Label>
              <Input
                id="recipientPhone"
                type="tel"
                placeholder="+573001234567"
                value={recipientPhone}
                onChange={(e) => setRecipientPhone(e.target.value)}
                className="bg-[#3a3a3a] border-gray-600 text-white placeholder:text-gray-500 h-12"
                disabled={isTransferring}
                required
              />
              <p className="text-xs text-gray-500">Formato: +57 seguido de 10 dígitos</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount" className="text-sm font-medium text-gray-300">
                Monto (DLY)
              </Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-[#3a3a3a] border-gray-600 text-white placeholder:text-gray-500 h-12"
                disabled={isTransferring}
                required
              />
              <p className="text-xs text-gray-500">
                Disponible: {availableBalance.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 3 })} DLY
              </p>
            </div>

            {(error || transferError) && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3">
                <p className="text-red-400 text-sm">{error || transferError}</p>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isTransferring}
                className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isTransferring}
                className="flex-1 bg-[#F4E500] hover:bg-[#d4c500] text-black font-semibold"
              >
                {isTransferring ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Enviar
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
