import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";

document.getElementById("btnLogin").addEventListener("click", async function() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("Usuario autenticado:", userCredential.user);
        alert("Inicio de sesión exitoso");
        window.location.href = "index.html"; // Redirigir a la página principal
    } catch (error) {
        console.error("Error en el inicio de sesión:", error.message);
        alert("Error: " + error.message);
    }
});

import { getAuth, signInWithPopup, GoogleAuthProvider, GithubAuthProvider, OAuthProvider } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";

const auth = getAuth();

// Inicio de sesión con Google
document.getElementById("btnGoogle").addEventListener("click", async function() {
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        console.log("Usuario autenticado con Google:", result.user);
        alert("Inicio de sesión con Google exitoso");
        window.location.href = "index.html"; 
    } catch (error) {
        console.error("Error con Google:", error.message);
    }
});

// Inicio de sesión con GitHub
document.getElementById("btnGitHub").addEventListener("click", async function() {
    const provider = new GithubAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        console.log("Usuario autenticado con GitHub:", result.user);
        alert("Inicio de sesión con GitHub exitoso");
        window.location.href = "index.html";
    } catch (error) {
        console.error("Error con GitHub:", error.message);
    }
});

// Inicio de sesión con Microsoft
document.getElementById("btnMicrosoft").addEventListener("click", async function() {
    const provider = new OAuthProvider('microsoft.com');
    try {
        const result = await signInWithPopup(auth, provider);
        console.log("Usuario autenticado con Microsoft:", result.user);
        alert("Inicio de sesión con Microsoft exitoso");
        window.location.href = "index.html";
    } catch (error) {
        console.error("Error con Microsoft:", error.message);
    }
});
