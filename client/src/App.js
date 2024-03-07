import React, { useState, useEffect } from "react";
import "primereact/resources/themes/lara-light-purple/theme.css";
import myImage from "../src/images/1229080980.png";
import "./styles/engine.css";
import { Button } from "primereact/button";

function App() {
  const [seleccion, setSeleccion] = useState({});
  const [ingredientes, setIngredientes] = useState([]);
  const [respuesta, setRespuesta] = useState([]);
  const [mostrarImagen, setMostrarImagen] = useState(false);
  const [mostrarTexto, setMostrarTexto] = useState(false);

  useEffect(() => {
    async function fetchIngredientes() {
      try {
        const response = await fetch("/data/ingredients.json");
        const data = await response.json();
        setIngredientes(data);
      } catch (error) {
        console.error("Error al cargar los ingredientes:", error);
      }
    }
    fetchIngredientes();
  }, []);

  const manejarSeleccion = (nombre) => {
    setSeleccion((prevSeleccion) => ({
      ...prevSeleccion,
      [nombre]: !prevSeleccion[nombre],
    }));
  };

  const enviarSeleccion = async () => {
    const datos = { ingredientesSeleccionados: seleccion };
    try {
      const response = await fetch("http://localhost:5000/api/openai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datos),
      });
      const data = await response.json();
      console.log(data);
      setRespuesta(data);
      setMostrarImagen(true);
      setMostrarTexto(true);
      if (respuesta.ok) {
        console.log("Datos enviados correctamente");
      } else {
        console.error("Error al enviar datos al servidor");
      }
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
    }
  };

  return (
    <div>
      {ingredientes.map((ingrediente) => (
        <div key={ingrediente.id}>
          <label className="contenedor">
            <input
              type="checkbox"
              onChange={() => manejarSeleccion(ingrediente.nombre)}
            />
            {ingrediente.nombre}
          </label>
        </div>
      ))}
      <Button
        className="boton-aceptar"
        onClick={enviarSeleccion}
        rounded
        label="Aceptar"
      />
      <h2>{respuesta.titulo}</h2>
      {mostrarTexto && <h3 label="Ingredientes:">Ingredientes:</h3>}
      <p className="ingredientes">{respuesta.ingredientes}</p>
      {mostrarTexto && <h3 label="Procedimiento:">Procedimiento:</h3>}
      <p>{respuesta.procedimiento}</p>
      {mostrarImagen && (
        <img
          src={myImage}
          alt="Description"
          style={{ width: "100%", height: "auto" }}
        />
      )}
    </div>
  );
}

export default App;
