// car-details.js
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { db } from "./firebaseConfig.js";
import { doc, getDoc, addDoc, collection, Timestamp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
import { mostrarToast } from "./toast.js";

const auth = getAuth();
let currentUser = null;
let currentVehicleId = null;
let currentVehicleData = null;

// Detectar usuario logueado
auth.onAuthStateChanged(user => {
  currentUser = user;
});

// Escuchar clic en el botón de Enviar Solicitud
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.querySelector(".theme-btn[type='submit']");
  if (btn) {
    btn.addEventListener("click", async () => {
      if (!currentUser) {
        window.location.href = "login.html";
        return;
      }

      await cargarDatosVehiculo();
      llenarModalConDatos();

      const modal = new bootstrap.Modal(document.getElementById("modalSolicitudReserva"));
      modal.show();
    });
  }
});

// Obtener datos del vehículo actual desde el DOM
function cargarDatosVehiculo() {
  return new Promise((resolve) => {
    currentVehicleData = {
      marca: document.getElementById("marcaVehiculo")?.textContent || "",
      modelo: document.getElementById("modeloVehiculo")?.textContent || "",
    };

    // Aquí puedes capturar el ID del vehículo desde el URL o alguna data attribute
    // Suponiendo que tienes un atributo data-id
    const btn = document.querySelector(".theme-btn[type='submit']");
    currentVehicleId = btn?.dataset?.idvehiculo || "";

    resolve();
  });
}

// Llenar el modal con la info
function llenarModalConDatos() {
  document.getElementById("nombreUsuario").value = currentUser.displayName || "";
  document.getElementById("emailUsuario").value = currentUser.email || "";

  document.getElementById("marcaVehiculo").value = currentVehicleData.marca;
  document.getElementById("modeloVehiculo").value = currentVehicleData.modelo;
}

// Enviar solicitud (guardar en Firestore)
document.getElementById("formSolicitudReserva").addEventListener("submit", async (e) => {
  e.preventDefault();

  const fechaInicio = document.getElementById("fechaHoraReserva").value;
  const fechaFin = document.getElementById("fechaHoraEntrega").value;

  if (!fechaInicio || !fechaFin) {
    mostrarToast("Debes seleccionar ambas fechas", "warning");
    return;
  }

  if (new Date(fechaFin) <= new Date(fechaInicio)) {
    mostrarToast("La fecha de entrega debe ser posterior a la de reserva", "warning");
    return;
  }

  try {
    await addDoc(collection(db, "reservas"), {
      Email: currentUser.email,
      idVehiculo: currentVehicleId,
      "Fecha de Reserva": Timestamp.fromDate(new Date(fechaInicio)),
      "Fecha de entrega": Timestamp.fromDate(new Date(fechaFin))
    });

    mostrarToast("Solicitud enviada exitosamente", "success");
    bootstrap.Modal.getInstance(document.getElementById("modalSolicitudReserva")).hide();
  } catch (error) {
    console.error("Error al enviar la solicitud:", error);
    mostrarToast("Error al enviar la solicitud", "danger");
  }
});