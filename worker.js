export default {
  async fetch(request, env) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);

    if (url.pathname === "/test") {
      await sendZap("✅ Teste Loklai OK", env);
      return new Response(JSON.stringify({ok:true}), { 
        headers: {...corsHeaders, "content-type":"application/json"} 
      });
    }

    if (request.method === "POST" && url.pathname === "/lead") {
      const data = await request.json().catch(() => ({}));

      // 1) WhatsApp (como hoje)
      const msg = `💬 NOVO LEAD\n\n👤 ${data.nome||''}\n📱 ${data.telefone||''}\n📧 ${data.email||''}\n📝 ${data.texto||''}\n🌐 ${data.pagina||''}`;
      await sendZap(msg, env);

      // 2) NOVO: Google Sheets
      if (env.SHEETS_URL) {
        fetch(env.SHEETS_URL, {
          method: 'POST',
          body: JSON.stringify(data),
          headers: { 'Content-Type': 'application/json' }
        }).catch(()=>{}); // não trava se Sheets falhar
      }

      return new Response("ok", { headers: corsHeaders });
    }

    return new Response("ok", { headers: corsHeaders });
  }
}

async function sendZap(text, env) {
  const api = `https://api.callmebot.com/whatsapp.php?phone=${env.CALLMEBOT_PHONE}&text=${encodeURIComponent(text)}&apikey=${env.CALLMEBOT_APIKEY}`;
  await fetch(api);
}