/**
 * Loklai Widget v4 - Final
 * Funciona em PT e EN
 * Envia lead completo e abandono
 */
document.addEventListener('DOMContentLoaded', function() {
  const PHONE = '5519988820402';
  const WORKER_URL = 'https://api.loklai.com';

  const chat = document.getElementById('lkChat');
  const btn = document.getElementById('lkBtn');
  const msgs = document.getElementById('lkMsgs');
  const input = document.getElementById('lkInput');
  const sendBtn = document.getElementById('lkSend');

  if (!btn || !chat || !input || !msgs) {
    console.error('Loklai: elementos do widget nÃ£o encontrados');
    return;
  }

  let step = 0;
  let nome = '';
  let telefone = '';
  let email = '';

  function bot(t) {
    msgs.insertAdjacentHTML('beforeend', '<div class="lk-b lk-bot">' + t + '</div>');
    msgs.scrollTop = msgs.scrollHeight;
  }

  function user(t) {
    msgs.insertAdjacentHTML('beforeend', '<div class="lk-b lk-user">' + t + '</div>');
    msgs.scrollTop = msgs.scrollHeight;
  }

  function enviaLead(dados) {
    try {
      fetch(WORKER_URL + '/lead', {
        method: 'POST',
        body: JSON.stringify(dados),
        keepalive: true
      }).catch(() => {});
    } catch (e) {}
  }

  function registraAbandono() {
    if (!nome || step >= 5) return;
    const dados = {
      nome: nome,
      telefone: telefone,
      email: email,
      texto: 'ðŸš¨ ABANDONO etapa ' + step + ' (não completou)',
      pagina: location.pathname,
      motivo: 'abandono'
    };
    try {
      // no-cors + keepalive = funciona ao fechar aba
      fetch(WORKER_URL + '/lead', {
        method: 'POST',
        body: JSON.stringify(dados),
        keepalive: true,
        mode: 'no-cors'
      }).catch(() => {});
      console.log('[Loklai] abandono enviado', dados);
    } catch (e) {}
  }

  btn.addEventListener('click', function() {
    chat.classList.toggle('open');
    if (chat.classList.contains('open')) {
      setTimeout(function() { input.focus(); }, 150);
      if (step === 0) {
        msgs.innerHTML = '';
        bot('Olá! ðŸ‘‹ Qual seu nome?');
        step = 1;
      }
    }
  });

  function enviar() {
    const texto = input.value.trim();
    if (!texto) return;
    input.value = '';
    user(texto);

    if (step === 1) {
      nome = texto.split(' ')[0];
      bot('Prazer, ' + nome + '! Qual seu WhatsApp?');
      input.placeholder = '(19) 99999-9999';
      step = 2;
    } else if (step === 2) {
      telefone = texto;
      bot('Perfeito. E seu melhor e-mail?');
      input.placeholder = 'seu@email.com';
      step = 3;
    } else if (step === 3) {
      email = texto;
      bot('Em que posso ajudar?');
      input.placeholder = 'Digite...';
      step = 4;
    } else if (step === 4) {
      bot('Obrigado! Responderemos em breve.');
      const link = 'https://wa.me/' + PHONE + '?text=' + encodeURIComponent('Oi, sou ' + nome + ' do site. ' + texto);
      msgs.insertAdjacentHTML('beforeend', '<div class="lk-cta"><a href="' + link + '" target="_blank" rel="noopener">Continuar no WhatsApp</a></div>');
      msgs.scrollTop = msgs.scrollHeight;
      
      enviaLead({
        nome: nome,
        telefone: telefone,
        email: email,
        texto: texto,
        pagina: location.pathname,
        etapa: 4,
        horario: new Date().toISOString()
      });
      step = 5;
    }
  }

  sendBtn.addEventListener('click', enviar);
  input.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      enviar();
    }
  });

  // Abandono em 3 eventos
  document.addEventListener('visibilitychange', function() {
    if (document.hidden) registraAbandono();
  });
  window.addEventListener('pagehide', registraAbandono);
  window.addEventListener('beforeunload', registraAbandono);

  // Teste no console
  window.lkTeste = function() {
    enviaLead({
      nome: 'Teste Rafael',
      telefone: '19988820402',
      email: 'teste@loklai.com',
      texto: 'Teste do widget final',
      pagina: location.pathname
    });
    console.log('Teste enviado');
  };

  console.log('Loklai widget v4 ativo');
});
