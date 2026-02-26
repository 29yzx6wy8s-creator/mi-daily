import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { RegistrationError } from '../backend';

export function useTransfer() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  const transformError = (err: RegistrationError): string => {
    switch (err) {
      case RegistrationError.userNotRegistered:
        return 'El destinatario no está registrado';
      case RegistrationError.userNotFound:
        return 'Usuario no encontrado';
      case RegistrationError.balanceOutOfRange:
        return 'Saldo insuficiente para realizar la transferencia';
      default:
        return 'Error al realizar la transferencia';
    }
  };

  const mutation = useMutation({
    mutationFn: async ({ fromUserId, toPhoneNumber, amount }: { fromUserId: string; toPhoneNumber: string; amount: number }) => {
      if (!actor) throw new Error('Actor no disponible');

      const result = await actor.transfer(fromUserId, toPhoneNumber, BigInt(amount));

      if (result.__kind__ === 'err') {
        throw new Error(transformError(result.err));
      }

      return result.ok;
    },
    onSuccess: () => {
      // Invalidate balances to refresh the UI
      queryClient.invalidateQueries({ queryKey: ['balances'] });
      // Invalidate transaction history
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    }
  });

  const transfer = async (fromUserId: string, toPhoneNumber: string, amount: number) => {
    return mutation.mutateAsync({ fromUserId, toPhoneNumber, amount });
  };

  return {
    transfer,
    isTransferring: mutation.isPending,
    error: mutation.error?.message || null
  };
}
