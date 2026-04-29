/**
 * Loklai Widget v5 - PT/EN + abandono inteligente
 */
document.addEventListener('DOMContentLoaded', function() {
  const PHONE = '5519988820402';
  const WORKER_URL = 'https://api.loklai.co';

  const chat = document.getElementById('lkChat');
  const btn = document.getElementById('lkBtn');
  const msgs = document.getElementById('lkMsgs');
  const input = document.getElementById('lkInput');
  const sendBtn = document.getElementById('lkSend');

  if (!btn || !chat || !input || !msgs) return;

  // Detecta idioma
  const isEN = location.pathname.startsWith('/en') || document.documentElement.lang?.toLowerCase().startsWith('en');

  const T = {
    pt: {
      hello: 'Olá! Qual seu nome completo?',
      askPhone: nome => `Prazer, ${nome}! Qual seu WhatsApp?`,
      askEmail: 'Perfeito. E seu melhor e-mail?',
      askNeed: 'O que você precisa automatizar hoje?',
      thanks: 'Obrigado! Vamos responder em minutos.',
      cta: 'Continuar no WhatsApp',
      phName: 'Seu nome completo',
      phPhone: '(19) 99999-9999',
      phEmail: 'seu@email.com',
      phNeed: 'Digite sua necessidade...'
    },
    en: {
      hello: 'Hi! What is your full name?',
      askPhone: nome => `Nice to meet you, ${nome}! What's your WhatsApp?`,
      askEmail: 'Great. And your best email?',
      askNeed: 'What do you need to automate today?',
      thanks: 'Thanks! We will reply in minutes.',
      cta: 'Continue on WhatsApp',
      phName: 'Your full name',
      phPhone: '+1 (555) 000-0000',
      phEmail: 'you@email.com',
      phNeed: 'Type your need...'
    }
  };
  const t = isEN ? T.en : T.pt;

  let step = 0;
  let nome = '';
  let telefone = '';
  let email = '';

  function bot(txt) {
    msgs.insertAdjacentHTML('beforeend', '<div class="lk-b lk-bot">' + txt + '</div>');
    msgs.scrollTop = msgs.scrollHeight;
  }
  function user(txt) {
    msgs.insertAdjacentHTML('beforeend', '<div class="lk-b lk-user">' + txt + '</div>');
    msgs.scrollTop = msgs.scrollHeight;
  }

  function enviaLead(dados) {
    fetch(WORKER_URL + '/lead', {
      method: 'POST',
      body: JSON.stringify(dados),
      keepalive: true
    }).catch(()=>{});
  }

  function registraAbandono() {
    const temNomeCompleto = nome.trim().includes(' ');
    const temContato = telefone.length > 7 || email.includes('@');
    
    if ((!temNomeCompleto && !temContato) || step >= 5 || !nome) return;

    const dados = {
      nome: nome,
      telefone: telefone,
      email: email,
      texto: 'ðŸš¨ ABANDONO widget etapa ' + step + ' (nÃ£o completou)',
      pagina: location.pathname,
      motivo: 'abandono',
      idioma: isEN ? 'en' : 'pt'
    };
    try {
      fetch(WORKER_URL + '/lead', {
        method: 'POST',
        body: JSON.stringify(dados),
        keepalive: true
      }).catch(()=>{});
      console.log('[Loklai] abandono enviado', dados);
    } catch(e){}
  }

  btn.addEventListener('click', function() {
    chat.classList.toggle('open');
    if (chat.classList.contains('open')) {
      setTimeout(()=>input.focus(), 150);
      if (step === 0) {
        msgs.innerHTML = '';
        input.placeholder = t.phName;
        bot(t.hello);
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
      nome = texto;
      bot(t.askPhone(nome.split(' ')[0]));
      input.placeholder = t.phPhone;
      step = 2;
    } else if (step === 2) {
      telefone = texto;
      bot(t.askEmail);
      input.placeholder = t.phEmail;
      input.type = 'email';
      step = 3;
    } else if (step === 3) {
      email = texto;
      bot(t.askNeed);
      input.placeholder = t.phNeed;
      input.type = 'text';
      step = 4;
    } else if (step === 4) {
      bot(t.thanks);
      const link = 'https://wa.me/' + PHONE + '?text=' + encodeURIComponent((isEN ? 'Hi, I am ' : 'Oi, sou ') + nome + '. ' + texto);
      msgs.insertAdjacentHTML('beforeend', '<div class="lk-cta"><a href="' + link + '" target="_blank" rel="noopener">' + t.cta + '</a></div>');
      msgs.scrollTop = msgs.scrollHeight;
      
      enviaLead({
        nome: nome,
        telefone: telefone,
        email: email,
        texto: texto,
        pagina: location.pathname,
        etapa: 4,
        idioma: isEN ? 'en' : 'pt',
        horario: new Date().toISOString()
      });
      step = 5;
    }
  }

  sendBtn.addEventListener('click', enviar);
  input.addEventListener('keydown', e => { if(e.key==='Enter' && !e.shiftKey){ e.preventDefault(); enviar(); }});

  document.addEventListener('visibilitychange', ()=>{ if(document.hidden) registraAbandono(); });
  window.addEventListener('pagehide', registraAbandono);
  window.addEventListener('beforeunload', registraAbandono);

  window.lkTeste = () => enviaLead({nome:'Teste',telefone:'',email:'',texto:'Teste v5',pagina:location.pathname});

  console.log('Loklai widget v5 ativo -', isEN ? 'EN' : 'PT');
});
