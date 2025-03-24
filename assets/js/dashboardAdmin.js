import { db } from "./firebaseConfig.js";

import {
    collection,
    addDoc,
    updateDoc,
    query,
    where,
    doc,
    getDoc,
    getDocs,
    deleteDoc,
    onSnapshot
  } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
  
  import { mostrarToast } from "./toast.js";
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


// ==========================
// USUARIOS
// ==========================
function cargarUsuarios() {
  const tabla = document.getElementById("tablaUsuarios");
  tabla.innerHTML = "";

  const filtroCorreo = document.getElementById("filtroUsuarioCorreo").value.toLowerCase();
  const filtroRol = document.getElementById("filtroRol").value;

  onSnapshot(usuariosRef, (snapshot) => {
    tabla.innerHTML = "";
    snapshot.forEach((docu) => {
      const data = docu.data();
      const uid = docu.id;
      const email = data.email || "";
      const rol = data.rol || "user";
      if (!email.trim()) return;

      const coincideCorreo = email.toLowerCase().includes(filtroCorreo);
      const coincideRol = !filtroRol || rol === filtroRol;

      if (coincideCorreo && coincideRol) {
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
      }
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
// === FILTROS USUARIOS ===
document.getElementById("filtroUsuarioCorreo").addEventListener("input", cargarUsuarios);
document.getElementById("filtroRol").addEventListener("change", cargarUsuarios);
document.getElementById("limpiarFiltrosUsuarios").addEventListener("click", () => {
  document.getElementById("filtroUsuarioCorreo").value = "";
  document.getElementById("filtroRol").value = "";
  cargarUsuarios();
});



// ==========================
// VEHÍCULOS
// ==========================
    

    function cargarVehiculos() {
    const tabla = document.getElementById("tablaVehiculos");
    tabla.innerHTML = "";
  
    onSnapshot(vehiculosRef, (snapshot) => {
      tabla.innerHTML = "";
  
      const marcaFiltro = document.getElementById("filtroMarca").value.toLowerCase();
      const dispoFiltro = document.getElementById("filtroDisponibilidad").value;
      const anioFiltro = document.getElementById("filtroAnio").value;
      const precioMin = parseFloat(document.getElementById("precioMin").value);
      const precioMax = parseFloat(document.getElementById("precioMax").value);
  
      snapshot.forEach((docu) => {
        const data = docu.data();
  
        const cumpleMarca = !marcaFiltro || data.MARCA.toLowerCase().includes(marcaFiltro);
        const cumpleDispo = dispoFiltro === "" || data.DISPONIBLE.toString() === dispoFiltro;
        const cumpleAnio = !anioFiltro || data.AÑO.toString() === anioFiltro;
        const cumplePrecio = (!precioMin || data.PRECIO_DIA >= precioMin) &&
                             (!precioMax || data.PRECIO_DIA <= precioMax);
  
        if (cumpleMarca && cumpleDispo && cumpleAnio && cumplePrecio) {
          tabla.innerHTML += `
          <tr>
            <td>${data.MARCA}</td>
            <td>${data.MODELO}</td>
            <td>${data.PLACA}</td>
            <td>${data.AÑO}</td>
            <td>L. ${data.PRECIO_DIA.toFixed(2)}</td>
            <td><span class="badge ${data.DISPONIBLE ? 'bg-success' : 'bg-danger'}">${data.DISPONIBLE ? 'Disponible' : 'No disponible'}</span></td>
            <td id="proximaReserva-${docu.id}">Cargando...</td>
            <td>
              <button class="btn btn-sm btn-secondary" onclick="editarVehiculo('${docu.id}')"><i class="fa fa-pen"></i></button>
              <button class="btn btn-sm btn-danger" onclick="eliminarVehiculo('${docu.id}')"><i class="fa fa-trash"></i></button>
            </td>
          </tr>
          `;
          mostrarProximaReserva(docu.id);
        }
      });
    });
  }

  

async function mostrarProximaReserva(idVehiculo) {
    const reservasSnap = await getDocs(query(reservasRef, where("idVehiculo", "==", idVehiculo)));
    const ahora = new Date();
  
    let proxima = null;
  
    reservasSnap.forEach((doc) => {
      const data = doc.data();
      const inicio = data["Fecha de Reserva"]?.toDate();
      if (inicio && inicio > ahora) {
        if (!proxima || inicio < proxima) {
          proxima = inicio;
        }
      }
    });
  
    const celda = document.getElementById(`proximaReserva-${idVehiculo}`);
    celda.textContent = proxima ? proxima.toLocaleString() : "Sin próximas";
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

document.getElementById("limpiarFiltrosVehiculos").addEventListener("click", () => {
    document.getElementById("filtroMarca").value = "";
    document.getElementById("filtroDisponibilidad").value = "";
    document.getElementById("filtroAnio").value = "";
    document.getElementById("precioMin").value = "";
    document.getElementById("precioMax").value = "";
    cargarVehiculos();
  });
  

// Escuchar cambios en los filtros
document.getElementById("filtroMarca").addEventListener("input", cargarVehiculos);
document.getElementById("filtroAnio").addEventListener("input", cargarVehiculos);
document.getElementById("precioMin").addEventListener("input", cargarVehiculos);
document.getElementById("precioMax").addEventListener("input", cargarVehiculos);
document.getElementById("filtroDisponibilidad").addEventListener("change", cargarVehiculos);


// ==========================
// RESERVAS
// ==========================
function cargarReservas() {
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

    // Ordenar por Fecha de Reserva descendente
    reservas.sort((a, b) => b.fechaReserva - a.fechaReserva);

    // Renderizar
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

  cargarReservas();
    document.getElementById("limpiarFiltrosReservas").addEventListener("click", () => {
    document.getElementById("filtroDesde").value = "";
    document.getElementById("filtroHasta").value = "";
    document.getElementById("filtroUsuario").value = "";
    document.getElementById("filtroEstado").value = "";
    cargarReservas();
  });
  
  

  ["filtroDesde", "filtroHasta", "filtroUsuario", "filtroEstado"].forEach(id => {
    document.getElementById(id).addEventListener("input", cargarReservas);
  });
  
  
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

async function validarSolapamiento(idVehiculo, nuevaInicio, nuevaFin, idReservaActual = null) {
    const snapshot = await getDoc(query(reservasRef, where("idVehiculo", "==", idVehiculo)));
  
    for (const docu of snapshot.docs) {
      if (idReservaActual && docu.id === idReservaActual) continue;
  
      const data = docu.data();
      const inicio = data["Fecha de Reserva"]?.toDate();
      const fin = data["Fecha de entrega"]?.toDate();
  
      const solapa = (nuevaInicio < fin) && (nuevaFin > inicio);
      if (solapa) return true;
    }
  
    return false;
  }
  

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
    // Validar solapamiento de fechas con reservas existentes del mismo vehículo
    const solapamiento = await validarSolapamiento(idVehiculoNuevo, fechaReserva, fechaEntrega, id);
    if (solapamiento) {
      return mostrarToast("El vehículo ya está reservado en ese rango de fechas.", "danger");
    }
  
    if (id) {
      await updateDoc(doc(db, "reservas", id), reserva);
    } else {
      await addDoc(reservasRef, reserva);
    }
  
    // Solo marcar como no disponible si la reserva es inmediata
    bootstrap.Modal.getInstance(document.getElementById("modalReserva")).hide();
    mostrarToast("Reserva guardada correctamente.", "success");
  } catch (error) {
    console.error(error);
    mostrarToast("Error al guardar reserva.", "danger");
  }
  
}
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
  