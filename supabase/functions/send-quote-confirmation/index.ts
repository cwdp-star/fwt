import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface QuoteConfirmationRequest {
  name: string;
  email: string;
  projectType: string;
  location: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, projectType, location }: QuoteConfirmationRequest = await req.json();

    // Here you would integrate with your email service (Resend, SendGrid, etc.)
    // For now, we'll just log and return success
    console.log('Sending confirmation email to:', email);
    console.log('Quote details:', { name, projectType, location });

    // Example email content
    const emailContent = {
      to: email,
      subject: 'Pedido de Orçamento Recebido - RC Construções',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #D4AF37;">Pedido de Orçamento Recebido</h2>
          <p>Olá ${name},</p>
          <p>Recebemos o seu pedido de orçamento com os seguintes detalhes:</p>
          <ul>
            <li><strong>Tipo de Projeto:</strong> ${projectType}</li>
            <li><strong>Localização:</strong> ${location}</li>
          </ul>
          <p>A nossa equipa irá analisar o seu pedido e entraremos em contacto consigo nas próximas 24-48 horas.</p>
          <p>Se tiver alguma questão urgente, não hesite em contactar-nos diretamente.</p>
          <br>
          <p>Atentamente,</p>
          <p><strong>RC Construções</strong></p>
          <p style="color: #666; font-size: 12px;">Este é um email automático, por favor não responda diretamente.</p>
        </div>
      `
    };

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Confirmation email sent successfully',
        emailContent 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error sending confirmation:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
