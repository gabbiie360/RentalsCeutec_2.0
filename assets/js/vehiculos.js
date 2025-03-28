import { db } from "./firebaseConfig.js";
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  where
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-storage.js";

import { mostrarToast } from "./toast.js";

const vehiculosRef = collection(db, "vehiculos");
const reservasRef = collection(db, "reservas");
const storage = getStorage();

export function inicializarVehiculos() {
  cargarVehiculos();

    document.getElementById("limpiarFiltrosVehiculos").addEventListener("click", () => {
    document.getElementById("filtroMarca").value = "";
    document.getElementById("filtroDisponibilidad").value = "";
    document.getElementById("filtroAnio").value = "";
    document.getElementById("precioMin").value = "";
    document.getElementById("precioMax").value = "";
    cargarVehiculos();
  });

  document.getElementById("filtroMarca").addEventListener("input", cargarVehiculos);
  document.getElementById("filtroAnio").addEventListener("input", cargarVehiculos);
  document.getElementById("precioMin").addEventListener("input", cargarVehiculos);
  document.getElementById("precioMax").addEventListener("input", cargarVehiculos);
  document.getElementById("filtroDisponibilidad").addEventListener("change", cargarVehiculos);

  document.getElementById("fotoVehiculo").addEventListener("change", function () {
    const file = this.files[0];
    const preview = document.getElementById("previewFotoVehiculo");

    if (file) {
      const extension = file.name.split('.').pop().toLowerCase();
      if (!["jpg", "jpeg", "png", "webp"].includes(extension)) {
        mostrarToast("Formato de imagen no permitido.", "warning");
        this.value = "";
        preview.src = "";
        preview.style.display = "none";
        return;
      }

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

  // Exponer funciones globalmente
  window.abrirModalVehiculo = abrirModalVehiculo;
  window.editarVehiculo = editarVehiculo;
  window.guardarVehiculo = guardarVehiculo;
  window.eliminarVehiculo = eliminarVehiculo;
}

function cargarVehiculos() {
  const tabla = document.getElementById("tablaVehiculos");
  const marcaFiltro = document.getElementById("filtroMarca").value.toLowerCase();
  const dispoFiltro = document.getElementById("filtroDisponibilidad").value;
  const anioFiltro = document.getElementById("filtroAnio").value;
  const precioMin = parseFloat(document.getElementById("precioMin").value);
  const precioMax = parseFloat(document.getElementById("precioMax").value);

  onSnapshot(vehiculosRef, (snapshot) => {
    tabla.innerHTML = "";
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
          <td>${data.PUERTAS}</td>
          <td>L. ${data.PRECIO_DIA.toFixed(2)}</td>
          <td><span class="badge ${data.DISPONIBLE ? 'bg-success' : 'bg-danger'}">${data.DISPONIBLE ? 'Disponible' : 'No disponible'}</span></td>
          <td id="proximaReserva-${docu.id}">Cargando...</td>
          <td>
            ${data.FOTO ? `<img src="${data.FOTO}" alt="foto" style="height:40px;border-radius:5px;margin-right:5px;">` : ""}
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
    if (inicio && inicio > ahora && (!proxima || inicio < proxima)) {
      proxima = inicio;
    }
  });

  const celda = document.getElementById(`proximaReserva-${idVehiculo}`);
  if (celda) celda.textContent = proxima ? proxima.toLocaleString() : "Sin próximas";
}

function abrirModalVehiculo() {
  document.querySelectorAll("#modalVehiculo input, #modalVehiculo select").forEach(e => e.value = "");
  document.getElementById("disponible").value = "true";
  document.getElementById("previewFotoVehiculo").style.display = "none";

  const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById("modalVehiculo"));
  modal.show();
}

async function editarVehiculo(id) {
  const docSnap = await getDoc(doc(db, "vehiculos", id));
  if (docSnap.exists()) {
    const data = docSnap.data();
    document.getElementById("vehiculoId").value = id;
    document.getElementById("marca").value = data.MARCA;
    document.getElementById("modelo").value = data.MODELO;
    document.getElementById("placa").value = data.PLACA;
    document.getElementById("anio").value = data.AÑO;
    document.getElementById("puertas").value = data.PUERTAS || "";
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

    const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById("modalVehiculo"));
    modal.show();
  }
}

async function guardarVehiculo() {
  const campos = ["marca", "modelo", "placa", "anio", "asientos", "combustible", "transmision", "precioDia", "puertas"];
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
    PUERTAS: parseInt(document.getElementById("puertas").value),
    DISPONIBLE: document.getElementById("disponible").value === "true",
    updatedAt: new Date()
  };

  const id = document.getElementById("vehiculoId").value;
  const archivoImagen = document.getElementById("fotoVehiculo").files[0];

  try {
    if (archivoImagen) {
      const extension = archivoImagen.name.split('.').pop().toLowerCase();
      if (!["jpg", "jpeg", "png", "webp"].includes(extension)) {
        return mostrarToast("Formato de imagen no permitido.", "warning");
      }

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
    console.error(error);
    mostrarToast("Error al guardar vehículo.", "danger");
  }
}

async function eliminarVehiculo(id) {
  try {
    const reservasSnap = await getDocs(query(reservasRef, where("idVehiculo", "==", id)));
    if (!reservasSnap.empty) {
      return mostrarToast("No se puede eliminar el vehículo porque tiene reservas activas.", "warning");
    }

    if (confirm("¿Seguro que deseas eliminar este vehículo?")) {
      await deleteDoc(doc(db, "vehiculos", id));
      mostrarToast("Vehículo eliminado correctamente.", "success");
    }
  } catch (error) {
    console.error("Error al eliminar vehículo:", error);
    mostrarToast("No se pudo eliminar el vehículo.", "danger");
  }
}
