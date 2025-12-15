import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/utils/logger';

interface SecurityContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  signOut: () => Promise<void>;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(SecurityContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a SecurityProvider');
  }
  return context;
};

interface SecurityProviderProps {
  children: React.ReactNode;
}

export const SecurityProvider = ({ children }: SecurityProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;

    const scheduleAdminCheck = (userId?: string) => {
      if (!mounted) return;

      if (!userId) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      setLoading(true);
      setTimeout(() => {
        if (mounted) checkAdminStatus(userId);
      }, 0);
    };

    // Listen for auth changes FIRST (avoid missing events)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;

      setUser(session?.user ?? null);
      scheduleAdminCheck(session?.user?.id);
    });

    // THEN check for existing session
    supabase.auth
      .getSession()
      .then(({ data: { session }, error }) => {
        if (!mounted) return;

        if (error) {
          logger.error('Erro ao obter sessão:', error);
          setLoading(false);
          return;
        }

        setUser(session?.user ?? null);
        scheduleAdminCheck(session?.user?.id);
      })
      .catch((error) => {
        logger.error('Erro na inicialização da auth:', error);
        if (mounted) setLoading(false);
      });

    // Cleanup timeout to prevent infinite loading (reduced to 3s for better UX)
    const timeout = setTimeout(() => {
      if (mounted) {
        logger.info('Timeout de autenticação atingido');
        setLoading(false);
      }
    }, 3000);

    return () => {
      mounted = false;
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  const checkAdminStatus = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        logger.error('Erro ao verificar status de admin:', error);
        setIsAdmin(false);
      } else {
        const isAdminUser = data?.role === 'admin';
        setIsAdmin(isAdminUser);
      }
    } catch (error) {
      logger.error('Erro geral:', error);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setUser(null);
      setIsAdmin(false);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast({
        title: "Sessão Terminada",
        description: "Sessão terminada com sucesso",
      });
    } catch (error) {
      logger.error('Sign out error:', error);
      toast({
        title: "Erro",
        description: "Erro ao terminar sessão",
        variant: "destructive",
      });
    }
  };

  const value = {
    user,
    isAdmin,
    loading,
    signOut,
  };

  return (
    <SecurityContext.Provider value={value}>
      {children}
    </SecurityContext.Provider>
  );
};