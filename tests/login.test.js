const { obtenerRol, signInWithEmail } = require("../assets/js/loginTest");  // ✅


describe("Pruebas unitarias de autenticación", () => {
    test("Debería retornar el rol 'admin' para el UID de Maria", () => {
        // Arrange
        const uid = "maria";

        // Act
        const rol = obtenerRol(uid);

        // Assert
        expect(rol).toBe("admin");
    });

    test("Debería retornar el rol 'user' para el UID de Juan", () => {
        // Arrange
        const uid = "juan";

        // Act
        const rol = obtenerRol(uid);

        // Assert
        expect(rol).toBe("user");
    });

    test("Debería retornar 'null' para un UID desconocido", () => {
        // Arrange
        const uid = "desconocido";

        // Act
        const rol = obtenerRol(uid);

        // Assert
        expect(rol).toBeNull();
    });

    test("Debería iniciar sesión correctamente con el usuario admin", () => {
        // Arrange
        const email = "maria@example.com";
        const password = "admin123";

        // Act
        const result = signInWithEmail(email, password);

        // Assert
        expect(result).toEqual({
            user: { uid: "maria", email: "maria@example.com" }
        });
    });

    test("Debería iniciar sesión correctamente con el usuario común", () => {
        // Arrange
        const email = "juan@example.com";
        const password = "user123";

        // Act
        const result = signInWithEmail(email, password);

        // Assert
        expect(result).toEqual({
            user: { uid: "juan", email: "juan@example.com" }
        });
    });

    test("Debería lanzar un error al iniciar sesión con credenciales incorrectas", () => {
        // Arrange
        const email = "incorrecto@example.com";
        const password = "wrong";

        // Act & Assert
        expect(() => signInWithEmail(email, password)).toThrow("Credenciales inválidas");
    });

    test("Debería devolver 'dashboard.html' si el rol es admin", () => {
        // Arrange
        const rol = obtenerRol("maria");

        // Act
        const redireccion = rol === "admin" ? "dashboard.html" : "clientes.html";

        // Assert
        expect(redireccion).toBe("dashboard.html");
    });

    test("Debería devolver 'clientes.html' si el rol es user", () => {
        // Arrange
        const rol = obtenerRol("juan");

        // Act
        const redireccion = rol === "admin" ? "dashboard.html" : "clientes.html";

        // Assert
        expect(redireccion).toBe("clientes.html");
    });
});
