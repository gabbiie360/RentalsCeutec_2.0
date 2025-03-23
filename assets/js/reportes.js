import { db } from "./firebaseConfig.js";
import {
  collection,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

const colores = {
    fondo: [
      getComputedStyle(document.documentElement).getPropertyValue('--color-rojo').trim(),
      getComputedStyle(document.documentElement).getPropertyValue('--color-azul').trim(),
      getComputedStyle(document.documentElement).getPropertyValue('--color-verde').trim(),
      getComputedStyle(document.documentElement).getPropertyValue('--color-naranja').trim(),
      getComputedStyle(document.documentElement).getPropertyValue('--color-morado').trim(),
      getComputedStyle(document.documentElement).getPropertyValue('--color-celeste').trim(),
      getComputedStyle(document.documentElement).getPropertyValue('--color-rosa').trim()
    ],
    bordes: [
      "#fa5252", "#339af0", "#40c057", "#ff922b", "#7950f2", "#3bc9db", "#e64980"
    ]
  };
  

// Referencias
const reservasRef = collection(db, "reservas");

// Inicialización
const reservasPorDia = {};
const vehiculosUsados = {};
const usuariosActivos = {};

const graficaReservas = document.getElementById("chartReservasFecha");
const graficaVehiculos = document.getElementById("chartVehiculosTop");
const graficaUsuarios = document.getElementById("chartUsuariosTop");


const kpiTotalReservas = document.getElementById("kpiTotalReservas");
const kpiVehiculoTop = document.getElementById("kpiVehiculoTop");
const kpiUsuarioTop = document.getElementById("kpiUsuarioTop");

let chartReservas, chartVehiculos, chartUsuarios;

onSnapshot(reservasRef, (snapshot) => {
  // Reiniciar datos
  Object.keys(reservasPorDia).forEach(k => delete reservasPorDia[k]);
  Object.keys(vehiculosUsados).forEach(k => delete vehiculosUsados[k]);
  Object.keys(usuariosActivos).forEach(k => delete usuariosActivos[k]);

  let total = 0;

  snapshot.forEach((doc) => {
    const data = doc.data();
    total++;

    // === Reservas por fecha ===
    const fecha = data["Fecha de Reserva"]?.toDate();
    if (fecha) {
      const fechaStr = fecha.toLocaleDateString();
      reservasPorDia[fechaStr] = (reservasPorDia[fechaStr] || 0) + 1;
    }

    // === Vehículos más utilizados ===
    const vehiculo = data.nombreVehiculo;
    if (vehiculo) {
      vehiculosUsados[vehiculo] = (vehiculosUsados[vehiculo] || 0) + 1;
    }

    // === Usuarios más activos ===
    const usuario = data.Email;
    if (usuario) {
      usuariosActivos[usuario] = (usuariosActivos[usuario] || 0) + 1;
    }
  });

  // KPIs
  kpiTotalReservas.textContent = total;

  const topVehiculo = Object.entries(vehiculosUsados).sort((a, b) => b[1] - a[1])[0];
  const topUsuario = Object.entries(usuariosActivos).sort((a, b) => b[1] - a[1])[0];
  kpiVehiculoTop.textContent = topVehiculo ? `${topVehiculo[0]} (${topVehiculo[1]})` : "N/A";
  kpiUsuarioTop.textContent = topUsuario ? `${topUsuario[0]} (${topUsuario[1]})` : "N/A";

  actualizarGraficas();
});

function actualizarGraficas() {
  // === Reservas por Fecha (Línea) ===
  if (chartReservas) chartReservas.destroy();
  chartReservas = new Chart(graficaReservas, {
    type: "line",
    data: {
      labels: Object.keys(reservasPorDia),
      datasets: [{
        label: "Reservas",
        data: Object.values(reservasPorDia),
        tension: 0.3,
        fill: false,
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      }
    }
  });

  // === Vehículos más utilizados (Barras) ===
  if (chartVehiculos) chartVehiculos.destroy();
  chartVehiculos = new Chart(graficaVehiculos, {
    type: "bar",
    data: {
      labels: Object.keys(vehiculosUsados),
      datasets: [{
        label: "Veces reservado",
        data: Object.values(vehiculosUsados),
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      indexAxis: "y",
      plugins: {
        legend: { display: false }
      }
    }
  });

  // === Usuarios más activos (Pastel) ===
  if (chartUsuarios) chartUsuarios.destroy();
  chartUsuarios = new Chart(graficaUsuarios, {
    type: "pie",
      data: {
      labels: Object.keys(usuariosActivos),
      datasets: [{
        data: Object.values(usuariosActivos)
      }]
    },
    options: {
      responsive: true
    }
  });
}
