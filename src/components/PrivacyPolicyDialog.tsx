import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
interface PrivacyPolicyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
export function PrivacyPolicyDialog({ open, onOpenChange }: PrivacyPolicyDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Privacy Policy</DialogTitle>
          <DialogDescription>
            Last updated: October 26, 2025
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[400px] pr-6">
          <div className="space-y-4 text-sm text-muted-foreground">
            <p>
              Welcome to encryptfile.online. Your privacy is critically important to us. This Privacy Policy outlines our commitment to protecting your data and explains how we operate.
            </p>
            <h3 className="font-semibold text-foreground">1. Zero-Trust Architecture</h3>
            <p>
              encryptfile.online is built on a "zero-trust" or "client-side only" model. This means that all cryptographic operations—including file encryption and decryption—happen exclusively within your web browser on your own device.
            </p>
            <h3 className="font-semibold text-foreground">2. No Data Transmission or Storage</h3>
            <p>
              <strong>We never see, receive, or store your files, passphrases, or encryption keys.</strong> The files you select and the passphrases you enter are processed locally and are never uploaded to our servers or any third-party service. Once you close your browser tab, all session data is gone.
            </p>
            <h3 className="font-semibold text-foreground">3. Information We Do Not Collect</h3>
            <ul className="list-disc list-inside space-y-1 pl-4">
              <li>The content of your files.</li>
              <li>Your passphrases.</li>
              <li>Your derived encryption keys.</li>
              <li>Personal information such as your name, email address, or IP address.</li>
            </ul>
            <h3 className="font-semibold text-foreground">4. How Encryption Works</h3>
            <p>
              We use the standard WebCrypto API, a feature built into modern web browsers, to perform AES-256-GCM encryption. Your passphrase is used to derive a strong encryption key using the PBKDF2 algorithm, which is then used to secure your file. This entire process is self-contained and does not require any server interaction.
            </p>
            <h3 className="font-semibold text-foreground">5. Your Responsibility</h3>
            <p>
              Because we do not store your passphrase, we cannot help you recover it if you forget it. A forgotten passphrase means your encrypted file cannot be decrypted. It is your sole responsibility to remember and securely manage your passphrases.
            </p>
            <h3 className="font-semibold text-foreground">6. Changes to This Policy</h3>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
            </p>
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}