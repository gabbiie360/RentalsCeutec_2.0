import { db } from "./firebaseConfig.js";
import {
  collection,
  doc,
  deleteDoc,
  updateDoc,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

import { mostrarToast } from "./toast.js";

const usuariosRef = collection(db, "usuarios");

export function inicializarUsuarios() {
  cargarUsuarios();

  document.getElementById("filtroUsuarioCorreo").addEventListener("input", cargarUsuarios);
  document.getElementById("filtroRol").addEventListener("change", cargarUsuarios);
  document.getElementById("limpiarFiltrosUsuarios").addEventListener("click", () => {
    document.getElementById("filtroUsuarioCorreo").value = "";
    document.getElementById("filtroRol").value = "";
    cargarUsuarios();
  });
}

function cargarUsuarios() {
  const tabla = document.getElementById("tablaUsuarios");
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
            <button class="btn btn-sm btn-danger" data-eliminar-usuario="${uid}">
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

    document.querySelectorAll("[data-eliminar-usuario]").forEach(btn => {
      btn.addEventListener("click", async () => {
        const uid = btn.dataset.eliminarUsuario;
        eliminarUsuario(uid);
      });
    });
  });
}

async function eliminarUsuario(uid) {
  if (confirm("¿Seguro que quieres eliminar este usuario?")) {
    try {
      await deleteDoc(doc(db, "usuarios", uid));
      mostrarToast("Usuario eliminado correctamente.");
    } catch (error) {
      mostrarToast("No se pudo eliminar el usuario.");
    }
  }
}
