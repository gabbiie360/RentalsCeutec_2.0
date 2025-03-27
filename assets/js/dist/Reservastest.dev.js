"use strict";

function validarReserva(datos) {
  var fechaReserva = datos.fechaReserva,
      fechaEntrega = datos.fechaEntrega;
  var ahora = new Date();
  var ahoraMasUnaHora = new Date(ahora.getTime() + 60 * 60 * 1000);

  if (new Date(fechaReserva) < ahoraMasUnaHora || new Date(fechaEntrega) <= new Date(fechaReserva)) {
    return "Las fechas deben ser futuras y la entrega posterior a la reserva (mínimo 1h desde ahora).";
  }

  return "válido";
}

function validarHorario(fechaReserva, fechaEntrega) {
  var diasPermitidos = [1, 2, 3, 4, 5, 6]; // Lunes a sábado

  var horaMin = 9;
  var horaMax = 17;
  var diaReserva = new Date(fechaReserva).getDay();
  var horaReserva = new Date(fechaReserva).getHours();
  var diaEntrega = new Date(fechaEntrega).getDay();
  var horaEntrega = new Date(fechaEntrega).getHours();

  if (!diasPermitidos.includes(diaReserva) || !diasPermitidos.includes(diaEntrega)) {
    return "Las reservas solo se pueden realizar o entregar de lunes a sábado.";
  }

  if (horaReserva < horaMin || horaReserva >= horaMax || horaEntrega < horaMin || horaEntrega >= horaMax) {
    return "El horario permitido es de 09:00 AM a 05:00 PM.";
  }

  return "válido";
}

function simularReserva(datos) {
  var resultado = validarReserva(datos);
  if (resultado !== "válido") return resultado;
  resultado = validarHorario(datos.fechaReserva, datos.fechaEntrega);
  if (resultado !== "válido") return resultado;
  return "¡Reserva guardada correctamente!";
}

module.exports = {
  validarReserva: validarReserva,
  validarHorario: validarHorario,
  simularReserva: simularReserva
};
//# sourceMappingURL=Reservastest.dev.js.map
