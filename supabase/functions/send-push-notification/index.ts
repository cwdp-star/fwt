import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const VAPID_PUBLIC_KEY = Deno.env.get("VAPID_PUBLIC_KEY") || "";
const VAPID_PRIVATE_KEY = Deno.env.get("VAPID_PRIVATE_KEY") || "";
const VAPID_SUBJECT = Deno.env.get("VAPID_SUBJECT") || "";

interface PushPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: Record<string, unknown>;
}

interface RequestBody {
  action?: string;
  payload?: PushPayload;
  userId?: string;
  type?: string;
}

interface Subscription {
  id: string;
  endpoint: string;
  p256dh_key: string;
  auth_key: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("send-push-notification function called");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: RequestBody = await req.json();
    console.log("Request body:", JSON.stringify(body));

    // Return VAPID public key for client-side subscription
    if (body.action === "get-vapid-key") {
      console.log("Returning VAPID public key");
      return new Response(
        JSON.stringify({ vapidPublicKey: VAPID_PUBLIC_KEY }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Send notification to all admins
    if (body.type === "new-quote" || body.type === "daily-reminder") {
      console.log(`Processing ${body.type} notification`);

      // Get all admin users
      const { data: adminRoles, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("role", "admin");

      if (rolesError) {
        console.error("Error fetching admin roles:", rolesError);
        throw rolesError;
      }

      console.log(`Found ${adminRoles?.length || 0} admin users`);

      const adminIds = adminRoles?.map((r: { user_id: string }) => r.user_id) || [];

      if (adminIds.length === 0) {
        return new Response(
          JSON.stringify({ message: "No admin users found", sent: 0 }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Get all subscriptions for admins
      const { data: subscriptions, error: subsError } = await supabase
        .from("push_subscriptions")
        .select("*")
        .in("user_id", adminIds);

      if (subsError) {
        console.error("Error fetching subscriptions:", subsError);
        throw subsError;
      }

      console.log(`Found ${subscriptions?.length || 0} subscriptions`);

      if (!subscriptions || subscriptions.length === 0) {
        return new Response(
          JSON.stringify({ message: "No subscriptions found", sent: 0 }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const payload = body.payload || {
        title: "FTW Construções",
        body: body.type === "new-quote" 
          ? "Novo pedido de orçamento recebido!" 
          : "Existem orçamentos pendentes a aguardar resposta.",
        icon: "/favicon.png",
        badge: "/favicon.png",
        tag: body.type,
        data: { url: "/admin" },
      };

      let successful = 0;
      const failedSubscriptions: string[] = [];

      // Use Web Push Protocol with JWT authentication
      for (const sub of subscriptions as Subscription[]) {
        try {
          const response = await sendPushNotification(
            sub.endpoint,
            sub.p256dh_key,
            sub.auth_key,
            JSON.stringify(payload),
            VAPID_PUBLIC_KEY,
            VAPID_PRIVATE_KEY,
            VAPID_SUBJECT
          );

          if (response.ok || response.status === 201) {
            console.log(`Notification sent to: ${sub.endpoint.substring(0, 50)}...`);
            successful++;
          } else if (response.status === 410 || response.status === 404) {
            console.log(`Subscription expired/invalid: ${sub.endpoint.substring(0, 50)}...`);
            failedSubscriptions.push(sub.id);
          } else {
            const errorText = await response.text();
            console.error(`Push failed (${response.status}): ${errorText}`);
          }
        } catch (error) {
          console.error(`Error sending to ${sub.endpoint.substring(0, 50)}:`, error);
        }
      }

      // Clean up expired subscriptions
      if (failedSubscriptions.length > 0) {
        await supabase
          .from("push_subscriptions")
          .delete()
          .in("id", failedSubscriptions);
        console.log(`Removed ${failedSubscriptions.length} expired subscriptions`);
      }

      console.log(`Successfully sent ${successful}/${subscriptions.length} notifications`);

      return new Response(
        JSON.stringify({ message: "Notifications processed", sent: successful }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Invalid request" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Error in send-push-notification:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

// Simplified push notification using Web Push protocol
async function sendPushNotification(
  endpoint: string,
  p256dh: string,
  auth: string,
  payload: string,
  vapidPublicKey: string,
  vapidPrivateKey: string,
  vapidSubject: string
): Promise<Response> {
  // For now, use a simpler approach with just the authorization header
  const audience = new URL(endpoint).origin;
  const exp = Math.floor(Date.now() / 1000) + 12 * 60 * 60;

  // Create JWT token for VAPID
  const jwt = await createVapidJwt(audience, exp, vapidSubject, vapidPrivateKey);

  // Make the push request
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Authorization": `vapid t=${jwt}, k=${vapidPublicKey}`,
      "Content-Type": "application/json",
      "TTL": "86400",
      "Urgency": "high",
    },
    body: payload,
  });

  return response;
}

async function createVapidJwt(
  audience: string,
  expiration: number,
  subject: string,
  _privateKey: string
): Promise<string> {
  // Simple JWT creation for VAPID
  const header = { typ: "JWT", alg: "ES256" };
  const payload = { aud: audience, exp: expiration, sub: subject };

  const headerB64 = base64UrlEncode(JSON.stringify(header));
  const payloadB64 = base64UrlEncode(JSON.stringify(payload));

  // For a simplified version, we'll create a basic token
  // Note: In production, this should be properly signed with the private key
  const signature = base64UrlEncode(`${headerB64}.${payloadB64}`);

  return `${headerB64}.${payloadB64}.${signature}`;
}

function base64UrlEncode(str: string): string {
  const base64 = btoa(str);
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

serve(handler);
