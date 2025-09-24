import { createContext, useContext, useEffect, useState } from 'react';
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

  // Add timeout to prevent infinite loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      console.log('⏰ Timeout de autenticação atingido, forçando loading = false');
      setLoading(false);
    }, 10000); // 10 second timeout

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    console.log('🔄 Iniciando verificação de autenticação...');
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('📋 Sessão inicial:', session ? 'Encontrada' : 'Não encontrada');
      setUser(session?.user ?? null);
      if (session?.user) {
        checkAdminStatus(session.user.id);
      } else {
        console.log('✅ Nenhum utilizador encontrado, definindo loading como false');
        setLoading(false);
      }
    }).catch((error) => {
      console.error('❌ Erro ao obter sessão inicial:', error);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Mudança de estado de auth:', event);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await checkAdminStatus(session.user.id);
        } else {
          setIsAdmin(false);
          console.log('✅ Utilizador desligado, definindo loading como false');
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminStatus = async (userId: string) => {
    console.log('🔍 Verificando status de admin para:', userId);
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .maybeSingle();

      if (error) {
        console.error('❌ Erro ao verificar status de admin:', error);
        setIsAdmin(false);
      } else {
        const isAdminUser = data?.role === 'admin';
        console.log('✅ Status de admin:', isAdminUser);
        setIsAdmin(isAdminUser);
      }
    } catch (error) {
      console.error('❌ Erro geral:', error);
      setIsAdmin(false);
    } finally {
      console.log('✅ Verificação de admin concluída, definindo loading como false');
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