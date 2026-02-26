import { useEffect, useState } from 'react';
import { Button } from './ui/button';

interface SplashScreenProps {
  onComplete?: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    // Show fallback button after 4 seconds if user is still on splash
    const fallbackTimer = setTimeout(() => {
      console.log('SplashScreen: Showing fallback button');
      setShowFallback(true);
    }, 4000);

    return () => {
      clearTimeout(fallbackTimer);
    };
  }, []);

  const handleManualContinue = () => {
    console.log('SplashScreen: Manual continue clicked');
    if (onComplete) {
      onComplete();
    } else {
      // Fallback: Force navigation by reloading to root path
      window.location.href = '/';
    }
  };

  return (
    <div className="fixed inset-0 bg-[#1a1a1a] flex flex-col items-center justify-center overflow-hidden">
      <img 
        src="/assets/generated/splash-screen-optimized.dim_1080x1920.png" 
        alt="Mi Daily" 
        className="w-full h-full object-cover splash-animate"
      />
      
      {showFallback && (
        <div className="absolute bottom-20 left-0 right-0 flex justify-center px-6 z-10">
          <Button
            onClick={handleManualContinue}
            className="bg-[#FFD700] hover:bg-[#FFC700] text-black font-semibold px-8 py-6 rounded-full text-lg shadow-lg"
          >
            Continue
          </Button>
        </div>
      )}
    </div>
  );
}
