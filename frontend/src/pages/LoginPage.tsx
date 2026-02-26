import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAuth } from '../context/AuthContext';
import LoginIllustration from '../components/LoginIllustration';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoggingIn } = useAuth();
  const [countryCode, setCountryCode] = useState('+57');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [error, setError] = useState('');

  const handleContinue = async () => {
    if (!phoneNumber.trim()) {
      setError('Please enter your phone number');
      return;
    }

    if (isLoginMode) {
      // In login mode, navigate to password page
      navigate({ to: '/password', search: { phone: countryCode + phoneNumber, mode: 'login' } });
    } else {
      // In registration mode, navigate to password page
      navigate({ to: '/password', search: { phone: countryCode + phoneNumber, mode: 'register' } });
    }
  };

  const handleRegister = () => {
    setIsLoginMode(false);
    setPassword('');
    setError('');
  };

  const handleBackToLogin = () => {
    setIsLoginMode(true);
    setPassword('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#3a3a3a] flex items-center justify-center p-4">
      <div className="w-[90%] max-w-[420px] bg-[#6b6b6b] rounded-[20px] p-6 shadow-2xl">
        {/* Header section */}
        <div className="text-center">
          <h1 className="text-[28px] font-semibold text-white leading-[1.2]">
            Welcome to Mi Daily
          </h1>
        </div>

        {/* Subtitle - 8px gap from title */}
        <div className="text-center mt-2">
          <p className="text-sm font-normal text-[#D1D1D1]">
            {isLoginMode ? 'Log in to your account' : 'Create your account'}
          </p>
        </div>

        {/* Illustration - 18px gap from subtitle, directly on card background */}
        <div className="flex justify-center mt-[18px] mb-5">
          <LoginIllustration />
        </div>

        {/* Form section - 20px gap from illustration */}
        <div className="flex flex-col">
          <div>
            <label className="text-sm font-medium text-[#E5E5E5] mb-2 block">
              My mobile number
            </label>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  const codes = ['+57', '+1', '+52', '+34'];
                  const currentIndex = codes.indexOf(countryCode);
                  const nextIndex = (currentIndex + 1) % codes.length;
                  setCountryCode(codes[nextIndex]);
                }}
                className="w-24 bg-[#e8e8e8] text-gray-800 border-none rounded-xl px-3 h-12 text-base font-semibold hover:bg-[#f0f0f0] transition-colors"
              >
                {countryCode}
              </button>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder=""
                className="flex-1 bg-[#e8e8e8] text-gray-800 placeholder-gray-500 border-none rounded-xl px-3 h-12 text-base focus:outline-none focus:ring-0 focus:bg-[#e8e8e8]"
              />
            </div>
          </div>

          {error && (
            <div className="text-red-400 text-sm text-center bg-red-900/20 p-3 rounded-lg mt-5">
              {error}
            </div>
          )}

          {/* Button - 20px gap from inputs */}
          <button
            onClick={handleContinue}
            disabled={isLoggingIn}
            className="w-full bg-[#F4E03D] hover:bg-[#e5d135] text-black font-semibold h-[50px] rounded-xl text-base transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-5"
          >
            {isLoggingIn ? 'Loading...' : 'Continue'}
          </button>

          {/* Links - 18px gap from button */}
          <div className="flex justify-center gap-4 text-sm mt-[18px]">
            {isLoginMode ? (
              <>
                <button
                  onClick={handleRegister}
                  className="text-[#D1D1D1] font-normal underline hover:text-[#F4E03D] transition-colors"
                >
                  Register
                </button>
                <span className="text-gray-400">-</span>
                <button className="text-[#D1D1D1] font-normal underline hover:text-[#F4E03D] transition-colors">
                  Contáctenos
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleBackToLogin}
                  className="text-[#D1D1D1] font-normal underline hover:text-[#F4E03D] transition-colors"
                >
                  Log in
                </button>
                <span className="text-gray-400">-</span>
                <button className="text-[#D1D1D1] font-normal underline hover:text-[#F4E03D] transition-colors">
                  Contáctenos
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
