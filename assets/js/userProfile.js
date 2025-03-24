import { auth, db, storage } from "./firebaseConfig.js";
import {
  doc, getDoc, updateDoc
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
import {
  signOut, sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import {
  ref, uploadBytes, getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-storage.js";

import { mostrarToast } from "./toast.js";

let uidActual = null;

// ==========================
// Mostrar datos informativos
// ==========================
function mostrarDatosInformativos(data) {
  document.getElementById("profileName").textContent = data.nombre || "Usuario";
  document.getElementById("profileEmail").textContent = data.email || "Correo no disponible";
  document.getElementById("profilePhone").textContent = data.telefono || "No disponible";
  document.getElementById("profileAddress").textContent = data.direccion || "No disponible";
  document.getElementById("fotoPerfil").src = data.fotoPerfil || "assets/img/user-icon.png";
}

// ==========================
// Cargar datos del perfil
// ==========================
async function cargarDatosPerfil(uid) {
  try {
    const docRef = doc(db, "usuarios", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      mostrarDatosInformativos(data);

      // Limpiar campos del formulario al cargar
      document.getElementById("inputNombre").value = "";
      document.getElementById("inputTelefono").value = "";
      document.getElementById("inputDireccion").value = "";
    }
  } catch (error) {
    console.error("Error al cargar perfil:", error);
    mostrarToast("Error al cargar el perfil.", "danger");
  }
}

// ==========================
// Verificar sesión y cargar datos
// ==========================
auth.onAuthStateChanged(async (user) => {
  const headerButton = document.querySelector(".header-button");

  if (user) {
    uidActual = user.uid;

    headerButton.innerHTML = `
      <a href="#" id="userIcon" class="theme-btn">
        <i class="fas fa-user"></i>
      </a>
      <div id="userMenu" class="user-menu">
        <a href="userProfile.html">Mi Perfil</a>
        <a href="reservations.html">Mis Reservas</a>
      </div>
    `;

    document.getElementById("userIcon").addEventListener("click", async () => {
      await signOut(auth);
      window.location.reload();
    });

    await cargarDatosPerfil(uidActual);
  } else {
    headerButton.innerHTML = `
      <a href="login.html" class="theme-btn">
        ¡Inicia Sesión o Regístrate!
      </a>
    `;
  }
});

// ==========================
// Guardar cambios del perfil
// ==========================
document.getElementById("profileForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!uidActual) return;
  
    const nombre = document.getElementById("inputNombre").value.trim();
    const telefono = document.getElementById("inputTelefono").value.trim();
    const direccion = document.getElementById("inputDireccion").value.trim();
  
    const camposActualizados = {};
    if (nombre.length > 0) {
      if (nombre.length < 3) {
        return mostrarToast("El nombre debe tener al menos 3 caracteres.", "warning");
      }
      camposActualizados.nombre = nombre;
    }
  
    if (telefono.length > 0) {
      if (!/^[0-9+\-() ]{7,15}$/.test(telefono)) {
        return mostrarToast("Teléfono no válido.", "warning");
      }
      camposActualizados.telefono = telefono;
    }
  
    if (direccion.length > 0) {
      if (direccion.length < 5) {
        return mostrarToast("La dirección debe tener al menos 5 caracteres.", "warning");
      }
      camposActualizados.direccion = direccion;
    }
  
    if (Object.keys(camposActualizados).length === 0) {
      mostrarToast("No se detectaron cambios para guardar.", "info");
      return;
    }
  
    try {
      await updateDoc(doc(db, "usuarios", uidActual), camposActualizados);
      mostrarToast("¡Datos actualizados correctamente!", "success");
  
      // Refrescar los datos visuales
      const docRef = doc(db, "usuarios", uidActual);
      const updatedSnap = await getDoc(docRef);
      if (updatedSnap.exists()) {
        mostrarDatosInformativos(updatedSnap.data());
      }
  
      document.getElementById("profileForm").reset();
    } catch (error) {
      console.error("Error al guardar perfil:", error);
      mostrarToast("Ocurrió un error al guardar los cambios.", "danger");
    }
  });
  
// ==========================
// Subida de foto de perfil
// ==========================
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("inputFotoPerfil").addEventListener("change", async (e) => {
    const archivo = e.target.files[0];
    if (!archivo || !uidActual) return;

    const extension = archivo.name.split('.').pop().toLowerCase();
    const tiposPermitidos = ['jpg', 'jpeg', 'png', 'webp'];

    if (!tiposPermitidos.includes(extension)) {
      mostrarToast("Solo se permiten imágenes JPG, PNG o WebP.", "warning");
      return;
    }

    const preview = document.getElementById("fotoPerfil");
    preview.src = URL.createObjectURL(archivo); // Vista previa inmediata

    try {
      const ruta = `fotos_perfil/${uidActual}.${extension}`;
      const storageRef = ref(storage, ruta);
      await uploadBytes(storageRef, archivo);

      const url = await getDownloadURL(storageRef);
      await updateDoc(doc(db, "usuarios", uidActual), {
        fotoPerfil: url
      });

      preview.src = url;
      mostrarToast("Foto de perfil actualizada.", "success");
    } catch (error) {
      console.error("Error al subir imagen:", error);
      mostrarToast("Error al subir la foto de perfil.", "danger");
    }
  });
});

// ==========================
// Restablecer contraseña
// ==========================
document.getElementById("resetPasswordBtn")?.addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user || !user.email) {
    return mostrarToast("No se pudo obtener tu email.", "danger");
  }

  try {
    await sendPasswordResetEmail(auth, user.email);
    mostrarToast("Se ha enviado un correo para cambiar tu contraseña.", "info");
  } catch (error) {
    console.error("Error al enviar email:", error.message);
    mostrarToast("No se pudo enviar el correo.", "danger");
  }
});

// ==========================
// Cerrar sesión
// ==========================
document.getElementById("logoutBtn").addEventListener("click", async () => {
  try {
    await signOut(auth);
    localStorage.clear();
    window.location.href = "login.html";
  } catch (error) {
    console.error("Error al cerrar sesión:", error.message);
    mostrarToast("Error al cerrar sesión.", "danger");
  }
});
