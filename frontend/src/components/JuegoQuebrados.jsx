import { useState, useEffect } from 'react';
import { guardarProgreso } from '../services/api';
import fondoQuebrados from '../../img/quebrados-diy.jpg';

export default function JuegoQuebrados({ estudianteId }) {
  const [pregunta, setPregunta] = useState({ n1: 0, n2: 0, d: 0, res: 0 });
  const [opciones, setOpciones] = useState([]);
  const [ronda, setRonda] = useState(1);
  const [puntaje, setPuntaje] = useState(0);
  const [mensaje, setMensaje] = useState('');
  const [terminado, setTerminado] = useState(false);

  const generarPregunta = () => {
    const d = Math.floor(Math.random() * 5) + 4; // Denominador entre 4 y 8
    const n1 = Math.floor(Math.random() * (d - 2)) + 1;
    const n2 = Math.floor(Math.random() * (d - n1 - 1)) + 1;
    const res = n1 + n2;

    let opcionesFalsas = new Set();
    while(opcionesFalsas.size < 3) {
      let f = Math.floor(Math.random() * (d + 2)) + 1;
      if(f !== res) opcionesFalsas.add(f);
    }
    
    setPregunta({ n1, n2, d, res });
    setOpciones([res, ...opcionesFalsas].sort(() => Math.random() - 0.5));
    setMensaje('');
  };

  useEffect(() => { generarPregunta(); }, []);

  const seleccionar = (val) => {
    if (mensaje.includes('Correcto')) return;
    if (val === pregunta.res) {
      setMensaje('¡Correcto! ✅'); setPuntaje(puntaje + 25);
      setTimeout(() => {
        if (ronda < 4) { setRonda(ronda + 1); generarPregunta(); }
        else { finalizarJuego(puntaje + 25); }
      }, 1000);
    } else {
      setMensaje('Incorrecto ❌ Intenta de nuevo');
    }
  };

  const finalizarJuego = async (puntajeFinal) => {
    setTerminado(true);
    try {
      // ID 8 es Suma de Quebrados
      await guardarProgreso({ estudiante_id: estudianteId, actividad_id: 8, puntaje: puntajeFinal, total_preguntas: 100 });
    } catch (error) { console.error(error); }
  };

  // Componente visual para la fracción
  const Fraccion = ({ n, d }) => (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', margin: '0 10px', fontSize: '3rem', fontWeight: 'bold', verticalAlign: 'middle' }}>
      <span style={{ borderBottom: '4px solid white', paddingBottom: '5px', paddingX: '10px' }}>{n}</span>
      <span style={{ paddingTop: '5px' }}>{d}</span>
    </div>
  );

  if (terminado) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${fondoQuebrados})`, backgroundSize: 'cover', fontFamily: 'Comic Sans MS', color: 'white' }}>
        <h1 style={{ color: '#FF9800', fontSize: '3rem' }}>¡Terminado! 🎉</h1>
        <h2>Puntaje: {puntaje} / 100</h2>
        <button onClick={() => {setPuntaje(0); setRonda(1); setTerminado(false); generarPregunta();}} style={{ padding: '15px 30px', fontSize: '20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', marginTop: '20px' }}>Jugar de nuevo</button>
        <p style={{ marginTop: '3rem', fontWeight: 'bold' }}>Creado por Manolo Estrada</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', padding: '2rem', textAlign: 'center', backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${fondoQuebrados})`, backgroundSize: 'cover', fontFamily: 'Comic Sans MS', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1 style={{ fontSize: '3rem', color: '#FF9800' }}>➗ Suma de Quebrados</h1>
      <p style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '20px' }}>Ronda: {ronda} de 4 | Puntaje: {puntaje}</p>

      {/* La pizarra verde reutilizada */}
      <div style={{ backgroundColor: '#2E7D32', border: '15px solid #8D6E63', borderRadius: '10px', padding: '30px', boxShadow: '0 10px 20px rgba(0,0,0,0.5)', marginBottom: '2rem', display: 'flex', alignItems: 'center' }}>
        <Fraccion n={pregunta.n1} d={pregunta.d} />
        <span style={{ fontSize: '3rem', margin: '0 20px' }}>+</span>
        <Fraccion n={pregunta.n2} d={pregunta.d} />
        <span style={{ fontSize: '3rem', margin: '0 20px' }}>=</span>
        <span style={{ fontSize: '3rem' }}>?</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 100px)', gap: '15px', justifyContent: 'center' }}>
        {opciones.map((op, i) => (
          <button key={i} onClick={() => seleccionar(op)} style={{ padding: '15px', fontSize: '2rem', cursor: 'pointer', borderRadius: '15px', border: '3px solid #FF9800', backgroundColor: '#FFE0B2', color: '#E65100', fontWeight: 'bold' }}>
            <Fraccion n={op} d={pregunta.d} />
          </button>
        ))}
      </div>

      {mensaje && <p style={{ fontSize: '1.5rem', fontWeight: 'bold', marginTop: '20px', backgroundColor: 'white', color: mensaje.includes('Correcto') ? '#4CAF50' : '#F44336', padding: '10px', borderRadius: '10px' }}>{mensaje}</p>}
      <p style={{ marginTop: 'auto', fontWeight: 'bold' }}>Creado por Manolo Estrada</p>
    </div>
  );
}