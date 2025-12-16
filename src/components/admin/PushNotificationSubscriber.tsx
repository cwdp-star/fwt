import { Bell, BellOff, BellRing } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const PushNotificationSubscriber = () => {
  const { isSupported, isSubscribed, permission, loading, subscribe, unsubscribe } = usePushNotifications();

  if (!isSupported) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" disabled className="opacity-50">
              <BellOff className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Notificações push não suportadas neste browser</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  if (permission === 'denied') {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" disabled className="opacity-50">
              <BellOff className="h-5 w-5 text-destructive" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Notificações bloqueadas. Ative nas configurações do browser.</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={isSubscribed ? unsubscribe : subscribe}
            disabled={loading}
            className={isSubscribed ? 'text-primary' : 'text-muted-foreground'}
          >
            {isSubscribed ? (
              <BellRing className="h-5 w-5" />
            ) : (
              <Bell className="h-5 w-5" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isSubscribed ? 'Desativar notificações' : 'Ativar notificações push'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default PushNotificationSubscriber;
