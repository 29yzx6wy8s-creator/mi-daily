import { useState } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useAuth } from '../context/AuthContext';
import LoginIllustration from '../components/LoginIllustration';

export default function PasswordPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: '/password' }) as { phone?: string; mode?: string };
  const { register, login, isRegistering, isLoggingIn } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const isLoginMode = search.mode === 'login';
  const isProcessing = isRegistering || isLoggingIn;

  const handleSubmit = async () => {
    if (!password.trim()) {
      setError('Por favor ingresa una contraseña');
      return;
    }

    if (!search.phone) {
      setError('Número de teléfono no encontrado. Por favor vuelve al inicio.');
      return;
    }

    if (!isLoginMode) {
      if (password.length < 6) {
        setError('La contraseña debe tener al menos 6 caracteres');
        return;
      }

      if (password !== confirmPassword) {
        setError('Las contraseñas no coinciden');
        return;
      }
    }

    try {
      setError('');
      
      if (isLoginMode) {
        await login(search.phone, password);
      } else {
        await register(search.phone, password);
      }
      
      // Wait a brief moment for state to update, then navigate
      setTimeout(() => {
        navigate({ to: '/dashboard', replace: true });
      }, 150);
    } catch (err: any) {
      setError(err.message || `${isLoginMode ? 'Inicio de sesión' : 'Registro'} falló. Por favor intenta de nuevo.`);
    }
  };

  return (
    <div className="min-h-screen bg-[#3a3a3a] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#6b6b6b] rounded-3xl p-8 shadow-2xl">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-white mb-2">
            {isLoginMode ? 'Ingresa tu Contraseña' : 'Crea tu Contraseña'}
          </h1>
          <p className="text-gray-300 text-lg">
            {isLoginMode ? 'Ingresa tu contraseña para continuar' : 'Establece una contraseña segura para tu cuenta'}
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="w-full max-w-[280px] border-2 border-gray-500 rounded-2xl p-6 flex items-center justify-center bg-[#5a5a5a]">
            <LoginIllustration />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-white text-base mb-2 block">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#8a8a8a] text-white placeholder-gray-400 border-none rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#F4E500]"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isProcessing) {
                  handleSubmit();
                }
              }}
              disabled={isProcessing}
            />
          </div>

          {!isLoginMode && (
            <div>
              <label className="text-white text-base mb-2 block">Confirmar Contraseña</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#8a8a8a] text-white placeholder-gray-400 border-none rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#F4E500]"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !isProcessing) {
                    handleSubmit();
                  }
                }}
                disabled={isProcessing}
              />
            </div>
          )}

          {error && (
            <div className="text-red-400 text-sm text-center bg-red-900/20 p-3 rounded-lg border border-red-500/30">
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={isProcessing}
            className="w-full bg-[#F4E500] hover:bg-[#d4c500] text-black font-semibold py-4 rounded-xl text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (isLoginMode ? 'Iniciando sesión...' : 'Creando cuenta...') : (isLoginMode ? 'Iniciar Sesión' : 'Crear Cuenta')}
          </button>

          <div className="flex justify-center gap-4 text-sm pt-4">
            <button
              onClick={() => navigate({ to: '/' })}
              className="text-gray-300 underline hover:text-[#F4E500] transition-colors"
              disabled={isProcessing}
            >
              Volver al inicio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
