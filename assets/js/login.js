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

document.addEventListener("DOMContentLoaded", () => {
    const loginButton = document.getElementById("loginButton");
    const userIcon = document.getElementById("userIcon");
    const logoutButton = document.getElementById("logoutButton");

    // Mostrar botón o ícono según sesión
    auth.onAuthStateChanged((user) => {
        if (user) {
            console.log("Usuario autenticado:", user.email);
            if (loginButton) loginButton.style.display = "none";
            if (userIcon) userIcon.style.display = "block";
        } else {
            console.log("No hay usuario autenticado.");
            if (loginButton) loginButton.style.display = "block";
            if (userIcon) userIcon.style.display = "none";
        }
    });

    // Cerrar sesión
    if (logoutButton) {
        logoutButton.addEventListener("click", async (e) => {
            e.preventDefault();
            try {
                await signOut(auth);
                mostrarToast("Has cerrado sesión correctamente.");
                window.location.href = "login.html";
            } catch (error) {
                console.error("Error al cerrar sesión:", error);
                mostrarToast("Hubo un problema al cerrar sesión.");
            }
        });
    }

    // Función para obtener rol
    async function obtenerRol(uid, userInfo = null) {
        const docRef = doc(db, "usuarios", uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            return data.rol || null;
        } else if (userInfo) {
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

    // Restablecer contraseña
    const forgotLink = document.getElementById("forgotPasswordLink");
    const forgotForm = document.getElementById("forgotPasswordForm");
    const resetButton = document.getElementById("resetPasswordButton");

    if (forgotLink && forgotForm) {
        forgotLink.addEventListener("click", (event) => {
            event.preventDefault();
            forgotForm.style.display = "block";
        });
    }

    if (resetButton) {
        resetButton.addEventListener("click", async () => {
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
    }

    // Login con email
    const btnLogin = document.getElementById("btnLogin");
    if (btnLogin) {
        btnLogin.addEventListener("click", async () => {
            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value.trim();

            try {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                const rol = await obtenerRol(user.uid);
                redirigirPorRol(rol);
            } catch (error) {
                console.error("Error en el inicio de sesión:", error.message);
                mostrarToast("Credenciales inválidas");
            }
        });
    }

    // Login con Google
    const btnGoogle = document.getElementById("btnGoogle");
    if (btnGoogle) {
        btnGoogle.addEventListener("click", async () => {
            try {
                const result = await signInWithPopup(auth, googleProvider);
                const user = result.user;
                const rol = await obtenerRol(user.uid, user);
                redirigirPorRol(rol);
            } catch (error) {
                console.error("Error con Google:", error.message);
                mostrarToast("Credenciales inválidas");
            }
        });
    }

    // Login con GitHub
    const btnGitHub = document.getElementById("btnGitHub");
    if (btnGitHub) {
        btnGitHub.addEventListener("click", async () => {
            try {
                const result = await signInWithPopup(auth, githubProvider);
                const user = result.user;
                const rol = await obtenerRol(user.uid, user);
                redirigirPorRol(rol);
            } catch (error) {
                console.error("Error con GitHub:", error.message);
                mostrarToast("Credenciales inválidas");
            }
        });
    }

    // Login con Microsoft
    const btnMicrosoft = document.getElementById("btnMicrosoft");
    if (btnMicrosoft) {
        btnMicrosoft.addEventListener("click", async () => {
            try {
                const result = await signInWithPopup(auth, microsoftProvider);
                const user = result.user;
                const rol = await obtenerRol(user.uid, user);
                redirigirPorRol(rol);
            } catch (error) {
                console.error("Error con Microsoft:", error.message);
                mostrarToast("Credenciales inválidas");
            }
        });
    }

    // Registro
    const registerBtn = document.getElementById("registerEmail");
    if (registerBtn) {
        registerBtn.addEventListener("click", async (event) => {
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
                mostrarToast("Se ha enviado un correo de verificación. Revisa tu bandeja de entrada.");

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
    }

    // Mostrar/ocultar contraseña
    const passwordInput = document.getElementById("password");
    const togglePassword = document.getElementById("togglePassword");

    if (togglePassword && passwordInput) {
        togglePassword.addEventListener("click", () => {
            const isPasswordHidden = passwordInput.type === "password";
            passwordInput.type = isPasswordHidden ? "text" : "password";
            togglePassword.classList.toggle("fa-eye");
            togglePassword.classList.toggle("fa-eye-slash");
        });
    }
});
