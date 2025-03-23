export function mostrarToast(mensaje, tipo = "primary") {
    let toastElement = document.getElementById("toastMensaje");
    let toastTexto = document.getElementById("toastTexto");
  
    if (!toastElement || !toastTexto) {
      // Crear el toast dinámicamente si no existe
      toastElement = document.createElement("div");
      toastElement.id = "toastMensaje";
      toastElement.className = `toast align-items-center text-bg-${tipo} border-0`;
      toastElement.style.position = "fixed";
      toastElement.style.bottom = "20px";
      toastElement.style.right = "20px";
      toastElement.style.zIndex = "9999";
  
      toastTexto = document.createElement("div");
      toastTexto.id = "toastTexto";
      toastTexto.className = "d-flex align-items-center p-3";
      toastElement.appendChild(toastTexto);
  
      document.body.appendChild(toastElement);
    }
  
    toastTexto.textContent = mensaje;
    toastElement.className = `toast align-items-center text-bg-${tipo} border-0`;
  
    const toast = new bootstrap.Toast(toastElement);
    toast.show();
  }
  