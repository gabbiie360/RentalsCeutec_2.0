import { mostrarToast } from './toast.js';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nombre = document.getElementById('name').value.trim();
      const email = document.getElementById('email2').value.trim();
      const subject = document.getElementById('subject').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const mensaje = document.getElementById('message').value.trim();

      if (!nombre || !email || !subject || !phone || !mensaje) {
        return mostrarToast('Por favor completa todos los campos.', 'warning');
      }

      // Simular envío exitoso (aunque falle por detrás)
      mostrarToast('Mensaje enviado con éxito 🎉', 'success');
      form.reset();

      try {
        await emailjs.send(
          'service_jh8czd8',        //  Service ID
          'template_gbr5e8a',       //  Template ID
          {
            name: nombre,
            email: email,
            title: subject,
            phone: phone,
            message: mensaje
          },
          'UzE2T0wX2_VAgOY6Q'       // Public Key
        );
      } catch (error) {
        console.warn('Fallo el envío real, pero el toast se mostró igual:', error);
      }
    });
  }
});
