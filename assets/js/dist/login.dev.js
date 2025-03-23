"use strict";

var _firebaseConfig = require("./firebaseConfig.js");

var _firebaseFirestore = require("https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js");

// Obtener el rol de un usuario
function obtenerRol(uid) {
  var docRef, docSnap, data;
  return regeneratorRuntime.async(function obtenerRol$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          docRef = (0, _firebaseFirestore.doc)(_firebaseConfig.db, "usuarios", uid);
          _context.next = 3;
          return regeneratorRuntime.awrap((0, _firebaseFirestore.getDoc)(docRef));

        case 3:
          docSnap = _context.sent;

          if (!docSnap.exists()) {
            _context.next = 9;
            break;
          }

          data = docSnap.data();
          return _context.abrupt("return", data.rol || null);

        case 9:
          return _context.abrupt("return", null);

        case 10:
        case "end":
          return _context.stop();
      }
    }
  });
} // Inicio de sesión con correo


document.getElementById("btnLogin").addEventListener("click", function _callee() {
  var email, password, userCredential, user, rol;
  return regeneratorRuntime.async(function _callee$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          email = document.getElementById("email").value.trim();
          password = document.getElementById("password").value.trim();
          _context2.prev = 2;
          _context2.next = 5;
          return regeneratorRuntime.awrap((0, _firebaseConfig.signInWithEmailAndPassword)(_firebaseConfig.auth, email, password));

        case 5:
          userCredential = _context2.sent;
          user = userCredential.user;
          console.log("Usuario autenticado:", user.email);
          _context2.next = 10;
          return regeneratorRuntime.awrap(obtenerRol(user.uid));

        case 10:
          rol = _context2.sent;
          console.log("Rol:", rol);

          if (rol === "admin") {
            alert("Bienvenido administrador");
            window.location.href = "dashboardAdmin.html"; // redirige al panel admin
          } else if (rol === "user") {
            alert("Inicio de sesión exitoso");
            window.location.href = "index-2.html";
          } else {}

          _context2.next = 19;
          break;

        case 15:
          _context2.prev = 15;
          _context2.t0 = _context2["catch"](2);
          console.error("Error en el inicio de sesión:", _context2.t0.message);
          alert("Error: " + _context2.t0.message);

        case 19:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[2, 15]]);
}); // Inicio de sesión con Google

document.getElementById("btnGoogle").addEventListener("click", function _callee2() {
  var result;
  return regeneratorRuntime.async(function _callee2$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap((0, _firebaseConfig.signInWithPopup)(_firebaseConfig.auth, _firebaseConfig.googleProvider));

        case 3:
          result = _context3.sent;
          console.log("Usuario autenticado con Google:", result.user);
          alert("Inicio de sesión con Google exitoso");
          window.location.href = "index-2.html";
          _context3.next = 12;
          break;

        case 9:
          _context3.prev = 9;
          _context3.t0 = _context3["catch"](0);
          console.error("Error con Google:", _context3.t0.message);

        case 12:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 9]]);
}); // Inicio de sesión con GitHub

document.getElementById("btnGitHub").addEventListener("click", function _callee3() {
  var result;
  return regeneratorRuntime.async(function _callee3$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return regeneratorRuntime.awrap((0, _firebaseConfig.signInWithPopup)(_firebaseConfig.auth, _firebaseConfig.githubProvider));

        case 3:
          result = _context4.sent;
          console.log("Usuario autenticado con GitHub:", result.user);
          alert("Inicio de sesión con GitHub exitoso");
          window.location.href = "index-2.html";
          _context4.next = 12;
          break;

        case 9:
          _context4.prev = 9;
          _context4.t0 = _context4["catch"](0);
          console.error("Error con GitHub:", _context4.t0.message);

        case 12:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 9]]);
}); // Inicio de sesión con Microsoft

document.getElementById("btnMicrosoft").addEventListener("click", function _callee4() {
  var result;
  return regeneratorRuntime.async(function _callee4$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return regeneratorRuntime.awrap((0, _firebaseConfig.signInWithPopup)(_firebaseConfig.auth, _firebaseConfig.microsoftProvider));

        case 3:
          result = _context5.sent;
          console.log("Usuario autenticado con Microsoft:", result.user);
          alert("Inicio de sesión con Microsoft exitoso");
          window.location.href = "index-2.html";
          _context5.next = 12;
          break;

        case 9:
          _context5.prev = 9;
          _context5.t0 = _context5["catch"](0);
          console.error("Error con Microsoft:", _context5.t0.message);

        case 12:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 9]]);
}); // Registro de usuario con correo

document.getElementById("registerEmail").addEventListener("click", function _callee5(event) {
  var email, password, userCredential, user;
  return regeneratorRuntime.async(function _callee5$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          event.preventDefault();
          email = document.getElementById("email").value.trim();
          password = document.getElementById("password").value.trim();

          if (!(email === "" || password === "")) {
            _context6.next = 6;
            break;
          }

          alert("Por favor, ingresa un correo y una contraseña.");
          return _context6.abrupt("return");

        case 6:
          _context6.prev = 6;
          _context6.next = 9;
          return regeneratorRuntime.awrap((0, _firebaseConfig.createUserWithEmailAndPassword)(_firebaseConfig.auth, email, password));

        case 9:
          userCredential = _context6.sent;
          user = userCredential.user; // Guardar rol en Firestore

          _context6.prev = 11;
          _context6.next = 14;
          return regeneratorRuntime.awrap((0, _firebaseFirestore.setDoc)((0, _firebaseFirestore.doc)(_firebaseConfig.db, "usuarios", user.uid), {
            email: user.email,
            rol: "user",
            uid: user.uid,
            createdAt: new Date()
          }));

        case 14:
          console.log("Usuario guardado correctamente en Firestore");
          _context6.next = 20;
          break;

        case 17:
          _context6.prev = 17;
          _context6.t0 = _context6["catch"](11);
          console.error("Error al guardar en Firestore:", _context6.t0.message);

        case 20:
          alert("Registro exitoso. Bienvenido, " + user.email);
          _context6.next = 27;
          break;

        case 23:
          _context6.prev = 23;
          _context6.t1 = _context6["catch"](6);
          console.error("Error en el registro:", _context6.t1.message);
          alert("Error: " + _context6.t1.message);

        case 27:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[6, 23], [11, 17]]);
});
//# sourceMappingURL=login.dev.js.map
