console.log("reservations.js");
import { db } from "./firebaseConfig.js";
import {
    collection,
    query,
    where,
    onSnapshot,
    doc,
    getDoc
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
            tabla.innerHTML = "<tr><td colspan='3'>No hay reservas disponibles</td></tr>";
            return;
        }

        for (const reservaDoc of snapshot.docs) {
            const reservaData = reservaDoc.data();
            console.log("📝 Reserva encontrada:", reservaData);

            // Obtener datos del vehículo relacionado
            let vehiculoData = {};
            if (reservaData.idVehiculo) {
                const vehiculoDoc = await getDoc(doc(db, "vehiculos", reservaData.idVehiculo));
                vehiculoData = vehiculoDoc.exists() ? vehiculoDoc.data() : {};
            } else {
                console.warn(`⚠ Reserva ${reservaDoc.id} no tiene idVehiculo.`);
            }

            // Crear la fila en la tabla con los datos obtenidos
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${reservaData["Nombre Completo"] || "No disponible"}</td>
                <td>${vehiculoData["MARCA"] || "No asignado"}</td>
                <td>${vehiculoData["MODELO"] || "No asignado"}</td>
                <td>${vehiculoData["PLACA"] || "No asignado"}</td>
                <td>${vehiculoData["AÑO"] || "No asignado"}</td>
                <td>${vehiculoData["PRECIO_DIA"] || "No asignado"}</td>
                <td>${reservaData["Fecha de Reserva"] ? reservaData["Fecha de Reserva"].toDate().toLocaleDateString() : "No asignado"}</td>
                <td>${reservaData["Fecha de entrega"]? reservaData["Fecha de entrega"].toDate().toLocaleDateString() : "No asignado"}</td>
            `;
            tabla.appendChild(fila);
        }
    });
}

// Esperar a que el usuario inicie sesión y obtener su Email
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log(`✅ Usuario logueado: ${user.email}`);
        cargarReservas(user.email); // Filtrar reservas por Email
    } else {
        console.log("❌ No hay usuario logueado");
        document.getElementById("reservationsTableBody").innerHTML = "<tr><td colspan='3'>No hay reservas disponibles</td></tr>";
    }
});
