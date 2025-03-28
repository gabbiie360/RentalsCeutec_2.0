// reservaCliente.js
import { auth, db } from './firebaseConfig.js';
import {
  addDoc,
  collection,
  query,
  where,
  getDocs,
  Timestamp,
  getDoc,
  doc
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
    mostrarToast('No se pudieron cargar los datos del usuario', 'error');
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

  // Validación de campos obligatorios
  if (!nombre || !email || !telefono || !ubicacion || !marca || !modelo || !idVehiculo) {
    return mostrarToast('Todos los campos son obligatorios.', 'error');
  }

  const ahora = new Date();
  const ahoraMasUnaHora = new Date(ahora.getTime() + 60 * 60 * 1000);

  if (!fechaReserva || !fechaEntrega || fechaReserva < ahoraMasUnaHora || fechaEntrega <= fechaReserva) {
    return mostrarToast('Las fechas deben ser futuras y la entrega posterior a la reserva (mínimo 1h desde ahora).', 'warning');
  }

  // Validar horario y días permitidos
  const diasPermitidos = [1, 2, 3, 4, 5, 6]; // Lunes a sábado
  const horaMin = 9;
  const horaMax = 17;

  const diaReserva = fechaReserva.getDay();
  const horaReserva = fechaReserva.getHours();
  const diaEntrega = fechaEntrega.getDay();
  const horaEntrega = fechaEntrega.getHours();

  if (!diasPermitidos.includes(diaReserva) || !diasPermitidos.includes(diaEntrega)) {
    return mostrarToast('Las reservas solo se pueden realizar o entregar de lunes a sábado.', 'warning');
  }

  if (horaReserva < horaMin || horaReserva >= horaMax || horaEntrega < horaMin || horaEntrega >= horaMax) {
    return mostrarToast('El horario permitido es de 09:00 AM a 05:00 PM.', 'warning');
  }

  try {
    const solapado = await validarSolapamiento(idVehiculo, fechaReserva, fechaEntrega);
    if (solapado) {
      return mostrarToast('Este vehículo ya está reservado en esas fechas.', 'error');
    }

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
    document.getElementById('formReservaCliente').reset();
    mostrarToast('¡Reserva guardada correctamente!', 'success');
  } catch (error) {
    console.error('Error al guardar la reserva:', error);
    mostrarToast('No se pudo guardar la reserva.', 'error');
  }
}

// Validar solapamiento de fechas para el vehículo
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

// Asociar evento al formulario
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formReservaCliente');
  if (form) {
    form.addEventListener('submit', guardarReservaDesdeCliente);
  }
});
