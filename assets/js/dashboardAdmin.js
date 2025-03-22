import { db } from "./firebaseConfig.js";
import {
  addDoc,
  collection,
  doc,
  deleteDoc,
  updateDoc,
  onSnapshot,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

// ============================
// === CRUD USUARIOS =====
// ============================

const usuariosRef = collection(db, "usuarios");

function cargarUsuarios() {
  const tabla = document.getElementById("tablaUsuarios");
  tabla.innerHTML = "";

  onSnapshot(usuariosRef, (snapshot) => {
    tabla.innerHTML = "";

    snapshot.forEach((docu) => {
      const data = docu.data();
      const uid = docu.id;
      const rol = data.rol || "user";

      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${data.email}</td>
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
          alert("Rol actualizado correctamente.");
        } catch (error) {
          console.error("Error al actualizar el rol:", error);
          alert("Hubo un error al actualizar el rol.");
        }
      });
    });
  });
}

window.eliminarUsuario = async function (uid) {
  if (confirm("¿Seguro que quieres eliminar este usuario?")) {
    try {
      await deleteDoc(doc(db, "usuarios", uid));
      alert("Usuario eliminado correctamente.");
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      alert("No se pudo eliminar el usuario.");
    }
  }
};

cargarUsuarios();

// ============================
// === CRUD VEHÍCULOS =====
// ============================

const vehiculosRef = collection(db, "vehiculos");

function cargarVehiculos() {
  const tabla = document.getElementById("tablaVehiculos");
  tabla.innerHTML = "";

  onSnapshot(vehiculosRef, (snapshot) => {
    tabla.innerHTML = "";
    snapshot.forEach((docu) => {
      const data = docu.data();
      const fila = `
        <tr>
          <td>${data.MARCA || "-"}</td>
          <td>${data.MODELO || "-"}</td>
          <td>${data.PLACA || "-"}</td>
          <td>${data.AÑO || "-"}</td>
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
      tabla.innerHTML += fila;
    });
  });
}

window.abrirModalVehiculo = function () {
  document.getElementById("vehiculoId").value = ""; // para diferenciar nuevo o editar
  document.getElementById("marca").value = "";
  document.getElementById("modelo").value = "";
  document.getElementById("placa").value = "";
  document.getElementById("anio").value = "";
  document.getElementById("asientos").value = "";
  document.getElementById("combustible").value = "";
  document.getElementById("transmision").value = "";
  document.getElementById("precioDia").value = "";
  document.getElementById("disponible").value = "true";

  new bootstrap.Modal(document.getElementById("modalVehiculo")).show();
};

window.editarVehiculo = async function (id) {
  const docSnap = await getDoc(doc(db, "vehiculos", id));
  if (docSnap.exists()) {
    const data = docSnap.data();
    document.getElementById("vehiculoId").value = id;
    document.getElementById("marca").value = data.MARCA || "";
    document.getElementById("modelo").value = data.MODELO || "";
    document.getElementById("placa").value = data.PLACA || "";
    document.getElementById("anio").value = data.AÑO || "";
    document.getElementById("asientos").value = data.ASIENTOS || "";
    document.getElementById("combustible").value = data.COMBUSTIBLE || "";
    document.getElementById("transmision").value = data.TRANSMISION || "";
    document.getElementById("precioDia").value = data.PRECIO_DIA || "";
    document.getElementById("disponible").value = data.DISPONIBLE ? "true" : "false";

    new bootstrap.Modal(document.getElementById("modalVehiculo")).show();
  }
};

window.guardarVehiculo = async function () {
  const id = document.getElementById("vehiculoId").value;
  const vehiculo = {
    MARCA: document.getElementById("marca").value.trim(),
    MODELO: document.getElementById("modelo").value.trim(),
    PLACA: document.getElementById("placa").value.trim(),
    AÑO: parseInt(document.getElementById("anio").value.trim()),
    ASIENTOS: parseInt(document.getElementById("asientos").value.trim()),
    COMBUSTIBLE: document.getElementById("combustible").value.trim(),
    TRANSMISION: document.getElementById("transmision").value.trim(),
    PRECIO_DIA: parseFloat(document.getElementById("precioDia").value.trim()),
    DISPONIBLE: document.getElementById("disponible").value === "true",
    updatedAt: new Date()
  };

  try {
    if (id) {
      await updateDoc(doc(db, "vehiculos", id), vehiculo);
      alert("Vehículo actualizado.");
    } else {
      vehiculo.createdAt = new Date();
      await addDoc(vehiculosRef, vehiculo);
      alert("Vehículo agregado.");
    }

    bootstrap.Modal.getInstance(document.getElementById("modalVehiculo")).hide();
  } catch (error) {
    console.error("Error al guardar vehículo:", error);
    alert("No se pudo guardar.");
  }
};

window.eliminarVehiculo = async function (id) {
  if (confirm("¿Seguro que deseas eliminar este vehículo?")) {
    try {
      await deleteDoc(doc(db, "vehiculos", id));
      alert("Vehículo eliminado correctamente.");
    } catch (error) {
      console.error("Error al eliminar vehículo:", error);
      alert("No se pudo eliminar.");
    }
  }
};

cargarVehiculos();

document.getElementById("logout").addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "login.html";
});
