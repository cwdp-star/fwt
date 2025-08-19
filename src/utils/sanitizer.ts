/**
 * Security utilities for input sanitization and validation
 */

// HTML entities to prevent XSS
const HTML_ENTITIES: { [key: string]: string } = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
};

/**
 * Sanitize HTML content to prevent XSS attacks
 */
export const sanitizeHtml = (input: string): string => {
  if (!input || typeof input !== 'string') return '';
  
  return input.replace(/[&<>"'\/]/g, (char) => HTML_ENTITIES[char] || char);
};

/**
 * Sanitize text input by trimming and removing dangerous characters
 */
export const sanitizeText = (input: string): string => {
  if (!input || typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/[\x00-\x1f\x7f-\x9f]/g, '') // Remove control characters
    .replace(/<script[^>]*>.*?<\/script>/gi, '') // Remove script tags
    .substring(0, 1000); // Limit length
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};

/**
 * Validate phone number (Portuguese format)
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^(\+351\s?)?[29]\d{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Validate URL format
 */
export const isValidUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return ['http:', 'https:'].includes(urlObj.protocol);
  } catch {
    return false;
  }
};

/**
 * Rate limiting helper
 */
export const createRateLimiter = (maxRequests: number, windowMs: number) => {
  const requests: { [key: string]: number[] } = {};
  
  return (identifier: string): boolean => {
    const now = Date.now();
    const windowStart = now - windowMs;
    
    if (!requests[identifier]) {
      requests[identifier] = [];
    }
    
    // Remove old requests outside the window
    requests[identifier] = requests[identifier].filter(time => time > windowStart);
    
    if (requests[identifier].length >= maxRequests) {
      return false; // Rate limit exceeded
    }
    
    requests[identifier].push(now);
    return true; // Request allowed
  };
};

/**
 * Sanitize form data object
 */
export const sanitizeFormData = (data: Record<string, any>): Record<string, any> => {
  const sanitized: Record<string, any> = {};
  
  Object.keys(data).forEach(key => {
    const value = data[key];
    
    if (typeof value === 'string') {
      sanitized[key] = sanitizeText(value);
    } else if (typeof value === 'boolean' || typeof value === 'number') {
      sanitized[key] = value;
    } else {
      sanitized[key] = String(value || '').substring(0, 100);
    }
  });
  
  return sanitized;
};