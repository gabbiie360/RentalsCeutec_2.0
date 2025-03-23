
function obtenerRol(uid) {
    const roles = {
        maria: "admin",
        juan: "user"
    };
    return roles[uid] || null;
}

function signInWithEmail(email, password) {
    const users = {
        "maria@example.com": { uid: "maria", password: "admin123" },
        "juan@example.com": { uid: "juan", password: "user123" }
    };

    if (users[email] && users[email].password === password) {
        return { user: { uid: users[email].uid, email } };
    } else {
        throw new Error("Credenciales inválidas");
    }
}

module.exports = { obtenerRol, signInWithEmail };