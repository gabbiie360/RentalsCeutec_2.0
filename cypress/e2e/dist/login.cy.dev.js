"use strict";

describe('Pruebas de inicio de sesión y registro', function () {
  var baseUrl = 'http://localhost:3000'; // Cambia esto según tu entorno

  beforeEach(function () {
    cy.visit("".concat(baseUrl, "/login.html")); // Cambia la ruta según tu archivo HTML de login
  });
  it('Debería iniciar sesión con correo y contraseña válidos', function () {
    cy.get('#email').type('usuario@prueba.com'); // Cambia por un correo válido

    cy.get('#password').type('contraseña123'); // Cambia por una contraseña válida

    cy.get('#btnLogin').click(); // Verifica la redirección y el mensaje

    cy.url().should('include', 'dashboardAdmin.html'); // Cambia según el rol esperado

    cy.contains('Bienvenido administrador').should('be.visible');
  });
  it('Debería mostrar un error con credenciales inválidas', function () {
    cy.get('#email').type('usuario_invalido@prueba.com');
    cy.get('#password').type('contraseña_invalida');
    cy.get('#btnLogin').click(); // Verifica que se muestra un mensaje de error

    cy.on('window:alert', function (text) {
      expect(text).to.contains('Error');
    });
  });
  it('Debería iniciar sesión con Google', function () {
    cy.get('#btnGoogle').click(); // Simula el inicio de sesión con Google
    // Nota: Cypress no puede interactuar directamente con ventanas emergentes de OAuth.
    // Aquí puedes mockear la respuesta o verificar que se abre la ventana emergente.

    cy.url().should('include', 'index-2.html');
    cy.contains('Inicio de sesión con Google exitoso').should('be.visible');
  });
  it('Debería iniciar sesión con GitHub', function () {
    cy.get('#btnGitHub').click(); // Simula el inicio de sesión con GitHub

    cy.url().should('include', 'index-2.html');
    cy.contains('Inicio de sesión con GitHub exitoso').should('be.visible');
  });
  it('Debería iniciar sesión con Microsoft', function () {
    cy.get('#btnMicrosoft').click(); // Simula el inicio de sesión con Microsoft

    cy.url().should('include', 'index-2.html');
    cy.contains('Inicio de sesión con Microsoft exitoso').should('be.visible');
  });
  it('Debería registrar un nuevo usuario con correo y contraseña', function () {
    cy.get('#email').type('nuevo_usuario@prueba.com'); // Cambia por un correo válido

    cy.get('#password').type('nueva_contraseña123'); // Cambia por una contraseña válida

    cy.get('#registerEmail').click(); // Verifica el mensaje de éxito

    cy.on('window:alert', function (text) {
      expect(text).to.contains('Registro exitoso');
    });
  });
});
//# sourceMappingURL=login.cy.dev.js.map
