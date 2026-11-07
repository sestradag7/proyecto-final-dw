import { useState, useEffect } from 'react';
import { guardarProgreso } from '../services/api';
import fondoFiguras from '../../img/figuras-diy.jpg';

const figuras = [
  { nombre: 'Círculo', tipo: 'circulo' },
  { nombre: 'Cuadrado', tipo: 'cuadrado' },
  { nombre: 'Triángulo', tipo: 'triangulo' },
  { nombre: 'Rectángulo', tipo: 'rectangulo' }
];

export default function JuegoFiguras({ estudianteId }) {
  const [pregunta, setPregunta] = useState(null);
  const [opciones, setOpciones] = useState([]);
  const [ronda, setRonda] = useState(1);
  const [puntaje, setPuntaje] = useState(0);
  const [mensaje, setMensaje] = useState('');
  const [terminado, setTerminado] = useState(false);

  const generarPregunta = () => {
    const correcta = figuras[Math.floor(Math.random() * figuras.length)];
    const otras = figuras.filter(f => f.nombre !== correcta.nombre).sort(() => Math.random() - 0.5).slice(0, 3);
    setPregunta(correcta);
    setOpciones([correcta, ...otras].sort(() => Math.random() - 0.5));
    setMensaje('');
  };

  useEffect(() => { generarPregunta(); }, []);

  const seleccionar = (nombre) => {
    if (mensaje.includes('Correcto')) return;
    if (nombre === pregunta.nombre) {
      setMensaje('¡Correcto! ✅'); setPuntaje(puntaje + 25);
      setTimeout(() => {
        if (ronda < 4) { setRonda(ronda + 1); generarPregunta(); }
        else { finalizarJuego(puntaje + 25); }
      }, 1000);
    } else { setMensaje('Incorrecto ❌ Intenta de nuevo'); }
  };

  const finalizarJuego = async (puntajeFinal) => {
    setTerminado(true);
    try { await guardarProgreso({ estudiante_id: estudianteId, actividad_id: 5, puntaje: puntajeFinal, total_preguntas: 100 }); } 
    catch (error) { console.error(error); }
  };

  const renderizarFigura = () => {
    if (!pregunta) return null;
    let estiloBase = { width: 'clamp(80px, 25vw, 150px)', height: 'clamp(80px, 25vw, 150px)', backgroundColor: '#FF5722', margin: '20px auto', boxShadow: '0 10px 20px rgba(0,0,0,0.3)' };
    if (pregunta.tipo === 'circulo') return <div style={{...estiloBase, borderRadius: '50%'}}></div>;
    if (pregunta.tipo === 'cuadrado') return <div style={estiloBase}></div>;
    if (pregunta.tipo === 'rectangulo') return <div style={{...estiloBase, width: 'clamp(120px, 35vw, 200px)', height: 'clamp(80px, 25vw, 120px)'}}></div>;
    if (pregunta.tipo === 'triangulo') return (
      <div style={{ width: '0', height: '0', borderLeft: 'clamp(40px, 12vw, 75px) solid transparent', borderRight: 'clamp(40px, 12vw, 75px) solid transparent', borderBottom: 'clamp(70px, 20vw, 130px) solid #FF5722', margin: '20px auto', filter: 'drop-shadow(0px 10px 10px rgba(0,0,0,0.3))' }}></div>
    );
  };

  if (terminado) {
    return (
      <div style={{ minHeight: '100vh', padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundImage: `linear-gradient(rgba(255,255,255,0.8), rgba(255,255,255,0.8)), url(${fondoFiguras})`, backgroundSize: 'cover', fontFamily: 'Comic Sans MS' }}>
        <h1 style={{ color: '#E91E63', fontSize: 'clamp(2rem, 6vw, 3rem)' }}>¡Terminado! 🎉</h1>
        <h2 style={{ fontSize: 'clamp(1.2rem, 4vw, 2rem)' }}>Puntaje: {puntaje} / 100</h2>
        <button onClick={() => {setPuntaje(0); setRonda(1); setTerminado(false); generarPregunta();}} style={{ padding: '10px 20px', fontSize: 'clamp(1rem, 4vw, 1.2rem)', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', marginTop: '20px' }}>Jugar de nuevo</button>
        <p style={{ marginTop: '3rem', fontSize: 'clamp(0.8rem, 3vw, 1.2rem)', fontWeight: 'bold' }}>Creado por Manolo Estrada</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', padding: '1rem', textAlign: 'center', backgroundImage: `linear-gradient(rgba(255,255,255,0.8), rgba(255,255,255,0.8)), url(${fondoFiguras})`, backgroundSize: 'cover', fontFamily: 'Comic Sans MS', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 3rem)', color: '#3F51B5' }}>📐 ¿Qué figura es esta?</h1>
      <p style={{ fontSize: 'clamp(1rem, 3vw, 1.5rem)', fontWeight: 'bold', marginBottom: '20px' }}>Ronda: {ronda} de 4 | Puntaje: {puntaje}</p>
      
      {renderizarFigura()}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'clamp(10px, 3vw, 15px)', width: '100%', maxWidth: '400px', marginTop: '20px' }}>
        {opciones.map((op, i) => (
          <button key={i} onClick={() => seleccionar(op.nombre)} style={{ padding: 'clamp(10px, 3vw, 15px)', fontSize: 'clamp(1rem, 4vw, 1.5rem)', fontWeight: 'bold', cursor: 'pointer', borderRadius: '15px', border: '3px solid #3F51B5', backgroundColor: '#E8EAF6', color: '#1A237E' }}>
            {op.nombre}
          </button>
        ))}
      </div>
      
      {mensaje && <p style={{ fontSize: 'clamp(1.2rem, 4vw, 1.5rem)', fontWeight: 'bold', color: mensaje.includes('Correcto') ? '#4CAF50' : '#F44336', backgroundColor: 'white', padding: '10px', borderRadius: '10px', marginTop: '20px' }}>{mensaje}</p>}
      <p style={{ marginTop: 'auto', paddingTop: '20px', fontSize: 'clamp(0.8rem, 3vw, 1.2rem)', fontWeight: 'bold' }}>Creado por Manolo Estrada</p>
    </div>
  );
}