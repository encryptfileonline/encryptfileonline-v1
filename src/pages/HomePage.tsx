import React, { useEffect, useState } from 'react';
import { useWindowSize } from 'react-use';
import ReactConfetti from 'react-confetti';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Toaster } from '@/components/ui/sonner';
import { CipherCard } from '@/components/CipherCard';
import { useCipherStore } from '@/hooks/useCipherStore';interface AnimatePresence {id?: string | number;
  [key: string]: unknown;
}interface AnimatePresenceProps {children?: React.ReactNode;className?: string;style?: React.CSSProperties;[key: string]: unknown;}export function HomePage() {const { width, height } = useWindowSize();
  const isSuccess = useCipherStore((s) => s.isSuccess);
  const [showConfetti, setShowConfetti] = useState(false);
  useEffect(() => {
    if (isSuccess) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess]);
  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen w-full bg-background overflow-hidden p-4">
      <div
        className="absolute inset-0 z-0 opacity-50 dark:opacity-30"
        style={{
          backgroundImage: 'radial-gradient(circle at 25% 30%, #A5B4FC 0%, transparent 40%), radial-gradient(circle at 75% 70%, #2563EB 0%, transparent 40%)'
        }} />

      <div className="absolute inset-0 z-10 bg-grid-slate-100/[0.05] dark:bg-grid-slate-700/[0.1] [mask-image:linear-gradient(to_bottom,white_0%,transparent_100%)]" />
      <ThemeToggle className="absolute top-4 right-4 z-30" />
      <div className="relative z-20 flex flex-col items-center justify-center w-full">
        <CipherCard />
      </div>
      <footer className="absolute bottom-6 text-center text-muted-foreground/80 text-sm z-20">
        <p>Built with ��️ at Cloudflare</p>
      </footer>
      <AnimatePresence>
        {showConfetti &&
        <ReactConfetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={400}
          gravity={0.1} />

        }
      </AnimatePresence>
      <Toaster richColors closeButton theme="light" />
    </main>);

}