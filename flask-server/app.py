from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI, OpenAIError
import os
from dotenv import load_dotenv
from stability_ia import ImageGenerator

app = Flask(__name__)
CORS(app)


@app.route("/api/openai", methods=["GET", "POST"])
def ObtenerIngredientes():
    datos = request.json
    ingredientes_seleccionados = datos.get("ingredientesSeleccionados")
    nombres_ingredientes = ", ".join(ingredientes_seleccionados.keys())
    print(nombres_ingredientes)
    client = OpenAI()
    load_dotenv()
    api_key = os.getenv("OPENAI_API_KEY")

    if not api_key:
        return (
            jsonify(
                {"error": "La variable de entorno OPENAI_API_KEY no está configurada."}
            ),
            500,
        )
    else:
        try:
            # Crear la instancia del cliente OpenAI con la clave de la API
            client = OpenAI(api_key=api_key)
            completion = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {
                        "role": "user",
                        "content": f"haz una receta (debe ser un postre) con los siguientes ingredientes {nombres_ingredientes} (la estructura es titulo, ingredientes, instrucciones)",
                    }
                ],
            )
            response = completion.choices[0].message.content
            print(response)

            # Separar la respuesta en título, ingredientes y procedimiento
            titulo, contenido = response.split("Ingredientes:")
            ingredientes, procedimiento = contenido.split("Instrucciones:")
            # Eliminar espacios en blanco al principio y al final de las cadenas
            titulo = titulo.strip()
            ingredientes = ingredientes.strip()
            procedimiento = procedimiento.strip()

            # Imprimir los resultados
            print("Título:", titulo)
            print("Ingredientes:", ingredientes)
            print("Procedimiento:", procedimiento)

            imageGenerator = ImageGenerator()
            imageGenerator.generate_image(prompt=ingredientes)

            receta_dict = {
                "titulo": titulo,
                "ingredientes": ingredientes,
                "procedimiento": procedimiento,
            }

            return jsonify(receta_dict)
        except OpenAIError as e:
            print(f"Error al inicializar la instancia de OpenAI: {e}")


if __name__ == "__main__":
    app.run(debug=True)
