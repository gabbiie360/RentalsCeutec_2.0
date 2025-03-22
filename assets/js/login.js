<<<<<<< Updated upstream
console.log("login.js cargado correctamente");
import { auth, db, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup,
        googleProvider, githubProvider, microsoftProvider } from "./firebaseConfig.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
=======
console.log("login.js cargado");
import { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, googleProvider,
    githubProvider, microsoftProvider, signOut, sendPasswordResetEmail } from "./firebaseConfig.js";
import { db } from "./firebaseConfig.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

//Elementos del DOM
const headerButton = document.querySelector(".header-button");

// Verificar si el usuario está autenticado
auth.onAuthStateChanged((user) => {
    if (user) {
        console.log("Usuario autenticado:", user.email);

        // Si el usuario está autenticado, mostrar icono y ocultar botón de login
        headerButton.innerHTML = `
            <a href="#" id="userIcon" class="theme-btn">
                <i class="fas fa-user"></i>
            </a>
        `;

        // Agregar evento para cerrar sesión
        document.getElementById("userIcon").addEventListener("click", async () => {
            await signOut(auth);
            window.location.reload();
        });
    } else {
        console.log("No hay usuario autenticado.");

        // Si el usuario no está autenticado, mostrar el botón de login
        headerButton.innerHTML = `
            <a href="login.html" class="theme-btn">
                ¡Inicia Sesión o Regístrate!
            </a>
        `;
    }
});
// Obtener el rol de un usuario
async function obtenerRol(uid) {
    const docRef = doc(db, "usuarios", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const data = docSnap.data();
        return data.rol || null;
    } else {
        return null;
    }
}

// Evento para mostrar el formulario de restablecimiento de contraseña
document.getElementById("forgotPasswordLink").addEventListener("click", function (event) {
    event.preventDefault();
    document.getElementById("forgotPasswordForm").style.display = "block";
});
>>>>>>> Stashed changes

// Evento para enviar el correo de restablecimiento de contraseña
document.getElementById("resetPasswordButton").addEventListener("click", async function () {
    const email = document.getElementById("resetEmail").value.trim();

    if (email === "") {
        alert("Por favor, ingresa un correo electrónico.");
        return;
    }

    try {
        await sendPasswordResetEmail(auth, email);
        alert("Se ha enviado un correo para restablecer la contraseña. Revisa tu bandeja de entrada.");
        document.getElementById("forgotPasswordForm").style.display = "none"; // Ocultar formulario después del envío
    } catch (error) {
        console.error("Error al restablecer la contraseña:", error.message);
        alert("Error: " + error.message);
    }
});

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

// Registro de usuario con correo y guardado en Firestore
document.getElementById("registerEmail").addEventListener("click", async (event) => {
    event.preventDefault(); // Evita recargar la página

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (email === "" || password === "") {
        alert("Por favor, ingresa un correo y una contraseña.");
        return;
    }

    try {
        // Registro en Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Guardar usuario en Firestore
        await setDoc(doc(db, "usuarios", user.uid), {
            email: user.email,
            uid: user.uid,
            password: password,
            createdAt: new Date()
        });

        alert("Registro exitoso. Bienvenido, " + user.email);
        document.getElementById("userInfo").textContent = "Bienvenido, " + user.email;
        document.getElementById("logout").style.display = "block";
    } catch (error) {
        console.error("Error en el registro:", error.message);
        alert("Error: " + error.message);
    }
});