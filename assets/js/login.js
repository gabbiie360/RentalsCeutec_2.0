console.log("login.js cargado correctamente");

import {
    auth, db,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    googleProvider,
    githubProvider,
    microsoftProvider,
    signOut,
    sendPasswordResetEmail,
    sendEmailVerification
} from "./firebaseConfig.js";

import {
    doc,
    setDoc,
    collection,
    query,
    where,
    getDoc,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

import { mostrarToast } from "./toast.js";


// Elementos del DOM
const headerButton = document.querySelector(".header-button");

// Verificar si el usuario está autenticado
auth.onAuthStateChanged((user) => {
    if (user) {
        console.log("Usuario autenticado:", user.email);
        headerButton.innerHTML = `
            <a href="#" id="userIcon" class="theme-btn">
                <i class="fas fa-user"></i>
            </a>
        `;
        document.getElementById("userIcon").addEventListener("click", async () => {
            await signOut(auth);
            window.location.reload();
        });
    } else {
        console.log("No hay usuario autenticado.");
        headerButton.innerHTML = `
            <a href="login.html" class="theme-btn">
                ¡Inicia Sesión o Regístrate!
            </a>
        `;
    }
});

// Obtener o crear el rol de un usuario
async function obtenerRol(uid, userInfo = null) {
    const docRef = doc(db, "usuarios", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const data = docSnap.data();
        return data.rol || null;
    } else if (userInfo) {
        // Crear usuario automáticamente si no existe
        await setDoc(docRef, {
            email: userInfo.email || "",
            firstName: userInfo.displayName || "Usuario",
            photoURL: userInfo.photoURL || "",
            rol: "user",
            uid: userInfo.uid,
            createdAt: new Date()
        });
        console.warn("Usuario creado en Firestore con rol 'user'");
        return "user";
    } else {
        return null;
    }
}

function redirigirPorRol(rol) {
    if (rol === "admin") {
        mostrarToast("Bienvenido administrador");
        window.location.href = "dashboardAdmin.html";
    } else if (rol === "user") {
        mostrarToast("Inicio de sesión exitoso");
        window.location.href = "index.html";
    } else {
        mostrarToast("Rol no asignado. Contacte al administrador.");
    }
}

// Restablecimiento de contraseña
document.getElementById("forgotPasswordLink").addEventListener("click", function (event) {
    event.preventDefault();
    document.getElementById("forgotPasswordForm").style.display = "block";
});

document.getElementById("resetPasswordButton").addEventListener("click", async function () {
    const resetEmail = document.getElementById("resetEmail").value.trim();

    if (resetEmail === "") {
        mostrarToast("Por favor, ingresa un correo electrónico.");
        return;
    }

    try {
        const usersRef = collection(db, "usuarios");
        const q = query(usersRef, where("email", "==", resetEmail));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            mostrarToast("El correo ingresado no está registrado en la base de datos.");
            return;
        }

        await sendPasswordResetEmail(auth, resetEmail);
        mostrarToast("Se ha enviado un correo para restablecer tu contraseña.");
    } catch (error) {
        console.error("Error al enviar el correo de restablecimiento:", error.message);
    }
});

// Inicio de sesión con correo
document.getElementById("btnLogin").addEventListener("click", async function () {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log("Usuario autenticado:", user);

        const rol = await obtenerRol(user.uid);
        console.log("Rol:", rol);
        redirigirPorRol(rol);
    } catch (error) {
        console.error("Error en el inicio de sesión:", error.message);
        mostrarToast("Invalid Credentials");
    }
});

// Login con Google
document.getElementById("btnGoogle").addEventListener("click", async function () {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        console.log("Usuario autenticado con Google:", user);

        const rol = await obtenerRol(user.uid, user);
        console.log("Rol:", rol);
        redirigirPorRol(rol);
    } catch (error) {
        console.error("Error con Google:", error.message);
        mostrarToast("Invalid Credentials");
    }
});

// Login con GitHub
document.getElementById("btnGitHub").addEventListener("click", async function () {
    try {
        const result = await signInWithPopup(auth, githubProvider);
        const user = result.user;
        console.log("Usuario autenticado con GitHub:", user);

        const rol = await obtenerRol(user.uid, user);
        console.log("Rol:", rol);
        redirigirPorRol(rol);
    } catch (error) {
        console.error("Error con GitHub:", error.message);
        mostrarToast("Invalid Credentials");
    }
});

// Login con Microsoft
document.getElementById("btnMicrosoft").addEventListener("click", async function () {
    try {
        const result = await signInWithPopup(auth, microsoftProvider);
        const user = result.user;
        console.log("Usuario autenticado con Microsoft:", user);

        const rol = await obtenerRol(user.uid, user);
        console.log("Rol:", rol);
        redirigirPorRol(rol);
    } catch (error) {
        console.error("Error con Microsoft:", error.message);
        mostrarToast("Ivalid Credentials");
    }
});

// Registro con correo
document.getElementById("registerEmail").addEventListener("click", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (email === "" || password === "") {
        mostrarToast("Por favor, ingresa un correo y una contraseña.");
        return;
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await sendEmailVerification(user);
        mostrarToast("Se ha enviado un correo de verificación. Por favor, revisa tu bandeja de entrada.");

        await setDoc(doc(db, "usuarios", user.uid), {
            email: user.email,
            rol: "user",
            verified: false,
            uid: user.uid,
            createdAt: new Date()
        });

        await signOut(auth);
        mostrarToast("Por favor, verifica tu correo antes de iniciar sesión.");
    } catch (error) {
        console.error("Error en el registro:", error.message);
        mostrarToast("Error: " + error.message);
    }
});
