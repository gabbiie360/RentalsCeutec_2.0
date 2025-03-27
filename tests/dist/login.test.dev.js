"use strict";

var _require = require("../assets/js/loginTest"),
    obtenerRol = _require.obtenerRol,
    signInWithEmail = _require.signInWithEmail; // ✅


describe("Pruebas unitarias de autenticación", function () {
  test("Debería retornar el rol 'admin' para el UID de Maria", function () {
    var uid = "maria";
    var rol = obtenerRol(uid);
    expect(rol).toBe("admin");
  });
  test("Debería retornar el rol 'user' para el UID de Juan", function () {
    var uid = "juan";
    var rol = obtenerRol(uid);
    expect(rol).toBe("user");
  });
  test("Debería retornar 'null' para un UID desconocido", function () {
    var uid = "desconocido";
    var rol = obtenerRol(uid);
    expect(rol).toBeNull();
  });
  test("Debería iniciar sesión correctamente con el usuario admin", function () {
    var email = "maria@example.com";
    var password = "admin123";
    var result = signInWithEmail(email, password);
    expect(result).toEqual({
      user: {
        uid: "maria",
        email: "maria@example.com"
      }
    });
  });
  test("Debería iniciar sesión correctamente con el usuario común", function () {
    var email = "juan@example.com";
    var password = "user123";
    var result = signInWithEmail(email, password);
    expect(result).toEqual({
      user: {
        uid: "juan",
        email: "juan@example.com"
      }
    });
  });
  test("Debería lanzar un error al iniciar sesión con credenciales incorrectas", function () {
    var email = "incorrecto@example.com";
    var password = "wrong";
    expect(function () {
      return signInWithEmail(email, password);
    }).toThrow("Credenciales inválidas");
  });
  test("Debería devolver 'dashboard.html' si el rol es admin", function () {
    var rol = obtenerRol("maria");
    var redireccion = rol === "admin" ? "dashboard.html" : "clientes.html";
    expect(redireccion).toBe("dashboard.html");
  });
  test("Debería devolver 'clientes.html' si el rol es user", function () {
    var rol = obtenerRol("juan");
    var redireccion = rol === "admin" ? "dashboard.html" : "clientes.html";
    expect(redireccion).toBe("clientes.html");
  });
});
//# sourceMappingURL=login.test.dev.js.map
