import { auth, db } from "./firebaseConfig.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

export function inicializarAutenticacion(onLoginExitoso) {
  auth.onAuthStateChanged(async (user) => {
    if (!user) return (window.location.href = "index.html");

    const docSnap = await getDoc(doc(db, "usuarios", user.uid));
    if (!docSnap.exists() || docSnap.data().rol !== "admin") {
      return (window.location.href = "index.html");
    }

    // Mostrar contenido si el usuario es admin
    document.body.style.display = "block";

    // Mostrar nombre en el sidebar
    const nombre = docSnap.data().firstName || user.email;
    document.getElementById("nombreTexto").textContent = nombre;

    // Mostrar foto de perfil en el sidebar (si existe)
    const fotoPerfil = docSnap.data().fotoPerfil;
    const avatar = document.getElementById("adminUserPhoto");
    if (avatar && fotoPerfil) {
      avatar.src = fotoPerfil;
    }

    

    // Botón para colapsar el sidebar
    document.getElementById("toggleSidebar").addEventListener("click", () => {
      document.getElementById("sidebar").classList.toggle("collapsed");
      document.getElementById("mainContent").classList.toggle("expanded");
    });

    // Navegación entre secciones del dashboard
    const links = document.querySelectorAll(".sidebar-link");
    const secciones = document.querySelectorAll(".dashboard-section");

    links.forEach((link, index) => {
      link.addEventListener("click", () => {
        secciones.forEach(s => s.classList.add("d-none"));
        links.forEach(l => l.classList.remove("active"));
        secciones[index].classList.remove("d-none");
        link.classList.add("active");
      });
    });

    // Ejecutar función adicional si se proporciona
    if (onLoginExitoso) onLoginExitoso();
  });
}
