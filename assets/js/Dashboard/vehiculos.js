import { db } from "../firebaseConfig.js";
import {
  collection,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc,
  addDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-storage.js";
import { mostrarToast } from "../toast.js";

const vehiculosRef = collection(db, "vehiculos");
const storage = getStorage();

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

export function abrirModalVehiculo() {
  document.querySelectorAll("#modalVehiculo input, #modalVehiculo select").forEach(e => e.value = "");
  document.getElementById("disponible").value = "true";
  document.getElementById("previewFotoVehiculo").style.display = "none";
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

    const preview = document.getElementById("previewFotoVehiculo");
    if (data.FOTO) {
      preview.src = data.FOTO;
      preview.style.display = "block";
    } else {
      preview.style.display = "none";
    }

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
  const archivoImagen = document.getElementById("fotoVehiculo").files[0];

  try {
    if (archivoImagen) {
      const refImg = storageRef(storage, `vehiculos/${Date.now()}_${archivoImagen.name}`);
      await uploadBytes(refImg, archivoImagen);
      const url = await getDownloadURL(refImg);
      vehiculo.FOTO = url;
    }

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

document.getElementById("fotoVehiculo").addEventListener("change", function () {
  const file = this.files[0];
  const preview = document.getElementById("previewFotoVehiculo");

  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      preview.src = e.target.result;
      preview.style.display = "block";
    };
    reader.readAsDataURL(file);
  } else {
    preview.src = "";
    preview.style.display = "none";
  }
});
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