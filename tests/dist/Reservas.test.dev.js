"use strict";

var _require = require('../assets/js/reservastest.js'),
    validarReserva = _require.validarReserva,
    validarHorario = _require.validarHorario,
    simularReserva = _require.simularReserva;

describe('Validaciones de Reserva', function () {
  test('Debe rechazar reserva si la fecha es menor a 1 hora en el futuro', function () {
    var ahora = new Date();
    var fechaInvalida = new Date(ahora.getTime() + 30 * 60 * 1000).toISOString();
    var resultado = validarReserva({
      fechaReserva: fechaInvalida,
      fechaEntrega: fechaInvalida
    });
    expect(resultado).toBe("Las fechas deben ser futuras y la entrega posterior a la reserva (mínimo 1h desde ahora).");
  });
  test('Debe rechazar si la fecha de entrega es antes de la fecha de reserva', function () {
    var resultado = validarReserva({
      fechaReserva: "2025-04-02T15:00",
      fechaEntrega: "2025-04-02T14:00"
    });
    expect(resultado).toBe("Las fechas deben ser futuras y la entrega posterior a la reserva (mínimo 1h desde ahora).");
  });
  test('Debe rechazar si la reserva o entrega es domingo', function () {
    var resultado = validarHorario("2025-04-06T10:00", "2025-04-07T12:00");
    expect(resultado).toBe("Las reservas solo se pueden realizar o entregar de lunes a sábado.");
  });
  test('Debe rechazar si la hora de reserva es antes de las 09:00 AM o después de las 05:00 PM', function () {
    var resultado = validarHorario("2025-04-01T08:00", "2025-04-01T12:00");
    expect(resultado).toBe("El horario permitido es de 09:00 AM a 05:00 PM.");
  });
  test('Debe aceptar una reserva válida', function () {
    var resultado = simularReserva({
      fechaReserva: "2025-04-02T10:00",
      fechaEntrega: "2025-04-03T15:00"
    });
    expect(resultado).toBe("¡Reserva guardada correctamente!");
  });
});
//# sourceMappingURL=Reservas.test.dev.js.map
