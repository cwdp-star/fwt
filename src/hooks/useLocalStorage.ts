import { useState, useEffect } from 'react';

/**
 * Hook para armazenar dados no localStorage com cache e expiração
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  ttl?: number // Time to live em minutos
) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (!item) return initialValue;

      const parsed = JSON.parse(item);
      
      // Verificar se há TTL e se ainda é válido
      if (ttl && parsed.timestamp) {
        const now = Date.now();
        const expirationTime = parsed.timestamp + (ttl * 60 * 1000);
        
        if (now > expirationTime) {
          window.localStorage.removeItem(key);
          return initialValue;
        }
        
        return parsed.data;
      }
      
      return parsed.data || parsed;
    } catch (error) {
      console.warn(`Erro ao ler localStorage para chave "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      const dataToStore = ttl ? {
        data: valueToStore,
        timestamp: Date.now()
      } : valueToStore;
      
      window.localStorage.setItem(key, JSON.stringify(dataToStore));
    } catch (error) {
      console.error(`Erro ao salvar no localStorage para chave "${key}":`, error);
    }
  };

  const removeValue = () => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Erro ao remover do localStorage para chave "${key}":`, error);
    }
  };

  // Listen for changes to localStorage from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          const parsed = JSON.parse(e.newValue);
          const data = ttl && parsed.timestamp ? parsed.data : parsed;
          setStoredValue(data);
        } catch (error) {
          console.error(`Erro ao processar mudança no localStorage para chave "${key}":`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, ttl]);

  return [storedValue, setValue, removeValue] as const;
}

/**
 * Hook para cache de dados com expiração automática
 */
export function useCache<T>(key: string, ttlMinutes: number = 30) {
  return useLocalStorage<T | null>(key, null, ttlMinutes);
}