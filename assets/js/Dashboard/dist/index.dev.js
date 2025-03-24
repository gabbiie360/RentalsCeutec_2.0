"use strict";

var _usuarios = require("./usuarios.js");

var _vehiculos = require("./vehiculos.js");

var _reservas = require("./reservas.js");

document.getElementById("toggleSidebar").addEventListener("click", function () {
  var sidebar = document.getElementById("sidebar");
  var main = document.getElementById("mainContent");
  sidebar.classList.toggle("collapsed");
  main.classList.toggle("expanded");
}); // Manejo de clics en el menú lateral

document.querySelectorAll('.sidebar-link').forEach(function (link) {
  link.addEventListener('click', function () {
    // Remover la clase 'active' de todos los enlaces
    document.querySelectorAll('.sidebar-link').forEach(function (item) {
      return item.classList.remove('active');
    }); // Agregar la clase 'active' al enlace clicado

    link.classList.add('active'); // Ocultar todas las secciones

    document.querySelectorAll('.dashboard-section').forEach(function (section) {
      return section.classList.add('d-none');
    }); // Mostrar la sección correspondiente

    var sectionId = link.getAttribute('data-section');
    document.getElementById(sectionId).classList.remove('d-none');
  });
}); // Inicializar funcionalidades específicas

document.addEventListener("DOMContentLoaded", function () {
  (0, _usuarios.cargarUsuarios)();
  (0, _vehiculos.cargarVehiculos)();
  (0, _reservas.cargarReservas)();
}); // Exponer funciones globalmente

window.editarVehiculo = _vehiculos.editarVehiculo;
window.guardarVehiculo = _vehiculos.guardarVehiculo;
window.editarReserva = _reservas.editarReserva;
window.guardarReserva = _reservas.guardarReserva;
window.abrirModalReserva = _reservas.abrirModalReserva;
//# sourceMappingURL=index.dev.js.map
