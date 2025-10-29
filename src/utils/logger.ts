/**
 * Environment-aware logging utility
 * Only logs detailed errors in development mode
 */

export const logger = {
  error: (message: string, error?: any) => {
    if (import.meta.env.DEV) {
      console.error(message, error);
    }
    // In production, could send to error tracking service (Sentry, LogRocket, etc.)
  },
  
  info: (message: string, data?: any) => {
    if (import.meta.env.DEV) {
      console.info(message, data);
    }
  },
  
  warn: (message: string, data?: any) => {
    if (import.meta.env.DEV) {
      console.warn(message, data);
    }
  }
};
