// car-grid.js
import { db } from './firebaseConfig.js';
import { collection, getDocs } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js';
import { verificarSesionYMostrarModal, guardarReservaDesdeCliente } from './reservaCliente.js';

document.addEventListener('DOMContentLoaded', () => {
  const contenedor = document.getElementById('contenedor-vehiculos');

  async function cargarVehiculos() {
    if (!contenedor) return;

    try {
      const vehiculosRef = collection(db, 'vehiculos');
      const snapshot = await getDocs(vehiculosRef);

      if (snapshot.empty) {
        contenedor.innerHTML = `<p class="text-center">No hay vehículos disponibles por el momento.</p>`;
        return;
      }

      snapshot.forEach(doc => {
        const vehiculo = doc.data();
        const id = doc.id;

        const card = document.createElement('div');
        card.className = 'col-xl-4 col-lg-6 col-md-6 wow fadeInUp';
        card.setAttribute('data-wow-delay', '.3s');
        card.innerHTML = `
          <div class="car-rentals-items mt-0">
            <div class="car-image">
              <img src="${vehiculo.FOTO || 'assets/img/car/placeholder.jpg'}" alt="img" style="object-fit: cover; height: 200px; width: 100%;">
            </div>
            <div class="car-content">
              <div class="post-cat">Modelo ${vehiculo.AÑO || 'S/D'}</div>
              <div class="star">
                <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <span>${vehiculo.reseñas || 0} Reseñas</span>
              </div>
              <h4>${vehiculo.MARCA} ${vehiculo.MODELO}</h4>

              <h6>HNL. ${vehiculo.PRECIO_DIA || 0} <span>/ Día</span></h6>
              <div class="icon-items">
                <ul>
                  <li><img src="assets/img/car/seat.svg" class="me-1"> ${vehiculo.ASIENTOS || 'N/A'} Asientos</li>
                  <li><img src="assets/img/car/door.svg" class="me-1"> ${vehiculo.PUERTAS || 'N/A'} Puertas</li>
                </ul>
                <ul>
                  <li><img src="assets/img/car/automatic.svg" class="me-1"> ${vehiculo.TRANSMISION || 'N/A'}</li>
                  <li><img src="assets/img/car/petrol.svg" class="me-1"> ${vehiculo.COMBUSTIBLE || 'N/A'}</li>
                </ul>
              </div>
              <button class="theme-btn bg-color w-100 text-center btn-reservar" 
                type="button" 
                data-id="${id}">
                Reservar <i class="fa-solid fa-arrow-right ps-1"></i>
              </button>
            </div>
          </div>
        `;

        const btnReservar = card.querySelector('.btn-reservar');
        btnReservar.vehiculo = {
          ...vehiculo,
          id: id
        };

        contenedor.appendChild(card);
      });

    } catch (error) {
      console.error("Error al cargar los vehículos:", error);
      if (contenedor) {
        contenedor.innerHTML = `<p class="text-danger text-center">Error al cargar vehículos. Intenta más tarde.</p>`;
      }
    }
  }

  // Ejecutar carga
  cargarVehiculos();

  // Capturar clicks en botones "Reservar"
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-reservar')) {
      const vehiculo = e.target.vehiculo;
      if (vehiculo) {
        verificarSesionYMostrarModal(vehiculo);
      } else {
        console.warn('No se encontró el objeto del vehículo.');
      }
    }
  });

  // Capturar envío del formulario (solo si existe)
  const form = document.getElementById('formReservaCliente');
  if (form) {
    form.addEventListener('submit', guardarReservaDesdeCliente);
  }
});
