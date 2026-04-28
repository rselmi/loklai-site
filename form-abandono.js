/**
 * Loklai Form Abandono v1
 * Funciona em PT e EN - dispara sÃ³ com Nome + Sobrenome
 */
document.addEventListener('DOMContentLoaded', function() {
  const WORKER_URL = 'https://api.loklai.com';
  const form = document.querySelector('form.contact-form');
  
  if (!form) return;

  const get = name => form.querySelector('[name="'+name+'"]');
  const firstName = get('firstName');
  const lastName = get('lastName');
  const whatsapp = get('whatsapp');
  const email = get('email');
  const businessArea = get('businessArea');

  let enviado = sessionStorage.getItem('loklai_form_enviado') === '1';

  form.addEventListener('submit', function() {
    enviado = true;
    sessionStorage.setItem('loklai_form_enviado', '1');
  });

  function coletaDados() {
    return {
      nome: (firstName?.value || '').trim(),
      sobrenome: (lastName?.value || '').trim(),
      telefone: (whatsapp?.value || '').trim(),
      email: (email?.value || '').trim(),
      empresa: (businessArea?.value || '').trim()
    };
  }

  function podeEnviar(d) {
    // Regra: Nome + Sobrenome preenchidos
    return d.nome.length > 1 && d.sobrenome.length > 1 && !enviado;
  }

  function enviaAbandono() {
    const d = coletaDados();
    if (!podeEnviar(d)) return;

    const payload = {
      nome: d.nome + ' ' + d.sobrenome,
      telefone: d.telefone,
      email: d.email,
      texto: 'ðŸš¨ FORMULÃRIO ABANDONADO' + (d.empresa ? ' | ' + d.empresa : ''),
      pagina: location.pathname,
      motivo: 'form_abandono'
    };

    try {
      fetch(WORKER_URL + '/lead', {
        method: 'POST',
        body: JSON.stringify(payload),
        keepalive: true,
        mode: 'no-cors'
      }).catch(()=>{});
      console.log('[Loklai] Form abandono enviado', payload);
      // evita duplicar
      sessionStorage.setItem('loklai_form_enviado', '1');
    } catch(e){}
  }

  // dispara ao sair
  document.addEventListener('visibilitychange', () => { if(document.hidden) enviaAbandono(); });
  window.addEventListener('pagehide', enviaAbandono);
  window.addEventListener('beforeunload', enviaAbandono);

  console.log('Loklai form abandono ativo');
});
