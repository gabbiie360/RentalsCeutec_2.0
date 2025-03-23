

const login = require('../assets/js/login'); // Ajusta la ruta según tu proyecto

describe('Funcionalidad de inicio de sesión', () => {
  it('debería devolver éxito cuando se proporcionan credenciales válidas', async () => {
    const mockCredentials = { username: 'testuser', password: 'password123' };
    const result = await login(mockCredentials);

    expect(result).toEqual({ success: true, message: 'Inicio de sesión exitoso' });
  });

  it('debería devolver un error cuando se proporcionan credenciales inválidas', async () => {
    const mockCredentials = { username: 'testuser', password: 'wrongpassword' };
    const result = await login(mockCredentials);

    expect(result).toEqual({ success: false, message: 'Credenciales inválidas' });
  });

  it('debería lanzar un error si falta el nombre de usuario o la contraseña', async () => {
    const mockCredentials = { username: '', password: '' };

    await expect(login(mockCredentials)).rejects.toThrow('Se requieren nombre de usuario y contraseña');
  });

  it('debería manejar los errores del servidor de manera adecuada', async () => {
    const mockCredentials = { username: 'testuser', password: 'password123' };

    // Simula un error del servidor
    jest.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.reject(new Error('Error del servidor'))
    );

    await expect(login(mockCredentials)).rejects.toThrow('Error del servidor');

    // Limpia el mock
    global.fetch.mockRestore();
  });
});