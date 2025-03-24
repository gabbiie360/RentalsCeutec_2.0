import { cargarUsuarios } from "./usuarios.js";
import { cargarVehiculos } from "./vehiculos.js";
import { cargarReservas } from "./reservas.js";

document.getElementById("toggleSidebar").addEventListener("click", () => {
  const sidebar = document.getElementById("sidebar");
  const main = document.getElementById("mainContent");
  sidebar.classList.toggle("collapsed");
  main.classList.toggle("expanded");
});
const links = document.querySelectorAll(".sidebar-link");
const secciones = document.querySelectorAll(".dashboard-section");

links.forEach((link, index) => {
  link.addEventListener("click", () => {
    secciones.forEach((s) => s.classList.add("d-none"));
    links.forEach((l) => l.classList.remove("active"));

    secciones[index].classList.remove("d-none");
    link.classList.add("active");
  });
});

// Inicializar funcionalidades específicas
document.addEventListener("DOMContentLoaded", () => {
  cargarUsuarios();
  cargarVehiculos();
  cargarReservas();
});