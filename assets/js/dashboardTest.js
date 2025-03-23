function actualizarRol(select) {
    const nuevoRol = select.value;
    const uid = select.dataset.uid;
    
    // Simulación de actualización
    if (uid && nuevoRol) {
        return { uid, rol: nuevoRol, mensaje: "Rol actualizado correctamente." };
    } else {
        throw new Error("Error al actualizar el rol.");
    }
}

function eliminarUsuario(uid) {
    if (confirm("¿Seguro que quieres eliminar este usuario?")) {
        return { uid, mensaje: "Usuario eliminado correctamente." };
    } else {
        throw new Error("No se pudo eliminar el usuario.");
    }
}

function editarVehiculo(id) {
    // Datos quemados
    const data = {
        MARCA: "Toyota",
        MODELO: "Corolla",
        PLACA: "ABC-123",
        AÑO: 2020,
        ASIENTOS: 5,
        COMBUSTIBLE: "Gasolina",
        TRANSMISION: "Automática",
        PRECIO_DIA: 50,
        DISPONIBLE: true
    };
    
    return { id, ...data };
}

function guardarVehiculo(datos) {
    if (!datos.MARCA || !datos.MODELO || !datos.PLACA) {
        throw new Error("Todos los campos del vehículo son obligatorios.");
    }
    
    return { ...datos, mensaje: "Vehículo guardado correctamente." };
}

function eliminarVehiculo(id) {
    if (confirm("¿Seguro que deseas eliminar este vehículo?")) {
        return { id, mensaje: "Vehículo eliminado correctamente." };
    } else {
        throw new Error("No se pudo eliminar.");
    }
}

function editarReserva(id) {
    // Datos quemados
    const data = {
        "Nombre Completo": "Juan Pérez",
        Email: "juan.perez@example.com",
        "Numero de Telefono": "12345678",
        "Recoges en": "Aeropuerto",
        "Fecha de Reserva": new Date("2025-04-01T10:00"),
        "Fecha de entrega": new Date("2025-04-05T10:00"),
        idVehiculo: "vehiculo123",
        nombreVehiculo: "Toyota Corolla - ABC-123"
    };
    
    return { id, ...data };
}

function guardarReserva(datos) {
    if (!datos["Nombre Completo"] || !datos.Email || !datos["Numero de Telefono"]) {
        throw new Error("Todos los campos son obligatorios.");
    }
    
    return { ...datos, mensaje: "Reserva guardada correctamente." };
}

function eliminarReserva(id) {
    if (confirm("¿Deseas eliminar esta reserva?")) {
        return { id, mensaje: "Reserva eliminada correctamente." };
    } else {
        throw new Error("Error al eliminar reserva.");
    }
}
