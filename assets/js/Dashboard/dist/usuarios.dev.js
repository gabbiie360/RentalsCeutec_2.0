"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cargarUsuarios = cargarUsuarios;
exports.eliminarUsuario = eliminarUsuario;

var _firebaseConfig = require("./asset/js/firebaseConfig.js");

var _firebaseFirestore = require("https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js");

var _toast = require("./asset/js/toast.js");

var usuariosRef = (0, _firebaseFirestore.collection)(_firebaseConfig.db, "usuarios");

function cargarUsuarios() {
  var tabla = document.getElementById("tablaUsuarios");
  tabla.innerHTML = "";
  var filtroCorreo = document.getElementById("filtroUsuarioCorreo").value.toLowerCase();
  var filtroRol = document.getElementById("filtroRol").value;
  (0, _firebaseFirestore.onSnapshot)(usuariosRef, function (snapshot) {
    tabla.innerHTML = "";
    snapshot.forEach(function (docu) {
      var data = docu.data();
      var uid = docu.id;
      var email = data.email || "";
      var rol = data.rol || "user";
      if (!email.trim()) return;
      var coincideCorreo = email.toLowerCase().includes(filtroCorreo);
      var coincideRol = !filtroRol || rol === filtroRol;

      if (coincideCorreo && coincideRol) {
        var fila = document.createElement("tr");
        fila.innerHTML = "\n          <td>".concat(email, "</td>\n          <td>\n            <select class=\"form-select form-select-sm\" data-uid=\"").concat(uid, "\">\n              <option value=\"user\" ").concat(rol === "user" ? "selected" : "", ">Usuario</option>\n              <option value=\"admin\" ").concat(rol === "admin" ? "selected" : "", ">Administrador</option>\n            </select>\n          </td>\n          <td>\n            <button class=\"btn btn-sm btn-danger\" onclick=\"eliminarUsuario('").concat(uid, "')\">\n              <i class=\"fa fa-trash\"></i>\n            </button>\n          </td>\n        ");
        tabla.appendChild(fila);
      }
    });
    document.querySelectorAll('select[data-uid]').forEach(function (select) {
      select.addEventListener("change", function _callee() {
        var nuevoRol, uid;
        return regeneratorRuntime.async(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                nuevoRol = this.value;
                uid = this.dataset.uid;
                _context.prev = 2;
                _context.next = 5;
                return regeneratorRuntime.awrap((0, _firebaseFirestore.updateDoc)((0, _firebaseFirestore.doc)(_firebaseConfig.db, "usuarios", uid), {
                  rol: nuevoRol
                }));

              case 5:
                (0, _toast.mostrarToast)("Rol actualizado correctamente.", "success");
                _context.next = 11;
                break;

              case 8:
                _context.prev = 8;
                _context.t0 = _context["catch"](2);
                (0, _toast.mostrarToast)("Error al actualizar el rol.", "danger");

              case 11:
              case "end":
                return _context.stop();
            }
          }
        }, null, this, [[2, 8]]);
      });
    });
  });
}

function eliminarUsuario(uid) {
  return regeneratorRuntime.async(function eliminarUsuario$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          if (!confirm("¿Seguro que quieres eliminar este usuario?")) {
            _context2.next = 10;
            break;
          }

          _context2.prev = 1;
          _context2.next = 4;
          return regeneratorRuntime.awrap((0, _firebaseFirestore.deleteDoc)((0, _firebaseFirestore.doc)(_firebaseConfig.db, "usuarios", uid)));

        case 4:
          (0, _toast.mostrarToast)("Usuario eliminado correctamente.");
          _context2.next = 10;
          break;

        case 7:
          _context2.prev = 7;
          _context2.t0 = _context2["catch"](1);
          (0, _toast.mostrarToast)("No se pudo eliminar el usuario.");

        case 10:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[1, 7]]);
}
//# sourceMappingURL=usuarios.dev.js.map
