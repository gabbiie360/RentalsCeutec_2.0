export function mostrarToast(mensaje, tipo = "primary") {
  // Eliminar cualquier toast previo
  const toastAnterior = document.getElementById("toastMensaje");
  if (toastAnterior) {
    toastAnterior.remove();
  }

  // Elegir el ícono según el tipo
  const iconos = {
    success: `<i class="fas fa-check-circle me-2"></i>`,
    danger: `<i class="fas fa-times-circle me-2"></i>`,
    warning: `<i class="fas fa-exclamation-triangle me-2"></i>`,
    info: `<i class="fas fa-info-circle me-2"></i>`,
    primary: `<i class="fas fa-info-circle me-2"></i>`,
  };

  const icono = iconos[tipo] || "";

  // Crear estructura del toast
  const toastElement = document.createElement("div");
  toastElement.id = "toastMensaje";
  toastElement.className = `toast align-items-center text-bg-${tipo} border-0`;
  toastElement.setAttribute("role", "alert");
  toastElement.setAttribute("aria-live", "assertive");
  toastElement.setAttribute("aria-atomic", "true");
  toastElement.style.position = "fixed";
  toastElement.style.bottom = "20px";
  toastElement.style.right = "20px";
  toastElement.style.zIndex = "9999";
  toastElement.style.minWidth = "300px";

  const toastBody = document.createElement("div");
  toastBody.className = "toast-body d-flex justify-content-between align-items-center";
  toastBody.innerHTML = `
    <span>${icono}${mensaje}</span>
    <button type="button" class="btn-close btn-close-white ms-2 mb-1" data-bs-dismiss="toast" aria-label="Close"></button>
  `;

  toastElement.appendChild(toastBody);
  document.body.appendChild(toastElement);

  // Activar el toast
  const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastElement, {
    animation: true,
    autohide: true,
    delay: 4000,
  });

  toastBootstrap.show();
}
