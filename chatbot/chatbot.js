function toggleChat() {
    const chatContainer = document.getElementById('chat-container');
    const messages = document.getElementById('messages');

    const savedConversation = localStorage.getItem('chatConversation');
    if (savedConversation) {
        messages.innerHTML = savedConversation;
    }

    if (!chatContainer.classList.contains('active') && !savedConversation) {
        const welcomeMessage = document.createElement('div');
        welcomeMessage.className = 'bot';
        welcomeMessage.textContent = 'Hola, soy Car-Litos, puedes llamarme Litos, tu asistente virtual de RentalsCeutec. ¿En qué puedo ayudarte hoy?';
        messages.appendChild(welcomeMessage);
        saveConversation();
    }

    chatContainer.classList.toggle('active');
}

async function sendMessage() {
    const userInput = document.getElementById('user-input');
    const messages = document.getElementById('messages');

    if (!userInput.value.trim()) return;

    const userMessage = document.createElement('div');
    userMessage.className = 'user';
    userMessage.textContent = userInput.value;
    messages.appendChild(userMessage);
    saveConversation();

    const loadingMessage = document.createElement('div');
    loadingMessage.className = 'loading';
    loadingMessage.textContent = 'Estoy pensando...';
    messages.appendChild(loadingMessage);
    saveConversation();

    try {
        const response = await fetch('http://localhost:3000/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: userInput.value })
        });

        const data = await response.json();

        messages.removeChild(loadingMessage);

        const botMessage = document.createElement('div');
        botMessage.className = 'bot';
        botMessage.textContent = data.response || data.error || 'No response';
        messages.appendChild(botMessage);
        saveConversation();
    } catch (error) {
        messages.removeChild(loadingMessage);

        const errorMessage = document.createElement('div');
        errorMessage.className = 'bot';
        errorMessage.textContent = 'Error: Unable to connect to the server.';
        messages.appendChild(errorMessage);
        saveConversation();
    }

    userInput.value = '';
    messages.scrollTop = messages.scrollHeight;
}

function saveConversation() {
    const messages = document.getElementById('messages');
    localStorage.setItem('chatConversation', messages.innerHTML);
}

document.getElementById("user-input").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault(); 
        sendMessage();
    }
});

