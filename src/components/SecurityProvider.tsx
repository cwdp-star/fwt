import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

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

    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mounted) return;

        if (error) {
          console.error('❌ Erro ao obter sessão:', error);
          setLoading(false);
          return;
        }

        setUser(session?.user ?? null);
        
        if (session?.user) {
          await checkAdminStatus(session.user.id);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('❌ Erro na inicialização da auth:', error);
        if (mounted) setLoading(false);
      }
    };

    // Initialize auth state
    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        setUser(session?.user ?? null);
        
        if (session?.user) {
          await checkAdminStatus(session.user.id);
        } else {
          setIsAdmin(false);
          setLoading(false);
        }
      }
    );

    // Cleanup timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      if (mounted) {
        console.log('⏰ Timeout de autenticação atingido');
        setLoading(false);
      }
    }, 8000);

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
        console.error('❌ Erro ao verificar status de admin:', error);
        setIsAdmin(false);
      } else {
        const isAdminUser = data?.role === 'admin';
        setIsAdmin(isAdminUser);
      }
    } catch (error) {
      console.error('❌ Erro geral:', error);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Sessão Terminada",
        description: "Sessão terminada com sucesso",
      });
    } catch (error) {
      console.error('Sign out error:', error);
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