import { db } from "./firebaseConfig.js";
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

import { mostrarToast } from "./toast.js";

const reservasRef = collection(db, "reservas");
const vehiculosRef = collection(db, "vehiculos");

let vehiculosDisponibles = [];
let vehiculoAnteriorId = null;
let todasLasReservas = [];

export function inicializarReservas() {
  cargarReservas();

  document.getElementById("limpiarFiltrosReservas").addEventListener("click", () => {
    document.getElementById("filtroDesde").value = "";
    document.getElementById("filtroHasta").value = "";
    document.getElementById("filtroUsuario").value = "";
    document.getElementById("filtroEstado").value = "";
    aplicarFiltrosReservas();
  });

  ["filtroDesde", "filtroHasta", "filtroUsuario", "filtroEstado"].forEach(id => {
    document.getElementById(id).addEventListener("input", aplicarFiltrosReservas);
  });

  window.abrirModalReserva = abrirModalReserva;
  window.editarReserva = editarReserva;
  window.guardarReserva = guardarReserva;
  window.eliminarReserva = eliminarReserva;
}

function cargarReservas() {
  onSnapshot(reservasRef, (snapshot) => {
    todasLasReservas = [];

    const ahora = new Date();

    snapshot.forEach((docu) => {
      const data = docu.data();
      const fechaReserva = data["Fecha de Reserva"]?.toDate();
      const fechaEntrega = data["Fecha de entrega"]?.toDate();

      if (!fechaReserva || !fechaEntrega) return;

      todasLasReservas.push({
        id: docu.id,
        ...data,
        fechaReserva,
        fechaEntrega
      });
    });

    aplicarFiltrosReservas();
  });
}

function aplicarFiltrosReservas() {
  const tabla = document.getElementById("tablaReservas");
  tabla.innerHTML = "";

  const ahora = new Date();
  const desde = document.getElementById("filtroDesde")?.valueAsDate;
  const hasta = document.getElementById("filtroHasta")?.valueAsDate;
  const usuarioFiltro = document.getElementById("filtroUsuario")?.value.toLowerCase();
  const estadoFiltro = document.getElementById("filtroEstado")?.value;

  let reservasFiltradas = todasLasReservas.filter((data) => {
    if (desde && data.fechaReserva < desde) return false;
    if (hasta && data.fechaReserva > hasta) return false;
    if (usuarioFiltro && !data.Email?.toLowerCase().includes(usuarioFiltro)) return false;
    if (estadoFiltro === "futuras" && data.fechaEntrega < ahora) return false;
    if (estadoFiltro === "pasadas" && data.fechaEntrega >= ahora) return false;
    return true;
  });

  reservasFiltradas.sort((a, b) => b.fechaReserva - a.fechaReserva);

  reservasFiltradas.forEach((data) => {
    tabla.innerHTML += `
      <tr>
        <td>${data["Nombre Completo"]}</td>
        <td>${data.Email}</td>
        <td>${data["Numero de Telefono"]}</td>
        <td>${data["Recoges en"]}</td>
        <td>${data.nombreVehiculo}</td>
        <td>${data.fechaReserva.toLocaleString()}</td>
        <td>${data.fechaEntrega.toLocaleString()}</td>
        <td>
          <button class="btn btn-sm btn-secondary" onclick="editarReserva('${data.id}')"><i class="fa fa-pen"></i></button>
          <button class="btn btn-sm btn-danger" onclick="eliminarReserva('${data.id}')"><i class="fa fa-trash"></i></button>
        </td>
      </tr>
    `;
  });

  if (reservasFiltradas.length === 0) {
    tabla.innerHTML = "<tr><td colspan='8'>No se encontraron reservas con los filtros aplicados</td></tr>";
  }
}

function cargarVehiculosParaReservas(callback = null) {
  const select = document.getElementById("vehiculoReserva");
  select.innerHTML = '<option value="">Selecciona un vehículo</option>';

  onSnapshot(vehiculosRef, (snapshot) => {
    vehiculosDisponibles = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data.DISPONIBLE) {
        vehiculosDisponibles.push({ id: doc.id, ...data });
        const option = document.createElement("option");
        option.value = doc.id;
        option.textContent = `${data.MARCA} ${data.MODELO} - ${data.PLACA}`;
        select.appendChild(option);
      }
    });

    if (callback) callback();
  });
}

function abrirModalReserva() {
  document.querySelectorAll("#modalReserva input").forEach(e => e.value = "");
  vehiculoAnteriorId = null;
  cargarVehiculosParaReservas(() => {
    const modalEl = document.getElementById("modalReserva");
    const modalInstance = bootstrap.Modal.getOrCreateInstance(modalEl);
    modalInstance.show();
  });
}

async function editarReserva(id) {
  const docSnap = await getDoc(doc(db, "reservas", id));
  if (docSnap.exists()) {
    const data = docSnap.data();
    document.getElementById("reservaId").value = id;
    document.getElementById("nombreCompleto").value = data["Nombre Completo"];
    document.getElementById("emailReserva").value = data.Email;
    document.getElementById("telefono").value = data["Numero de Telefono"];
    document.getElementById("ubicacion").value = data["Recoges en"];
    document.getElementById("fechaReserva").value = data["Fecha de Reserva"]?.toDate().toISOString().slice(0, 16);
    document.getElementById("fechaEntrega").value = data["Fecha de entrega"]?.toDate().toISOString().slice(0, 16);
    vehiculoAnteriorId = data.idVehiculo;

    cargarVehiculosParaReservas(() => {
      document.getElementById("vehiculoReserva").value = vehiculoAnteriorId;
      const modalEl = document.getElementById("modalReserva");
      const modalInstance = bootstrap.Modal.getOrCreateInstance(modalEl);
      modalInstance.show();
    });
  }
}

async function validarSolapamiento(idVehiculo, nuevaInicio, nuevaFin, idReservaActual = null) {
  const snapshot = await getDocs(query(reservasRef, where("idVehiculo", "==", idVehiculo)));

  for (const docu of snapshot.docs) {
    if (idReservaActual && docu.id === idReservaActual) continue;

    const data = docu.data();
    const inicio = data["Fecha de Reserva"]?.toDate();
    const fin = data["Fecha de entrega"]?.toDate();

    if ((nuevaInicio < fin) && (nuevaFin > inicio)) return true;
  }

  return false;
}

async function guardarReserva() {
  const campos = ["nombreCompleto", "emailReserva", "telefono", "ubicacion", "fechaReserva", "fechaEntrega"];
  for (let id of campos) {
    const valor = document.getElementById(id).value.trim();
    if (!valor) return mostrarToast("Todos los campos son obligatorios.", "danger");
  }

  const id = document.getElementById("reservaId").value;
  const idVehiculoNuevo = document.getElementById("vehiculoReserva").value;
  const vehiculoSeleccionado = vehiculosDisponibles.find(v => v.id === idVehiculoNuevo);
  if (!vehiculoSeleccionado) return mostrarToast("Selecciona un vehículo disponible.", "danger");

  const fechaReserva = new Date(document.getElementById("fechaReserva").value);
  const fechaEntrega = new Date(document.getElementById("fechaEntrega").value);
  const ahora = new Date();
  const ahoraMasUnaHora = new Date(ahora.getTime() + 3600000);

  if (fechaReserva < ahoraMasUnaHora) return mostrarToast("Reserva debe ser al menos 1h después de la hora actual.", "warning");
  if (fechaEntrega <= fechaReserva) return mostrarToast("Entrega debe ser posterior a la reserva.", "warning");

  const reserva = {
    "Nombre Completo": document.getElementById("nombreCompleto").value.trim(),
    Email: document.getElementById("emailReserva").value.trim(),
    "Numero de Telefono": document.getElementById("telefono").value.trim(),
    "Recoges en": document.getElementById("ubicacion").value.trim(),
    "Fecha de Reserva": fechaReserva,
    "Fecha de entrega": fechaEntrega,
    idVehiculo: idVehiculoNuevo,
    nombreVehiculo: `${vehiculoSeleccionado.MARCA} ${vehiculoSeleccionado.MODELO} - ${vehiculoSeleccionado.PLACA}`
  };

  try {
    const solapamiento = await validarSolapamiento(idVehiculoNuevo, fechaReserva, fechaEntrega, id);
    if (solapamiento) return mostrarToast("El vehículo ya está reservado en ese rango de fechas.", "danger");

    if (id) {
      await updateDoc(doc(db, "reservas", id), reserva);
    } else {
      await addDoc(reservasRef, reserva);
    }

    bootstrap.Modal.getInstance(document.getElementById("modalReserva")).hide();
    mostrarToast("Reserva guardada correctamente.", "success");
  } catch (error) {
    console.error(error);
    mostrarToast("Error al guardar reserva.", "danger");
  }
}

async function eliminarReserva(id) {
  if (confirm("¿Deseas eliminar esta reserva?")) {
    try {
      const docSnap = await getDoc(doc(db, "reservas", id));
      if (docSnap.exists()) {
        const data = docSnap.data();
        await updateDoc(doc(db, "vehiculos", data.idVehiculo), { DISPONIBLE: true });
      }
      await deleteDoc(doc(db, "reservas", id));
      mostrarToast("Reserva eliminada.");
    } catch (error) {
      mostrarToast("Error al eliminar reserva.", "danger");
    }
  }
}
