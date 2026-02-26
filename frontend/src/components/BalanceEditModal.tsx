import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useBalances } from '../hooks/useBalances';

interface BalanceEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  balanceType: 'myDailys' | 'rewards' | 'available';
  currentValue: number;
}

const BALANCE_LABELS = {
  myDailys: 'My Dailys',
  rewards: 'Rewards',
  available: 'Available'
};

export default function BalanceEditModal({ isOpen, onClose, balanceType, currentValue }: BalanceEditModalProps) {
  const { updateSingleBalance, isUpdating } = useBalances();
  const [value, setValue] = useState(currentValue.toString());
  const [error, setError] = useState('');

  useEffect(() => {
    setValue(currentValue.toString());
  }, [currentValue, isOpen]);

  const handleSave = async () => {
    const numValue = parseFloat(value);
    
    if (isNaN(numValue)) {
      setError('Please enter a valid number');
      return;
    }

    if (numValue < 0 || numValue > 999999999) {
      setError('Value must be between 0 and 999,999,999');
      return;
    }

    try {
      setError('');
      await updateSingleBalance(balanceType, numValue);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update balance');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#2a2a2a] text-white border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-xl">Edit {BALANCE_LABELS[balanceType]}</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <label className="text-sm text-gray-400 mb-2 block">DLY Amount</label>
          <Input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter amount"
            className="bg-white text-black border-none"
            step="0.001"
          />
          {error && (
            <div className="text-red-400 text-sm mt-2">{error}</div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button
            onClick={onClose}
            variant="outline"
            className="bg-gray-700 text-white border-gray-600 hover:bg-gray-600"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isUpdating}
            className="bg-[#F4E500] hover:bg-[#d4c500] text-black"
          >
            {isUpdating ? 'Saving...' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
