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
    const d = Math.floor(Math.random() * 5) + 4;
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
    } else { setMensaje('Incorrecto ❌ Intenta de nuevo'); }
  };

  const finalizarJuego = async (puntajeFinal) => {
    setTerminado(true);
    try { await guardarProgreso({ estudiante_id: estudianteId, actividad_id: 8, puntaje: puntajeFinal, total_preguntas: 100 }); } 
    catch (error) { console.error(error); }
  };

  const Fraccion = ({ n, d }) => (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', margin: '0 5px', fontSize: 'clamp(1.5rem, 5vw, 3rem)', fontWeight: 'bold', verticalAlign: 'middle' }}>
      <span style={{ borderBottom: '3px solid white', paddingBottom: '2px', paddingX: '5px' }}>{n}</span>
      <span style={{ paddingTop: '2px' }}>{d}</span>
    </div>
  );

  if (terminado) {
    return (
      <div style={{ minHeight: '100vh', padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${fondoQuebrados})`, backgroundSize: 'cover', fontFamily: 'Comic Sans MS', color: 'white' }}>
        <h1 style={{ color: '#FF9800', fontSize: 'clamp(2rem, 6vw, 3rem)' }}>¡Terminado! 🎉</h1>
        <h2 style={{ fontSize: 'clamp(1.2rem, 4vw, 2rem)' }}>Puntaje: {puntaje} / 100</h2>
        <button onClick={() => {setPuntaje(0); setRonda(1); setTerminado(false); generarPregunta();}} style={{ padding: '10px 20px', fontSize: 'clamp(1rem, 4vw, 1.2rem)', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', marginTop: '20px' }}>Jugar de nuevo</button>
        <p style={{ marginTop: '3rem', fontSize: 'clamp(0.8rem, 3vw, 1.2rem)', fontWeight: 'bold' }}>Creado por Manolo Estrada</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', padding: '1rem', textAlign: 'center', backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${fondoQuebrados})`, backgroundSize: 'cover', fontFamily: 'Comic Sans MS', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 3rem)', color: '#FF9800' }}>➗ Suma de Quebrados</h1>
      <p style={{ fontSize: 'clamp(1rem, 3vw, 1.5rem)', fontWeight: 'bold', marginBottom: '20px' }}>Ronda: {ronda} de 4 | Puntaje: {puntaje}</p>

      <div style={{ backgroundColor: '#2E7D32', border: 'clamp(5px, 2vw, 15px) solid #8D6E63', borderRadius: '10px', padding: 'clamp(10px, 4vw, 30px)', boxShadow: '0 10px 20px rgba(0,0,0,0.5)', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', maxWidth: '500px' }}>
        <Fraccion n={pregunta.n1} d={pregunta.d} />
        <span style={{ fontSize: 'clamp(1.5rem, 5vw, 3rem)', margin: '0 10px' }}>+</span>
        <Fraccion n={pregunta.n2} d={pregunta.d} />
        <span style={{ fontSize: 'clamp(1.5rem, 5vw, 3rem)', margin: '0 10px' }}>=</span>
        <span style={{ fontSize: 'clamp(1.5rem, 5vw, 3rem)' }}>?</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'clamp(10px, 3vw, 15px)', width: '100%', maxWidth: '400px' }}>
        {opciones.map((op, i) => (
          <button key={i} onClick={() => seleccionar(op)} style={{ padding: 'clamp(10px, 3vw, 15px)', cursor: 'pointer', borderRadius: '15px', border: '3px solid #FF9800', backgroundColor: '#FFE0B2', color: '#E65100', fontWeight: 'bold', display: 'flex', justifyContent: 'center' }}>
            <Fraccion n={op} d={pregunta.d} />
          </button>
        ))}
      </div>

      {mensaje && <p style={{ fontSize: 'clamp(1.2rem, 4vw, 1.5rem)', fontWeight: 'bold', marginTop: '20px', backgroundColor: 'white', color: mensaje.includes('Correcto') ? '#4CAF50' : '#F44336', padding: '10px', borderRadius: '10px' }}>{mensaje}</p>}
      <p style={{ marginTop: 'auto', paddingTop: '20px', fontSize: 'clamp(0.8rem, 3vw, 1.2rem)', fontWeight: 'bold' }}>Creado por Manolo Estrada</p>
    </div>
  );
}