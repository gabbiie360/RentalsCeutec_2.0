function toggleChat() {
  const chatContainer = document.getElementById('chat-container');
  const messages = document.getElementById('messages');
  const savedConversation = localStorage.getItem('chatConversation');

  if (savedConversation) {
    messages.innerHTML = savedConversation;
  }

  if (!chatContainer.classList.contains('active') && !savedConversation) {
    appendBotMessage(
      'Hola, soy Car-Litos, puedes llamarme Litos, tu asistente virtual de RentalsCeutec. ¿En qué puedo ayudarte hoy?'
    );
    saveConversation();
  }

  chatContainer.classList.toggle('active');
}

function sendMessage() {
  const userInput = document.getElementById('user-input');
  const messages = document.getElementById('messages');
  const userText = userInput.value.trim();

  if (!userText) return;

  appendUserMessage(userText);
  saveConversation();

  const loadingMessage = createMessageElement('loading', 'Estoy pensando...');
  messages.appendChild(loadingMessage);
  saveConversation();

  fetch('http://localhost:3000/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: userText })
  })
    .then(response => response.json())
    .then(data => {
      messages.removeChild(loadingMessage);
      appendBotMessage(data.response || data.error || 'No response');
      saveConversation();
      scrollToBottom(messages);
    })
    .catch(() => {
      messages.removeChild(loadingMessage);
      appendBotMessage('Error: Unable to connect to the server.');
      saveConversation();
      scrollToBottom(messages);
    });

  userInput.value = '';
}

function createMessageElement(className, textContent) {
  const element = document.createElement('div');
  element.className = className;
  element.textContent = textContent;
  return element;
}

function appendUserMessage(text) {
  const messages = document.getElementById('messages');
  const messageElement = createMessageElement('user', text);
  messages.appendChild(messageElement);
}

function appendBotMessage(text) {
  const messages = document.getElementById('messages');
  const messageElement = createMessageElement('bot', text);
  messages.appendChild(messageElement);
}

function scrollToBottom(container) {
  container.scrollTop = container.scrollHeight;
}

function saveConversation() {
  const messages = document.getElementById('messages');
  localStorage.setItem('chatConversation', messages.innerHTML);
}

document
  .getElementById('user-input')
  .addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      sendMessage();
      }
    });