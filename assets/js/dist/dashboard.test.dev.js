"use strict";

var _require = require("./dashboardTest"),
    eliminarUsuario = _require.eliminarUsuario,
    editarVehiculo = _require.editarVehiculo,
    guardarVehiculo = _require.guardarVehiculo,
    eliminarVehiculo = _require.eliminarVehiculo,
    editarReserva = _require.editarReserva,
    guardarReserva = _require.guardarReserva,
    eliminarReserva = _require.eliminarReserva;

test("Debería eliminar un usuario", function () {
  // Arrange
  global.confirm = jest.fn(function () {
    return true;
  });
  var uid = "user123"; // Act

  var resultado = eliminarUsuario(uid); // Assert

  expect(resultado).toEqual({
    uid: uid,
    mensaje: "Usuario eliminado correctamente."
  });
});
test("Debería editar un vehículo y devolver sus datos", function () {
  // Arrange
  var id = "vehiculo1"; // Act

  var resultado = editarVehiculo(id); // Assert

  expect(resultado).toHaveProperty("MARCA", "Toyota");
  expect(resultado).toHaveProperty("MODELO", "Corolla");
  expect(resultado).toHaveProperty("PLACA", "ABC-123");
});
test("Debería guardar un vehículo correctamente", function () {
  // Arrange
  var datos = {
    MARCA: "Toyota",
    MODELO: "Corolla",
    PLACA: "ABC-123"
  }; // Act

  var resultado = guardarVehiculo(datos); // Assert

  expect(resultado).toHaveProperty("mensaje", "Vehículo guardado correctamente.");
});
test("Debería lanzar un error si faltan datos al guardar un vehículo", function () {
  // Arrange
  var datos = {
    MARCA: "Toyota",
    MODELO: "Corolla"
  }; // Falta la placa
  // Act & Assert

  expect(function () {
    return guardarVehiculo(datos);
  }).toThrow("Todos los campos del vehículo son obligatorios.");
});
test("Debería eliminar un vehículo", function () {
  // Arrange
  global.confirm = jest.fn(function () {
    return true;
  });
  var id = "vehiculo123"; // Act

  var resultado = eliminarVehiculo(id); // Assert

  expect(resultado).toEqual({
    id: id,
    mensaje: "Vehículo eliminado correctamente."
  });
});
test("Debería editar una reserva y devolver sus datos", function () {
  // Arrange
  var id = "reserva1"; // Act

  var resultado = editarReserva(id); // Assert

  expect(resultado).toHaveProperty("Nombre Completo", "Juan Pérez");
  expect(resultado).toHaveProperty("Email", "juan.perez@example.com");
});
test("Debería guardar una reserva correctamente", function () {
  // Arrange
  var datos = {
    "Nombre Completo": "Juan Pérez",
    Email: "juan.perez@example.com",
    "Numero de Telefono": "12345678"
  }; // Act

  var resultado = guardarReserva(datos); // Assert

  expect(resultado).toHaveProperty("mensaje", "Reserva guardada correctamente.");
});
test("Debería lanzar un error si faltan datos al guardar una reserva", function () {
  // Arrange
  var datos = {
    "Nombre Completo": "Juan Pérez",
    Email: "juan.perez@example.com"
  }; // Falta el teléfono
  // Act & Assert

  expect(function () {
    return guardarReserva(datos);
  }).toThrow("Todos los campos son obligatorios.");
});
test("Debería eliminar una reserva", function () {
  // Arrange
  global.confirm = jest.fn(function () {
    return true;
  });
  var id = "reserva123"; // Act

  var resultado = eliminarReserva(id); // Assert

  expect(resultado).toEqual({
    id: id,
    mensaje: "Reserva eliminada correctamente."
  });
});
//# sourceMappingURL=dashboard.test.dev.js.map
