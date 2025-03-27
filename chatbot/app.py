import os
import requests
import json
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

os.environ.pop("SSL_CERT_FILE", None)

app = Flask(__name__)
CORS(app)  

@app.route('/')
def index():
    return send_from_directory('.', 'chatbot.html')

@app.route('/chat', methods=['POST'])
def chat():
    try:
        user_message = request.json.get('message', '')
        if not user_message:
            app.logger.error("No message provided in request")
            return jsonify({"error": "No message provided"}), 400

        app.logger.info(f"Received message: {user_message}")

        response = requests.post(
            url="https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": "Bearer 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",
                "Content-Type": "application/json",
            },
            data=json.dumps({
                "model": "deepseek/deepseek-chat-v3-0324:free",
                "messages": [
                    {
                        "role": "user",
                        "content": user_message
                    }
                ],
            })
        )

        response.raise_for_status()
        chat_response = response.json()

        bot_message = chat_response["choices"][0]["message"]["content"]
        return jsonify({"response": bot_message})

    except requests.exceptions.HTTPError as e:
        app.logger.error(f"HTTP error occurred: {e}")
        return jsonify({"error": "HTTP error occurred", "details": str(e)}), 500
    except Exception as e:
        app.logger.error(f"An error occurred: {e}")
        return jsonify({"error": "An error occurred", "details": str(e)}), 500

if __name__ == '__main__':
    import sys

    if len(sys.argv) > 1 and sys.argv[1].lower() == 'console':
        print("Starting chatbot in console mode. Type 'exit' or 'quit' to stop.")
        while True:
            try:
                user_message = input("You: ")
                if user_message.lower() in ['exit', 'quit']:
                    print("Exiting chatbot. Goodbye!")
                    break

                response = requests.post(
                    url="https://openrouter.ai/api/v1/chat/completions",
                    headers={
                        "Authorization": "Bearer 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",
                        "Content-Type": "application/json",
                    },
                    data=json.dumps({
                        "model": "deepseek/deepseek-chat-v3-0324:free",
                        "messages": [
                            {
                                "role": "user",
                                "content": user_message
                            }
                        ],
                    })
                )

                response.raise_for_status()
                chat_response = response.json()

                bot_message = chat_response["choices"][0]["message"]["content"]
                print(f"Bot: {bot_message}")

            except requests.exceptions.HTTPError as e:
                print(f"HTTP error occurred: {e}")
            except Exception as e:
                print(f"An error occurred: {e}")
    else:
        print("Starting Flask server. Use 'python app.py console' to run in console mode.")
        app.run(debug=True)