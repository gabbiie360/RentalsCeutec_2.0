// reservaCliente.js
import { auth, db } from './firebaseConfig.js';
import {
  addDoc,
  collection,
  query,
  where,
  getDocs,
  Timestamp
} from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js';
import { mostrarToast } from './toast.js';

const reservasRef = collection(db, 'reservas');

// Mostrar modal con datos precargados si el usuario está logueado
export function verificarSesionYMostrarModal(vehiculo) {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      window.location.href = 'login.html';
    } else {
      precargarDatosModal(user, vehiculo);
      const modal = new bootstrap.Modal(document.getElementById('modalReserva'));
      modal.show();
    }
  });
}

// Precargar datos en el modal
import { getDoc, doc } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js'; // asegúrate de tener esta importación también

async function precargarDatosModal(user, vehiculo) {
  try {
    const userDoc = await getDoc(doc(db, 'usuarios', user.uid));
    const data = userDoc.exists() ? userDoc.data() : {};

    document.getElementById('nombreCompleto').value = data.nombre || user.displayName || 'Usuario';
    document.getElementById('emailReserva').value = user.email;
    document.getElementById('telefono').value = data.telefono || user.phoneNumber || '';
    document.getElementById('ubicacion').value = 'San Pedro Sula';

    document.getElementById('marcaVehiculo').value = vehiculo.MARCA;
    document.getElementById('modeloVehiculo').value = vehiculo.MODELO;
    document.getElementById('idVehiculoSeleccionado').value = vehiculo.id;

    document.getElementById('modalReserva').dataset.nombreVehiculo =
      `${vehiculo.MARCA} ${vehiculo.MODELO} - ${vehiculo.PLACA || ''}`;
  } catch (error) {
    console.error('Error al obtener datos del usuario:', error);
    mostrarToast('error', 'No se pudieron cargar los datos del usuario');
  }
}

  

// Guardar reserva en Firestore
export async function guardarReservaDesdeCliente(e) {
  e.preventDefault();

  const nombre = document.getElementById('nombreCompleto').value.trim();
  const email = document.getElementById('emailReserva').value.trim();
  const telefono = document.getElementById('telefono').value.trim();
  const ubicacion = document.getElementById('ubicacion').value.trim();
  const marca = document.getElementById('marcaVehiculo').value.trim();
  const modelo = document.getElementById('modeloVehiculo').value.trim();
  const idVehiculo = document.getElementById('idVehiculoSeleccionado').value;
  const nombreVehiculo = document.getElementById('modalReserva').dataset.nombreVehiculo;
  const fechaReserva = new Date(document.getElementById('fechaReserva').value);
  const fechaEntrega = new Date(document.getElementById('fechaEntrega').value);

  // Validación de campos
  if (!nombre || !email || !telefono || !ubicacion || !marca || !modelo || !idVehiculo) {
    return mostrarToast('error', 'Todos los campos son obligatorios.');
  }

  const ahora = new Date();
  if (!fechaReserva || !fechaEntrega || fechaEntrega <= fechaReserva || fechaReserva < ahora || fechaEntrega < ahora) {
  return mostrarToast('warning', 'Las fechas deben ser futuras y la entrega posterior a la reserva.');
  }


  try {
    const solapado = await validarSolapamiento(idVehiculo, fechaReserva, fechaEntrega);
    if (solapado) return mostrarToast('error', 'Este vehículo ya está reservado en esas fechas.');

    await addDoc(reservasRef, {
      Email: email,
      "Nombre Completo": nombre,
      "Numero de Telefono": telefono,
      "Recoges en": ubicacion,
      "Fecha de Reserva": Timestamp.fromDate(fechaReserva),
      "Fecha de entrega": Timestamp.fromDate(fechaEntrega),
      idVehiculo,
      nombreVehiculo
    });

    bootstrap.Modal.getInstance(document.getElementById('modalReserva')).hide();
    mostrarToast('success', '¡Reserva guardada correctamente!');
    document.getElementById('formReservaCliente').reset();

  } catch (error) {
    console.error('Error al guardar la reserva:', error);
    mostrarToast('error', 'No se pudo guardar la reserva.');
  }
}

// Validación de solapamiento de fechas
async function validarSolapamiento(idVehiculo, nuevaInicio, nuevaFin) {
  const q = query(reservasRef, where('idVehiculo', '==', idVehiculo));
  const snapshot = await getDocs(q);

  for (const doc of snapshot.docs) {
    const data = doc.data();
    const inicio = data['Fecha de Reserva']?.toDate();
    const fin = data['Fecha de entrega']?.toDate();

    if ((nuevaInicio < fin) && (nuevaFin > inicio)) {
      return true;
    }
  }
  return false;
}

// Asociar evento submit al formulario del cliente
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formReservaCliente');
    if (form) {
      form.addEventListener('submit', guardarReservaDesdeCliente);
    }
  });
  
 
  