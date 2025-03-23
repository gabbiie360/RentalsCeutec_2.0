"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function actualizarRol(select) {
  var nuevoRol = select.value;
  var uid = select.dataset.uid; // Simulación de actualización

  if (uid && nuevoRol) {
    return {
      uid: uid,
      rol: nuevoRol,
      mensaje: "Rol actualizado correctamente."
    };
  } else {
    throw new Error("Error al actualizar el rol.");
  }
}

function eliminarUsuario(uid) {
  if (confirm("¿Seguro que quieres eliminar este usuario?")) {
    return {
      uid: uid,
      mensaje: "Usuario eliminado correctamente."
    };
  } else {
    throw new Error("No se pudo eliminar el usuario.");
  }
}

function editarVehiculo(id) {
  // Datos quemados
  var data = {
    MARCA: "Toyota",
    MODELO: "Corolla",
    PLACA: "ABC-123",
    AÑO: 2020,
    ASIENTOS: 5,
    COMBUSTIBLE: "Gasolina",
    TRANSMISION: "Automática",
    PRECIO_DIA: 50,
    DISPONIBLE: true
  };
  return _objectSpread({
    id: id
  }, data);
}

function guardarVehiculo(datos) {
  if (!datos.MARCA || !datos.MODELO || !datos.PLACA) {
    throw new Error("Todos los campos del vehículo son obligatorios.");
  }

  return _objectSpread({}, datos, {
    mensaje: "Vehículo guardado correctamente."
  });
}

function eliminarVehiculo(id) {
  if (confirm("¿Seguro que deseas eliminar este vehículo?")) {
    return {
      id: id,
      mensaje: "Vehículo eliminado correctamente."
    };
  } else {
    throw new Error("No se pudo eliminar.");
  }
}

function editarReserva(id) {
  // Datos quemados
  var data = {
    "Nombre Completo": "Juan Pérez",
    Email: "juan.perez@example.com",
    "Numero de Telefono": "12345678",
    "Recoges en": "Aeropuerto",
    "Fecha de Reserva": new Date("2025-04-01T10:00"),
    "Fecha de entrega": new Date("2025-04-05T10:00"),
    idVehiculo: "vehiculo123",
    nombreVehiculo: "Toyota Corolla - ABC-123"
  };
  return _objectSpread({
    id: id
  }, data);
}

function guardarReserva(datos) {
  if (!datos["Nombre Completo"] || !datos.Email || !datos["Numero de Telefono"]) {
    throw new Error("Todos los campos son obligatorios.");
  }

  return _objectSpread({}, datos, {
    mensaje: "Reserva guardada correctamente."
  });
}

function eliminarReserva(id) {
  if (confirm("¿Deseas eliminar esta reserva?")) {
    return {
      id: id,
      mensaje: "Reserva eliminada correctamente."
    };
  } else {
    throw new Error("Error al eliminar reserva.");
  }
}

module.exports = {
  actualizarRol: actualizarRol,
  eliminarUsuario: eliminarUsuario,
  editarVehiculo: editarVehiculo,
  guardarVehiculo: guardarVehiculo,
  eliminarVehiculo: eliminarVehiculo,
  editarReserva: editarReserva,
  guardarReserva: guardarReserva,
  eliminarReserva: eliminarReserva
};
//# sourceMappingURL=dashboardTest.dev.js.map
