import { db } from "../firebaseConfig.js";
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, getDoc, query, where } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
import { mostrarToast } from "../toast.js";

const reservasRef = collection(db, "reservas");

export function cargarReservas() {
  const tabla = document.getElementById("tablaReservas");
  tabla.innerHTML = "";

  onSnapshot(reservasRef, (snapshot) => {
    const ahora = new Date();
    const desde = document.getElementById("filtroDesde")?.valueAsDate;
    const hasta = document.getElementById("filtroHasta")?.valueAsDate;
    const usuarioFiltro = document.getElementById("filtroUsuario")?.value.toLowerCase();
    const estadoFiltro = document.getElementById("filtroEstado")?.value;

    let reservas = [];

    snapshot.forEach((docu) => {
      const data = docu.data();
      const fechaReserva = data["Fecha de Reserva"]?.toDate();
      const fechaEntrega = data["Fecha de entrega"]?.toDate();

      if (!fechaReserva || !fechaEntrega) return;

      if (desde && fechaReserva < desde) return;
      if (hasta && fechaReserva > hasta) return;
      if (usuarioFiltro && !data.Email.toLowerCase().includes(usuarioFiltro)) return;
      if (estadoFiltro === "futuras" && fechaEntrega < ahora) return;
      if (estadoFiltro === "pasadas" && fechaEntrega >= ahora) return;

      reservas.push({ id: docu.id, ...data, fechaReserva, fechaEntrega });
    });

    reservas.sort((a, b) => b.fechaReserva - a.fechaReserva);

    reservas.forEach((data) => {
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
  });
}

export async function guardarReserva() {
  const campos = ["nombreCompleto", "emailReserva", "telefono", "ubicacion", "fechaReserva", "fechaEntrega"];
  for (let id of campos) {
    const valor = document.getElementById(id).value.trim();
    if (!valor) return mostrarToast("Todos los campos son obligatorios.", "danger");
  }

  const id = document.getElementById("reservaId").value;
  const idVehiculoNuevo = document.getElementById("vehiculoReserva").value;
  const fechaReserva = new Date(document.getElementById("fechaReserva").value);
  const fechaEntrega = new Date(document.getElementById("fechaEntrega").value);

  if (fechaEntrega <= fechaReserva) return mostrarToast("La fecha de entrega debe ser posterior a la fecha de reserva.", "warning");

  const reserva = {
    "Nombre Completo": document.getElementById("nombreCompleto").value.trim(),
    Email: document.getElementById("emailReserva").value.trim(),
    "Numero de Telefono": document.getElementById("telefono").value.trim(),
    "Recoges en": document.getElementById("ubicacion").value.trim(),
    "Fecha de Reserva": fechaReserva,
    "Fecha de entrega": fechaEntrega,
    idVehiculo: idVehiculoNuevo,
    nombreVehiculo: document.getElementById("vehiculoReserva").selectedOptions[0].textContent
  };

  try {
    if (id) {
      await updateDoc(doc(db, "reservas", id), reserva);
      mostrarToast("Reserva actualizada correctamente.", "success");
    } else {
      await addDoc(reservasRef, reserva);
      mostrarToast("Reserva creada correctamente.", "success");
    }
    bootstrap.Modal.getInstance(document.getElementById("modalReserva")).hide();
  } catch (error) {
    mostrarToast("Error al guardar la reserva.", "danger");
  }
}

export async function editarReserva(id) {
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
    document.getElementById("vehiculoReserva").value = data.idVehiculo;

    new bootstrap.Modal(document.getElementById("modalReserva")).show();
  }
}

export async function eliminarReserva(id) {
  if (confirm("¿Deseas eliminar esta reserva?")) {
    try {
      await deleteDoc(doc(db, "reservas", id));
      mostrarToast("Reserva eliminada correctamente.", "success");
    } catch (error) {
      mostrarToast("Error al eliminar la reserva.", "danger");
    }
  }
}
export function abrirModalReserva() {
  document.querySelectorAll("#modalReserva input").forEach((input) => (input.value = ""));
  document.getElementById("vehiculoReserva").innerHTML = '<option value="">Selecciona un vehículo</option>';
  new bootstrap.Modal(document.getElementById("modalReserva")).show();
}
window.abrirModalReserva = abrirModalReserva;