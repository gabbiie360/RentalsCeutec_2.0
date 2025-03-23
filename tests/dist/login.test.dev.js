"use strict";

var login = require('../assets/js/login'); // Ajusta la ruta según tu proyecto


describe('Funcionalidad de inicio de sesión', function () {
  it('debería devolver éxito cuando se proporcionan credenciales válidas', function _callee() {
    var mockCredentials, result;
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            mockCredentials = {
              username: 'testuser',
              password: 'password123'
            };
            _context.next = 3;
            return regeneratorRuntime.awrap(login(mockCredentials));

          case 3:
            result = _context.sent;
            expect(result).toEqual({
              success: true,
              message: 'Inicio de sesión exitoso'
            });

          case 5:
          case "end":
            return _context.stop();
        }
      }
    });
  });
  it('debería devolver un error cuando se proporcionan credenciales inválidas', function _callee2() {
    var mockCredentials, result;
    return regeneratorRuntime.async(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            mockCredentials = {
              username: 'testuser',
              password: 'wrongpassword'
            };
            _context2.next = 3;
            return regeneratorRuntime.awrap(login(mockCredentials));

          case 3:
            result = _context2.sent;
            expect(result).toEqual({
              success: false,
              message: 'Credenciales inválidas'
            });

          case 5:
          case "end":
            return _context2.stop();
        }
      }
    });
  });
  it('debería lanzar un error si falta el nombre de usuario o la contraseña', function _callee3() {
    var mockCredentials;
    return regeneratorRuntime.async(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            mockCredentials = {
              username: '',
              password: ''
            };
            _context3.next = 3;
            return regeneratorRuntime.awrap(expect(login(mockCredentials)).rejects.toThrow('Se requieren nombre de usuario y contraseña'));

          case 3:
          case "end":
            return _context3.stop();
        }
      }
    });
  });
  it('debería manejar los errores del servidor de manera adecuada', function _callee4() {
    var mockCredentials;
    return regeneratorRuntime.async(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            mockCredentials = {
              username: 'testuser',
              password: 'password123'
            }; // Simula un error del servidor

            jest.spyOn(global, 'fetch').mockImplementation(function () {
              return Promise.reject(new Error('Error del servidor'));
            });
            _context4.next = 4;
            return regeneratorRuntime.awrap(expect(login(mockCredentials)).rejects.toThrow('Error del servidor'));

          case 4:
            // Limpia el mock
            global.fetch.mockRestore();

          case 5:
          case "end":
            return _context4.stop();
        }
      }
    });
  });
});
//# sourceMappingURL=login.test.dev.js.map
