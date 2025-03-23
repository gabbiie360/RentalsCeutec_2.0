import { db } from "./firebaseConfig.js";
import {
  collection,
  onSnapshot,
  updateDoc,
  getDocs,
  doc
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

const reservasRef = collection(db, "reservas");
const vehiculosRef = collection(db, "vehiculos");

actualizarDisponibilidadVehiculos();


// Esta función se encargará de actualizar los estados
function actualizarDisponibilidadVehiculos() {
    onSnapshot(reservasRef, async (snapshot) => {
      const hoy = new Date();
      const vehiculosConReservaActiva = new Set();
  
      snapshot.forEach((docu) => {
        const data = docu.data();
        const inicio = data["Fecha de Reserva"]?.toDate();
        const fin = data["Fecha de entrega"]?.toDate();
  
        if (inicio && fin && hoy >= inicio && hoy <= fin) {
          vehiculosConReservaActiva.add(data.idVehiculo);
        }
      });
  
      const snapshotVehiculos = await getDocs(vehiculosRef);
      snapshotVehiculos.forEach(async (vehiculo) => {
        const id = vehiculo.id;
        const estaActivo = vehiculosConReservaActiva.has(id);
  
        // Solo actualizamos si el estado es diferente
        if (vehiculo.data().DISPONIBLE === estaActivo) {
          await updateDoc(doc(db, "vehiculos", id), {
            DISPONIBLE: !estaActivo
          });
        }
      });
    });
  }
  