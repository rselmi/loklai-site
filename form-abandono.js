/**
 * Loklai Form Abandono v2 - regra flexÃ­vel
 * Envia se: Nome + (Sobrenome OU WhatsApp OU Email)
 */
document.addEventListener('DOMContentLoaded', function() {
  const WORKER_URL = 'https://api.loklai.com';
  const form = document.querySelector('form.contact-form');
  if (!form) return;

  const get = n => form.querySelector('[name="'+n+'"]');
  const firstName = get('firstName');
  const lastName = get('lastName');
  const whatsapp = get('whatsapp');
  const email = get('email');
  const businessArea = get('businessArea');

  let enviado = sessionStorage.getItem('loklai_form_enviado') === '1';
  form.addEventListener('submit', ()=>{ enviado=true; sessionStorage.setItem('loklai_form_enviado','1'); });

  function dados(){
    return {
      nome: (firstName?.value||'').trim(),
      sobrenome: (lastName?.value||'').trim(),
      telefone: (whatsapp?.value||'').trim(),
      email: (email?.value||'').trim(),
      empresa: (businessArea?.value||'').trim()
    };
  }
  function podeEnviar(d){
    if(enviado) return false;
    if(d.nome.length < 2) return false;
    // regra nova: nome + pelo menos um contato
    return d.sobrenome.length>1 || d.telefone.length>7 || d.email.includes('@');
  }
  function envia(){
    const d = dados();
    if(!podeEnviar(d)) return;
    const payload = {
      nome: d.nome + (d.sobrenome ? ' '+d.sobrenome : ''),
      telefone: d.telefone,
      email: d.email,
      texto: 'ðŸš¨ FORMULÃRIO ABANDONADO' + (d.empresa ? ' | '+d.empresa : ''),
      pagina: location.pathname,
      motivo: 'form_abandono'
    };
    try{
      fetch(WORKER_URL+'/lead',{method:'POST',body:JSON.stringify(payload),keepalive:true}).catch(()=>{});
      sessionStorage.setItem('loklai_form_enviado','1');
      console.log('[Loklai] Form abandono enviado', payload);
    }catch(e){}
  }

  document.addEventListener('visibilitychange', ()=>{ if(document.hidden) envia(); });
  window.addEventListener('pagehide', envia);
  window.addEventListener('beforeunload', envia);
  console.log('Loklai form abandono v2 ativo');
});
