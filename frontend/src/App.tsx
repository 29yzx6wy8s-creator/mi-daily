import { RouterProvider, createRouter, createRoute, createRootRoute, redirect, Outlet } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import SplashScreen from './components/SplashScreen';
import LoginPage from './pages/LoginPage';
import PasswordPage from './pages/PasswordPage';
import DashboardPage from './pages/DashboardPage';
import TransactionHistoryPage from './pages/TransactionHistoryPage';
import { BalanceVisibilityProvider } from './context/BalanceVisibilityContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useActor } from './hooks/useActor';

function RootComponent() {
  const { isAuthenticated } = useAuth();
  const { actor, isFetching } = useActor();
  const isReady = !!actor && !isFetching;
  const queryClient = useQueryClient();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Invalidate router when authentication state changes
    router.invalidate();
    
    // Clear all queries when authentication state changes
    if (!isAuthenticated) {
      queryClient.clear();
    }
  }, [isAuthenticated, queryClient]);

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return <RouterProvider router={router} context={{ isAuthenticated, isReady }} />;
}

const rootRoute = createRootRoute({
  component: () => <Outlet />
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: ({ context }: any) => {
    if (context?.isAuthenticated && context?.isReady) {
      throw redirect({ to: '/dashboard' });
    }
  },
  component: LoginPage
});

const passwordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/password',
  component: PasswordPage
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  beforeLoad: ({ context }: any) => {
    if (!context?.isAuthenticated) {
      throw redirect({ to: '/' });
    }
    if (!context?.isReady) {
      throw redirect({ to: '/' });
    }
  },
  component: () => (
    <BalanceVisibilityProvider>
      <DashboardPage />
    </BalanceVisibilityProvider>
  )
});

const transactionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/transactions',
  beforeLoad: ({ context }: any) => {
    if (!context?.isAuthenticated) {
      throw redirect({ to: '/' });
    }
    if (!context?.isReady) {
      throw redirect({ to: '/' });
    }
  },
  component: TransactionHistoryPage
});

const routeTree = rootRoute.addChildren([indexRoute, passwordRoute, dashboardRoute, transactionsRoute]);

const router = createRouter({
  routeTree,
  context: { isAuthenticated: false, isReady: false },
  defaultPreload: 'intent'
});

export default function App() {
  return (
    <AuthProvider>
      <RootComponent />
    </AuthProvider>
  );
}
