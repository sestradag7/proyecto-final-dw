import { useState, useEffect } from 'react';
import { guardarProgreso } from '../services/api';
import fondoMultiplicar from '../../img/multiplicar-diy.jpg';

export default function JuegoMultiplicar({ estudianteId }) {
  const [pregunta, setPregunta] = useState({ a: 0, b: 0, respuesta: 0 });
  const [opciones, setOpciones] = useState([]);
  const [puntaje, setPuntaje] = useState(0);
  const [ronda, setRonda] = useState(1);
  const [mensaje, setMensaje] = useState('');
  const [terminado, setTerminado] = useState(false);

  const TOTAL_RONDAS = 5;

  const generarPregunta = () => {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    const respuesta = a * b;
    let opcionesFalsas = new Set();
    while (opcionesFalsas.size < 3) {
      let falsa = respuesta + (Math.floor(Math.random() * 10) - 5);
      if (falsa > 0 && falsa !== respuesta) opcionesFalsas.add(falsa);
    }
    const todasLasOpciones = [respuesta, ...opcionesFalsas].sort(() => Math.random() - 0.5);
    setPregunta({ a, b, respuesta }); setOpciones(todasLasOpciones); setMensaje('');
  };

  useEffect(() => { generarPregunta(); }, []);

  const seleccionarRespuesta = (opcion) => {
    if (mensaje.includes('Correcto')) return;
    if (opcion === pregunta.respuesta) {
      setMensaje('¡Correcto! ✅'); setPuntaje(puntaje + 20);
      setTimeout(() => {
        if (ronda < TOTAL_RONDAS) { setRonda(ronda + 1); generarPregunta(); }
        else { finalizarJuego(puntaje + 20); }
      }, 1000);
    } else {
      setMensaje('Incorrecto ❌ Intenta de nuevo');
    }
  };

  const finalizarJuego = async (puntajeFinal) => {
    setTerminado(true);
    try {
      await guardarProgreso({ estudiante_id: estudianteId, actividad_id: 7, puntaje: puntajeFinal, total_preguntas: 100 });
    } catch (error) { console.error('Error al guardar:', error); }
  };

  const reiniciarJuego = () => { setPuntaje(0); setRonda(1); setTerminado(false); generarPregunta(); };

  if (terminado) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${fondoMultiplicar})`, backgroundSize: 'cover', backgroundPosition: 'center', color: '#fff', textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
        <div style={{ backgroundColor: 'rgba(255,255,255,0.95)', padding: '40px', borderRadius: '20px', color: '#333', textShadow: 'none' }}>
          <h1 style={{ fontSize: '3rem', color: '#FF9800', margin: '0 0 15px 0' }}>¡Juego Terminado! 🎉</h1>
          <h2 style={{ fontSize: '2rem' }}>Tu puntaje: {puntaje} / 100</h2>
          <button onClick={reiniciarJuego} style={{ padding: '15px 30px', fontSize: '20px', marginTop: '20px', cursor: 'pointer', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold' }}>
            Jugar de nuevo
          </button>
        </div>
        <p style={{ marginTop: '3rem', fontSize: '1.2rem', fontWeight: 'bold' }}>Creado por Manolo Estrada</p>
      </div>
    );
  }

  return (
    <div style={{ 
      textAlign: 'center', padding: '2rem', fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif', 
      backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)), url(${fondoMultiplicar})`,
      backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '100vh', color: '#333',
      display: 'flex', flexDirection: 'column', alignItems: 'center'
    }}>
      
      {/* CONTENEDOR ESTILO PIZARRA */}
      <div style={{
        backgroundColor: '#2E7D32', // Verde pizarra
        border: '15px solid #8D6E63', // Borde madera
        borderRadius: '10px',
        padding: '30px 50px',
        boxShadow: '0 10px 20px rgba(0,0,0,0.5), inset 0 0 20px rgba(0,0,0,0.3)',
        maxWidth: '1000px',
        width: '100%',
        color: 'white',
        marginBottom: '2rem'
      }}>
        <h1 style={{ fontSize: '3.5rem', color: '#FFF', margin: '0 0 40px 0', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>✖️ Multiplicaciones</h1>
        
          {/* Margen inferior arreglado aquí */}
        <p style={{ fontSize: '1.5rem', fontWeight: 'bold', marginTop: '0', marginBottom: '50px', color: '#E0E0E0' }}>
          Ronda: {ronda} de {TOTAL_RONDAS} | Puntaje: {puntaje}
        </p>
        
        <div style={{ fontSize: '5rem', fontWeight: 'bold', color: '#FFF', textShadow: '3px 3px 6px rgba(0,0,0,0.6)' }}>
          {pregunta.a} × {pregunta.b} = ?
        </div>
      </div>

      {/* Los botones de opciones fuera de la pizarra */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 180px)', gap: '20px', justifyContent: 'center' }}>
        {opciones.map((opcion, index) => (
          <button key={index} onClick={() => seleccionarRespuesta(opcion)} style={{ padding: '20px', fontSize: '2.5rem', fontWeight: 'bold', cursor: 'pointer', borderRadius: '20px', border: '4px solid #4e29e2', backgroundColor: '#bec2e7', color: '#4A148C', boxShadow: '0 6px 0 #3527b0' }}>
            {opcion}
          </button>
        ))}
      </div>

      {mensaje && (
        <div style={{ marginTop: '1.5rem' }}>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', display: 'inline-block', padding: '10px 20px', borderRadius: '15px', backgroundColor: 'rgba(255,255,255,0.9)', color: mensaje.includes('Correcto') ? '#4CAF50' : '#F44336', margin: 0, boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            {mensaje}
          </p>
        </div>
      )}

      <p style={{ marginTop: 'auto', paddingTop: '2rem', fontSize: '1.2rem', fontWeight: 'bold', color: '#555' }}>Creado por Manolo Estrada</p>
    </div>
  );
}