const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

const infoData = fs.readFileSync(path.join(__dirname, 'info.json'), 'utf-8');

app.get('/', (req, res) => {
    console.log("Cargando interfaz de chatbot...");
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});


app.post('/chat', async (req, res) => {
    try {
        const userMessage = req.body.message;
        if (!userMessage) {
            console.error("No se escribio ningun mensaje");
            return res.status(400).json({ error: "No message provided" });
        }

        console.log(`Received message: ${userMessage}`);

        const response = await axios.post(
            'https://openrouter.ai/api/v1/chat/completions',
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

        - Si ya te presentaste una vez, no lo hagas de nuevo.  
        - Responde de manera breve y clara, con un máximo de dos líneas por pregunta, utilizando los datos del siguiente JSON: ${infoData}.  
        - Si un usuario pregunta sobre temas ajenos a la renta de vehículos o al sitio web de RentalsCeutec, infórmale amablemente y con humor que solo puedes ayudar con consultas relacionadas con el alquiler de vehículos.  
        - Si recibes preguntas delicadas o que no puedan responderse con la información disponible, sugiere que contacten a RentalsCeutec por correo o teléfono para asistencia personalizada, sin prometer ayuda que no puedas dar.  
        - Adáptate al lenguaje del cliente: si usa lenguaje coloquial, tú usarás lenguaje coloquial; si usa lenguaje formal, responderás de manera formal para generar confianza, pero sin explicar por qué respondiste de esa manera.  
        
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
                    Authorization: "Bearer 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",
                    "Content-Type": "application/json"
                }
            }
        );

        if (response.data.choices && response.data.choices.length > 0) {
            const botMessage = response.data.choices[0].message.content;
            console.log("Respuesta enviada correctamente");
            res.json({ response: botMessage });
        } else {
            console.error("Respuesta no valida de bot.");
            res.status(500).json({ error: "Respuesta no valida" });
        }

    } catch (error) {
        console.error("Ocurrio un error:", error.message);
        if (error.response) {
            console.error("Detalles del error:", error.response.data);
            res.status(500).json({ error: "Error HTTP", details: error.response.data });
        } else {
            res.status(500).json({ error: "Ha ocurrido un error", details: error.message });
        }
    }
});


if (process.argv.includes('console')) {
    const readline = require('readline');
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
                const response = await axios.post(
                    'https://openrouter.ai/api/v1/chat/completions',
                    {
                        model: "deepseek/deepseek-chat-v3-0324:free",
                        messages: [
                            {
                                role: "system",
                                content: `You are a chatbot assistant for RentalsCeutec. Use the following information to answer questions: ${infoData}`
                            },
                            {
                                role: "user",
                                content: userMessage
                            }
                        ]
                    },
                    {
                        headers: {
                            Authorization: "Bearer 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",
                            "Content-Type": "application/json"
                        }
                    }
                );

                if (response.data.choices && response.data.choices.length > 0) {
                    const botMessage = response.data.choices[0].message.content;
                    console.log(`Bot: ${botMessage}`);
                } else {
                    console.error("No valid response from the bot.");
                }

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
