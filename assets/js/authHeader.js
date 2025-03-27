// authHeader.js
import { auth, db } from "./firebaseConfig.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
import { mostrarToast } from "./toast.js";

// Esperar a que el DOM esté cargado
document.addEventListener("DOMContentLoaded", () => {
  const headerButton = document.querySelector(".header-button");
  if (!headerButton) return;

  auth.onAuthStateChanged(async (user) => {
    if (user) {
      try {
        const docSnap = await getDoc(doc(db, "usuarios", user.uid));
        const data = docSnap.exists() ? docSnap.data() : {};
        const esAdmin = data.rol === "admin";
        const fotoPerfil = data.fotoPerfil || "assets/img/Avatars/avatar-icon.svg";
        mostrarMenuUsuario(esAdmin, fotoPerfil);
      } catch (error) {
        console.error("Error obteniendo datos del usuario:", error);
        mostrarMenuUsuario(false, "assets/img/Avatars/avatar-icon.svg");
      }
    } else {
      mostrarBotonLogin();
    }
  });
});

// Mostrar botón de login
function mostrarBotonLogin() {
  const headerButton = document.querySelector(".header-button");
  if (!headerButton) return;

  headerButton.innerHTML = `
    <a href="login.html" id="loginButton" class="theme-btn">
      ¡Inicia Sesión o Regístrate!
    </a>
  `;
}

// Mostrar ícono con submenú (dinámico con rol y foto)
function mostrarMenuUsuario(esAdmin, fotoPerfil) {
  const headerButton = document.querySelector(".header-button");
  if (!headerButton) return;

  headerButton.innerHTML = `
    <div id="userIcon" style="cursor: pointer; position: relative;">
      <img src="${fotoPerfil}" alt="Usuario" width="40px" height="40px" style="border-radius: 50%; object-fit: cover;">
      <div id="userMenu" class="user-menu d-none" style="position: absolute; top: 50px; right: 0; background: white; border: 1px solid #ccc; padding: 10px; z-index: 1000;">
        <a href="userProfile.html">Mi Perfil</a><br>
        <a href="reservations.html">Mis Reservas</a><br>
        ${esAdmin ? `<a href="dashboardAdmin.html">Dashboard</a><br>` : ""}
        <a href="#" id="logoutButton" class="logout-btn">Cerrar Sesión</a>
      </div>
    </div>
  `;

  const userIcon = document.getElementById("userIcon");
  const userMenu = document.getElementById("userMenu");

  userIcon.addEventListener("click", (e) => {
    e.stopPropagation();
    userMenu.classList.toggle("d-none");
  });

  document.addEventListener("click", (e) => {
    if (!userIcon.contains(e.target)) {
      userMenu.classList.add("d-none");
    }
  });

  // Cierre de sesión
  const logoutButton = document.getElementById("logoutButton");
  logoutButton.addEventListener("click", async (e) => {
    e.preventDefault();
    try {
      await signOut(auth);
      localStorage.clear();
      location.href = "login.html";
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      mostrarToast("Error al cerrar sesión", "danger");
    }
  });
}
