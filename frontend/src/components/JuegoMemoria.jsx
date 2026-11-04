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
      textAlign: 'center', padding: '2rem', fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif', 
      // Fondo atenuado a 0.75 para que se entienda mejor el juego
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75)), url(${fondoMemoria})`,
      backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '100vh', 
      color: '#fff', textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
      display: 'flex', flexDirection: 'column', alignItems: 'center'
    }}>
      
      <h1 style={{ fontSize: '3.5rem', color: '#FFF', margin: '0 0 20px 0' }}>🧠 Juego de Memoria</h1>
      
      {/* Margen inferior arreglado aquí */}
      <p style={{ fontSize: '1.5rem', fontWeight: 'bold', marginTop: '0', marginBottom: '30px' }}>
        
      </p>

      {/* Margen inferior arreglado aquí */}
      <p style={{ fontSize: '1.5rem', fontWeight: 'bold', marginTop: '0', marginBottom: '30px' }}>
        Movimientos: {movimientos}
      </p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 110px)', gap: '15px', justifyContent: 'center' }}>
        {cartas.map((c, i) => {
          const visible = c.volteada || parejas.includes(c.emoji);
          return (
            <div key={c.uniqueId} onClick={() => voltear(i)} style={{
              width: '110px', height: '110px', backgroundColor: visible ? '#FFF' : '#0bff07',
              border: visible ? '4px solid #4CAF50' : '4px solid #1aff00', 
              borderRadius: '20px', display: 'flex', alignItems: 'center', 
              justifyContent: 'center', fontSize: '3.5rem', cursor: 'pointer',
              boxShadow: '0 6px 0 rgba(0,0,0,0.3)', textShadow: 'none'
            }}>
              {visible ? c.emoji : '❓'}
            </div>
          );
        })}
      </div>
      
      {terminado && (
        <div style={{ marginTop: '2rem', backgroundColor: 'rgba(255,255,255,0.95)', display: 'inline-block', padding: '20px', borderRadius: '15px', color: '#333', textShadow: 'none' }}>
          <h2 style={{ color: '#4CAF50', fontSize: '2rem', margin: '0 0 15px 0' }}>¡Felicidades! 🎉</h2>
          <button onClick={iniciarJuego} style={{ padding: '15px 30px', fontSize: '20px', cursor: 'pointer', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold' }}>
            Jugar de nuevo
          </button>
        </div>
      )}

      <p style={{ marginTop: 'auto', paddingTop: '2rem', fontSize: '1.2rem', fontWeight: 'bold' }}>Creado por Manolo Estrada</p>
    </div>
  );
}