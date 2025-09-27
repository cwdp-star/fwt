import { useState, useCallback } from 'react';
import { useToast } from './use-toast';

interface UseRetryOptions {
  maxAttempts?: number;
  delay?: number;
  exponentialBackoff?: boolean;
  onError?: (error: Error, attempt: number) => void;
  onMaxAttemptsReached?: (error: Error) => void;
}

export function useRetry(options: UseRetryOptions = {}) {
  const {
    maxAttempts = 3,
    delay = 1000,
    exponentialBackoff = true,
    onError,
    onMaxAttemptsReached
  } = options;

  const [isRetrying, setIsRetrying] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const { toast } = useToast();

  const executeWithRetry = useCallback(async <T>(
    operation: () => Promise<T>,
    customOptions?: Partial<UseRetryOptions>
  ): Promise<T> => {
    const opts = { ...options, ...customOptions };
    const maxRetries = opts.maxAttempts || maxAttempts;
    let attempt = 0;

    const execute = async (): Promise<T> => {
      try {
        setAttemptCount(attempt);
        const result = await operation();
        setIsRetrying(false);
        setAttemptCount(0);
        return result;
      } catch (error) {
        attempt++;
        const err = error as Error;
        
        console.warn(`Tentativa ${attempt} falhou:`, err.message);
        onError?.(err, attempt);

        if (attempt >= maxRetries) {
          setIsRetrying(false);
          setAttemptCount(0);
          onMaxAttemptsReached?.(err);
          
          toast({
            title: "Erro",
            description: `Falha após ${maxRetries} tentativas. Verifique sua conexão.`,
            variant: "destructive",
          });
          
          throw err;
        }

        setIsRetrying(true);
        
        const waitTime = exponentialBackoff 
          ? delay * Math.pow(2, attempt - 1)
          : delay;

        await new Promise(resolve => setTimeout(resolve, waitTime));
        return execute();
      }
    };

    return execute();
  }, [maxAttempts, delay, exponentialBackoff, onError, onMaxAttemptsReached, toast]);

  const retry = useCallback(async <T>(
    operation: () => Promise<T>,
    customOptions?: Partial<UseRetryOptions>
  ) => {
    return executeWithRetry(operation, customOptions);
  }, [executeWithRetry]);

  return {
    retry,
    isRetrying,
    attemptCount,
    executeWithRetry
  };
}