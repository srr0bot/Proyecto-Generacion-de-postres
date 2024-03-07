import React, { useState, useEffect } from "react";
import "primereact/resources/themes/lara-light-purple/theme.css";
import myImage from '../src/images/1229080980.png';
import './styles/engine.css';
import { Button } from 'primereact/button';

     
function Receta({ titulo, ingredientes, procedimiento }) {
  return (
    <div>
      <h2>{titulo}</h2>
      <p>{ingredientes}</p>
      <p>{procedimiento}</p>
    </div>
  );
}

function App() {
  const [seleccion, setSeleccion] = useState({});
  const [ingredientes, setIngredientes] = useState([]);
  const [respuesta, setRespuesta] = useState([])
  const [mostrarImagen, setMostrarImagen] = useState(false)

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
      const response = await fetch('http://localhost:5000/api/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
      });
      const data = await response.json()
      console.log(data)
      setRespuesta(data)
      setMostrarImagen(true)
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
          <label className="contenedor">
            <input type="checkbox" onChange={() => manejarSeleccion(ingrediente.nombre)}/>
            {ingrediente.nombre}
          </label>
        </div>
      ))}
      <Button className="boton-aceptar" onClick={enviarSeleccion} rounded label="Aceptar"/>
      <Receta titulo={respuesta.titulo} ingredientes={respuesta.ingredientes} procedimiento={respuesta.procedimiento} />
      {mostrarImagen && <img src={myImage} alt="Description" style={{ width: '100%', height: 'auto' }} />}

    </div>
  );

  
};

export default App;