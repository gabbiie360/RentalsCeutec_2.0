import { db } from "../firebaseConfig.js";
import { collection, onSnapshot, updateDoc, deleteDoc, doc, addDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
import { mostrarToast } from "../toast.js";

const vehiculosRef = collection(db, "vehiculos");

export function cargarVehiculos() {
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

export function abrirModalVehiculo() {
  document.querySelectorAll("#modalVehiculo input, #modalVehiculo select").forEach(e => e.value = "");
  document.getElementById("disponible").value = "true";
  new bootstrap.Modal(document.getElementById("modalVehiculo")).show();
}
window.abrirModalVehiculo = abrirModalVehiculo;
export async function editarVehiculo(id) {
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
}

export async function guardarVehiculo() {
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
}

export async function eliminarVehiculo(id) {
  if (confirm("¿Seguro que deseas eliminar este vehículo?")) {
    try {
      await deleteDoc(doc(db, "vehiculos", id));
      mostrarToast("Vehículo eliminado correctamente.");
    } catch (error) {
      mostrarToast("No se pudo eliminar.");
    }
  }
}