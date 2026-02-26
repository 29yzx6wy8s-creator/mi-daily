import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Transaction } from '../backend';

export function useTransactionHistory(userId: string) {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<Transaction[]>({
    queryKey: ['transactions', userId],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      
      const transactions = await actor.getTransactionHistory(userId);
      return transactions;
    },
    enabled: !!actor && !actorFetching && !!userId,
    retry: 2,
    retryDelay: 1000
  });

  return {
    transactions: query.data,
    isLoading: actorFetching || query.isLoading,
    error: query.error,
    refetch: query.refetch
  };
}
