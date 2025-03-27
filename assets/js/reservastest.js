function validarReserva(datos) {
    const { fechaReserva, fechaEntrega } = datos;
    const ahora = new Date();
    const ahoraMasUnaHora = new Date(ahora.getTime() + 60 * 60 * 1000);
    
    if (new Date(fechaReserva) < ahoraMasUnaHora || new Date(fechaEntrega) <= new Date(fechaReserva)) {
        return "Las fechas deben ser futuras y la entrega posterior a la reserva (mínimo 1h desde ahora).";
    }
    
    return "válido";
}

function validarHorario(fechaReserva, fechaEntrega) {
    const diasPermitidos = [1, 2, 3, 4, 5, 6]; // Lunes a sábado
    const horaMin = 9;
    const horaMax = 17;

    const diaReserva = new Date(fechaReserva).getDay();
    const horaReserva = new Date(fechaReserva).getHours();
    const diaEntrega = new Date(fechaEntrega).getDay();
    const horaEntrega = new Date(fechaEntrega).getHours();

    if (!diasPermitidos.includes(diaReserva) || !diasPermitidos.includes(diaEntrega)) {
        return "Las reservas solo se pueden realizar o entregar de lunes a sábado.";
    }

    if (horaReserva < horaMin || horaReserva >= horaMax || horaEntrega < horaMin || horaEntrega >= horaMax) {
        return "El horario permitido es de 09:00 AM a 05:00 PM.";
    }

    return "válido";
}

function simularReserva(datos) {
    let resultado = validarReserva(datos);
    if (resultado !== "válido") return resultado;
    
    resultado = validarHorario(datos.fechaReserva, datos.fechaEntrega);
    if (resultado !== "válido") return resultado;
    
    return "¡Reserva guardada correctamente!";
}

module.exports = { validarReserva, validarHorario, simularReserva };