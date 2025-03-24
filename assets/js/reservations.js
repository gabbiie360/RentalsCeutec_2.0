console.log("reservations.js");
import { db } from "./firebaseConfig.js";
import {
    collection,
    query,
    where,
    onSnapshot,
    doc,
    getDoc,
    deleteDoc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";

// Referencias a Firestore
const reservasRef = collection(db, "reservas");
const auth = getAuth();

// Función para cargar las reservas del usuario logueado
async function cargarReservas(emailUsuario) {
    console.log(`📌 Buscando reservas para el usuario con Email: ${emailUsuario}`);

    const tabla = document.getElementById("reservationsTableBody");
    tabla.innerHTML = "";

    // Filtrar reservas por Email
    const q = query(reservasRef, where("Email", "==", emailUsuario));

    onSnapshot(q, async (snapshot) => {
        console.log(`✅ Total reservas encontradas: ${snapshot.docs.length}`);
        tabla.innerHTML = ""; // Limpiar tabla antes de agregar nuevas filas
        
        if (snapshot.empty) {
            console.warn("⚠ No hay reservas para este usuario.");
            tabla.innerHTML = "<tr><td colspan='9'>No hay reservas disponibles</td></tr>";
            return;
        }

        for (const reservaDoc of snapshot.docs) {
            const reservaData = reservaDoc.data();
            const reservaId = reservaDoc.id;
            console.log("📝 Reserva encontrada:", reservaData);

            // Obtener datos del vehículo relacionado
            let vehiculoData = {};
            if (reservaData.idVehiculo) {
                const vehiculoDoc = await getDoc(doc(db, "vehiculos", reservaData.idVehiculo));
                vehiculoData = vehiculoDoc.exists() ? vehiculoDoc.data() : {};
            }

            // Convertir fechas a formato legible
            const fechaReserva = reservaData["Fecha de Reserva"]?.toDate ? reservaData["Fecha de Reserva"].toDate().toLocaleDateString() : "No asignado";
            const fechaEntrega = reservaData["Fecha de entrega"]?.toDate ? reservaData["Fecha de entrega"].toDate().toLocaleDateString() : "No asignado";

            // Crear la fila en la tabla con los datos obtenidos
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${reservaData["Nombre Completo"] || "No disponible"}</td>
                <td>${vehiculoData["MARCA"] || "No asignado"}</td>
                <td>${vehiculoData["MODELO"] || "No asignado"}</td>
                <td>${vehiculoData["PLACA"] || "No asignado"}</td>
                <td>${vehiculoData["AÑO"] || "No asignado"}</td>
                <td>${vehiculoData["PRECIO_DIA"] || "No asignado"}</td>
                <td>${fechaReserva}</td>
                <td>${fechaEntrega}</td>
                <td>
                    <button class="btn-delete" data-id="${reservaId}">🗑️</button>
                    <button class="btn-edit" data-id="${reservaId}">✏️</button>
                </td>
            `;
            tabla.appendChild(fila);
        }
        agregarEventosBotones();
    });
}

// Función para agregar eventos a los botones de eliminar y editar
function agregarEventosBotones() {
    // Botones de eliminar
    document.querySelectorAll(".btn-delete").forEach((button) => {
        button.addEventListener("click", async (e) => {
            const reservaId = e.target.getAttribute("data-id");
            if (confirm("¿Estás seguro de eliminar esta reserva?")) {
                await deleteDoc(doc(db, "reservas", reservaId));
                alert("✅ Reserva eliminada exitosamente.");
            }
        });
    });

    // Botones de editar
    document.querySelectorAll(".btn-edit").forEach((button) => {
        button.addEventListener("click", async (e) => {
            const reservaId = e.target.getAttribute("data-id");

            // Pedir nuevas fechas al usuario
            const nuevaFechaReserva = prompt("Ingrese nueva fecha de reserva (YYYY-MM-DD):");
            const nuevaFechaEntrega = prompt("Ingrese nueva fecha de entrega (YYYY-MM-DD):");

            if (nuevaFechaReserva && nuevaFechaEntrega) {
                await updateDoc(doc(db, "reservas", reservaId), {
                    "Fecha de Reserva": new Date(nuevaFechaReserva),
                    "Fecha de entrega": new Date(nuevaFechaEntrega)
                });
                alert("✅ Reserva actualizada exitosamente.");
            }
        });
    });
}

// Esperar a que el usuario inicie sesión y obtener su Email
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log(`✅ Usuario logueado: ${user.email}`);
        cargarReservas(user.email); // Filtrar reservas por Email
    } else {
        console.log("❌ No hay usuario logueado");
        document.getElementById("reservationsTableBody").innerHTML = "<tr><td colspan='9'>No hay reservas disponibles</td></tr>";
    }
});
