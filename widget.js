<script>
    document.addEventListener('DOMContentLoaded', function() {
      const PHONE = '5519988820402';
      const WORKER_URL = 'https://https://api.loklai.com';

      const chat = document.getElementById('lkChat');
      const btn = document.getElementById('lkBtn');
      const msgs = document.getElementById('lkMsgs');
      const input = document.getElementById('lkInput');
      const sendBtn = document.getElementById('lkSend');

      if(!input){ console.error('Loklai: input não encontrado'); return; }

      let step = 0, nome = '', telefone = '', email = '', necessidade = '';

      function bot(t){ msgs.insertAdjacentHTML('beforeend','<div class="lk-b lk-bot">'+t+'</div>'); msgs.scrollTop=msgs.scrollHeight; }
      function user(t){ msgs.insertAdjacentHTML('beforeend','<div class="lk-b lk-user">'+t+'</div>'); msgs.scrollTop=msgs.scrollHeight; }

      function enviaLead(dados){
        fetch(WORKER_URL + '/lead', {
          method:'POST', 
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify(dados),
          keepalive:true
        }).catch(()=>{});
      }

      btn.addEventListener('click', function(){
        chat.classList.toggle('open');
        if(chat.classList.contains('open')){
          setTimeout(function(){ input.focus(); }, 100);
          if(step===0){ bot('Olá! 👋 Qual seu nome?'); step=1; }
        }
      });

      function enviar(){
        const texto = input.value.trim();
        if(!texto) return;
        input.value = '';
        user(texto);

        if(step===1){
          nome = texto.split(' ')[0];
          setTimeout(function(){ bot('Prazer, '+nome+'! Qual seu WhatsApp?'); input.placeholder='(19) 99999-9999'; }, 400);
          step = 2;
        }else if(step===2){
          telefone = texto;
          setTimeout(function(){ bot('Perfeito. E seu melhor e-mail?'); input.placeholder='seu@email.com'; }, 400);
          step = 3;
        }else if(step===3){
          email = texto;
          setTimeout(function(){ bot('O que você precisa automatizar hoje?'); input.placeholder='Digite...'; }, 400);
          step = 4;
        }else if(step===4){
          necessidade = texto;
          bot('Obrigado! Já avisei nossa equipe, vamos te responder em minutos.');
          const link = 'https://wa.me/'+PHONE+'?text='+encodeURIComponent('Oi, sou '+nome+' do site. '+necessidade);
          msgs.insertAdjacentHTML('beforeend','<div class="lk-cta"><a href="'+link+'" target="_blank" rel="noopener">Continuar no WhatsApp</a></div>');
          msgs.scrollTop = msgs.scrollHeight;
          
          // ENVIA PARA SEU WHATSAPP
          enviaLead({
            nome: nome,
            telefone: telefone,
            email: email,
            texto: necessidade,
            pagina: location.pathname,
            etapa: 4,
            horario: new Date().toISOString()
          });
          step = 5;
        }
      }

      sendBtn.addEventListener('click', enviar);
      input.addEventListener('keydown', function(e){
        if(e.key === 'Enter' &&!e.shiftKey){ e.preventDefault(); enviar(); }
      });

      // abandono
      document.addEventListener('visibilitychange', function(){ 
        if(document.hidden && nome && step<5) enviaLead({nome:nome, telefone:telefone, email:email, texto:'Saiu antes de terminar (etapa '+step+')', pagina:location.pathname, motivo:'abandono'}); 
      });

      window.lkTeste = function(){ enviaLead({nome:'Teste Rafael', telefone:'19988820402', email:'teste@loklai.com', texto:'Teste do widget completo'}); };

      console.log('Loklai widget v2 - nome/telefone/email ativo');
    });
    </script>