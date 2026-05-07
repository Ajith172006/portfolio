async function loadSections() {
  const placeholders = Array.from(document.querySelectorAll('[data-src]'));
  const loadPromises = placeholders.map(async (placeholder) => {
    const src = placeholder.dataset.src;
    try {
      const response = await fetch(src);
      if (!response.ok) throw new Error(`Failed to load ${src}`);
      const sectionHtml = await response.text();
      placeholder.insertAdjacentHTML('afterend', sectionHtml);
      placeholder.remove();
    } catch (error) {
      placeholder.innerHTML = `<p style="color: var(--accent2); text-align: center; padding: 2rem;">Unable to load section: ${src}</p>`;
      console.error(error);
    }
  });
  await Promise.all(loadPromises);
}

function initRevealObserver() {
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 60);
      } else {
        entry.target.classList.remove('visible');
      }
    });
  }, { threshold: 0.1 });
  reveals.forEach(el => observer.observe(el));
}

function sendContactEmail(event) {
  event.preventDefault();
  const form = event.target;
  const fromEmail = form.from_email.value.trim();
  const subject = form.subject.value.trim();
  const message = form.message.value.trim();
  if (!fromEmail || !subject || !message) return false;

  const statusEl = document.getElementById('form-status');
  const btn = form.querySelector('button');
  btn.disabled = true;
  btn.textContent = 'Sending...';
  statusEl.textContent = '';

  const templateParams = {
    from_email: fromEmail,
    subject: subject,
    message: message
  };

  emailjs.send('service_lygvgw4', 'template_qp4t65g', templateParams, 'HNfEh15wOD-NHTosq')
    .then(() => {
      statusEl.textContent = 'Message sent successfully!';
      statusEl.style.color = 'green';
      form.reset();
    })
    .catch((error) => {
      console.error('EmailJS Error:', error);
      statusEl.textContent = 'Failed to send message. Please try again.';
      statusEl.style.color = 'red';
    })
    .finally(() => {
      btn.disabled = false;
      btn.textContent = 'Send Message';
    });

  return false;
}

window.addEventListener('DOMContentLoaded', async () => {
  await loadSections();
  initRevealObserver();

  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', sendContactEmail);
  }
});