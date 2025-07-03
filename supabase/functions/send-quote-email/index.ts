
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface QuoteEmailRequest {
  name: string;
  email: string;
  phone: string;
  projectType: string;
  location: string;
  budget: string;
  timeline: string;
  description: string;
  documentsCount: number;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData: QuoteEmailRequest = await req.json();

    const emailResponse = await resend.emails.send({
      from: "Motivo Visionário <onboarding@resend.dev>",
      to: ["geral@motivovisionario.pt"],
      subject: `Novo Pedido de Orçamento - ${formData.projectType}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #ea580c, #dc2626); padding: 30px; border-radius: 10px; margin-bottom: 30px;">
            <h1 style="color: white; margin: 0; font-size: 24px; text-align: center;">
              Novo Pedido de Orçamento
            </h1>
          </div>
          
          <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #ea580c; margin-top: 0;">Informações do Cliente</h2>
            <p><strong>Nome:</strong> ${formData.name}</p>
            <p><strong>Email:</strong> ${formData.email}</p>
            <p><strong>Telefone:</strong> ${formData.phone}</p>
          </div>

          <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #ea580c; margin-top: 0;">Detalhes do Projeto</h2>
            <p><strong>Tipo de Projeto:</strong> ${formData.projectType}</p>
            <p><strong>Localização:</strong> ${formData.location}</p>
            <p><strong>Orçamento Previsto:</strong> ${formData.budget}</p>
            <p><strong>Prazo Desejado:</strong> ${formData.timeline}</p>
          </div>

          <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #ea580c; margin-top: 0;">Descrição do Projeto</h2>
            <p style="line-height: 1.6;">${formData.description}</p>
          </div>

          ${formData.documentsCount > 0 ? `
            <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
              <h2 style="color: #ea580c; margin-top: 0;">Documentos</h2>
              <p>O cliente anexou ${formData.documentsCount} documento(s). Os documentos foram enviados separadamente.</p>
            </div>
          ` : ''}

          <div style="background: #1f2937; padding: 20px; border-radius: 8px; text-align: center;">
            <p style="color: white; margin: 0;">
              <strong>Motivo Visionário - Ferro e Cofragem</strong><br>
              Telefone: +351 912 363 935<br>
              Email: geral@motivovisionario.pt
            </p>
          </div>
        </div>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending email:", error);
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
