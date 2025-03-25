import { auth, db } from "./firebaseConfig.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

export function inicializarAutenticacion(onLoginExitoso) {
  auth.onAuthStateChanged(async (user) => {
    if (!user) return (window.location.href = "index.html");

    const docSnap = await getDoc(doc(db, "usuarios", user.uid));
    if (!docSnap.exists() || docSnap.data().rol !== "admin") {
      return (window.location.href = "index.html");
    }

    document.body.style.display = "block";
    const nombre = docSnap.data().firstName || user.email;
    document.getElementById("nombreTexto").textContent = nombre;

    document.getElementById("toggleSidebar").addEventListener("click", () => {
      document.getElementById("sidebar").classList.toggle("collapsed");
      document.getElementById("mainContent").classList.toggle("expanded");
    });

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

    // Ejecutar función callback cuando la autenticación es exitosa
    if (onLoginExitoso) onLoginExitoso();
  });
}
