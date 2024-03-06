from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI, OpenAIError
import os
from dotenv import load_dotenv

app = Flask(__name__)
CORS(app)

@app.route('/api/openai', methods=['POST'])
def GPT():
    datos = request.json
    ingredientes_seleccionados = datos.get('ingredientesSeleccionados')
    nombres_ingredientes = ", ".join(ingredientes_seleccionados.keys())
    print(nombres_ingredientes);
    return jsonify({'mensaje': 'Datos recibidos correctamente'})

if __name__ == '__main__':
    app.run(debug=True)