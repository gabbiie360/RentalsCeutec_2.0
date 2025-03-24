const { actualizarRol, eliminarUsuario, editarVehiculo, guardarVehiculo, eliminarVehiculo, editarReserva, guardarReserva, eliminarReserva, validarSolapamiento } = require("../assets/js/dashboardTest");

describe("Pruebas unitarias de dashboard", () => {
    test("Debería actualizar el rol de un usuario", () => {
        // Arrange
        const select = { value: "admin", dataset: { uid: "user123" } };
        
        // Act
        const resultado = actualizarRol(select);
        
        // Assert
        expect(resultado).toEqual({ uid: "user123", rol: "admin", mensaje: "Rol actualizado correctamente." });
    });

    test("Debería eliminar un usuario", () => {
        // Arrange
        global.confirm = jest.fn(() => true);
        const uid = "user123";
        
        // Act
        const resultado = eliminarUsuario(uid);
        
        // Assert
        expect(resultado).toEqual({ uid, mensaje: "Usuario eliminado correctamente." });
    });

    test("Debería editar un vehículo y devolver sus datos", () => {
        // Arrange
        const id = "vehiculo1";
        
        // Act
        const resultado = editarVehiculo(id);
        
        // Assert
        expect(resultado).toHaveProperty("MARCA", "Toyota");
        expect(resultado).toHaveProperty("MODELO", "Corolla");
        expect(resultado).toHaveProperty("PLACA", "ABC-123");
    });

    test("Debería guardar un vehículo correctamente", () => {
        // Arrange
        const datos = { MARCA: "Toyota", MODELO: "Corolla", PLACA: "ABC-123" };
        
        // Act
        const resultado = guardarVehiculo(datos);
        
        // Assert
        expect(resultado).toHaveProperty("mensaje", "Vehículo guardado correctamente.");
    });

    test("Debería lanzar un error si faltan datos al guardar un vehículo", () => {
        // Arrange
        const datos = { MARCA: "Toyota", MODELO: "Corolla" }; // Falta la placa
        
        // Act & Assert
        expect(() => guardarVehiculo(datos)).toThrow("Todos los campos del vehículo son obligatorios.");
    });

    test("Debería eliminar un vehículo", () => {
        // Arrange
        global.confirm = jest.fn(() => true);
        const id = "vehiculo123";
        
        // Act
        const resultado = eliminarVehiculo(id);
        
        // Assert
        expect(resultado).toEqual({ id, mensaje: "Vehículo eliminado correctamente." });
    });

    test("Debería editar una reserva y devolver sus datos", () => {
        // Arrange
        const id = "reserva1";
        
        // Act
        const resultado = editarReserva(id);
        
        // Assert
        expect(resultado).toHaveProperty("Nombre Completo", "Juan Pérez");
        expect(resultado).toHaveProperty("Email", "juan.perez@example.com");
    });

    test("Debería guardar una reserva correctamente", () => {
        // Arrange
        const datos = { "Nombre Completo": "Juan Pérez", Email: "juan.perez@example.com", "Numero de Telefono": "12345678" };
        
        // Act
        const resultado = guardarReserva(datos);
        
        // Assert
        expect(resultado).toHaveProperty("mensaje", "Reserva guardada correctamente.");
    });

    test("Debería lanzar un error si faltan datos al guardar una reserva", () => {
        // Arrange
        const datos = { "Nombre Completo": "Juan Pérez", Email: "juan.perez@example.com" }; // Falta el teléfono
        
        // Act & Assert
        expect(() => guardarReserva(datos)).toThrow("Todos los campos son obligatorios.");
    });

    test("Debería eliminar una reserva", () => {
        // Arrange
        global.confirm = jest.fn(() => true);
        const id = "reserva123";
        
        // Act
        const resultado = eliminarReserva(id);
        
        // Assert
        expect(resultado).toEqual({ id, mensaje: "Reserva eliminada correctamente." });
    });
    test("Debería detectar solapamiento con una reserva existente", () => {
        // Arrange
        const resultado = validarSolapamiento("vehiculo123", new Date("2025-04-03T09:00"), new Date("2025-04-04T09:00"));
        
        // Assert
        expect(resultado).toEqual({ solapado: true, mensaje: "Conflicto de reserva detectado." });
    });

    test("No debería detectar solapamiento si las fechas no se cruzan", () => {
        // Arrange
        const resultado = validarSolapamiento("vehiculo123", new Date("2025-04-07T09:00"), new Date("2025-04-08T09:00"));
        
        // Assert
        expect(resultado).toEqual({ solapado: false, mensaje: "No hay solapamiento de reservas." });
    });

    test("No debería detectar solapamiento si el ID de vehículo no coincide", () => {
        // Arrange
        const resultado = validarSolapamiento("vehiculo999", new Date("2025-04-03T09:00"), new Date("2025-04-04T09:00"));
        
        // Assert
        expect(resultado).toEqual({ solapado: false, mensaje: "No hay solapamiento de reservas." });
    });

    test("Debería ignorar una reserva si es la misma que está siendo editada", () => {
        // Arrange
        const resultado = validarSolapamiento("vehiculo123", new Date("2025-04-03T09:00"), new Date("2025-04-04T09:00"), "reserva1");
        
        // Assert
        expect(resultado).toEqual({ solapado: false, mensaje: "No hay solapamiento de reservas." });
    });
});
