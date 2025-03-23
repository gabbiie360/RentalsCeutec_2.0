import { db } from "./firebaseConfig.js";
import {
  collection, doc, deleteDoc, updateDoc, onSnapshot, getDoc, addDoc
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

// Sidebar toggle
document.getElementById("toggleSidebar").addEventListener("click", () => {
  const sidebar = document.getElementById("sidebar");
  const main = document.getElementById("mainContent");
  sidebar.classList.toggle("collapsed");
  main.classList.toggle("expanded");
});

// Secciones del dashboard
const links = document.querySelectorAll(".sidebar-link");
const secciones = document.querySelectorAll(".dashboard-section");

links.forEach((link, index) => {
  link.addEventListener("click", () => {
    secciones.forEach(s => s.classList.add("d-none"));
    links.forEach(l => l.classList.remove("active"));

    secciones[index].classList.remove("d-none");
    link.classList.add("active");
  });
});

// Referencias a Firestore
const usuariosRef = collection(db, "usuarios");
const vehiculosRef = collection(db, "vehiculos");
const reservasRef = collection(db, "reservas");

let vehiculosDisponibles = [];
let vehiculoAnteriorId = null;

// Mostrar toast
function mostrarToast(mensaje, tipo = "primary") {
  const toastElement = document.getElementById("toastMensaje");
  const toastTexto = document.getElementById("toastTexto");
  toastTexto.textContent = mensaje;
  toastElement.className = `toast align-items-center text-bg-${tipo} border-0`;
  const toast = new bootstrap.Toast(toastElement);
  toast.show();
}

// ==========================
// USUARIOS
// ==========================
function cargarUsuarios() {
  const tabla = document.getElementById("tablaUsuarios");
  tabla.innerHTML = "";

  onSnapshot(usuariosRef, (snapshot) => {
    tabla.innerHTML = "";
    snapshot.forEach((docu) => {
      const data = docu.data();
      const uid = docu.id;
      const email = data.email || "";
      const rol = data.rol || "user";
      if (!email.trim()) return;

      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${email}</td>
        <td>
          <select class="form-select form-select-sm" data-uid="${uid}">
            <option value="user" ${rol === "user" ? "selected" : ""}>Usuario</option>
            <option value="admin" ${rol === "admin" ? "selected" : ""}>Administrador</option>
          </select>
        </td>
        <td>
          <button class="btn btn-sm btn-danger" onclick="eliminarUsuario('${uid}')">
            <i class="fa fa-trash"></i>
          </button>
        </td>
      `;
      tabla.appendChild(fila);
    });

    document.querySelectorAll('select[data-uid]').forEach(select => {
      select.addEventListener("change", async function () {
        const nuevoRol = this.value;
        const uid = this.dataset.uid;
        try {
          await updateDoc(doc(db, "usuarios", uid), { rol: nuevoRol });
          mostrarToast("Rol actualizado correctamente.", "success");
        } catch (error) {
          mostrarToast("Error al actualizar el rol.", "danger");
        }
      });
    });
  });
}

window.eliminarUsuario = async function (uid) {
  if (confirm("¿Seguro que quieres eliminar este usuario?")) {
    try {
      await deleteDoc(doc(db, "usuarios", uid));
      mostrarToast("Usuario eliminado correctamente.");
    } catch (error) {
      mostrarToast("No se pudo eliminar el usuario.");
    }
  }
};

cargarUsuarios();

// ==========================
// VEHÍCULOS
// ==========================
function cargarVehiculos() {
  const tabla = document.getElementById("tablaVehiculos");
  tabla.innerHTML = "";

  onSnapshot(vehiculosRef, (snapshot) => {
    tabla.innerHTML = "";
    snapshot.forEach((docu) => {
      const data = docu.data();
      tabla.innerHTML += `
        <tr>
          <td>${data.MARCA}</td>
          <td>${data.MODELO}</td>
          <td>${data.PLACA}</td>
          <td>${data.AÑO}</td>
          <td>${data.DISPONIBLE ? "Sí" : "No"}</td>
          <td>
            <button class="btn btn-sm btn-secondary" onclick="editarVehiculo('${docu.id}')">
              <i class="fa fa-pen"></i>
            </button>
            <button class="btn btn-sm btn-danger" onclick="eliminarVehiculo('${docu.id}')">
              <i class="fa fa-trash"></i>
            </button>
          </td>
        </tr>
      `;
    });
  });
}

window.abrirModalVehiculo = function () {
  document.querySelectorAll("#modalVehiculo input, #modalVehiculo select").forEach(e => e.value = "");
  document.getElementById("disponible").value = "true";
  new bootstrap.Modal(document.getElementById("modalVehiculo")).show();
};

window.editarVehiculo = async function (id) {
  const docSnap = await getDoc(doc(db, "vehiculos", id));
  if (docSnap.exists()) {
    const data = docSnap.data();
    document.getElementById("vehiculoId").value = id;
    document.getElementById("marca").value = data.MARCA;
    document.getElementById("modelo").value = data.MODELO;
    document.getElementById("placa").value = data.PLACA;
    document.getElementById("anio").value = data.AÑO;
    document.getElementById("asientos").value = data.ASIENTOS;
    document.getElementById("combustible").value = data.COMBUSTIBLE;
    document.getElementById("transmision").value = data.TRANSMISION;
    document.getElementById("precioDia").value = data.PRECIO_DIA;
    document.getElementById("disponible").value = data.DISPONIBLE ? "true" : "false";
    new bootstrap.Modal(document.getElementById("modalVehiculo")).show();
  }
};

window.guardarVehiculo = async function () {
  const campos = ["marca", "modelo", "placa", "anio", "asientos", "combustible", "transmision", "precioDia"];
  for (let id of campos) {
    const valor = document.getElementById(id).value.trim();
    if (!valor) return mostrarToast("Todos los campos del vehículo son obligatorios.", "danger");
  }

  const vehiculo = {
    MARCA: document.getElementById("marca").value.trim(),
    MODELO: document.getElementById("modelo").value.trim(),
    PLACA: document.getElementById("placa").value.trim(),
    AÑO: parseInt(document.getElementById("anio").value),
    ASIENTOS: parseInt(document.getElementById("asientos").value),
    COMBUSTIBLE: document.getElementById("combustible").value.trim(),
    TRANSMISION: document.getElementById("transmision").value.trim(),
    PRECIO_DIA: parseFloat(document.getElementById("precioDia").value),
    DISPONIBLE: document.getElementById("disponible").value === "true",
    updatedAt: new Date()
  };

  const id = document.getElementById("vehiculoId").value;
  try {
    if (id) {
      await updateDoc(doc(db, "vehiculos", id), vehiculo);
      mostrarToast("Vehículo actualizado.", "success");
    } else {
      vehiculo.createdAt = new Date();
      await addDoc(vehiculosRef, vehiculo);
      mostrarToast("Vehículo agregado.", "success");
    }
    bootstrap.Modal.getInstance(document.getElementById("modalVehiculo")).hide();
  } catch (error) {
    mostrarToast("Error al guardar vehículo.", "danger");
  }
};

window.eliminarVehiculo = async function (id) {
  if (confirm("¿Seguro que deseas eliminar este vehículo?")) {
    try {
      await deleteDoc(doc(db, "vehiculos", id));
      mostrarToast("Vehículo eliminado correctamente.");
    } catch (error) {
      mostrarToast("No se pudo eliminar.");
    }
  }
};

cargarVehiculos();

// ==========================
// RESERVAS
// ==========================
function cargarReservas() {
  const tabla = document.getElementById("tablaReservas");
  tabla.innerHTML = "";

  onSnapshot(reservasRef, (snapshot) => {
    tabla.innerHTML = "";
    const ahora = new Date();

    snapshot.forEach((docu) => {
      const data = docu.data();
      const fechaEntrega = data["Fecha de entrega"]?.toDate();
      if (fechaEntrega < ahora) return; // Ocultar vencidas visualmente

      tabla.innerHTML += `
        <tr>
          <td>${data["Nombre Completo"]}</td>
          <td>${data.Email}</td>
          <td>${data["Numero de Telefono"]}</td>
          <td>${data["Recoges en"]}</td>
          <td>${data.nombreVehiculo}</td>
          <td>${data["Fecha de Reserva"]?.toDate().toLocaleString()}</td>
          <td>${data["Fecha de entrega"]?.toDate().toLocaleString()}</td>
          <td>
            <button class="btn btn-sm btn-secondary" onclick="editarReserva('${docu.id}')"><i class="fa fa-pen"></i></button>
            <button class="btn btn-sm btn-danger" onclick="eliminarReserva('${docu.id}')"><i class="fa fa-trash"></i></button>
          </td>
        </tr>
      `;
    });
  });
}

function cargarVehiculosParaReservas() {
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
  });
}

window.abrirModalReserva = function () {
  document.querySelectorAll("#modalReserva input").forEach(e => e.value = "");
  vehiculoAnteriorId = null;
  cargarVehiculosParaReservas();
  new bootstrap.Modal(document.getElementById("modalReserva")).show();
};

window.editarReserva = async function (id) {
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

    cargarVehiculosParaReservas();
    setTimeout(() => {
      document.getElementById("vehiculoReserva").value = vehiculoAnteriorId;
    }, 400);

    new bootstrap.Modal(document.getElementById("modalReserva")).show();
  }
};

window.guardarReserva = async function () {
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
    if (id) {
      await updateDoc(doc(db, "reservas", id), reserva);
    } else {
      await addDoc(reservasRef, reserva);
    }
    await updateDoc(doc(db, "vehiculos", idVehiculoNuevo), { DISPONIBLE: false });

    if (vehiculoAnteriorId && vehiculoAnteriorId !== idVehiculoNuevo) {
      await updateDoc(doc(db, "vehiculos", vehiculoAnteriorId), { DISPONIBLE: true });
    }

    bootstrap.Modal.getInstance(document.getElementById("modalReserva")).hide();
  } catch (error) {
    mostrarToast("Error al guardar reserva.", "danger");
  }
};

window.eliminarReserva = async function (id) {
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
};

cargarReservas();

// ==========================
// CERRAR SESIÓN
// ==========================
document.getElementById("logout").addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "login.html";
});
