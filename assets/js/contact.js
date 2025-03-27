import { mostrarToast } from './toast.js';

document.getElementById('formContacto').addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const datos = Object.fromEntries(formData.entries());

  try {
    const response = await fetch('sendMailResend.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos),
    });

    const result = await response.json();

    if (result.success) {
      mostrarToast("Mensaje enviado correctamente", "success");
      e.target.reset();
    } else {
      mostrarToast("Error al enviar el mensaje", "danger");
      console.error(result.error);
    }
  } catch (error) {
    console.error("Error:", error);
    mostrarToast("Error al enviar el mensaje", "danger");
  }
});
