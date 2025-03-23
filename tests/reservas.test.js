const { verificarDisponibilidad, validarReserva, crearReserva, cancelarReserva } = require("../js/reservas");

describe("Pruebas de la Funcionalidad de Reservas", () => {

    test("Verificar que un vehículo está disponible cuando no hay reservas", () => {
        expect(verificarDisponibilidad(1, "2025-04-01", "2025-04-05")).toBe(true);
    });

    test("Validar reserva con datos correctos", () => {
        expect(() => validarReserva("usuario1", 1, "2025-04-01", "2025-04-05")).not.toThrow();
    });

    test("No permitir fechas de reserva inválidas", () => {
        expect(() => validarReserva("usuario1", 1, "2025-04-05", "2025-04-01")).toThrow("La fecha de inicio debe ser antes de la fecha de fin.");
    });

    test("Crear una reserva si el vehículo está disponible", () => {
        const reserva = crearReserva("usuario1", 1, "2025-04-01", "2025-04-05");
        expect(reserva).toEqual({
            usuario: "usuario1",
            codVehiculo: 1,
            fechaInicio: "2025-04-01",
            fechaFin: "2025-04-05"
        });
    });

    test("No permitir reservar un vehículo si ya está reservado en las mismas fechas", () => {
        expect(() => crearReserva("usuario2", 1, "2025-04-02", "2025-04-04"))
            .toThrow("El vehículo no está disponible en esas fechas.");
    });

    test("Cancelar una reserva existente", () => {
        const reservaCancelada = cancelarReserva("usuario1", 1);
        expect(reservaCancelada.usuario).toBe("usuario1");
    });

    test("No cancelar una reserva inexistente", () => {
        expect(() => cancelarReserva("usuario99", 3)).toThrow("No se encontró la reserva.");
    });

});
