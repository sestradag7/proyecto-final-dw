import { BrowserRouter, Routes, Route, Link, useParams } from 'react-router-dom';
import RegistroEstudiante from './components/RegistroEstudiante';
import TableroDocente from './components/TableroDocente';
import JuegoMemoria from './components/JuegoMemoria';
import JuegoMultiplicar from './components/JuegoMultiplicar';
import JuegoFiguras from './components/JuegoFiguras';
import JuegoEspacial from './components/JuegoEspacial';
import JuegoQuebrados from './components/JuegoQuebrados';
import JuegoDecimales from './components/JuegoDecimales';

// Wrappers
function MemoriaWrapper() { const { id } = useParams(); return <JuegoMemoria estudianteId={id} />; }
function MultiplicarWrapper() { const { id } = useParams(); return <JuegoMultiplicar estudianteId={id} />; }
function FigurasWrapper() { const { id } = useParams(); return <JuegoFiguras estudianteId={id} />; }
function EspacialWrapper() { const { id } = useParams(); return <JuegoEspacial estudianteId={id} />; }
function QuebradosWrapper() { const { id } = useParams(); return <JuegoQuebrados estudianteId={id} />; }
function DecimalesWrapper() { const { id } = useParams(); return <JuegoDecimales estudianteId={id} />; }

function App() {
  return (
    <BrowserRouter>
      <nav style={{ padding: '1rem', background: '#673AB7', color: 'white', display: 'flex', gap: '2rem', justifyContent: 'center', fontFamily: 'Arial', fontSize: '1.2rem', fontWeight: 'bold' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>🏠 Registro</Link>
        <Link to="/docente" style={{ color: 'white', textDecoration: 'none' }}>📊 Tablero Docente</Link>
      </nav>
      <Routes>
        <Route path="/" element={<RegistroEstudiante />} />
        <Route path="/docente" element={<TableroDocente />} />
        <Route path="/jugar/memoria/:id" element={<MemoriaWrapper />} />
        <Route path="/jugar/multiplicar/:id" element={<MultiplicarWrapper />} />
        <Route path="/jugar/figuras/:id" element={<FigurasWrapper />} />
        <Route path="/jugar/espacial/:id" element={<EspacialWrapper />} />
        <Route path="/jugar/quebrados/:id" element={<QuebradosWrapper />} />
        <Route path="/jugar/decimales/:id" element={<DecimalesWrapper />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;