import React, { useEffect, useState } from 'react';
import { useWindowSize } from 'react-use';
import ReactConfetti from 'react-confetti';
import { AnimatePresence } from 'framer-motion';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Toaster } from '@/components/ui/sonner';
import { CipherCard } from '@/components/CipherCard';
import { useCipherStore } from '@/hooks/useCipherStore';
import { useTheme } from '@/hooks/use-theme';
import { PrivacyPolicyDialog } from '@/components/PrivacyPolicyDialog';
import { Button } from '@/components/ui/button';
export function HomePage() {
  const { width, height } = useWindowSize();
  const isSuccess = useCipherStore((s) => s.isSuccess);
  const { isDark } = useTheme();
  const [showConfetti, setShowConfetti] = useState(false);
  const [isPolicyOpen, setIsPolicyOpen] = useState(false);
  useEffect(() => {
    if (isSuccess) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 5000); // Confetti lasts for 5 seconds
      return () => clearTimeout(timer);
    }
  }, [isSuccess]);
  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen w-full bg-background overflow-hidden p-4">
      <div
        className="absolute inset-0 z-0 opacity-50 dark:opacity-30 transition-opacity duration-500"
        style={{
          backgroundImage: 'radial-gradient(circle at 25% 30%, #A5B4FC 0%, transparent 40%), radial-gradient(circle at 75% 70%, #2563EB 0%, transparent 40%)'
        }} />
      <div className="absolute inset-0 z-10 bg-grid-slate-100/[0.05] dark:bg-grid-slate-700/[0.1] [mask-image:linear-gradient(to_bottom,white_0%,transparent_100%)]" />
      <ThemeToggle className="absolute top-4 right-4 z-30" />
      <div className="relative z-20 flex flex-col items-center justify-center w-full">
        <CipherCard />
      </div>
      <footer className="absolute bottom-6 text-center text-muted-foreground/80 text-sm z-20 flex flex-col sm:flex-row items-center gap-x-4 gap-y-2">
        <p>© {new Date().getFullYear()} encryptfile.online</p>
        <div className="hidden sm:block w-px h-4 bg-muted-foreground/50"></div>
        <Button variant="link" className="p-0 h-auto text-muted-foreground/80 hover:text-foreground" onClick={() => setIsPolicyOpen(true)}>
          Privacy Policy
        </Button>
      </footer>
      <AnimatePresence>
        {showConfetti && (
          <ReactConfetti
            width={width}
            height={height}
            recycle={false}
            numberOfPieces={400}
            gravity={0.1}
          />
        )}
      </AnimatePresence>
      <Toaster richColors closeButton theme={isDark ? 'dark' : 'light'} />
      <PrivacyPolicyDialog open={isPolicyOpen} onOpenChange={setIsPolicyOpen} />
    </main>
  );
}