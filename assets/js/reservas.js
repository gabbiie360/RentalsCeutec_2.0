const reservas = []; // Simula la base de datos de reservas

// Comprobar si un auto está disponible en ciertas fechas
function verificarDisponibilidad(codVehiculo, fechaInicio, fechaFin) {
    return !reservas.some(reserva =>
        reserva.codVehiculo === codVehiculo &&
        ((fechaInicio >= reserva.fechaInicio && fechaInicio <= reserva.fechaFin) ||
        (fechaFin >= reserva.fechaInicio && fechaFin <= reserva.fechaFin))
    );
}

// Validar los datos de la reserva
function validarReserva(usuario, codVehiculo, fechaInicio, fechaFin) {
    if (!usuario || !codVehiculo || !fechaInicio || !fechaFin) {
        throw new Error("Todos los campos son obligatorios.");
    }
    if (fechaInicio >= fechaFin) {
        throw new Error("La fecha de inicio debe ser antes de la fecha de fin.");
    }
    return true;
}

// Crear una reserva si el auto está disponible
function crearReserva(usuario, codVehiculo, fechaInicio, fechaFin) {
    if (!verificarDisponibilidad(codVehiculo, fechaInicio, fechaFin)) {
        throw new Error("El vehículo no está disponible en esas fechas.");
    }
    validarReserva(usuario, codVehiculo, fechaInicio, fechaFin);
    const nuevaReserva = { usuario, codVehiculo, fechaInicio, fechaFin };
    reservas.push(nuevaReserva);
    return nuevaReserva;
}

// Cancelar una reserva
function cancelarReserva(usuario, codVehiculo) {
    const index = reservas.findIndex(r => r.usuario === usuario && r.codVehiculo === codVehiculo);
    if (index === -1) {
        throw new Error("No se encontró la reserva.");
    }
    return reservas.splice(index, 1)[0]; // Elimina y devuelve la reserva cancelada
}

module.exports = { verificarDisponibilidad, validarReserva, crearReserva, cancelarReserva };
