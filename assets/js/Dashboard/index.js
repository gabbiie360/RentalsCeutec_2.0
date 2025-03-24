import { cargarUsuarios } from "./usuarios.js";
import { cargarVehiculos, editarVehiculo, guardarVehiculo } from "./vehiculos.js";
import { cargarReservas, editarReserva, guardarReserva, abrirModalReserva } from "./reservas.js";

document.getElementById("toggleSidebar").addEventListener("click", () => {
  const sidebar = document.getElementById("sidebar");
  const main = document.getElementById("mainContent");
  sidebar.classList.toggle("collapsed");
  main.classList.toggle("expanded");
});

// Manejo de clics en el menú lateral
document.querySelectorAll('.sidebar-link').forEach(link => {
  link.addEventListener('click', () => {
    // Remover la clase 'active' de todos los enlaces
    document.querySelectorAll('.sidebar-link').forEach(item => item.classList.remove('active'));

    // Agregar la clase 'active' al enlace clicado
    link.classList.add('active');

    // Ocultar todas las secciones
    document.querySelectorAll('.dashboard-section').forEach(section => section.classList.add('d-none'));

    // Mostrar la sección correspondiente
    const sectionId = link.getAttribute('data-section');
    document.getElementById(sectionId).classList.remove('d-none');
  });
});

// Inicializar funcionalidades específicas
document.addEventListener("DOMContentLoaded", () => {
  cargarUsuarios();
  cargarVehiculos();
  cargarReservas();
});

// Exponer funciones globalmente
window.editarVehiculo = editarVehiculo;
window.guardarVehiculo = guardarVehiculo;
window.editarReserva = editarReserva;
window.guardarReserva = guardarReserva;
window.abrirModalReserva = abrirModalReserva;