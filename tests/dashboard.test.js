const { actualizarRol, eliminarUsuario, editarVehiculo, guardarVehiculo, eliminarVehiculo, editarReserva, guardarReserva, eliminarReserva, validarSolapamiento } = require("../assets/js/dashboardTest");

describe("Pruebas unitarias de dashboard", () => {
    test("Debería actualizar el rol de un usuario", () => {
        
        const select = { value: "admin", dataset: { uid: "user123" } };
        
      
        const resultado = actualizarRol(select);
        
      
        expect(resultado).toEqual({ uid: "user123", rol: "admin", mensaje: "Rol actualizado correctamente." });
    });

    test("Debería eliminar un usuario", () => {
       
        global.confirm = jest.fn(() => true);
        const uid = "user123";
        
     
        const resultado = eliminarUsuario(uid);
        
        
        expect(resultado).toEqual({ uid, mensaje: "Usuario eliminado correctamente." });
    });

    test("Debería editar un vehículo y devolver sus datos", () => {
      
        const id = "vehiculo1";
        
       
        const resultado = editarVehiculo(id);
        
        
        expect(resultado).toHaveProperty("MARCA", "Toyota");
        expect(resultado).toHaveProperty("MODELO", "Corolla");
        expect(resultado).toHaveProperty("PLACA", "ABC-123");
    });

    test("Debería guardar un vehículo correctamente", () => {
        
        const datos = { MARCA: "Toyota", MODELO: "Corolla", PLACA: "ABC-123" };
        
        
        const resultado = guardarVehiculo(datos);
        

        expect(resultado).toHaveProperty("mensaje", "Vehículo guardado correctamente.");
    });

    test("Debería lanzar un error si faltan datos al guardar un vehículo", () => {
        
        const datos = { MARCA: "Toyota", MODELO: "Corolla" }; // Falta la placa
        
       
        expect(() => guardarVehiculo(datos)).toThrow("Todos los campos del vehículo son obligatorios.");
    });

    test("Debería eliminar un vehículo", () => {
        
        global.confirm = jest.fn(() => true);
        const id = "vehiculo123";
        
      
        const resultado = eliminarVehiculo(id);
        
       
        expect(resultado).toEqual({ id, mensaje: "Vehículo eliminado correctamente." });
    });

    test("Debería editar una reserva y devolver sus datos", () => {
       
        const id = "reserva1";
        
        
        const resultado = editarReserva(id);
        
        
        expect(resultado).toHaveProperty("Nombre Completo", "Juan Pérez");
        expect(resultado).toHaveProperty("Email", "juan.perez@example.com");
    });

    test("Debería guardar una reserva correctamente", () => {
        
        const datos = { "Nombre Completo": "Juan Pérez", Email: "juan.perez@example.com", "Numero de Telefono": "12345678" };
        
        
        const resultado = guardarReserva(datos);
        
        
        expect(resultado).toHaveProperty("mensaje", "Reserva guardada correctamente.");
    });

    test("Debería lanzar un error si faltan datos al guardar una reserva", () => {
      
        const datos = { "Nombre Completo": "Juan Pérez", Email: "juan.perez@example.com" }; // Falta el teléfono
        
        
        expect(() => guardarReserva(datos)).toThrow("Todos los campos son obligatorios.");
    });

    test("Debería eliminar una reserva", () => {
        
        global.confirm = jest.fn(() => true);
        const id = "reserva123";
        
        
        const resultado = eliminarReserva(id);
        
      
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
