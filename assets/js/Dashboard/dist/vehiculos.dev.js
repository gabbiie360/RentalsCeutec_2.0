"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cargarVehiculos = cargarVehiculos;
exports.eliminarVehiculo = eliminarVehiculo;
exports.abrirModalVehiculo = abrirModalVehiculo;
exports.editarVehiculo = editarVehiculo;
exports.guardarVehiculo = guardarVehiculo;

var _firebaseConfig = require("./asset/js/firebaseConfig.js");

var _firebaseFirestore = require("https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js");

var _toast = require("./asset/js/toast.js");

var vehiculosRef = (0, _firebaseFirestore.collection)(_firebaseConfig.db, "vehiculos");

function cargarVehiculos() {
  var tabla = document.getElementById("tablaVehiculos");
  tabla.innerHTML = "";
  (0, _firebaseFirestore.onSnapshot)(vehiculosRef, function (snapshot) {
    tabla.innerHTML = "";
    var marcaFiltro = document.getElementById("filtroMarca").value.toLowerCase();
    var dispoFiltro = document.getElementById("filtroDisponibilidad").value;
    var anioFiltro = document.getElementById("filtroAnio").value;
    var precioMin = parseFloat(document.getElementById("precioMin").value);
    var precioMax = parseFloat(document.getElementById("precioMax").value);
    snapshot.forEach(function (docu) {
      var data = docu.data();
      var cumpleMarca = !marcaFiltro || data.MARCA.toLowerCase().includes(marcaFiltro);
      var cumpleDispo = dispoFiltro === "" || data.DISPONIBLE.toString() === dispoFiltro;
      var cumpleAnio = !anioFiltro || data.AÑO.toString() === anioFiltro;
      var cumplePrecio = (!precioMin || data.PRECIO_DIA >= precioMin) && (!precioMax || data.PRECIO_DIA <= precioMax);

      if (cumpleMarca && cumpleDispo && cumpleAnio && cumplePrecio) {
        tabla.innerHTML += "\n        <tr>\n          <td>".concat(data.MARCA, "</td>\n          <td>").concat(data.MODELO, "</td>\n          <td>").concat(data.PLACA, "</td>\n          <td>").concat(data.AÑO, "</td>\n          <td>L. ").concat(data.PRECIO_DIA.toFixed(2), "</td>\n          <td><span class=\"badge ").concat(data.DISPONIBLE ? 'bg-success' : 'bg-danger', "\">").concat(data.DISPONIBLE ? 'Disponible' : 'No disponible', "</span></td>\n          <td>\n            <button class=\"btn btn-sm btn-secondary\" onclick=\"editarVehiculo('").concat(docu.id, "')\"><i class=\"fa fa-pen\"></i></button>\n            <button class=\"btn btn-sm btn-danger\" onclick=\"eliminarVehiculo('").concat(docu.id, "')\"><i class=\"fa fa-trash\"></i></button>\n          </td>\n        </tr>\n        ");
      }
    });
  });
}

function eliminarVehiculo(id) {
  return regeneratorRuntime.async(function eliminarVehiculo$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (!confirm("¿Seguro que deseas eliminar este vehículo?")) {
            _context.next = 10;
            break;
          }

          _context.prev = 1;
          _context.next = 4;
          return regeneratorRuntime.awrap((0, _firebaseFirestore.deleteDoc)((0, _firebaseFirestore.doc)(_firebaseConfig.db, "vehiculos", id)));

        case 4:
          (0, _toast.mostrarToast)("Vehículo eliminado correctamente.");
          _context.next = 10;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](1);
          (0, _toast.mostrarToast)("No se pudo eliminar.");

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 7]]);
} // Abrir modal para agregar o editar un vehículo


function abrirModalVehiculo() {
  document.querySelectorAll("#modalVehiculo input, #modalVehiculo select").forEach(function (e) {
    return e.value = "";
  });
  document.getElementById("disponible").value = "true";
  new bootstrap.Modal(document.getElementById("modalVehiculo")).show();
} // Editar un vehículo existente


function editarVehiculo(id) {
  var docSnap, data;
  return regeneratorRuntime.async(function editarVehiculo$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(getDoc((0, _firebaseFirestore.doc)(_firebaseConfig.db, "vehiculos", id)));

        case 2:
          docSnap = _context2.sent;

          if (docSnap.exists()) {
            data = docSnap.data();
            document.getElementById("vehiculoId").value = id;
            document.getElementById("marca").value = data.MARCA;
            document.getElementById("modelo").value = data.MODELO;
            document.getElementById("placa").value = data.PLACA;
            document.getElementById("anio").value = data.AÑO;
            document.getElementById("asientos").value = data.ASIENTOS;
            document.getElementById("combustible").value = data.COMBUSTIBLE;
            document.getElementById("transmision").value = data.TRANSMISION;
            document.getElementById("precioDia").value = data.PRECIO_DIA;
            document.getElementById("disponible").value = data.DISPONIBLE ? "true" : "false";
            new bootstrap.Modal(document.getElementById("modalVehiculo")).show();
          }

        case 4:
        case "end":
          return _context2.stop();
      }
    }
  });
} // Guardar un nuevo vehículo o actualizar uno existente


function guardarVehiculo() {
  var campos, _i, _campos, _id, valor, vehiculo, id;

  return regeneratorRuntime.async(function guardarVehiculo$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          campos = ["marca", "modelo", "placa", "anio", "asientos", "combustible", "transmision", "precioDia"];
          _i = 0, _campos = campos;

        case 2:
          if (!(_i < _campos.length)) {
            _context3.next = 10;
            break;
          }

          _id = _campos[_i];
          valor = document.getElementById(_id).value.trim();

          if (valor) {
            _context3.next = 7;
            break;
          }

          return _context3.abrupt("return", (0, _toast.mostrarToast)("Todos los campos del vehículo son obligatorios.", "danger"));

        case 7:
          _i++;
          _context3.next = 2;
          break;

        case 10:
          vehiculo = {
            MARCA: document.getElementById("marca").value.trim(),
            MODELO: document.getElementById("modelo").value.trim(),
            PLACA: document.getElementById("placa").value.trim(),
            AÑO: parseInt(document.getElementById("anio").value),
            ASIENTOS: parseInt(document.getElementById("asientos").value),
            COMBUSTIBLE: document.getElementById("combustible").value.trim(),
            TRANSMISION: document.getElementById("transmision").value.trim(),
            PRECIO_DIA: parseFloat(document.getElementById("precioDia").value),
            DISPONIBLE: document.getElementById("disponible").value === "true",
            updatedAt: new Date()
          };
          id = document.getElementById("vehiculoId").value;
          _context3.prev = 12;

          if (!id) {
            _context3.next = 19;
            break;
          }

          _context3.next = 16;
          return regeneratorRuntime.awrap((0, _firebaseFirestore.updateDoc)((0, _firebaseFirestore.doc)(_firebaseConfig.db, "vehiculos", id), vehiculo));

        case 16:
          (0, _toast.mostrarToast)("Vehículo actualizado correctamente.", "success");
          _context3.next = 23;
          break;

        case 19:
          // Agregar nuevo vehículo
          vehiculo.createdAt = new Date();
          _context3.next = 22;
          return regeneratorRuntime.awrap((0, _firebaseFirestore.addDoc)(vehiculosRef, vehiculo));

        case 22:
          (0, _toast.mostrarToast)("Vehículo agregado correctamente.", "success");

        case 23:
          bootstrap.Modal.getInstance(document.getElementById("modalVehiculo")).hide();
          _context3.next = 29;
          break;

        case 26:
          _context3.prev = 26;
          _context3.t0 = _context3["catch"](12);
          (0, _toast.mostrarToast)("Error al guardar el vehículo.", "danger");

        case 29:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[12, 26]]);
}
//# sourceMappingURL=vehiculos.dev.js.map
