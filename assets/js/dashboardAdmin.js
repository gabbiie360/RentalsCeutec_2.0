import { inicializarAutenticacion } from "./authAdmin.js";
import { inicializarUsuarios } from "./usuarios.js";
import { inicializarVehiculos } from "./vehiculos.js";
import { inicializarReservas } from "./reservas.js";

inicializarAutenticacion(() => {
  inicializarUsuarios();
  inicializarVehiculos();
  inicializarReservas();

  document.getElementById("logout").addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "login.html";
  });
});
