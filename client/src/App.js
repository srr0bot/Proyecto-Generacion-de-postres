import React, { useState, useEffect } from "react";
import "primereact/resources/themes/arya-blue/theme.css";
        
function App() {
  const [seleccion, setSeleccion] = useState({});
  const [ingredientes, setIngredientes] = useState([]);
  const [respuesta, setRespuesta] = useState('')

  /*useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/openai')
        const data = await response.json()
        setRespuesta(data.response)
      } catch (error) {
        console.error('Error: ', error)
      }
    }
    fetchData()
  }, [])
  */

  useEffect(() => {
    async function fetchIngredientes() {
      try {
        const response = await fetch('/data/ingredients.json')
        const data = await response.json();
        setIngredientes(data)
      } catch (error) {
        console.error('Error al cargar los ingredientes:', error)
      }
    }

    fetchIngredientes();
  }, []);

  const manejarSeleccion = (nombre) => {
    setSeleccion(prevSeleccion => ({
      ...prevSeleccion,
      [nombre]: !prevSeleccion[nombre]
    }));
  };

  const enviarSeleccion = async () => {
    const datos = { ingredientesSeleccionados: seleccion };
    try {
      const respuesta = await fetch('http://localhost:5000/api/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
      });
      if (respuesta.ok) {
        console.log('Datos enviados correctamente');
      } else {
        console.error('Error al enviar datos al servidor');
      }
    } catch (error) {
      console.error('Error al realizar la solicitud:', error);
    }
  };

  return (
    <div>
      {ingredientes.map(ingrediente => (
        <div key={ingrediente.id}>
          <label>
            <input type="checkbox" onChange={() => manejarSeleccion(ingrediente.nombre)}/>
            {ingrediente.nombre}
          </label>
        </div>
      ))}
      <button onClick={enviarSeleccion}>ACEPTAR INGREDIENTES</button>
      <h1>Respuesta de OpenAI</h1>
      <p>{respuesta}</p>
    </div>
  );
};

export default App;