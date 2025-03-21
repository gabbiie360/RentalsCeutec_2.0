import { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, googleProvider, githubProvider, microsoftProvider } from "./firebaseConfig.js";

// Inicio de sesión con correo
document.getElementById("btnLogin").addEventListener("click", async function () {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("Usuario autenticado:", userCredential.user);
        alert("Inicio de sesión exitoso");
        window.location.href = "index-2.html";
    } catch (error) {
        console.error("Error en el inicio de sesión:", error.message);
        alert("Error: " + error.message);
    }
});

// Inicio de sesión con Google
document.getElementById("btnGoogle").addEventListener("click", async function () {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        console.log("Usuario autenticado con Google:", result.user);
        alert("Inicio de sesión con Google exitoso");
        window.location.href = "index-2.html";
    } catch (error) {
        console.error("Error con Google:", error.message);
    }
});

// Inicio de sesión con GitHub
document.getElementById("btnGitHub").addEventListener("click", async function () {
    try {
        const result = await signInWithPopup(auth, githubProvider);
        console.log("Usuario autenticado con GitHub:", result.user);
        alert("Inicio de sesión con GitHub exitoso");
        window.location.href = "index-2.html";
    } catch (error) {
        console.error("Error con GitHub:", error.message);
    }
});

// Inicio de sesión con Microsoft
document.getElementById("btnMicrosoft").addEventListener("click", async function () {
    try {
        const result = await signInWithPopup(auth, microsoftProvider);
        console.log("Usuario autenticado con Microsoft:", result.user);
        alert("Inicio de sesión con Microsoft exitoso");
        window.location.href = "index-2.html";
    } catch (error) {
        console.error("Error con Microsoft:", error.message);
    }
});

// Registro de usuario con correo
document.getElementById("registerEmail").addEventListener("click", async (event) => {
    event.preventDefault(); // Evita recargar la página

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (email === "" || password === "") {
        alert("Por favor, ingresa un correo y una contraseña.");
        return;
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        alert("Registro exitoso. Bienvenido, " + userCredential.user.email);
        document.getElementById("userInfo").textContent = "Bienvenido, " + userCredential.user.email;
        document.getElementById("logout").style.display = "block";
    } catch (error) {
        console.error("Error en el registro:", error.message);
        alert("Error: " + error.message);
    }
});
