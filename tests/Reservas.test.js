const { validarReserva, validarHorario, simularReserva } = require('../assets/js/reservastest.js');

describe('Validaciones de Reserva', () => {

  test('Debe rechazar reserva si la fecha es menor a 1 hora en el futuro', () => {
    const ahora = new Date();
    const fechaInvalida = new Date(ahora.getTime() + 30 * 60 * 1000).toISOString();
    const resultado = validarReserva({ fechaReserva: fechaInvalida, fechaEntrega: fechaInvalida });
    expect(resultado).toBe("Las fechas deben ser futuras y la entrega posterior a la reserva (mínimo 1h desde ahora).");
  });

  test('Debe rechazar si la fecha de entrega es antes de la fecha de reserva', () => {
    const resultado = validarReserva({
      fechaReserva: "2025-04-02T15:00",
      fechaEntrega: "2025-04-02T14:00" 
    });
    expect(resultado).toBe("Las fechas deben ser futuras y la entrega posterior a la reserva (mínimo 1h desde ahora).");
  });

  test('Debe rechazar si la reserva o entrega es domingo', () => {
    const resultado = validarHorario("2025-04-06T10:00", "2025-04-07T12:00");
    expect(resultado).toBe("Las reservas solo se pueden realizar o entregar de lunes a sábado.");
  });

  test('Debe rechazar si la hora de reserva es antes de las 09:00 AM o después de las 05:00 PM', () => {
    const resultado = validarHorario("2025-04-01T08:00", "2025-04-01T12:00");
    expect(resultado).toBe("El horario permitido es de 09:00 AM a 05:00 PM.");
  });

  test('Debe aceptar una reserva válida', () => {
    const resultado = simularReserva({
      fechaReserva: "2025-04-02T10:00",
      fechaEntrega: "2025-04-03T15:00"
    });
    expect(resultado).toBe("¡Reserva guardada correctamente!");
  });

});
