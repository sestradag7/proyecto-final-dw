import { useState, useEffect } from 'react';
import { guardarProgreso } from '../services/api';
import fondoMemoria from '../../img/memory-diy.jpg';

const cartasBase = [
  { id: 1, emoji: '🐶' }, { id: 2, emoji: '🐱' },
  { id: 3, emoji: '🐭' }, { id: 4, emoji: '🐹' },
  { id: 5, emoji: '🐰' }, { id: 6, emoji: '🦊' },
  { id: 7, emoji: '🐻' }, { id: 8, emoji: '🐼' }
];

export default function JuegoMemoria({ estudianteId }) {
  const [cartas, setCartas] = useState([]);
  const [volteadas, setVolteadas] = useState([]);
  const [parejas, setParejas] = useState([]);
  const [movimientos, setMovimientos] = useState(0);
  const [terminado, setTerminado] = useState(false);

  useEffect(() => { iniciarJuego(); }, []);

  const iniciarJuego = () => {
    const mezcladas = [...cartasBase, ...cartasBase].sort(() => Math.random() - 0.5).map((c, i) => ({ ...c, uniqueId: i, volteada: false }));
    setCartas(mezcladas); setVolteadas([]); setParejas([]); setMovimientos(0); setTerminado(false);
  };

  const voltear = (index) => {
    if (volteadas.length === 2 || cartas[index].volteada || parejas.includes(cartas[index].emoji)) return;
    const nuevas = [...cartas]; nuevas[index].volteada = true;
    setCartas(nuevas); setVolteadas([...volteadas, index]);
  };

  useEffect(() => {
    if (volteadas.length === 2) {
      setMovimientos(m => m + 1);
      const [a, b] = volteadas;
      if (cartas[a].emoji === cartas[b].emoji) {
        setParejas(p => [...p, cartas[a].emoji]); setVolteadas([]);
      } else {
        setTimeout(() => {
          const desvolteadas = [...cartas];
          desvolteadas[a].volteada = false; desvolteadas[b].volteada = false;
          setCartas(desvolteadas); setVolteadas([]);
        }, 1000);
      }
    }
  }, [volteadas, cartas]);

  useEffect(() => {
    if (parejas.length === cartasBase.length && cartas.length > 0 && !terminado) {
      setTerminado(true);
      guardarProgreso({
        estudiante_id: estudianteId, actividad_id: 6, 
        puntaje: Math.max(10, 100 - (movimientos - 8) * 5), total_preguntas: 100
      }).catch(console.error);
    }
  }, [parejas]);

  return (
    <div style={{ 
      textAlign: 'center', padding: '1rem', fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif', 
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75)), url(${fondoMemoria})`,
      backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '100vh', 
      color: '#fff', textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
      display: 'flex', flexDirection: 'column', alignItems: 'center'
    }}>
      {/* Título Responsivo */}
      <h1 style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)', margin: '0 0 10px 0' }}>🧠 Juego de Memoria</h1>
      <p style={{ fontSize: 'clamp(1rem, 4vw, 1.5rem)', fontWeight: 'bold', marginTop: '0', marginBottom: '20px' }}>Movimientos: {movimientos}</p>
      
      {/* Tablero Responsivo */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'clamp(5px, 2vw, 15px)', width: '100%', maxWidth: '500px' }}>
        {cartas.map((c, i) => {
          const visible = c.volteada || parejas.includes(c.emoji);
          return (
            <div key={c.uniqueId} onClick={() => voltear(i)} style={{
              aspectRatio: '1/1', backgroundColor: visible ? '#FFF' : '#0bff07',
              border: visible ? '4px solid #4CAF50' : '4px solid #1aff00', 
              borderRadius: 'clamp(10px, 3vw, 20px)', display: 'flex', alignItems: 'center', 
              justifyContent: 'center', fontSize: 'clamp(2rem, 8vw, 3.5rem)', cursor: 'pointer',
              boxShadow: '0 4px 0 rgba(0,0,0,0.3)', textShadow: 'none'
            }}>
              {visible ? c.emoji : '❓'}
            </div>
          );
        })}
      </div>
      
      {terminado && (
        <div style={{ marginTop: '20px', backgroundColor: 'rgba(255,255,255,0.95)', display: 'inline-block', padding: '20px', borderRadius: '15px', color: '#333', textShadow: 'none', width: '90%', maxWidth: '400px' }}>
          <h2 style={{ color: '#4CAF50', fontSize: 'clamp(1.5rem, 5vw, 2rem)', margin: '0 0 15px 0' }}>¡Felicidades! 🎉</h2>
          <button onClick={iniciarJuego} style={{ padding: '10px 20px', fontSize: 'clamp(1rem, 4vw, 1.2rem)', cursor: 'pointer', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', width: '100%' }}>
            Jugar de nuevo
          </button>
        </div>
      )}

      <p style={{ marginTop: 'auto', paddingTop: '20px', fontSize: 'clamp(0.8rem, 3vw, 1.2rem)', fontWeight: 'bold' }}>Creado por Manolo Estrada</p>
    </div>
  );
}