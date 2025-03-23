"use strict";

var _require = require("../assets/js/loginTest"),
    obtenerRol = _require.obtenerRol,
    signInWithEmail = _require.signInWithEmail; // ✅


describe("Pruebas unitarias de autenticación", function () {
  test("Debería retornar el rol 'admin' para el UID de Maria", function () {
    // Arrange
    var uid = "maria"; // Act

    var rol = obtenerRol(uid); // Assert

    expect(rol).toBe("admin");
  });
  test("Debería retornar el rol 'user' para el UID de Juan", function () {
    // Arrange
    var uid = "juan"; // Act

    var rol = obtenerRol(uid); // Assert

    expect(rol).toBe("user");
  });
  test("Debería retornar 'null' para un UID desconocido", function () {
    // Arrange
    var uid = "desconocido"; // Act

    var rol = obtenerRol(uid); // Assert

    expect(rol).toBeNull();
  });
  test("Debería iniciar sesión correctamente con el usuario admin", function () {
    // Arrange
    var email = "maria@example.com";
    var password = "admin123"; // Act

    var result = signInWithEmail(email, password); // Assert

    expect(result).toEqual({
      user: {
        uid: "maria",
        email: "maria@example.com"
      }
    });
  });
  test("Debería iniciar sesión correctamente con el usuario común", function () {
    // Arrange
    var email = "juan@example.com";
    var password = "user123"; // Act

    var result = signInWithEmail(email, password); // Assert

    expect(result).toEqual({
      user: {
        uid: "juan",
        email: "juan@example.com"
      }
    });
  });
  test("Debería lanzar un error al iniciar sesión con credenciales incorrectas", function () {
    // Arrange
    var email = "incorrecto@example.com";
    var password = "wrong"; // Act & Assert

    expect(function () {
      return signInWithEmail(email, password);
    }).toThrow("Credenciales inválidas");
  });
  test("Debería devolver 'dashboard.html' si el rol es admin", function () {
    // Arrange
    var rol = obtenerRol("maria"); // Act

    var redireccion = rol === "admin" ? "dashboard.html" : "clientes.html"; // Assert

    expect(redireccion).toBe("dashboard.html");
  });
  test("Debería devolver 'clientes.html' si el rol es user", function () {
    // Arrange
    var rol = obtenerRol("juan"); // Act

    var redireccion = rol === "admin" ? "dashboard.html" : "clientes.html"; // Assert

    expect(redireccion).toBe("clientes.html");
  });
});
//# sourceMappingURL=login.test.dev.js.map
