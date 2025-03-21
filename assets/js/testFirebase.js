import { db } from "./firebaseConfig.js";
import { collection, addDoc, getDocs } from "firebase/firestore";

// Probar escritura en Firebase
async function testFirebase() {
    try {
        const docRef = await addDoc(collection(db, "test"), {
            mensaje: "¡Firebase está conectado correctamente!"
        });
        console.log("Documento escrito con ID: ", docRef.id);
    } catch (e) {
        console.error("Error al escribir en Firebase: ", e);
    }
}

// Ejecutar prueba
testFirebase();
