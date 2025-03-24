import { db } from "./firebaseConfig.js";
import {
  collection, query, where, onSnapshot, doc,
  getDoc, deleteDoc, updateDoc
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
import {
  getAuth, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";

import { mostrarToast } from "./toast.js";
import "./authHeader.js"; // Para el menú del usuario

const auth = getAuth();
const reservasRef = collection(db, "reservas");

// ==========================
// Cargar reservas del usuario
// ==========================
async function cargarReservas(emailUsuario) {
  const tabla = document.getElementById("reservationsTableBody");
  tabla.innerHTML = "";

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
        vehiculoData = vehiculoDoc.exists() ? vehiculoDoc.data() : {};
      }

      const fechaReserva = reservaData["Fecha de Reserva"]?.toDate?.().toLocaleDateString() || "No asignado";
      const fechaEntrega = reservaData["Fecha de entrega"]?.toDate?.().toLocaleDateString() || "No asignado";

      const fila = document.createElement("tr");
      fila.innerHTML = `
        
        <td>${vehiculoData["MARCA"] || "No asignado"}</td>
        <td>${vehiculoData["MODELO"] || "No asignado"}</td>
        <td>${vehiculoData["PLACA"] || "No asignado"}</td>
        <td>${vehiculoData["AÑO"] || "No asignado"}</td>
        <td>${vehiculoData["PRECIO_DIA"] || "No asignado"}</td>
        <td>${fechaReserva}</td>
        <td>${fechaEntrega}</td>
        <td>
          <button class="btn-delete btn btn-sm btn-danger" data-id="${reservaId}">🗑️</button>
          <button class="btn-edit btn btn-sm btn-warning" data-id="${reservaId}">✏️</button>
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
  document.querySelectorAll(".btn-delete").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const id = e.currentTarget.dataset.id;
      if (confirm("¿Estás seguro de eliminar esta reserva?")) {
        await deleteDoc(doc(db, "reservas", id));
        mostrarToast("Reserva eliminada", "success");
      }
    });
  });

  document.querySelectorAll(".btn-edit").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const id = e.currentTarget.dataset.id;
      const nuevaFechaReserva = prompt("Nueva fecha de reserva (YYYY-MM-DD):");
      const nuevaFechaEntrega = prompt("Nueva fecha de entrega (YYYY-MM-DD):");

      if (nuevaFechaReserva && nuevaFechaEntrega) {
        try {
          await updateDoc(doc(db, "reservas", id), {
            "Fecha de Reserva": new Date(nuevaFechaReserva),
            "Fecha de entrega": new Date(nuevaFechaEntrega),
          });
          mostrarToast("Reserva actualizada", "success");
        } catch (error) {
          console.error("Error actualizando:", error);
          mostrarToast("Error al actualizar la reserva", "danger");
        }
      }
    });
  });
}

// ==========================
// Verificar sesión
// ==========================
onAuthStateChanged(auth, (user) => {
  if (user) {
    cargarReservas(user.email);
  } else {
    document.getElementById("reservationsTableBody").innerHTML =
      "<tr><td colspan='9'>No hay reservas disponibles</td></tr>";
  }
});
