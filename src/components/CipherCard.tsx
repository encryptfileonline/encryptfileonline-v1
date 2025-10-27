import React, { useCallback, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import { AnimatePresence, motion } from 'framer-motion';
import { Lock, Unlock, File, UploadCloud, X, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useCipherStore } from '@/hooks/useCipherStore';
import { encryptFile, decryptFile } from '@/lib/crypto';
import { cn } from '@/lib/utils';
export function CipherCard() {
  const mode = useCipherStore(s => s.mode);
  const setMode = useCipherStore(s => s.setMode);
  const file = useCipherStore(s => s.file);
  const setFile = useCipherStore(s => s.setFile);
  const passphrase = useCipherStore(s => s.passphrase);
  const setPassphrase = useCipherStore(s => s.setPassphrase);
  const isLoading = useCipherStore(s => s.isLoading);
  const progress = useCipherStore(s => s.progress);
  const error = useCipherStore(s => s.error);
  const startProcessing = useCipherStore(s => s.startProcessing);
  const setProgress = useCipherStore(s => s.setProgress);
  const setSuccess = useCipherStore(s => s.setSuccess);
  const setError = useCipherStore(s => s.setError);
  const reset = useCipherStore(s => s.reset);
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      if (mode === 'decrypt' && !selectedFile.name.endsWith('.enc')) {
        toast.error('Invalid File', { description: 'Please select a .enc file for decryption.' });
        return;
      }
      setFile(selectedFile);
    }
  }, [mode, setFile]);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    multiple: false,
  });
  const handleProcessFile = async () => {
    if (!file || !passphrase) {
      toast.error('Missing Information', { description: 'Please select a file and enter a passphrase.' });
      return;
    }
    startProcessing();
    try {
      let resultBlob: Blob;
      let successMessage: string;
      let downloadFileName: string;
      if (mode === 'encrypt') {
        resultBlob = await encryptFile(file, passphrase, setProgress);
        successMessage = 'File encrypted successfully!';
        downloadFileName = `${file.name}.enc`;
      } else {
        const originalFileName = file.name.replace(/\.enc$/, '');
        resultBlob = await decryptFile(file, passphrase, setProgress);
        successMessage = 'File decrypted successfully!';
        downloadFileName = originalFileName;
      }
      const url = URL.createObjectURL(resultBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = downloadFileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setSuccess(successMessage);
      toast.success(successMessage, { description: `Your file ${downloadFileName} has been downloaded.` });
      setTimeout(() => {
        reset();
      }, 3000);
    } catch (e) {
      console.error("File processing error:", e);
      const errorMessage = (mode === 'decrypt')
        ? 'Decryption failed. Please check your passphrase and ensure it is the correct file.'
        : 'An unexpected error occurred during encryption.';
      setError(errorMessage);
      toast.error('Operation Failed', { description: errorMessage });
    }
  };
  const actionText = useMemo(() => (mode === 'encrypt' ? 'Encrypt' : 'Decrypt'), [mode]);
  const isButtonDisabled = isLoading || !file || !passphrase;
  const renderFileDisplay = () => (
    <div className="relative flex items-center justify-between p-3 mt-4 border rounded-lg bg-muted/50">
      <div className="flex items-center gap-3">
        <File className="w-5 h-5 text-muted-foreground" />
        <span className="text-sm font-medium truncate">{file?.name}</span>
      </div>
      <Button variant="ghost" size="icon" className="w-6 h-6" onClick={() => setFile(null)}>
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
  const renderDropzone = () => (
    <div
      {...getRootProps()}
      className={cn(
        'flex flex-col items-center justify-center p-8 mt-4 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300',
        isDragActive ? 'border-solid border-cipher-blue bg-cipher-blue/10' : 'border-border hover:border-cipher-blue/50'
      )}
    >
      <input {...getInputProps()} />
      <motion.div
        animate={{ scale: isDragActive ? 1.1 : 1 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <UploadCloud className={cn('w-12 h-12 mb-4 transition-colors', isDragActive ? 'text-cipher-blue' : 'text-muted-foreground')} />
      </motion.div>
      <p className="text-center text-muted-foreground">
        {isDragActive ? 'Drop the file here...' : `Drag & drop a file here, or click to select`}
      </p>
    </div>
  );
  return (
    <Card className="w-full max-w-lg shadow-2xl shadow-black/10 animate-scale-in backdrop-blur-sm bg-card/80">
      <Tabs value={mode} onValueChange={(value) => setMode(value as 'encrypt' | 'decrypt')} className="w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-gradient-to-br from-cipher-blue to-cipher-lavender">
              <Lock className="w-6 h-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold">encryptfile.online</CardTitle>
          <CardDescription>Secure, client-side file encryption</CardDescription>
          <TabsList className="grid w-full grid-cols-2 mx-auto mt-6 max-w-xs">
            <TabsTrigger value="encrypt"><Lock className="w-4 h-4 mr-2" />Encrypt</TabsTrigger>
            <TabsTrigger value="decrypt"><Unlock className="w-4 h-4 mr-2" />Decrypt</TabsTrigger>
          </TabsList>
        </CardHeader>
        <TabsContent value={mode} className="p-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <CardContent className="space-y-4">
                {file ? renderFileDisplay() : renderDropzone()}
                <div className="space-y-2">
                  <label htmlFor="passphrase" className="text-sm font-medium">Passphrase</label>
                  <Input
                    id="passphrase"
                    type="password"
                    placeholder="Use a unique passphrase..."
                    value={passphrase}
                    onChange={(e) => setPassphrase(e.target.value)}
                    disabled={isLoading}
                  />
                  <p className="text-xs text-muted-foreground">E.g., "moonlight over the calm sea"</p>
                </div>
                {isLoading && (
                  <div className="space-y-2">
                    <Progress value={progress} className="w-full" />
                    <p className="text-sm text-center text-muted-foreground">Processing... this may take a moment.</p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button
                  size="lg"
                  className="w-full font-semibold text-base bg-cipher-blue hover:bg-cipher-blue/90 hover:shadow-glow transition-all duration-300 active:scale-95"
                  onClick={handleProcessFile}
                  disabled={isButtonDisabled}
                >
                  {isLoading ? 'Processing...' : (
                    <>
                      {mode === 'encrypt' ? <Lock className="w-4 h-4 mr-2" /> : <Unlock className="w-4 h-4 mr-2" />}
                      {actionText} File
                    </>
                  )}
                </Button>
                <div className="flex items-center text-xs text-muted-foreground">
                  <ShieldCheck className="w-4 h-4 mr-2 text-green-500" />
                  <span>Your files never leave your browser. All encryption happens locally.</span>
                </div>
              </CardFooter>
            </motion.div>
          </AnimatePresence>
        </TabsContent>
      </Tabs>
    </Card>
  );
}