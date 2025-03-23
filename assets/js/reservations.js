import { auth, onAuthStateChanged, getReservations } from "./firebaseConfig.js";

document.addEventListener('DOMContentLoaded', () => {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            loadReservations(user.uid);
        } else {
            window.location.href = 'login.html';
        }
    });
});

async function loadReservations(userId) {
    try {
        const reservations = await getReservations(userId);
        const tableBody = document.getElementById('reservationsTableBody');
        tableBody.innerHTML = '';

        reservations.forEach(reservation => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${reservation.car}</td>
                <td>${reservation.pickupDate}</td>
                <td>${reservation.returnDate}</td>
                <td>${reservation.location}</td>
                <td>${reservation.status}</td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading reservations:', error);
    }
}