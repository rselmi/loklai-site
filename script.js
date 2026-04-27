/**
 * LOKL AI - Scripts de Interface e FormulÃ¡rio
 * Foco: Performance e ExperiÃªncia do UsuÃ¡rio (UX)
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. ANIMAÃ‡ÃƒO AO SCROLL (REVEAL)
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

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();

    // 2. INTERCEPTAÃ‡ÃƒO DO FORMULÃRIO (FORMSPREE + AJAX)
    const contactForm = document.querySelector('.contact-form');

    if (contactForm) {
        // --- CASE DE TRADUÃ‡ÃƒO ---
        const lang = document.documentElement.lang?.toLowerCase().startsWith('en') ? 'en' : 'pt';
        const t = {
            en: {
                sending: "Sending...",
                successTitle: (n) => `Request Received, ${n}!`,
                successText: "Thank you for reaching out. We've received your details and will be in touch soon to schedule your Lokl AI demo.",
                error: "Error sending. Please try again.",
                fallbackName: "there"
            },
            pt: {
                sending: "Enviando...",
                successTitle: (n) => `SolicitaÃ§Ã£o Recebida, ${n}!`,
                successText: "Obrigado pelo contato. JÃ¡ recebemos seus dados e entraremos em contato em breve para agendar sua demonstraÃ§Ã£o do Lokl AI.",
                error: "Erro ao enviar. Tente novamente.",
                fallbackName: "Parceiro"
            }
        }[lang];

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const btn = contactForm.querySelector('button');
            const originalBtnText = btn.textContent;
            
            btn.textContent = t.sending;
            btn.disabled = true;

            const formData = new FormData(contactForm);

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    const userName = formData.get('firstName') || t.fallbackName;

                    contactForm.innerHTML = `
                        <div style="text-align:center; padding: 2rem; animation: fadeIn 0.5s ease-out forwards;">
                            <div style="font-size: 3rem; margin-bottom: 1rem;">âœ…</div>
                            <h3 style="color: var(--accent); margin-bottom: 1rem; font-size: 1.8rem;">
                                ${t.successTitle(userName)}
                            </h3>
                            <p style="color: var(--text-muted); line-height: 1.6;">
                                ${t.successText}
                            </p>
                        </div>`;
                } else {
                    const errorData = await response.json();
                    throw new Error(errorData.error || "Error");
                }
            } catch (err) {
                console.error("Form error:", err);
                btn.textContent = t.error;
                btn.disabled = false;
                
                setTimeout(() => {
                    btn.textContent = originalBtnText;
                }, 3000);
            }
        });
    }
});

// Estilo de animaÃ§Ã£o rÃ¡pida para a mensagem de sucesso
const style = document.createElement('style');
style.innerHTML = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);