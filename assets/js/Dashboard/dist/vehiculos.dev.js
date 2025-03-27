"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cargarVehiculos = cargarVehiculos;
exports.abrirModalVehiculo = abrirModalVehiculo;
exports.editarVehiculo = editarVehiculo;
exports.guardarVehiculo = guardarVehiculo;
exports.eliminarVehiculo = eliminarVehiculo;

var _firebaseConfig = require("../firebaseConfig.js");

var _firebaseFirestore = require("https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js");

var _firebaseStorage = require("https://www.gstatic.com/firebasejs/10.9.0/firebase-storage.js");

var _toast = require("../toast.js");

var vehiculosRef = (0, _firebaseFirestore.collection)(_firebaseConfig.db, "vehiculos");
var storage = (0, _firebaseStorage.getStorage)();

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
        tabla.innerHTML += "\n        <tr>\n          <td>".concat(data.MARCA, "</td>\n          <td>").concat(data.MODELO, "</td>\n          <td>").concat(data.PLACA, "</td>\n          <td>").concat(data.AÑO, "</td>\n          <td>L. ").concat(data.PRECIO_DIA.toFixed(2), "</td>\n          <td><span class=\"badge ").concat(data.DISPONIBLE ? 'bg-success' : 'bg-danger', "\">").concat(data.DISPONIBLE ? 'Disponible' : 'No disponible', "</span></td>\n          <td id=\"proximaReserva-").concat(docu.id, "\">Cargando...</td>\n          <td>\n            <button class=\"btn btn-sm btn-secondary\" onclick=\"editarVehiculo('").concat(docu.id, "')\"><i class=\"fa fa-pen\"></i></button>\n            <button class=\"btn btn-sm btn-danger\" onclick=\"eliminarVehiculo('").concat(docu.id, "')\"><i class=\"fa fa-trash\"></i></button>\n          </td>\n        </tr>\n        ");
        mostrarProximaReserva(docu.id);
      }
    });
  });
}

function abrirModalVehiculo() {
  document.querySelectorAll("#modalVehiculo input, #modalVehiculo select").forEach(function (e) {
    return e.value = "";
  });
  document.getElementById("disponible").value = "true";
  document.getElementById("previewFotoVehiculo").style.display = "none";
  new bootstrap.Modal(document.getElementById("modalVehiculo")).show();
}

window.abrirModalVehiculo = abrirModalVehiculo;

function editarVehiculo(id) {
  var docSnap, data, preview;
  return regeneratorRuntime.async(function editarVehiculo$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap((0, _firebaseFirestore.getDoc)((0, _firebaseFirestore.doc)(_firebaseConfig.db, "vehiculos", id)));

        case 2:
          docSnap = _context.sent;

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
            preview = document.getElementById("previewFotoVehiculo");

            if (data.FOTO) {
              preview.src = data.FOTO;
              preview.style.display = "block";
            } else {
              preview.style.display = "none";
            }

            new bootstrap.Modal(document.getElementById("modalVehiculo")).show();
          }

        case 4:
        case "end":
          return _context.stop();
      }
    }
  });
}

function guardarVehiculo() {
  var campos, _i, _campos, _id, valor, vehiculo, id, archivoImagen, refImg, url;

  return regeneratorRuntime.async(function guardarVehiculo$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          campos = ["marca", "modelo", "placa", "anio", "asientos", "combustible", "transmision", "precioDia"];
          _i = 0, _campos = campos;

        case 2:
          if (!(_i < _campos.length)) {
            _context2.next = 10;
            break;
          }

          _id = _campos[_i];
          valor = document.getElementById(_id).value.trim();

          if (valor) {
            _context2.next = 7;
            break;
          }

          return _context2.abrupt("return", (0, _toast.mostrarToast)("Todos los campos del vehículo son obligatorios.", "danger"));

        case 7:
          _i++;
          _context2.next = 2;
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
          archivoImagen = document.getElementById("fotoVehiculo").files[0];
          _context2.prev = 13;

          if (!archivoImagen) {
            _context2.next = 22;
            break;
          }

          refImg = (0, _firebaseStorage.ref)(storage, "vehiculos/".concat(Date.now(), "_").concat(archivoImagen.name));
          _context2.next = 18;
          return regeneratorRuntime.awrap((0, _firebaseStorage.uploadBytes)(refImg, archivoImagen));

        case 18:
          _context2.next = 20;
          return regeneratorRuntime.awrap((0, _firebaseStorage.getDownloadURL)(refImg));

        case 20:
          url = _context2.sent;
          vehiculo.FOTO = url;

        case 22:
          if (!id) {
            _context2.next = 28;
            break;
          }

          _context2.next = 25;
          return regeneratorRuntime.awrap((0, _firebaseFirestore.updateDoc)((0, _firebaseFirestore.doc)(_firebaseConfig.db, "vehiculos", id), vehiculo));

        case 25:
          (0, _toast.mostrarToast)("Vehículo actualizado.", "success");
          _context2.next = 32;
          break;

        case 28:
          vehiculo.createdAt = new Date();
          _context2.next = 31;
          return regeneratorRuntime.awrap((0, _firebaseFirestore.addDoc)(vehiculosRef, vehiculo));

        case 31:
          (0, _toast.mostrarToast)("Vehículo agregado.", "success");

        case 32:
          bootstrap.Modal.getInstance(document.getElementById("modalVehiculo")).hide();
          _context2.next = 38;
          break;

        case 35:
          _context2.prev = 35;
          _context2.t0 = _context2["catch"](13);
          (0, _toast.mostrarToast)("Error al guardar vehículo.", "danger");

        case 38:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[13, 35]]);
}

document.getElementById("fotoVehiculo").addEventListener("change", function () {
  var file = this.files[0];
  var preview = document.getElementById("previewFotoVehiculo");

  if (file) {
    var reader = new FileReader();

    reader.onload = function (e) {
      preview.src = e.target.result;
      preview.style.display = "block";
    };

    reader.readAsDataURL(file);
  } else {
    preview.src = "";
    preview.style.display = "none";
  }
});

function eliminarVehiculo(id) {
  return regeneratorRuntime.async(function eliminarVehiculo$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          if (!confirm("¿Seguro que deseas eliminar este vehículo?")) {
            _context3.next = 10;
            break;
          }

          _context3.prev = 1;
          _context3.next = 4;
          return regeneratorRuntime.awrap((0, _firebaseFirestore.deleteDoc)((0, _firebaseFirestore.doc)(_firebaseConfig.db, "vehiculos", id)));

        case 4:
          (0, _toast.mostrarToast)("Vehículo eliminado correctamente.");
          _context3.next = 10;
          break;

        case 7:
          _context3.prev = 7;
          _context3.t0 = _context3["catch"](1);
          (0, _toast.mostrarToast)("No se pudo eliminar.");

        case 10:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[1, 7]]);
}
//# sourceMappingURL=vehiculos.dev.js.map
