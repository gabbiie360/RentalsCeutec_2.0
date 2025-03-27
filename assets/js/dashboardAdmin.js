import { inicializarAutenticacion } from "./authAdmin.js";
import { inicializarUsuarios } from "./usuarios.js";
import { inicializarVehiculos } from "./vehiculos.js";
import { inicializarReservas } from "./reservas.js";
import { auth } from "./firebaseConfig.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { mostrarToast } from "./toast.js";

  inicializarAutenticacion(() => {
  inicializarUsuarios();
  inicializarVehiculos();
  inicializarReservas();

  const logoutBtn = document.getElementById("logout");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      try {
        await signOut(auth);
        localStorage.clear();
        window.location.href = "login.html";
      } catch (error) {
        console.error("Error al cerrar sesión:", error);
        mostrarToast?.("Error al cerrar sesión", "danger");
      }
    });
  }

  document.getElementById("adminUserIcon").addEventListener("click", () => {
    window.location.href = "userProfile.html";
  });
  
});
