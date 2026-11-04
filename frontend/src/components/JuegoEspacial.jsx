import { useState, useEffect } from 'react';
import { guardarProgreso } from '../services/api';
import fondoEspacial from '../../img/espacial-diy.jpg';

export default function JuegoEspacial({ estudianteId }) {
  const [estaAdentro, setEstaAdentro] = useState(true);
  const [ronda, setRonda] = useState(1);
  const [puntaje, setPuntaje] = useState(0);
  const [mensaje, setMensaje] = useState('');
  const [terminado, setTerminado] = useState(false);

  const generarPregunta = () => {
    setEstaAdentro(Math.random() > 0.5);
    setMensaje('');
  };

  useEffect(() => { generarPregunta(); }, []);

  const responder = (respuesta) => {
    if (mensaje.includes('Correcto')) return;
    
    const esCorrecto = (respuesta === 'adentro' && estaAdentro) || (respuesta === 'afuera' && !estaAdentro);
    
    if (esCorrecto) {
      setMensaje('¡Correcto! ✅');
      setPuntaje(puntaje + 25);
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
      // ID 1 es Adentro/Afuera
      await guardarProgreso({ estudiante_id: estudianteId, actividad_id: 1, puntaje: puntajeFinal, total_preguntas: 100 });
    } catch (error) { console.error(error); }
  };

  if (terminado) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundImage: `linear-gradient(rgba(255,255,255,0.8), rgba(255,255,255,0.8)), url(${fondoEspacial})`, backgroundSize: 'cover', fontFamily: 'Comic Sans MS' }}>
        <h1 style={{ color: '#E91E63', fontSize: '3rem' }}>¡Terminado! 🎉</h1>
        <h2>Puntaje: {puntaje} / 100</h2>
        <button onClick={() => {setPuntaje(0); setRonda(1); setTerminado(false); generarPregunta();}} style={{ padding: '15px 30px', fontSize: '20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', marginTop: '20px' }}>Jugar de nuevo</button>
        <p style={{ marginTop: '3rem', fontWeight: 'bold' }}>Creado por Manolo Estrada</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', padding: '2rem', textAlign: 'center', backgroundImage: `linear-gradient(rgba(255,255,255,0.8), rgba(255,255,255,0.8)), url(${fondoEspacial})`, backgroundSize: 'cover', fontFamily: 'Comic Sans MS', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1 style={{ fontSize: '3rem', color: '#009688' }}>📦 ¿Está adentro o afuera?</h1>
      <p style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '20px' }}>Ronda: {ronda} de 4 | Puntaje: {puntaje}</p>
      
      {/* Zona visual */}
      <div style={{ position: 'relative', width: '300px', height: '300px', margin: '2rem auto' }}>
        {/* La caja */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '150px', border: '8px solid #8D6E63', borderTop: 'none', backgroundColor: '#D7CCC8', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
          <span style={{ marginBottom: '10px', fontWeight: 'bold', color: '#5D4037' }}>ADENTRO</span>
        </div>
        
        {/* La pelota (emoji) */}
        <div style={{ 
          position: 'absolute', 
          left: '50%', 
          transform: 'translateX(-50%)',
          transition: 'all 0.5s ease',
          bottom: estaAdentro ? '50px' : '200px', // Si está adentro baja, si está afuera sube
          fontSize: '5rem'
        }}>
          ⚽
        </div>
      </div>

      <div style={{ display: 'flex', gap: '20px', marginTop: '1rem' }}>
        <button onClick={() => responder('adentro')} style={{ padding: '20px 40px', fontSize: '1.5rem', cursor: 'pointer', borderRadius: '15px', border: '3px solid #009688', backgroundColor: '#B2DFDB', color: '#004D40', fontWeight: 'bold' }}>Adentro</button>
        <button onClick={() => responder('afuera')} style={{ padding: '20px 40px', fontSize: '1.5rem', cursor: 'pointer', borderRadius: '15px', border: '3px solid #FF5722', backgroundColor: '#FFCCBC', color: '#BF360C', fontWeight: 'bold' }}>Afuera</button>
      </div>
      
      {mensaje && <p style={{ fontSize: '1.5rem', fontWeight: 'bold', marginTop: '20px', color: mensaje.includes('Correcto') ? '#4CAF50' : '#F44336', backgroundColor: 'white', padding: '10px', borderRadius: '10px' }}>{mensaje}</p>}
      <p style={{ marginTop: 'auto', fontWeight: 'bold' }}>Creado por Manolo Estrada</p>
    </div>
  );
}