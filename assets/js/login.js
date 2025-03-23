
console.log("login.js cargado correctamente");
import { auth, db, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup,
        googleProvider, githubProvider, microsoftProvider, signOut, sendPasswordResetEmail, sendEmailVerification } from "./firebaseConfig.js";
import { doc, setDoc, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

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


// Evento para enviar el correo de restablecimiento de contraseña
document.getElementById("resetPasswordButton").addEventListener("click", async function () {
    const resetEmail = document.getElementById("resetEmail").value.trim();

    if (resetEmail === "") {
        alert("Por favor, ingresa un correo electrónico.");
        return;
    }

    try {
        // Verificar si el correo está registrado en la colección "usuarios"
        const usersRef = collection(db, "usuarios");
        const q = query(usersRef, where("email", "==", resetEmail));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            alert("El correo ingresado no está registrado en la base de datos.");
            return; // Detener ejecución si el correo no está en Firestore
        }

        // Si el correo existe, enviar el restablecimiento de contraseña
        await sendPasswordResetEmail(auth, resetEmail);
        alert("Se ha enviado un correo para restablecer tu contraseña.");
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
        console.log("Usuario autenticado:", userCredential.user);
        alert("Inicio de sesión exitoso");
        window.location.href = "index.html";
        const user = userCredential.user;
        console.log("Usuario autenticado:", user.email);

        const rol = await obtenerRol(user.uid);
        console.log("Rol:", rol);

        if (rol === "admin") {
            alert("Bienvenido administrador");
            window.location.href = "dashboardAdmin.html"; // redirige al panel admin
        } else if (rol === "user") {
            alert("Inicio de sesión exitoso");
            window.location.href = "index-2.html";        } else {
            }
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
        window.location.href = "index.html";
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
        window.location.href = "index.html";
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
        window.location.href = "index.html";
    } catch (error) {
        console.error("Error con Microsoft:", error.message);
    }
});

// Registro de usuario con correo y guardado en Firestore
document.getElementById("registerEmail").addEventListener("click", async (event) => {
    event.preventDefault();

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
        
        // Enviar correo de verificación
        await sendEmailVerification(user);
        alert("Se ha enviado un correo de verificación. Por favor, revisa tu bandeja de entrada.");

        // Guardar usuario en Firestore con estado de verificación
        await setDoc(doc(db, "usuarios", user.uid), {
            email: user.email,
            uid: user.uid,
            verified: false, // Marcar como no verificado
            createdAt: new Date()
        });

        // Cerrar sesión hasta que verifique el correo
        await signOut(auth);
        alert("Por favor, verifica tu correo antes de iniciar sesión.");
        
    } catch (error) {
        console.error("Error en el registro:", error.message);
        alert("Error: " + error.message);
    }

        // Guardar rol en Firestore
        try {
            await setDoc(doc(db, "usuarios", user.uid), {
              email: user.email,
              rol: "user",
              uid: user.uid,
              createdAt: new Date()
            });
        
            console.log("Usuario guardado correctamente en Firestore");
        
          } catch (error) {
            console.error("Error al guardar en Firestore:", error.message);
          }
        
          alert("Registro exitoso. Bienvenido, " + user.email);
                
});

// Alternar visibilidad de la contraseña
document.addEventListener("DOMContentLoaded", function () {
    const passwordInput = document.getElementById("password");
    const togglePassword = document.getElementById("togglePassword");

    togglePassword.addEventListener("click", function () {
        const isPasswordHidden = passwordInput.type === "password";
        passwordInput.type = isPasswordHidden ? "text" : "password";

        // Alternar las clases sin necesidad de remover/agregar manualmente
        togglePassword.classList.toggle("fa-eye");
        togglePassword.classList.toggle("fa-eye-slash");
    });
});


