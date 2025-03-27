const { obtenerRol, signInWithEmail } = require("../assets/js/loginTest");  // ✅


describe("Pruebas unitarias de autenticación", () => {
    test("Debería retornar el rol 'admin' para el UID de Maria", () => {
        
        const uid = "maria";

       
        const rol = obtenerRol(uid);

        
        expect(rol).toBe("admin");
    });

    test("Debería retornar el rol 'user' para el UID de Juan", () => {
       
        const uid = "juan";

        
        const rol = obtenerRol(uid);

     
        expect(rol).toBe("user");
    });

    test("Debería retornar 'null' para un UID desconocido", () => {
        
        const uid = "desconocido";

        
        const rol = obtenerRol(uid);

        
        expect(rol).toBeNull();
    });

    test("Debería iniciar sesión correctamente con el usuario admin", () => {
      
        const email = "maria@example.com";
        const password = "admin123";

      
        const result = signInWithEmail(email, password);

    
        expect(result).toEqual({
            user: { uid: "maria", email: "maria@example.com" }
        });
    });

    test("Debería iniciar sesión correctamente con el usuario común", () => {
        
        const email = "juan@example.com";
        const password = "user123";

        
        const result = signInWithEmail(email, password);

        
        expect(result).toEqual({
            user: { uid: "juan", email: "juan@example.com" }
        });
    });

    test("Debería lanzar un error al iniciar sesión con credenciales incorrectas", () => {
    
        const email = "incorrecto@example.com";
        const password = "wrong";

    
        expect(() => signInWithEmail(email, password)).toThrow("Credenciales inválidas");
    });

    test("Debería devolver 'dashboard.html' si el rol es admin", () => {
        
        const rol = obtenerRol("maria");

        
        const redireccion = rol === "admin" ? "dashboard.html" : "clientes.html";

        
        expect(redireccion).toBe("dashboard.html");
    });

    test("Debería devolver 'clientes.html' si el rol es user", () => {
       
        const rol = obtenerRol("juan");

       
        const redireccion = rol === "admin" ? "dashboard.html" : "clientes.html";

       
        expect(redireccion).toBe("clientes.html");
    });
});
