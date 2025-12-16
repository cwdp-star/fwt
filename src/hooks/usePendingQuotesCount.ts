import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const usePendingQuotesCount = () => {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const { count: pendingCount, error } = await supabase
          .from('quote_requests')
          .select('*', { count: 'exact', head: true })
          .in('status', ['new', 'pending']);

        if (error) {
          console.error('Error fetching pending quotes count:', error);
          return;
        }

        setCount(pendingCount || 0);
      } catch (error) {
        console.error('Error fetching pending quotes count:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCount();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('quote-requests-count')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'quote_requests',
        },
        () => {
          fetchCount();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { count, loading };
};
