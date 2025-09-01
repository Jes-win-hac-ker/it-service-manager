// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  const { email, type } = await req.json();

  // Get SendGrid credentials from environment variables
  const SENDGRID_API_KEY = Deno.env.get("SENDGRID_API_KEY");
  const SENDGRID_SENDER = Deno.env.get("SENDGRID_SENDER"); // your verified sender

  const subject = `Account ${type} Notification`;
  const text = `There was a ${type} activity involving your email.`;

  const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${SENDGRID_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email }] }],
      from: { email: SENDGRID_SENDER },
      subject,
      content: [{ type: "text/plain", value: text }],
    }),
  });

  if (response.ok) {
    return new Response("Email sent", { status: 200 });
  } else {
    return new Response("Error sending email", { status: 500 });
  }
});
})
  
  const { email, type } = await req.json();

  // Get SendGrid credentials from environment variables
  const SENDGRID_API_KEY = Deno.env.get("SENDGRID_API_KEY");
  const SENDGRID_SENDER = Deno.env.get("SENDGRID_SENDER"); // your verified sender

  const subject = `Account ${type} Notification`;
  const text = `There was a ${type} activity involving your email.`;

  const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${SENDGRID_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email }] }],
      from: { email: SENDGRID_SENDER },
      subject,
      content: [{ type: "text/plain", value: text }],
    }),
  });

  if (response.ok) {
    return new Response("Email sent", { status: 200 });
  } else {
    return new Response("Error sending email", { status: 500 });
  }
});
/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/send-email' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
