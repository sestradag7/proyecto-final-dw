import { useEffect, useState } from 'react';
import { getEstudiantes, getProgresos } from '../services/api';

export default function TableroDocente() {
  const [estudiantes, setEstudiantes] = useState([]);
  const [progresos, setProgresos] = useState([]);
  const [filtro, setFiltro] = useState('');

  useEffect(() => { cargar(); }, []);

  const cargar = async () => {
    const [resEst, resProg] = await Promise.all([getEstudiantes(), getProgresos()]);
    setEstudiantes(resEst.data); setProgresos(resProg.data);
  };

  const filtrar = async (id) => {
    setFiltro(id);
    const res = await getProgresos(id);
    setProgresos(res.data);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Tablero del Docente</h1>
      <div style={{ margin: '1rem 0' }}>
        <label>Filtrar por estudiante: </label>
        <select value={filtro} onChange={(e) => filtrar(e.target.value)}>
          <option value="">Todos</option>
          {estudiantes.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
        </select>
      </div>
      <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#eee' }}>
            <th>Estudiante</th><th>Actividad</th><th>Puntaje</th><th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {progresos.map(p => (
            <tr key={p.id}>
              <td>{p.estudiante}</td><td>{p.actividad}</td>
              <td>{p.puntaje} / {p.total_preguntas}</td>
              <td>{new Date(p.fecha).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}