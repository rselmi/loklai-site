/**
 * Loklai Widget v6 - PT/EN + abandono em todas etapas
 */
document.addEventListener('DOMContentLoaded', function() {
  const PHONE = '5519988820402';
  const WORKER_URL = 'https://api.loklai.com';

  const chat = document.getElementById('lkChat');
  const btn = document.getElementById('lkBtn');
  const msgs = document.getElementById('lkMsgs');
  const input = document.getElementById('lkInput');
  const sendBtn = document.getElementById('lkSend');
  if (!btn || !chat) return;

  const isEN = location.pathname.startsWith('/en') || document.documentElement.lang?.toLowerCase().startsWith('en');
  const T = {
    pt: { hello:'Olá! Qual seu nome completo?', askPhone:n=>`Prazer, ${n}! Qual seu WhatsApp?`, askEmail:'Perfeito. E seu melhor e-mail?', askNeed:'O que você precisa automatizar hoje?', thanks:'Obrigado! Responderemos em minutos.', cta:'Continuar no WhatsApp', phName:'Seu nome completo', phPhone:'(19) 99999-9999', phEmail:'seu@email.com', phNeed:'Digite sua necessidade...' },
    en: { hello:'Hi! What is your full name?', askPhone:n=>`Nice to meet you, ${n}! What's your WhatsApp?`, askEmail:'Great. And your best email?', askNeed:'What do you need to automate today?', thanks:'Thanks! We will reply in minutes.', cta:'Continue on WhatsApp', phName:'Your full name', phPhone:'+1 (555) 000-0000', phEmail:'you@email.com', phNeed:'Type your need...' }
  };
  const t = isEN ? T.en : T.pt;

  let step=0, nome='', telefone='', email='';

  const bot = txt => { msgs.insertAdjacentHTML('beforeend','<div class="lk-b lk-bot">'+txt+'</div>'); msgs.scrollTop=msgs.scrollHeight; };
  const user = txt => { msgs.insertAdjacentHTML('beforeend','<div class="lk-b lk-user">'+txt+'</div>'); msgs.scrollTop=msgs.scrollHeight; };

  function envia(d){ fetch(WORKER_URL+'/lead',{method:'POST',body:JSON.stringify(d),keepalive:true}).catch(()=>{}); }

  function registraAbandono(){
    if(!nome || step>=5) return;
    envia({nome,telefone,email,texto:'ABANDONO widget etapa '+step, pagina:location.pathname, motivo:'abandono', idioma:isEN?'en':'pt'});
  }

  btn.addEventListener('click',()=>{ chat.classList.toggle('open'); if(chat.classList.contains('open') && step===0){ msgs.innerHTML=''; input.placeholder=t.phName; bot(t.hello); step=1; setTimeout(()=>input.focus(),150);} });

  function enviar(){
    const txt=input.value.trim(); if(!txt) return; input.value=''; user(txt);
    if(step===1){ nome=txt; bot(t.askPhone(nome.split(' ')[0])); input.placeholder=t.phPhone; step=2; }
    else if(step===2){ telefone=txt; bot(t.askEmail); input.placeholder=t.phEmail; input.type='email'; step=3; }
    else if(step===3){ email=txt; bot(t.askNeed); input.placeholder=t.phNeed; input.type='text'; step=4; }
    else if(step===4){ bot(t.thanks); const link='https://wa.me/'+PHONE+'?text='+encodeURIComponent((isEN?'Hi, I am ':'Oi, sou ')+nome+'. '+txt); msgs.insertAdjacentHTML('beforeend','<div class="lk-cta"><a href="'+link+'" target="_blank">'+t.cta+'</a></div>'); envia({nome,telefone,email,texto:txt,pagina:location.pathname,etapa:4,idioma:isEN?'en':'pt',horario:new Date().toISOString()}); step=5; }
  }
  sendBtn.addEventListener('click',enviar);
  input.addEventListener('keydown',e=>{ if(e.key==='Enter'&&!e.shiftKey){ e.preventDefault(); enviar(); }});

  document.addEventListener('visibilitychange',()=>{ if(document.hidden) registraAbandono(); });
  window.addEventListener('pagehide',registraAbandono);
  window.addEventListener('beforeunload',registraAbandono);
  console.log('Loklai widget v6 ativo -', isEN?'EN':'PT');
});
