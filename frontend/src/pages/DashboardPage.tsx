import DashboardHeader from '../components/DashboardHeader';
import TotalInWallets from '../components/TotalInWallets';
import MyDailysCard from '../components/MyDailysCard';
import RewardsCard from '../components/RewardsCard';
import AvailableCard from '../components/AvailableCard';
import FloatingActionButton from '../components/FloatingActionButton';
import BottomNavigation from '../components/BottomNavigation';
import { useBalances } from '../hooks/useBalances';
import { useAuth } from '../context/AuthContext';
import { useActor } from '../hooks/useActor';
import { Button } from '../components/ui/button';

export default function DashboardPage() {
  const { actor, isFetching } = useActor();
  const isReady = !!actor && !isFetching;
  const { isAuthenticated } = useAuth();
  const { isLoading, error } = useBalances();
  const { logout } = useAuth();

  // Wait for both actor and authentication to be ready
  if (!isReady || !isAuthenticated || isLoading) {
    return (
      <div className="min-h-screen bg-[#3a3a3a] flex items-center justify-center">
        <div className="text-center">
          <div className="text-white text-xl mb-4">Cargando...</div>
          <div className="text-gray-400 text-sm">Obteniendo tus datos</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#3a3a3a] flex items-center justify-center p-4">
        <div className="bg-[#6b6b6b] rounded-3xl p-8 max-w-md w-full text-center">
          <div className="text-red-400 text-xl mb-4">Error al cargar datos</div>
          <div className="text-gray-300 text-sm mb-6">
            {error instanceof Error ? error.message : 'No se pudieron cargar tus datos. Por favor intenta de nuevo.'}
          </div>
          <Button
            onClick={() => window.location.reload()}
            className="w-full bg-[#F4E500] hover:bg-[#d4c500] text-black font-semibold py-3 rounded-xl mb-3"
          >
            Reintentar
          </Button>
          <Button
            onClick={logout}
            variant="outline"
            className="w-full border-gray-400 text-gray-300 hover:bg-gray-700"
          >
            Cerrar Sesión
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#3a3a3a] pb-20">
      <DashboardHeader />
      
      <div className="px-4 pt-4 space-y-4">
        <TotalInWallets />
        <MyDailysCard />
        <RewardsCard />
        <AvailableCard />
      </div>

      <FloatingActionButton />
      <BottomNavigation />
    </div>
  );
}
