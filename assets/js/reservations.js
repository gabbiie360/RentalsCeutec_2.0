import { db } from "./firebaseConfig.js";
import {
  collection, query, where, onSnapshot, doc,
  getDoc, deleteDoc, updateDoc, getDocs
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
import {
  getAuth, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";

import { mostrarToast } from "./toast.js";
import "./authHeader.js"; // Para el menú del usuario

const auth = getAuth();
const reservasRef = collection(db, "reservas");

let idReservaParaCancelar = null;
let reservaIdVehiculo = null;
let todasLasReservas = [];

function aplicarFiltros() {
  const tabla = document.getElementById("reservationsTableBody");
  tabla.innerHTML = "";

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const filtro = document.getElementById("filtroEstado")?.value || "todas";
  const marcaFiltro = document.getElementById("filtroMarca")?.value.toLowerCase();
  const modeloFiltro = document.getElementById("filtroModelo")?.value.toLowerCase();
  const desde = document.getElementById("filtroDesde")?.value;
  const hasta = document.getElementById("filtroHasta")?.value;

  let reservasFiltradas = todasLasReservas.filter(r => {
    const estado = r.estado;
    if (filtro === "activas" && estado === "Pasada") return false;
    if (filtro === "pasadas" && estado === "Activa") return false;

    if (marcaFiltro && !r.vehiculo?.MARCA?.toLowerCase().includes(marcaFiltro)) return false;
    if (modeloFiltro && !r.vehiculo?.MODELO?.toLowerCase().includes(modeloFiltro)) return false;

    if (desde && r.fechaReserva < new Date(desde)) return false;
    if (hasta && r.fechaReserva > new Date(hasta)) return false;

    return true;
  });

  if (reservasFiltradas.length === 0) {
    tabla.innerHTML = "<tr><td colspan='9'>No hay reservas disponibles</td></tr>";
    return;
  }

  reservasFiltradas.forEach(r => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${r.vehiculo?.MARCA || "No asignado"}</td>
      <td>${r.vehiculo?.MODELO || "No asignado"}</td>
      <td>${r.vehiculo?.PLACA || "No asignado"}</td>
      <td>${r.vehiculo?.AÑO || "No asignado"}</td>
      <td>${r.vehiculo?.PRECIO_DIA || "No asignado"}</td>
      <td>${r.fechaReservaTxt}</td>
      <td>${r.fechaEntregaTxt}</td>
      <td>${r.estado}</td>
      <td>
        <button class="btn-delete btn btn-sm btn-danger" data-id="${r.id}">🗑️</button>
        <button class="btn-edit btn btn-sm btn-warning" data-id="${r.id}" data-idvehiculo="${r.idVehiculo}">✏️</button>
      </td>
    `;
    tabla.appendChild(fila);
  });

  agregarEventosBotones();
}

// ==========================
// Escuchar cambios en reservas del usuario
// ==========================
async function inicializarReservasUsuario(emailUsuario) {
  const q = query(reservasRef, where("Email", "==", emailUsuario));

  onSnapshot(q, async (snapshot) => {
    todasLasReservas = [];

    for (const reservaDoc of snapshot.docs) {
      const reservaData = reservaDoc.data();
      const reservaId = reservaDoc.id;

      let vehiculoData = {};
      if (reservaData.idVehiculo) {
        const vehiculoDoc = await getDoc(doc(db, "vehiculos", reservaData.idVehiculo));
        if (vehiculoDoc.exists()) {
          vehiculoData = vehiculoDoc.data();
        }
      }

      const fechaReserva = reservaData["Fecha de Reserva"]?.toDate?.();
      const fechaEntrega = reservaData["Fecha de entrega"]?.toDate?.();
      const fechaReservaTxt = fechaReserva?.toLocaleDateString() || "No asignado";
      const fechaEntregaTxt = fechaEntrega?.toLocaleDateString() || "No asignado";

      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      const estado = fechaEntrega < hoy ? "Pasada" : "Activa";

      todasLasReservas.push({
        id: reservaId,
        idVehiculo: reservaData.idVehiculo,
        vehiculo: vehiculoData,
        fechaReserva,
        fechaEntrega,
        fechaReservaTxt,
        fechaEntregaTxt,
        estado
      });
    }

    aplicarFiltros();
  });
}

// ==========================
// Acciones de botones
// ==========================
function agregarEventosBotones() {
  document.querySelectorAll(".btn-delete").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      idReservaParaCancelar = e.currentTarget.dataset.id;
      const modal = new bootstrap.Modal(document.getElementById("modalConfirmarCancelacion"));
      modal.show();
    });
  });

  document.querySelectorAll(".btn-edit").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const reservaId = e.currentTarget.dataset.id;
      reservaIdVehiculo = e.currentTarget.dataset.idvehiculo;
      document.getElementById("reservaIdEditar").value = reservaId;
      document.getElementById("nuevaFechaReserva").value = "";
      document.getElementById("nuevaFechaEntrega").value = "";

      const modal = new bootstrap.Modal(document.getElementById("modalEditarReserva"));
      modal.show();
    });
  });
}

// ==========================
// Confirmar cancelación
// ==========================
document.getElementById("btnConfirmarCancelacion").addEventListener("click", async () => {
  if (!idReservaParaCancelar) return;

  try {
    await deleteDoc(doc(db, "reservas", idReservaParaCancelar));
    mostrarToast("Reserva cancelada correctamente", "success");
  } catch (error) {
    console.error("Error al cancelar reserva:", error);
    mostrarToast("Ocurrió un error al cancelar la reserva", "danger");
  }

  const modal = bootstrap.Modal.getInstance(document.getElementById("modalConfirmarCancelacion"));
  modal.hide();
  idReservaParaCancelar = null;
});

// ==========================
// Guardar cambios desde el modal
// ==========================
document.getElementById("formEditarReserva").addEventListener("submit", async (e) => {
  e.preventDefault();
  const reservaId = document.getElementById("reservaIdEditar").value;
  const nuevaFechaReserva = document.getElementById("nuevaFechaReserva").value;
  const nuevaFechaEntrega = document.getElementById("nuevaFechaEntrega").value;

  if (!nuevaFechaReserva || !nuevaFechaEntrega) {
    mostrarToast("Ambas fechas son obligatorias", "warning");
    return;
  }

  const inicio = new Date(nuevaFechaReserva);
  const fin = new Date(nuevaFechaEntrega);
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  if (inicio < hoy || fin < hoy) {
    mostrarToast("No puedes seleccionar fechas en el pasado", "warning");
    return;
  }

  if (fin <= inicio) {
    mostrarToast("La fecha de entrega debe ser posterior a la fecha de reserva", "warning");
    return;
  }

  const reservasSolapadas = query(reservasRef, where("idVehiculo", "==", reservaIdVehiculo));
  const snapshot = await getDocs(reservasSolapadas);
  for (const doc of snapshot.docs) {
    if (doc.id === reservaId) continue;
    const r = doc.data();
    const rInicio = r["Fecha de Reserva"]?.toDate?.();
    const rFin = r["Fecha de entrega"]?.toDate?.();

    if (
      (inicio >= rInicio && inicio <= rFin) ||
      (fin >= rInicio && fin <= rFin) ||
      (inicio <= rInicio && fin >= rFin)
    ) {
      mostrarToast("Ese vehículo ya está reservado en ese rango de fechas", "danger");
      return;
    }
  }

  try {
    await updateDoc(doc(db, "reservas", reservaId), {
      "Fecha de Reserva": new Date(nuevaFechaReserva),
      "Fecha de entrega": new Date(nuevaFechaEntrega),
    });
    mostrarToast("Reserva reprogramada correctamente", "success");
    const modal = bootstrap.Modal.getInstance(document.getElementById("modalEditarReserva"));
    modal.hide();
  } catch (error) {
    console.error("Error al reprogramar:", error);
    mostrarToast("Error al reprogramar la reserva", "danger");
  }
});

// ==========================
// Verificar sesión y filtros
// ==========================
onAuthStateChanged(auth, (user) => {
  if (user) {
    inicializarReservasUsuario(user.email);

    const filtros = [
      "filtroEstado",
      "filtroMarca",
      "filtroModelo",
      "filtroDesde",
      "filtroHasta",
    ];

    filtros.forEach((id) => {
      document.getElementById(id)?.addEventListener("input", aplicarFiltros);
    });

    document.getElementById("btnLimpiarFiltros")?.addEventListener("click", () => {
      filtros.forEach(id => document.getElementById(id).value = "");
      document.getElementById("filtroEstado").value = "todas";
      aplicarFiltros();
    });

  } else {
    document.getElementById("reservationsTableBody").innerHTML =
      "<tr><td colspan='9'>Debes iniciar sesión para ver tus reservas</td></tr>";
  }
});
