import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  X, 
  Check, 
  AlertCircle, 
  Info, 
  MessageSquare,
  Upload,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Notification {
  id: string;
  type: 'quote_request' | 'media_upload' | 'system' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  data?: any;
}

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchNotifications();
    // Set up real-time subscription
    const channel = supabase
      .channel('quote_requests_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'quote_requests'
        },
        (payload) => {
          const newNotification: Notification = {
            id: `quote-${payload.new.id}`,
            type: 'quote_request',
            title: 'Nova Cotação Recebida',
            message: `${payload.new.name} solicitou cotação para ${payload.new.service}`,
            timestamp: new Date(),
            read: false,
            priority: 'high',
            data: payload.new
          };
          setNotifications(prev => [newNotification, ...prev]);
          
          // Show toast notification
          toast({
            title: "Nova Cotação!",
            description: `${payload.new.name} solicitou cotação para ${payload.new.service}`,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      
      // Fetch recent quote requests
      const { data: quotes, error: quotesError } = await supabase
        .from('quote_requests')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (quotesError) throw quotesError;

      // Convert to notifications
      const quoteNotifications: Notification[] = quotes?.map(quote => ({
        id: `quote-${quote.id}`,
        type: 'quote_request' as const,
        title: 'Cotação Recebida',
        message: `${quote.name} solicitou cotação para ${quote.service}`,
        timestamp: new Date(quote.created_at),
        read: false,
        priority: 'medium' as const,
        data: quote
      })) || [];

      // Add some system notifications
      const systemNotifications: Notification[] = [
        {
          id: 'welcome',
          type: 'system',
          title: 'Bem-vindo ao Painel Admin',
          message: 'Sistema de gestão de mídia e cotações atualizado com sucesso',
          timestamp: new Date(),
          read: false,
          priority: 'low'
        }
      ];

      setNotifications([...quoteNotifications, ...systemNotifications]);
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== notificationId)
    );
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'quote_request':
        return <MessageSquare className="h-4 w-4" />;
      case 'media_upload':
        return <Upload className="h-4 w-4" />;
      case 'system':
        return <Info className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) {
      return 'agora';
    } else if (diffInMinutes < 60) {
      return `há ${diffInMinutes}m`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `há ${hours}h`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `há ${days}d`;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const highPriorityCount = notifications.filter(n => !n.read && n.priority === 'high').length;

  return (
    <>
      {/* Notification Bell */}
      <div className="relative">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(true)}
          className="relative"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`absolute -top-1 -right-1 h-5 w-5 rounded-full text-xs font-medium flex items-center justify-center text-white ${
                highPriorityCount > 0 ? 'bg-red-500' : 'bg-primary'
              }`}
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </motion.div>
          )}
        </Button>
      </div>

      {/* Notification Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notificações
              </div>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-sm"
                >
                  Marcar todas como lidas
                </Button>
              )}
            </DialogTitle>
          </DialogHeader>
          
          <ScrollArea className="max-h-[60vh]">
            <AnimatePresence>
              {notifications.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Bell className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Nenhuma notificação</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {notifications.map((notification, index) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className={`p-3 transition-all duration-200 ${
                        notification.read 
                          ? 'bg-muted/30 opacity-70' 
                          : 'bg-card hover:shadow-md'
                      }`}>
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-full text-white ${getPriorityColor(notification.priority)}`}>
                            {getNotificationIcon(notification.type)}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="font-medium text-sm">{notification.title}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {formatRelativeTime(notification.timestamp)}
                                </p>
                              </div>
                              
                              <div className="flex items-center gap-1">
                                {!notification.read && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => markAsRead(notification.id)}
                                    className="h-6 w-6 p-0"
                                  >
                                    <Check className="h-3 w-3" />
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => deleteNotification(notification.id)}
                                  className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                            
                            {notification.priority === 'high' && !notification.read && (
                              <Badge variant="destructive" className="mt-2 text-xs">
                                Prioridade Alta
                              </Badge>
                            )}
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NotificationCenter;