"use strict";

var _firebaseConfig = require("./firebaseConfig.js");

var _sidebar = require("./sidebar.js");

var _usuarios = require("./usuarios.js");

var _vehiculos = require("./vehiculos.js");

var _reservas = require("./reservas.js");

// Inicializar funcionalidades del sidebar
(0, _sidebar.initSidebarToggle)();
(0, _sidebar.initDashboardNavigation)(); // Cargar datos iniciales

(0, _usuarios.cargarUsuarios)();
(0, _vehiculos.cargarVehiculos)();
(0, _reservas.cargarReservas)();
//# sourceMappingURL=dashboardAdmini.dev.js.map
