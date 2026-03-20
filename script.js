/**
 * LOKL AI - Scripts de Interface e Formulário
 * Foco: Performance e Experiência do Usuário (UX)
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. ANIMAÇÃO AO SCROLL (REVEAL)
    // Faz com que os elementos com a classe .reveal apareçam ao rolar a página
    const revealElements = document.querySelectorAll('.reveal');

    const revealOnScroll = () => {
        for (let i = 0; i < revealElements.length; i++) {
            const windowHeight = window.innerHeight;
            const elementTop = revealElements[i].getBoundingClientRect().top;
            const elementVisible = 150;

            if (elementTop < windowHeight - elementVisible) {
                revealElements[i].classList.add('active');
            }
        }
    };

    // Executa ao carregar e ao rolar
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();

    // 2. INTERCEPTAÇÃO DO FORMULÁRIO (FORMSPREE + AJAX)
    // Garante que o profissional autônomo não saia do site ao enviar os dados
    const contactForm = document.querySelector('.contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Impede o redirecionamento padrão do navegador
            
            const btn = contactForm.querySelector('button');
            const originalBtnText = btn.textContent;
            
            // Estado de carregamento
            btn.textContent = "Enviando...";
            btn.disabled = true;

            const formData = new FormData(contactForm);

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    // Feedback de Sucesso: Substitui o conteúdo do formulário por uma mensagem amigável
                    contactForm.innerHTML = `
                        <div style="text-align:center; padding: 2rem; animation: fadeIn 0.5s ease-out forwards;">
                            <div style="font-size: 3rem; margin-bottom: 1rem;">✅</div>
                            <h3 style="color: var(--accent); margin-bottom: 1rem; font-size: 1.8rem;">Solicitação Recebida!</h3>
                            <p style="color: var(--text-muted); line-height: 1.6;">
                                Obrigado, Rafael. Já recebemos seus dados e entraremos em contato via WhatsApp para agendar sua demonstração privada.
                            </p>
                        </div>`;
                } else {
                    const errorData = await response.json();
                    throw new Error(errorData.error || "Erro no envio");
                }
            } catch (err) {
                // Em caso de erro, devolve o botão ao estado original
                console.error("Erro no formulário:", err);
                btn.textContent = "Erro ao enviar. Tente novamente.";
                btn.disabled = false;
                
                setTimeout(() => {
                    btn.textContent = originalBtnText;
                }, 3000);
            }
        });
    }
});

// Estilo de animação rápida para a mensagem de sucesso
const style = document.createElement('style');
style.innerHTML = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);