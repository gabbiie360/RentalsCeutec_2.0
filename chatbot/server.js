const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const path = require('path');
const fs = require('fs');
const readline = require('readline');

const app = express();
const PORT = 3000;

const API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const API_KEY = 'Bearer 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';

const infoData = fs.readFileSync(path.join(__dirname, 'info.json'), 'utf-8');

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

const getChatResponse = async (userMessage) => {
  try {
    const response = await axios.post(
      API_URL,
      {
        model: "deepseek/deepseek-chat-v3-0324:free",
        messages: [
          {
            role: "system",
            content: `
              Eres un asistente virtual de RentalsCeutec, un sitio web especializado en la renta de vehículos.
              Actúa como un experto en servicio al cliente, utilizando un tono persuasivo y profesional para motivar a los clientes a reservar un vehículo.
              Aplica técnicas de psicología de venta de forma sutil, sin hacerlas evidentes en el chat.
              Siempre mantente dentro del tema del alquiler de vehículos y evita proporcionar información incorrecta.
              Si ya te presentaste una vez, no lo hagas de nuevo.
              Responde de manera breve y clara, con un máximo de dos líneas por pregunta, utilizando los datos del siguiente JSON: ${infoData}.
              Si un usuario pregunta sobre temas ajenos a la renta de vehículos o al sitio web de RentalsCeutec, infórmale amablemente y con humor que solo puedes ayudar con consultas relacionadas con el alquiler de vehículos.
              Si recibes preguntas delicadas o que no puedan responderse con la información disponible, sugiere que contacten a RentalsCeutec por correo o teléfono para asistencia personalizada, sin prometer ayuda que no puedas dar.
              Adáptate al lenguaje del cliente: si usa lenguaje coloquial, tú usarás lenguaje coloquial; si usa lenguaje formal, responderás de manera formal para generar confianza, pero sin explicar por qué respondiste de esa manera.
              Recuerda que estás actuando como chatbot para un cliente, no respondiendo a un usuario normal.
            `
          },
          {
            role: "user",
            content: userMessage
          }
        ]
      },
      {
        headers: {
          Authorization: API_KEY,
          "Content-Type": "application/json"
        }
      }
    );

    if (response.data.choices && response.data.choices.length > 0) {
      return response.data.choices[0].message.content;
    }
    throw new Error('Respuesta no válida del bot.');
  } catch (error) {
    throw error;
  }
};

app.get('/', (req, res) => {
  console.log("Cargando interfaz de chatbot...");
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;
  if (!userMessage) {
    return res.status(400).json({ error: "No message provided" });
  }

  console.log(`Received message: ${userMessage}`);
  try {
    const botMessage = await getChatResponse(userMessage);
    res.json({ response: botMessage });
  } catch (error) {
    console.error("Ocurrio un error:", error.message);
    res.status(500).json({ error: "Ha ocurrido un error", details: error.message });
  }
});

if (process.argv.includes('console')) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log("Iniciando chatbot en consola. 'exit' o 'quit' para salir.");

  const askQuestion = () => {
    rl.question("You: ", async (userMessage) => {
      if (['exit', 'quit'].includes(userMessage.toLowerCase())) {
        console.log("Saliendo del chatbot!");
        rl.close();
        return;
      }

      try {
        const botMessage = await getChatResponse(userMessage);
        console.log(`Bot: ${botMessage}`);
      } catch (error) {
        console.error("An error occurred:", error.message);
      }

      askQuestion();
    });
  };

  askQuestion();
} else {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
