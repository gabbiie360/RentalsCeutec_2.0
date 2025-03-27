import { db } from "./firebaseConfig.js";
import {
  collection,
  onSnapshot,
  

} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

// Referencias
const reservasRef = collection(db, "reservas");

// Filtros globales
const filtroDesde = document.getElementById("filtroDesde");
const filtroHasta = document.getElementById("filtroHasta");
const filtroEmail = document.getElementById("filtroEmailReporte");
const filtroMarca = document.getElementById("filtroMarcaReporte");
const filtroModelo = document.getElementById("filtroModeloReporte");
const filtroAnio = document.getElementById("filtroAnioReporte");
const limpiarFiltros = document.getElementById("limpiarFiltrosReportes");

// KPIs
const kpiTotalReservas = document.getElementById("kpiTotalReservas");
const kpiVehiculoTop = document.getElementById("kpiVehiculoTop");
const kpiUsuarioTop = document.getElementById("kpiUsuarioTop");

 

// Gráficas
const graficaReservas = document.getElementById("chartReservasFecha");
const graficaVehiculos = document.getElementById("chartVehiculosTop");
const graficaUsuarios = document.getElementById("chartUsuariosTop");

let chartReservas, chartVehiculos, chartUsuarios;
let todasLasReservas = [];

// Colores
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

// Cargar datos desde Firestore
onSnapshot(reservasRef, (snapshot) => {
  todasLasReservas = [];
  snapshot.forEach(doc => {
    const data = doc.data();
    if (data["Fecha de Reserva"]?.toDate) {
      todasLasReservas.push(data);
    }
  });
  aplicarFiltros();
  
});

// Escuchar cambios en filtros
[filtroDesde, filtroHasta, filtroEmail, filtroMarca, filtroModelo, filtroAnio].forEach(f => {
  f.addEventListener("input", aplicarFiltros);
});

// Botón limpiar filtros
limpiarFiltros.addEventListener("click", () => {
  filtroDesde.value = "";
  filtroHasta.value = "";
  filtroEmail.value = "";
  filtroMarca.value = "";
  filtroModelo.value = "";
  filtroAnio.value = "";
  aplicarFiltros();
});

function aplicarFiltros() {
  const desde = filtroDesde.valueAsDate;
  const hasta = filtroHasta.valueAsDate;
  const email = filtroEmail.value.toLowerCase();
  const marca = filtroMarca.value.toLowerCase();
  const modelo = filtroModelo.value.toLowerCase();
  const anio = filtroAnio.value;

  const filtradas = todasLasReservas.filter(r => {
    const fecha = r["Fecha de Reserva"].toDate();

    if (desde && fecha < desde) return false;
    if (hasta && fecha > hasta) return false;
    if (email && !r.Email?.toLowerCase().includes(email)) return false;
    if (marca && !r.nombreVehiculo?.toLowerCase().includes(marca)) return false;
    if (modelo && !r.nombreVehiculo?.toLowerCase().includes(modelo)) return false;
    if (anio && !r.nombreVehiculo?.includes(anio)) return false;

    return true;
  });

  generarReportes(filtradas);
}

function generarReportes(data) {
  const reservasPorDia = {};
  const vehiculosUsados = {};
  const usuariosActivos = {};

  data.forEach(r => {
    const fechaStr = r["Fecha de Reserva"].toDate().toLocaleDateString();
    reservasPorDia[fechaStr] = (reservasPorDia[fechaStr] || 0) + 1;

    if (r.nombreVehiculo) {
      vehiculosUsados[r.nombreVehiculo] = (vehiculosUsados[r.nombreVehiculo] || 0) + 1;
    }

    if (r.Email) {
      usuariosActivos[r.Email] = (usuariosActivos[r.Email] || 0) + 1;
    }
  });

  // KPIs
  kpiTotalReservas.textContent = data.length;
  const topVehiculo = Object.entries(vehiculosUsados).sort((a, b) => b[1] - a[1])[0];
  const topUsuario = Object.entries(usuariosActivos).sort((a, b) => b[1] - a[1])[0];
  kpiVehiculoTop.textContent = topVehiculo ? `${topVehiculo[0]} (${topVehiculo[1]})` : "N/A";
  kpiUsuarioTop.textContent = topUsuario ? `${topUsuario[0]} (${topUsuario[1]})` : "N/A";

  actualizarGraficas(reservasPorDia, vehiculosUsados, usuariosActivos);
}

function actualizarGraficas(reservasPorDia, vehiculosUsados, usuariosActivos) {
  if (chartReservas) chartReservas.destroy();
  if (chartVehiculos) chartVehiculos.destroy();
  if (chartUsuarios) chartUsuarios.destroy();

  chartReservas = new Chart(graficaReservas, {
    type: "line",
    data: {
      labels: Object.keys(reservasPorDia),
      datasets: [{
        label: "Reservas",
        data: Object.values(reservasPorDia),
        tension: 0.3,
        fill: false,
        borderWidth: 2,
        borderColor: colores.bordes[0],
        backgroundColor: colores.fondo[0]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      }
    }
  });

  chartVehiculos = new Chart(graficaVehiculos, {
    type: "bar",
    data: {
      labels: Object.keys(vehiculosUsados),
      datasets: [{
        label: "Veces reservado",
        data: Object.values(vehiculosUsados),
        backgroundColor: colores.fondo,
        borderColor: colores.bordes,
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

  chartUsuarios = new Chart(graficaUsuarios, {
    type: "pie",
    data: {
      labels: Object.keys(usuariosActivos),
      datasets: [{
        data: Object.values(usuariosActivos),
        backgroundColor: colores.fondo,
        borderColor: colores.bordes
      }]
    },
    options: {
      responsive: true
    }
  });
}
