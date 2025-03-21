// Importar Firebase y sus módulos necesarios
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, GithubAuthProvider, OAuthProvider, 
         signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, 
         signInAnonymously, signOut } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB6x-L6xqnLEnRu_6AbpweHV3tSkGSb0j0",
  authDomain: "rentalsceutec.firebaseapp.com",
  projectId: "rentalsceutec",
  storageBucket: "rentalsceutec.firebasestorage.app",
  messagingSenderId: "806584528723",
  appId: "1:806584528723:web:3fd8b9a58c72c95f507ba6",
  measurementId: "G-8H5VR3EK12"

  
};


// Initialize Firebase
 const app = initializeApp(firebaseConfig);
 const auth = getAuth(app);
 const db = getFirestore(app);

// Proveedores de autenticación
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();
const microsoftProvider = new MicrosoftAuthProvider();

export { auth, googleProvider, githubProvider, microsoftProvider, 
         signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, 
         signInAnonymously, signOut };