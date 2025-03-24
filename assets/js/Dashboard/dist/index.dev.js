"use strict";

var _usuarios = require("./usuarios.js");

var _vehiculos = require("./vehiculos.js");

var _reservas = require("./reservas.js");

document.getElementById("toggleSidebar").addEventListener("click", function () {
  var sidebar = document.getElementById("sidebar");
  var main = document.getElementById("mainContent");
  sidebar.classList.toggle("collapsed");
  main.classList.toggle("expanded");
});
var links = document.querySelectorAll(".sidebar-link");
var secciones = document.querySelectorAll(".dashboard-section");
links.forEach(function (link, index) {
  link.addEventListener("click", function () {
    secciones.forEach(function (s) {
      return s.classList.add("d-none");
    });
    links.forEach(function (l) {
      return l.classList.remove("active");
    });
    secciones[index].classList.remove("d-none");
    link.classList.add("active");
  });
}); // Inicializar funcionalidades específicas

document.addEventListener("DOMContentLoaded", function () {
  (0, _usuarios.cargarUsuarios)();
  (0, _vehiculos.cargarVehiculos)();
  (0, _reservas.cargarReservas)();
});
//# sourceMappingURL=index.dev.js.map
