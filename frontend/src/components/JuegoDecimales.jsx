import { useState, useEffect } from 'react';
import { guardarProgreso } from '../services/api';
import fondoDecimales from '../../img/decimales-diy.jpg';

export default function JuegoDecimales({ estudianteId }) {
  const [pregunta, setPregunta] = useState({ a: 0, b: 0, res: 0 });
  const [opciones, setOpciones] = useState([]);
  const [ronda, setRonda] = useState(1);
  const [puntaje, setPuntaje] = useState(0);
  const [mensaje, setMensaje] = useState('');
  const [terminado, setTerminado] = useState(false);

  const generarPregunta = () => {
    const a = Math.floor(Math.random() * 5) + 2;
    const decimales = [0.5, 1.5, 2.5, 3.5];
    const b = decimales[Math.floor(Math.random() * decimales.length)];
    const res = Number((a * b).toFixed(1));
    let opcionesFalsas = new Set();
    while(opcionesFalsas.size < 3) {
      let f = Number((res + (Math.random() * 4 - 2)).toFixed(1));
      if(f > 0 && f !== res) opcionesFalsas.add(f);
    }
    setPregunta({ a, b, res });
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
    try { await guardarProgreso({ estudiante_id: estudianteId, actividad_id: 9, puntaje: puntajeFinal, total_preguntas: 100 }); } 
    catch (error) { console.error(error); }
  };

  if (terminado) {
    return (
      <div style={{ minHeight: '100vh', padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundImage: `linear-gradient(rgba(255,255,255,0.8), rgba(255,255,255,0.8)), url(${fondoDecimales})`, backgroundSize: 'cover', fontFamily: 'Comic Sans MS' }}>
        <h1 style={{ color: '#E91E63', fontSize: 'clamp(2rem, 6vw, 3rem)' }}>¡Terminado! 🎉</h1>
        <h2 style={{ fontSize: 'clamp(1.2rem, 4vw, 2rem)' }}>Puntaje: {puntaje} / 100</h2>
        <button onClick={() => {setPuntaje(0); setRonda(1); setTerminado(false); generarPregunta();}} style={{ padding: '10px 20px', fontSize: 'clamp(1rem, 4vw, 1.2rem)', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', marginTop: '20px' }}>Jugar de nuevo</button>
        <p style={{ marginTop: '3rem', fontSize: 'clamp(0.8rem, 3vw, 1.2rem)', fontWeight: 'bold' }}>Creado por Manolo Estrada</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', padding: '1rem', textAlign: 'center', backgroundImage: `linear-gradient(rgba(255,255,255,0.8), rgba(255,255,255,0.8)), url(${fondoDecimales})`, backgroundSize: 'cover', fontFamily: 'Comic Sans MS', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 3rem)', color: '#9C27B0' }}>🔢 Multiplicación con Decimales</h1>
      <p style={{ fontSize: 'clamp(1rem, 3vw, 1.5rem)', fontWeight: 'bold', marginBottom: '20px' }}>Ronda: {ronda} de 4 | Puntaje: {puntaje}</p>
      
      <div style={{ backgroundColor: '#2E7D32', border: 'clamp(5px, 2vw, 15px) solid #8D6E63', borderRadius: '10px', padding: 'clamp(15px, 4vw, 30px)', boxShadow: '0 10px 20px rgba(0,0,0,0.5)', marginBottom: '20px', color: 'white', width: '100%', maxWidth: '500px' }}>
        <div style={{ fontSize: 'clamp(2.5rem, 8vw, 5rem)', fontWeight: 'bold', color: '#FFF', textShadow: '3px 3px 6px rgba(0,0,0,0.6)' }}>
          {pregunta.a} × {pregunta.b} = ?
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'clamp(10px, 3vw, 15px)', width: '100%', maxWidth: '400px' }}>
        {opciones.map((op, i) => (
          <button key={i} onClick={() => seleccionar(op)} style={{ padding: 'clamp(10px, 3vw, 20px)', fontSize: 'clamp(1.5rem, 6vw, 2.5rem)', cursor: 'pointer', borderRadius: '15px', border: '4px solid #9C27B0', backgroundColor: '#E1BEE7', color: '#4A148C', fontWeight: 'bold' }}>
            {op}
          </button>
        ))}
      </div>

      {mensaje && <p style={{ fontSize: 'clamp(1.2rem, 4vw, 1.5rem)', fontWeight: 'bold', marginTop: '20px', backgroundColor: 'white', color: mensaje.includes('Correcto') ? '#4CAF50' : '#F44336', padding: '10px', borderRadius: '10px' }}>{mensaje}</p>}
      <p style={{ marginTop: 'auto', paddingTop: '20px', fontSize: 'clamp(0.8rem, 3vw, 1.2rem)', fontWeight: 'bold', color: '#555' }}>Creado por Manolo Estrada</p>
    </div>
  );
}