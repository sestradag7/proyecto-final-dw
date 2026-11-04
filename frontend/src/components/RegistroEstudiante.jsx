import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { crearEstudiante } from '../services/api';
import fondoMaestra from '../../img/maestra.png';

export default function RegistroEstudiante() {
  // 1. Agregamos "juego" al estado del formulario
  const [form, setForm] = useState({ nombre: '', edad: '', nivel: 'preprimario', juego: 'memoria' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 2. Calculamos el nivel correcto según el juego elegido
      const esPrimario = ['multiplicar', 'quebrados', 'decimales'].includes(form.juego);
      const datosAEnviar = {
        nombre: form.nombre,
        edad: form.edad,
        nivel: esPrimario ? 'primario' : 'preprimario' // La BD solo recibe esto
      };

      const res = await crearEstudiante(datosAEnviar);
      const estudianteId = res.data.id;
      
      // 3. Redirigimos según el juego elegido
      switch (form.juego) {
        case 'memoria': navigate(`/jugar/memoria/${estudianteId}`); break;
        case 'multiplicar': navigate(`/jugar/multiplicar/${estudianteId}`); break;
        case 'figuras': navigate(`/jugar/figuras/${estudianteId}`); break;
        case 'espacial': navigate(`/jugar/espacial/${estudianteId}`); break;
        case 'quebrados': navigate(`/jugar/quebrados/${estudianteId}`); break;
        case 'decimales': navigate(`/jugar/decimales/${estudianteId}`); break;
        default: navigate(`/jugar/memoria/${estudianteId}`);
      }
    } catch (error) {
      console.error("Error al registrar:", error);
      alert('Error al registrar');
    }
  };

  return (
    <div style={{ 
      padding: '2rem', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.7)), url(${fondoMaestra})`,
      backgroundSize: 'cover', backgroundPosition: 'center', fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif',
    }}>
      <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', padding: '40px', borderRadius: '20px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', maxWidth: '400px', width: '100%', textAlign: 'center' }}>
        <h1 style={{ marginBottom: '1.5rem', fontSize: '2.5rem', color: '#E91E63' }}>🎒 Registro</h1>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          // Para el input de texto
<input type="text" placeholder="Nombre del niño" required 
  value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})}
  style={{ padding: '15px', fontSize: '18px', borderRadius: '10px', border: '2px solid #ccc', backgroundColor: '#fff', color: '#333' }}/>
          
          // Para el input de edad
<input type="number" placeholder="Edad" required 
  value={form.edad} onChange={e => setForm({...form, edad: e.target.value})}
  style={{ padding: '15px', fontSize: '18px', borderRadius: '10px', border: '2px solid #ccc', backgroundColor: '#fff', color: '#333' }}/>
          
          {/* 4. Este select ahora actualiza "juego" en lugar de "nivel" */}
          <select value={form.juego} onChange={e => setForm({...form, juego: e.target.value})}
  style={{ padding: '15px', fontSize: '18px', borderRadius: '10px', border: '2px solid #ccc', backgroundColor: '#fff', color: '#333', cursor: 'pointer' }}>
            <option value="memoria">🧠 Juego de Memoria</option>
            <option value="figuras">📐 Figuras Geométricas</option>
            <option value="espacial">📦 Adentro / Afuera</option>
            <option value="multiplicar">✖️ Tablas de Multiplicar</option>
            <option value="quebrados">➗ Suma de Quebrados</option>
            <option value="decimales">🔢 Multiplicación con Decimales</option>
          </select>
          
          <button type="submit" style={{ padding: '15px', fontSize: '20px', cursor: 'pointer', marginTop: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', boxShadow: '0 4px 0 #388E3C' }}>
            Registrar y Jugar 🚀
          </button>
        </form>
      </div>
      
      <p style={{ marginTop: '2rem', fontSize: '1.2rem', fontWeight: 'bold', color: '#555' }}>Creado por Manolo Estrada</p>
    </div>
  );
}