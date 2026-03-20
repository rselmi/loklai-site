document.addEventListener('DOMContentLoaded', () => {
    const observerOptions = {
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    const elements = document.querySelectorAll('.reveal');
    elements.forEach(el => observer.observe(el));
});

const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('button');
        const originalBtnText = btn.textContent;
        
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
                contactForm.innerHTML = `
                    <div style="text-align:center; padding: 2rem;">
                        <h3 style="color: var(--accent); margin-bottom: 1rem;">Solicitação Enviada!</h3>
                        <p>Obrigado, Rafael. Entraremos em contato via WhatsApp em breve para agendar sua demonstração.</p>
                    </div>`;
            } else {
                throw new Error();
            }
        } catch (err) {
            btn.textContent = "Erro ao enviar. Tente novamente.";
            btn.disabled = false;
        }
    });
}