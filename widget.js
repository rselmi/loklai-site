document.addEventListener('DOMContentLoaded', function() {
  const PHONE = '5519988820402';
  const WORKER_URL = 'https://api.loklai.com';

  const chat = document.getElementById('lkChat');
  const btn = document.getElementById('lkBtn');
  const msgs = document.getElementById('lkMsgs');
  const input = document.getElementById('lkInput');
  const sendBtn = document.getElementById('lkSend');

  if(!btn || !chat || !input){
    console.error('Loklai: widget elements nÃ£o encontrados');
    return;
  }

  let step = 0, nome = '', telefone = '', email = '';

  function bot(t){ 
    msgs.insertAdjacentHTML('beforeend','<div class="lk-b lk-bot">'+t+'</div>'); 
    msgs.scrollTop = msgs.scrollHeight; 
  }
  function user(t){ 
    msgs.insertAdjacentHTML('beforeend','<div class="lk-b lk-user">'+t+'</div>'); 
    msgs.scrollTop = msgs.scrollHeight; 
  }

  function enviaLead(dados){
    try {
      fetch(WORKER_URL + '/lead', {
        method:'POST',
        body: JSON.stringify(dados),
        keepalive: true
      }).catch(()=>{});
    } catch(e){}
  }

  function registraAbandono(){
    if(!nome || step>=5) return;
    const dados = {
      nome, telefone, email,
      texto: `ðŸš¨ ABANDONOU na etapa ${step}`,
      pagina: location.pathname,
      motivo: 'abandono'
    };
    try {
      const blob = new Blob([JSON.stringify(dados)], {type:'application/json'});
      navigator.sendBeacon(WORKER_URL + '/lead', blob);
    } catch(e){}
  }

  btn.addEventListener('click', function(){
    chat.classList.toggle('open');
    if(chat.classList.contains('open')){
      setTimeout(()=> input.focus(), 150);
      if(step===0){ 
        msgs.innerHTML = ''; // limpa
        bot('OlÃ¡! ðŸ‘‹ Qual seu nome?'); 
        step = 1; 
      }
    }
  });

  function enviar(){
    const texto = input.value.trim();
    if(!texto) return;
    input.value = '';
    user(texto);

    if(step===1){
      nome = texto.split(' ')[0];
      bot('Prazer, '+nome+'! Qual seu WhatsApp?');
      input.placeholder='(19) 99999-9999';
      step = 2;
    } else if(step===2){
      telefone = texto;
      bot('Perfeito. E seu melhor e-mail?');
      input.placeholder='seu@email.com';
      step = 3;
    } else if(step===3){
      email = texto;
      bot('O que vocÃª precisa automatizar hoje?');
      input.placeholder='Digite...';
      step = 4;
    } else if(step===4){
      bot('Obrigado! JÃ¡ avisei nossa equipe.');
      const link = 'https://wa.me/'+PHONE+'?text='+encodeURIComponent('Oi, sou '+nome+'. '+texto);
      msgs.insertAdjacentHTML('beforeend','<div class="lk-cta"><a href="'+link+'" target="_blank">Continuar no WhatsApp</a></div>');
      enviaLead({nome, telefone, email, texto, pagina:location.pathname, etapa:4});
      step = 5;
    }
  }

  sendBtn.addEventListener('click', enviar);
  input.addEventListener('keydown', e => { if(e.key==='Enter' && !e.shiftKey){ e.preventDefault(); enviar(); }});

  document.addEventListener('visibilitychange', ()=>{ if(document.hidden) registraAbandono(); });
  window.addEventListener('pagehide', registraAbandono);

  window.lkTeste = ()=> enviaLead({nome:'Teste', telefone:'19988820402', email:'teste@loklai.com', texto:'Teste widget', pagina:'/teste'});

  console.log('Loklai widget v3 ativo');
});
