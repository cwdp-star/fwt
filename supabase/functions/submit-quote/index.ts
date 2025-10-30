import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Validation functions
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};

const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^(\+351\s?)?[29]\d{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

const sanitizeText = (input: string): string => {
  if (!input || typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/[\x00-\x1f\x7f-\x9f]/g, '') // Remove control characters
    .replace(/<script[^>]*>.*?<\/script>/gi, '') // Remove script tags
    .substring(0, 1000); // Limit length
};

const sanitizeFormData = (data: Record<string, any>): Record<string, any> => {
  const sanitized: Record<string, any> = {};
  
  Object.keys(data).forEach(key => {
    const value = data[key];
    
    // Keep arrays (like attachments) as-is
    if (Array.isArray(value)) {
      sanitized[key] = value;
    } else if (typeof value === 'string') {
      sanitized[key] = sanitizeText(value);
    } else if (typeof value === 'boolean' || typeof value === 'number') {
      sanitized[key] = value;
    } else {
      sanitized[key] = String(value || '').substring(0, 100);
    }
  });
  
  return sanitized;
};

// Simple rate limiting - track submissions by email
const recentSubmissions = new Map<string, number>();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_SUBMISSIONS = 3;

const checkRateLimit = (email: string): boolean => {
  const now = Date.now();
  const key = email.toLowerCase();
  
  // Clean up old entries
  for (const [k, timestamp] of recentSubmissions.entries()) {
    if (now - timestamp > RATE_LIMIT_WINDOW) {
      recentSubmissions.delete(k);
    }
  }
  
  // Check submissions count
  const submissions = Array.from(recentSubmissions.entries())
    .filter(([k, timestamp]) => k === key && now - timestamp < RATE_LIMIT_WINDOW);
  
  if (submissions.length >= MAX_SUBMISSIONS) {
    return false;
  }
  
  recentSubmissions.set(key, now);
  return true;
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data = await req.json();
    
    // Server-side validation
    if (!data.name || !data.email || !data.phone) {
      return new Response(
        JSON.stringify({ error: 'Todos os campos obrigatórios devem ser preenchidos' }), 
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    if (!isValidEmail(data.email)) {
      return new Response(
        JSON.stringify({ error: 'Formato de email inválido' }), 
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    if (!isValidPhone(data.phone)) {
      return new Response(
        JSON.stringify({ error: 'Formato de telefone inválido. Use formato português (+351 ou 9XXXXXXXX)' }), 
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    if (!data.gdpr_consent) {
      return new Response(
        JSON.stringify({ error: 'É necessário consentir com o tratamento de dados' }), 
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Server-side rate limiting
    if (!checkRateLimit(data.email)) {
      return new Response(
        JSON.stringify({ error: 'Muitas tentativas. Por favor, aguarde um minuto antes de tentar novamente.' }), 
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Sanitize data
    const sanitized = sanitizeFormData(data);
    
    // Create Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    
    // Insert into database
    const { error: dbError } = await supabase
      .from('quote_requests')
      .insert({
        name: sanitized.name,
        email: sanitized.email,
        phone: sanitized.phone,
        service: sanitized.project_type,
        message: sanitized.message,
        status: 'new',
        notes: [
          sanitized.location ? `Localização: ${sanitized.location}` : null,
          sanitized.budget ? `Orçamento: ${sanitized.budget}` : null,
          sanitized.timeline ? `Prazo: ${sanitized.timeline}` : null,
          sanitized.documents_link ? `Documentos: ${sanitized.documents_link}` : null,
          sanitized.preferred_start_date ? `Data Início: ${sanitized.preferred_start_date}` : null,
        ].filter(Boolean).join('\n'),
        attachments: sanitized.attachments || []
      });
    
    if (dbError) {
      console.error('Database error:', dbError);
      return new Response(
        JSON.stringify({ error: 'Erro ao submeter pedido. Por favor, tente novamente.' }), 
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    return new Response(
      JSON.stringify({ success: true }), 
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error in submit-quote function:', error);
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor' }), 
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
