import { db } from "./firebaseConfig.js";
import { initSidebarToggle, initDashboardNavigation } from "./sidebar.js";
import { cargarUsuarios } from "./usuarios.js";
import { cargarVehiculos } from "./vehiculos.js";
import { cargarReservas } from "./reservas.js";

// Inicializar funcionalidades del sidebar
initSidebarToggle();
initDashboardNavigation();


// Cargar datos iniciales
cargarUsuarios();
cargarVehiculos();
cargarReservas();