import { useState, useEffect } from 'react';
import { guardarProgreso } from '../services/api';
import fondoEspacial from '../../img/espacial-diy.jpg';

export default function JuegoEspacial({ estudianteId }) {
  const [estaAdentro, setEstaAdentro] = useState(true);
  const [ronda, setRonda] = useState(1);
  const [puntaje, setPuntaje] = useState(0);
  const [mensaje, setMensaje] = useState('');
  const [terminado, setTerminado] = useState(false);

  const generarPregunta = () => { setEstaAdentro(Math.random() > 0.5); setMensaje(''); };
  useEffect(() => { generarPregunta(); }, []);

  const responder = (respuesta) => {
    if (mensaje.includes('Correcto')) return;
    const esCorrecto = (respuesta === 'adentro' && estaAdentro) || (respuesta === 'afuera' && !estaAdentro);
    if (esCorrecto) {
      setMensaje('¡Correcto! ✅'); setPuntaje(puntaje + 25);
      setTimeout(() => {
        if (ronda < 4) { setRonda(ronda + 1); generarPregunta(); }
        else { finalizarJuego(puntaje + 25); }
      }, 1000);
    } else { setMensaje('Incorrecto ❌ Intenta de nuevo'); }
  };

  const finalizarJuego = async (puntajeFinal) => {
    setTerminado(true);
    try { await guardarProgreso({ estudiante_id: estudianteId, actividad_id: 1, puntaje: puntajeFinal, total_preguntas: 100 }); } 
    catch (error) { console.error(error); }
  };

  if (terminado) {
    return (
      <div style={{ minHeight: '100vh', padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundImage: `linear-gradient(rgba(255,255,255,0.8), rgba(255,255,255,0.8)), url(${fondoEspacial})`, backgroundSize: 'cover', fontFamily: 'Comic Sans MS' }}>
        <h1 style={{ color: '#E91E63', fontSize: 'clamp(2rem, 6vw, 3rem)' }}>¡Terminado! 🎉</h1>
        <h2 style={{ fontSize: 'clamp(1.2rem, 4vw, 2rem)' }}>Puntaje: {puntaje} / 100</h2>
        <button onClick={() => {setPuntaje(0); setRonda(1); setTerminado(false); generarPregunta();}} style={{ padding: '10px 20px', fontSize: 'clamp(1rem, 4vw, 1.2rem)', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', marginTop: '20px' }}>Jugar de nuevo</button>
        <p style={{ marginTop: '3rem', fontSize: 'clamp(0.8rem, 3vw, 1.2rem)', fontWeight: 'bold' }}>Creado por Manolo Estrada</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', padding: '1rem', textAlign: 'center', backgroundImage: `linear-gradient(rgba(255,255,255,0.8), rgba(255,255,255,0.8)), url(${fondoEspacial})`, backgroundSize: 'cover', fontFamily: 'Comic Sans MS', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 3rem)', color: '#009688' }}>📦 ¿Adentro o afuera?</h1>
      <p style={{ fontSize: 'clamp(1rem, 3vw, 1.5rem)', fontWeight: 'bold', marginBottom: '20px' }}>Ronda: {ronda} de 4 | Puntaje: {puntaje}</p>
      
      <div style={{ position: 'relative', width: 'clamp(200px, 60vw, 300px)', height: 'clamp(200px, 60vw, 300px)', margin: '2rem auto' }}>
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '50%', border: '8px solid #8D6E63', borderTop: 'none', backgroundColor: '#D7CCC8', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
          <span style={{ marginBottom: '10px', fontWeight: 'bold', color: '#5D4037', fontSize: 'clamp(0.8rem, 3vw, 1rem)' }}>ADENTRO</span>
        </div>
        <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', transition: 'all 0.5s ease', bottom: estaAdentro ? '15%' : '65%', fontSize: 'clamp(3rem, 15vw, 5rem)' }}>
          ⚽
        </div>
      </div>

      <div style={{ display: 'flex', gap: 'clamp(10px, 3vw, 20px)', marginTop: '1rem', width: '100%', justifyContent: 'center' }}>
        <button onClick={() => responder('adentro')} style={{ padding: 'clamp(10px, 3vw, 20px) clamp(20px, 5vw, 40px)', fontSize: 'clamp(1.2rem, 4vw, 1.5rem)', cursor: 'pointer', borderRadius: '15px', border: '3px solid #009688', backgroundColor: '#B2DFDB', color: '#004D40', fontWeight: 'bold', flex: 1, maxWidth: '150px' }}>Adentro</button>
        <button onClick={() => responder('afuera')} style={{ padding: 'clamp(10px, 3vw, 20px) clamp(20px, 5vw, 40px)', fontSize: 'clamp(1.2rem, 4vw, 1.5rem)', cursor: 'pointer', borderRadius: '15px', border: '3px solid #FF5722', backgroundColor: '#FFCCBC', color: '#BF360C', fontWeight: 'bold', flex: 1, maxWidth: '150px' }}>Afuera</button>
      </div>
      
      {mensaje && <p style={{ fontSize: 'clamp(1.2rem, 4vw, 1.5rem)', fontWeight: 'bold', marginTop: '20px', color: mensaje.includes('Correcto') ? '#4CAF50' : '#F44336', backgroundColor: 'white', padding: '10px', borderRadius: '10px' }}>{mensaje}</p>}
      <p style={{ marginTop: 'auto', paddingTop: '20px', fontSize: 'clamp(0.8rem, 3vw, 1.2rem)', fontWeight: 'bold' }}>Creado por Manolo Estrada</p>
    </div>
  );
}