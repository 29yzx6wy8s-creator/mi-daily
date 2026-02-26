import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useActor } from '../hooks/useActor';
import { RegistrationError } from '../backend';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoggingIn: boolean;
  isRegistering: boolean;
  error: string | null;
  phoneNumber: string | null;
  login: (phoneNumber: string, password: string) => Promise<void>;
  register: (phoneNumber: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'daily_auth_phone';
const PASSWORD_STORAGE_KEY = 'daily_auth_password';

export function AuthProvider({ children }: { children: ReactNode }) {
  const { actor, isFetching } = useActor();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Auto-login on mount if credentials exist
  useEffect(() => {
    const autoLogin = async () => {
      const savedPhone = localStorage.getItem(AUTH_STORAGE_KEY);
      const savedPassword = localStorage.getItem(PASSWORD_STORAGE_KEY);
      
      if (savedPhone && savedPassword && actor) {
        try {
          const result = await actor.login(savedPhone, savedPassword);
          
          if (result.__kind__ === 'ok') {
            setPhoneNumber(savedPhone);
            setIsAuthenticated(true);
          } else {
            // Clear invalid credentials
            localStorage.removeItem(AUTH_STORAGE_KEY);
            localStorage.removeItem(PASSWORD_STORAGE_KEY);
          }
        } catch (error) {
          console.error('Auto-login failed:', error);
          localStorage.removeItem(AUTH_STORAGE_KEY);
          localStorage.removeItem(PASSWORD_STORAGE_KEY);
        }
      }
      
      setIsInitializing(false);
    };

    if (actor && !isFetching) {
      autoLogin();
    } else if (!isFetching) {
      setIsInitializing(false);
    }
  }, [actor, isFetching]);

  const transformRegistrationError = (err: RegistrationError): string => {
    switch (err) {
      case RegistrationError.phoneNumberInUse:
        return 'Este número de teléfono ya está registrado';
      case RegistrationError.userNotRegistered:
        return 'Número de teléfono no registrado. Por favor regístrate primero.';
      case RegistrationError.incorrectPassword:
        return 'Contraseña incorrecta. Por favor intenta de nuevo.';
      case RegistrationError.userNotFound:
        return 'Usuario no encontrado. Por favor regístrate primero.';
      case RegistrationError.balanceOutOfRange:
        return 'Error en el balance. Por favor intenta de nuevo.';
      default:
        return 'Error desconocido. Por favor intenta de nuevo.';
    }
  };

  const login = async (phoneNumber: string, password: string) => {
    if (!actor) {
      throw new Error('Sistema no disponible. Por favor recarga la página.');
    }
    
    setIsLoggingIn(true);
    setError(null);
    
    try {
      // Verify credentials with the backend
      const loginResult = await actor.login(phoneNumber, password);
      
      if (loginResult.__kind__ === 'err') {
        const friendlyError = transformRegistrationError(loginResult.err);
        setError(friendlyError);
        throw new Error(friendlyError);
      }
      
      // Store credentials for session persistence
      localStorage.setItem(AUTH_STORAGE_KEY, phoneNumber);
      localStorage.setItem(PASSWORD_STORAGE_KEY, password);
      setPhoneNumber(phoneNumber);
      setIsAuthenticated(true);
      
      // Small delay to ensure state is fully updated
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error: any) {
      console.error('Login error:', error);
      
      // If it's already a friendly error message, re-throw it
      if (error.message && (
          error.message.includes('Contraseña incorrecta') || 
          error.message.includes('Número de teléfono') ||
          error.message.includes('Usuario no encontrado') ||
          error.message.includes('Este número de teléfono') ||
          error.message.includes('Sistema no disponible')
      )) {
        throw error;
      }
      
      // Otherwise, provide a generic error
      const friendlyError = 'Error al iniciar sesión. Por favor intenta de nuevo.';
      setError(friendlyError);
      throw new Error(friendlyError);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const register = async (phoneNumber: string, password: string) => {
    if (!actor) {
      throw new Error('Sistema no disponible. Por favor recarga la página.');
    }
    
    setIsRegistering(true);
    setError(null);
    
    try {
      // Register the user
      const registerResult = await actor.register(phoneNumber, password);
      
      if (registerResult.__kind__ === 'err') {
        const friendlyError = transformRegistrationError(registerResult.err);
        setError(friendlyError);
        throw new Error(friendlyError);
      }
      
      // After successful registration, automatically log in
      const loginResult = await actor.login(phoneNumber, password);
      
      if (loginResult.__kind__ === 'err') {
        const friendlyError = transformRegistrationError(loginResult.err);
        setError(friendlyError);
        throw new Error(friendlyError);
      }
      
      // Store credentials for session persistence
      localStorage.setItem(AUTH_STORAGE_KEY, phoneNumber);
      localStorage.setItem(PASSWORD_STORAGE_KEY, password);
      setPhoneNumber(phoneNumber);
      setIsAuthenticated(true);
      
      // Small delay to ensure state is fully updated
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error: any) {
      console.error('Registration error:', error);
      
      // If it's already a friendly error message, re-throw it
      if (error.message && (
          error.message.includes('Este número de teléfono') ||
          error.message.includes('Contraseña incorrecta') ||
          error.message.includes('Número de teléfono') ||
          error.message.includes('Usuario no encontrado') ||
          error.message.includes('Sistema no disponible')
      )) {
        throw error;
      }
      
      // Otherwise, provide a generic error
      const friendlyError = 'Error al registrarse. Por favor intenta de nuevo.';
      setError(friendlyError);
      throw new Error(friendlyError);
    } finally {
      setIsRegistering(false);
    }
  };

  const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(PASSWORD_STORAGE_KEY);
    setPhoneNumber(null);
    setIsAuthenticated(false);
    setError(null);
  };

  // Don't render children until initialization is complete
  if (isInitializing) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      isLoggingIn, 
      isRegistering, 
      error, 
      phoneNumber,
      login, 
      register, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
