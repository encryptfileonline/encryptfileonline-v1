import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { checkPassphraseStrength, PassphraseStrength } from '@/lib/utils';
import { cn } from '@/lib/utils';
interface PassphraseStrengthMeterProps {
  passphrase?: string;
}
const strengthColors = [
  'bg-red-500', // 0 - Too Short (but we show it as weak)
  'bg-red-500', // 1 - Weak
  'bg-yellow-500', // 2 - Medium
  'bg-blue-500', // 3 - Strong
  'bg-green-500', // 4 - Very Strong
];
export function PassphraseStrengthMeter({ passphrase = '' }: PassphraseStrengthMeterProps) {
  const strength = useMemo(() => checkPassphraseStrength(passphrase), [passphrase]);
  if (!passphrase) {
    return null;
  }
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.2 }}
        className="space-y-2 overflow-hidden"
      >
        <div className="flex gap-2 pt-1">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-1 flex-1 rounded-full bg-muted">
              <motion.div
                className={cn('h-1 rounded-full', strengthColors[strength.score])}
                initial={{ width: 0 }}
                animate={{ width: strength.score > index ? '100%' : '0%' }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              />
            </div>
          ))}
        </div>
        <p className={cn('text-xs font-medium', strength.score > 2 ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground')}>
          Strength: {strength.label}
        </p>
      </motion.div>
    </AnimatePresence>
  );
}