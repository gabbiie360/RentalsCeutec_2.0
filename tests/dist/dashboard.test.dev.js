"use strict";

var _require = require("../assets/js/dashboardTest"),
    actualizarRol = _require.actualizarRol,
    eliminarUsuario = _require.eliminarUsuario,
    editarVehiculo = _require.editarVehiculo,
    guardarVehiculo = _require.guardarVehiculo,
    eliminarVehiculo = _require.eliminarVehiculo,
    editarReserva = _require.editarReserva,
    guardarReserva = _require.guardarReserva,
    eliminarReserva = _require.eliminarReserva,
    validarSolapamiento = _require.validarSolapamiento;

describe("Pruebas unitarias de dashboard", function () {
  test("Debería actualizar el rol de un usuario", function () {
    var select = {
      value: "admin",
      dataset: {
        uid: "user123"
      }
    };
    var resultado = actualizarRol(select);
    expect(resultado).toEqual({
      uid: "user123",
      rol: "admin",
      mensaje: "Rol actualizado correctamente."
    });
  });
  test("Debería eliminar un usuario", function () {
    global.confirm = jest.fn(function () {
      return true;
    });
    var uid = "user123";
    var resultado = eliminarUsuario(uid);
    expect(resultado).toEqual({
      uid: uid,
      mensaje: "Usuario eliminado correctamente."
    });
  });
  test("Debería editar un vehículo y devolver sus datos", function () {
    var id = "vehiculo1";
    var resultado = editarVehiculo(id);
    expect(resultado).toHaveProperty("MARCA", "Toyota");
    expect(resultado).toHaveProperty("MODELO", "Corolla");
    expect(resultado).toHaveProperty("PLACA", "ABC-123");
  });
  test("Debería guardar un vehículo correctamente", function () {
    var datos = {
      MARCA: "Toyota",
      MODELO: "Corolla",
      PLACA: "ABC-123"
    };
    var resultado = guardarVehiculo(datos);
    expect(resultado).toHaveProperty("mensaje", "Vehículo guardado correctamente.");
  });
  test("Debería lanzar un error si faltan datos al guardar un vehículo", function () {
    var datos = {
      MARCA: "Toyota",
      MODELO: "Corolla"
    }; // Falta la placa

    expect(function () {
      return guardarVehiculo(datos);
    }).toThrow("Todos los campos del vehículo son obligatorios.");
  });
  test("Debería eliminar un vehículo", function () {
    global.confirm = jest.fn(function () {
      return true;
    });
    var id = "vehiculo123";
    var resultado = eliminarVehiculo(id);
    expect(resultado).toEqual({
      id: id,
      mensaje: "Vehículo eliminado correctamente."
    });
  });
  test("Debería editar una reserva y devolver sus datos", function () {
    var id = "reserva1";
    var resultado = editarReserva(id);
    expect(resultado).toHaveProperty("Nombre Completo", "Juan Pérez");
    expect(resultado).toHaveProperty("Email", "juan.perez@example.com");
  });
  test("Debería guardar una reserva correctamente", function () {
    var datos = {
      "Nombre Completo": "Juan Pérez",
      Email: "juan.perez@example.com",
      "Numero de Telefono": "12345678"
    };
    var resultado = guardarReserva(datos);
    expect(resultado).toHaveProperty("mensaje", "Reserva guardada correctamente.");
  });
  test("Debería lanzar un error si faltan datos al guardar una reserva", function () {
    var datos = {
      "Nombre Completo": "Juan Pérez",
      Email: "juan.perez@example.com"
    }; // Falta el teléfono

    expect(function () {
      return guardarReserva(datos);
    }).toThrow("Todos los campos son obligatorios.");
  });
  test("Debería eliminar una reserva", function () {
    global.confirm = jest.fn(function () {
      return true;
    });
    var id = "reserva123";
    var resultado = eliminarReserva(id);
    expect(resultado).toEqual({
      id: id,
      mensaje: "Reserva eliminada correctamente."
    });
  });
  test("Debería detectar solapamiento con una reserva existente", function () {
    // Arrange
    var resultado = validarSolapamiento("vehiculo123", new Date("2025-04-03T09:00"), new Date("2025-04-04T09:00")); // Assert

    expect(resultado).toEqual({
      solapado: true,
      mensaje: "Conflicto de reserva detectado."
    });
  });
  test("No debería detectar solapamiento si las fechas no se cruzan", function () {
    // Arrange
    var resultado = validarSolapamiento("vehiculo123", new Date("2025-04-07T09:00"), new Date("2025-04-08T09:00")); // Assert

    expect(resultado).toEqual({
      solapado: false,
      mensaje: "No hay solapamiento de reservas."
    });
  });
  test("No debería detectar solapamiento si el ID de vehículo no coincide", function () {
    // Arrange
    var resultado = validarSolapamiento("vehiculo999", new Date("2025-04-03T09:00"), new Date("2025-04-04T09:00")); // Assert

    expect(resultado).toEqual({
      solapado: false,
      mensaje: "No hay solapamiento de reservas."
    });
  });
  test("Debería ignorar una reserva si es la misma que está siendo editada", function () {
    // Arrange
    var resultado = validarSolapamiento("vehiculo123", new Date("2025-04-03T09:00"), new Date("2025-04-04T09:00"), "reserva1"); // Assert

    expect(resultado).toEqual({
      solapado: false,
      mensaje: "No hay solapamiento de reservas."
    });
  });
});
//# sourceMappingURL=dashboard.test.dev.js.map
