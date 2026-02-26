import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useAuth } from '../context/AuthContext';
import { Balances } from '../backend';

export function useBalances() {
  const { actor, isFetching: actorFetching } = useActor();
  const isReady = !!actor && !actorFetching;
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery<Balances>({
    queryKey: ['balances'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      
      try {
        const result = await actor.getCallerBalances();
        
        if (result.__kind__ === 'err') {
          throw new Error(`Error al cargar balances: ${result.err}`);
        }
        
        return result.ok;
      } catch (error: any) {
        console.error('Balance fetch error:', error);
        
        // Transform backend errors into user-friendly messages
        if (error.message?.includes('Unauthorized') || 
            error.message?.includes('unauthorized')) {
          throw new Error('Sesión expirada. Por favor inicia sesión nuevamente.');
        }
        
        if (error.message?.includes('userNotFound')) {
          throw new Error('Usuario no encontrado. Por favor regístrate.');
        }
        
        throw error;
      }
    },
    enabled: !!actor && isReady && isAuthenticated,
    retry: (failureCount, error) => {
      // Don't retry on authentication errors
      if (error.message.includes('Sesión expirada') ||
          error.message.includes('Usuario no encontrado') ||
          error.message.includes('unauthorized') ||
          error.message.includes('userNotFound')) {
        return false;
      }
      return failureCount < 2;
    },
    retryDelay: 1000
  });

  const updateMutation = useMutation({
    mutationFn: async (balances: Balances) => {
      if (!actor) throw new Error('Actor not available');
      
      const result = await actor.updateCallerBalances(balances);
      
      if (result.__kind__ === 'err') {
        throw new Error(`Failed to update balances: ${result.err}`);
      }
      
      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['balances'] });
    }
  });

  const updateSingleBalance = async (field: keyof Balances, value: number) => {
    if (!query.data) throw new Error('No balances data available');
    
    const updatedBalances: Balances = {
      ...query.data,
      [field]: value
    };
    
    await updateMutation.mutateAsync(updatedBalances);
  };

  return {
    balances: query.data,
    isLoading: !isReady || query.isLoading,
    error: query.error,
    updateBalances: updateMutation.mutate,
    updateSingleBalance,
    isUpdating: updateMutation.isPending
  };
}
