// Importar Firebase y sus módulos necesarios
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, GithubAuthProvider, OAuthProvider, 
         signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, 
         signInAnonymously, signOut, sendPasswordResetEmail, sendEmailVerification } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";


// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB6x-L6xqnLEnRu_6AbpweHV3tSkGSb0j0",
  authDomain: "rentalsceutec.firebaseapp.com",
  projectId: "rentalsceutec",
  storageBucket: "rentalsceutec.firebasestorage.app",
  messagingSenderId: "806584528723",
  appId: "1:806584528723:web:3fd8b9a58c72c95f507ba6",
  measurementId: "G-8H5VR3EK12"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Proveedores de autenticación
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();
const microsoftProvider = new OAuthProvider('microsoft.com');  // <---- CORREGIDO

export { auth, db, googleProvider, githubProvider, microsoftProvider, 
         signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, 
         signInAnonymously, signOut, sendPasswordResetEmail, sendEmailVerification };
