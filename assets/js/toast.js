export function mostrarToast(mensaje, tipo = "primary", duracion = 4000) {
  if (!mensaje || mensaje.trim() === "") return; // Evitar toasts vacíos

  // Crear contenedor si no existe
  let container = document.getElementById("toastContainer");
  if (!container) {
    container = document.createElement("div");
    container.id = "toastContainer";
    container.className = "toast-container position-fixed bottom-0 end-0 p-3";
    container.style.zIndex = "9999";
    document.body.appendChild(container);
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
  toastElement.className = `toast align-items-center text-bg-${tipo} border-0 mb-2`;
  toastElement.setAttribute("role", "alert");
  toastElement.setAttribute("aria-live", "assertive");
  toastElement.setAttribute("aria-atomic", "true");

  const toastBody = document.createElement("div");
  toastBody.className = "toast-body d-flex justify-content-between align-items-center";
  toastBody.innerHTML = `
    <span>${icono}${mensaje}</span>
    <button type="button" class="btn-close btn-close-white ms-2 mb-1" data-bs-dismiss="toast" aria-label="Close"></button>
  `;

  toastElement.appendChild(toastBody);
  container.appendChild(toastElement);

  // Activar el toast con la duración personalizada
  const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastElement, {
    animation: true,
    autohide: true,
    delay: duracion,
  });

  toastBootstrap.show();

  // Remover el toast del DOM cuando termine
  toastElement.addEventListener("hidden.bs.toast", () => {
    toastElement.remove();
  });
}
