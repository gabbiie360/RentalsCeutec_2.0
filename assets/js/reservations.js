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

// ==========================
// Cargar reservas del usuario
// ==========================
async function cargarReservas(emailUsuario) {
  const tabla = document.getElementById("reservationsTableBody");
  const filtroEstado = document.getElementById("filtroEstado");
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const q = query(reservasRef, where("Email", "==", emailUsuario));

  onSnapshot(q, async (snapshot) => {
    tabla.innerHTML = "";

    if (snapshot.empty) {
      tabla.innerHTML = "<tr><td colspan='9'>No hay reservas disponibles</td></tr>";
      return;
    }

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

      // Estado virtual
      const estado = fechaEntrega < hoy ? "Pasada" : "Activa";

      // Leer filtros actuales
      const filtro = filtroEstado?.value || "todas";
      const marcaFiltro = document.getElementById("filtroMarca")?.value.toLowerCase();
      const modeloFiltro = document.getElementById("filtroModelo")?.value.toLowerCase();
      const desde = document.getElementById("filtroDesde")?.value;
      const hasta = document.getElementById("filtroHasta")?.value;

      // Filtro por estado
      if (filtro === "activas" && estado === "Pasada") continue;
      if (filtro === "pasadas" && estado === "Activa") continue;

      // Filtro por marca
      if (marcaFiltro && !vehiculoData["MARCA"]?.toLowerCase().includes(marcaFiltro)) continue;

      // Filtro por modelo
      if (modeloFiltro && !vehiculoData["MODELO"]?.toLowerCase().includes(modeloFiltro)) continue;

      // Filtro por rango de fechas
      if (desde && fechaReserva < new Date(desde)) continue;
      if (hasta && fechaReserva > new Date(hasta)) continue;

      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${vehiculoData["MARCA"] || "No asignado"}</td>
        <td>${vehiculoData["MODELO"] || "No asignado"}</td>
        <td>${vehiculoData["PLACA"] || "No asignado"}</td>
        <td>${vehiculoData["AÑO"] || "No asignado"}</td>
        <td>${vehiculoData["PRECIO_DIA"] || "No asignado"}</td>
        <td>${fechaReservaTxt}</td>
        <td>${fechaEntregaTxt}</td>
        <td>${estado}</td>
        <td>
          <button class="btn-delete btn btn-sm btn-danger" data-id="${reservaId}">🗑️</button>
          <button class="btn-edit btn btn-sm btn-warning" data-id="${reservaId}" data-idvehiculo="${reservaData.idVehiculo}">✏️</button>
        </td>
      `;
      tabla.appendChild(fila);
    }

    agregarEventosBotones();
  });
}

// ==========================
// Acciones de botones
// ==========================
function agregarEventosBotones() {
  // Abrir modal de cancelación
  document.querySelectorAll(".btn-delete").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      idReservaParaCancelar = e.currentTarget.dataset.id;
      const modal = new bootstrap.Modal(document.getElementById("modalConfirmarCancelacion"));
      modal.show();
    });
  });

  // Abrir modal de reprogramación
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

  // Validar solapamiento con otras reservas del mismo vehículo
  const reservasSolapadas = query(
    reservasRef,
    where("idVehiculo", "==", reservaIdVehiculo)
  );

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
// Verificar sesión
// ==========================
onAuthStateChanged(auth, (user) => {
  if (user) {
    cargarReservas(user.email);

    const filtros = [
      "filtroEstado",
      "filtroMarca",
      "filtroModelo",
      "filtroDesde",
      "filtroHasta",
    ];

    filtros.forEach((id) => {
      document.getElementById(id)?.addEventListener("input", () => {
        cargarReservas(user.email);
      });
    });
  } else {
    document.getElementById("reservationsTableBody").innerHTML =
      "<tr><td colspan='9'>Debes iniciar sesión para ver tus reservas</td></tr>";
  }


  document.getElementById("btnLimpiarFiltros")?.addEventListener("click", () => {
    document.getElementById("filtroEstado").value = "todas";
    document.getElementById("filtroMarca").value = "";
    document.getElementById("filtroModelo").value = "";
    document.getElementById("filtroDesde").value = "";
    document.getElementById("filtroHasta").value = "";
    cargarReservas(auth.currentUser.email);
  });
  

});
