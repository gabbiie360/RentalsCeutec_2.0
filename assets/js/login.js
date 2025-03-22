import { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, googleProvider, githubProvider, microsoftProvider } from "./firebaseConfig.js";
import { db } from "./firebaseConfig.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

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



// Inicio de sesión con correo
document.getElementById("btnLogin").addEventListener("click", async function () {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
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
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (email === "" || password === "") {
        alert("Por favor, ingresa un correo y una contraseña.");
        return;
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

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
        } catch (error) {
          console.error("Error en el registro:", error.message);
          alert("Error: " + error.message);
        }

        
});

