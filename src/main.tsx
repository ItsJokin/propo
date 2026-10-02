import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';


class Boundary extends React.Component<{ children: React.ReactNode }, { err: Error | null }> {
  state = { err: null as Error | null };
  static getDerivedStateFromError(err: Error) { return { err }; }
  componentDidCatch(err: Error) { console.error(err); }
  render() {
    if (!this.state.err) return this.props.children;
    return (
      <div style={{ maxWidth: 520, margin: '80px auto', padding: '0 16px', fontFamily: 'var(--font-body)' }}>
        <h1 style={{ fontSize: 24 }}>Algo ha fallado en esta pantalla.</h1>
        <p style={{ color: 'var(--fg-2)', marginTop: 12 }}>Tu trabajo está guardado. Vuelve al inicio e inténtalo de nuevo. Si se repite, restablece el espacio local desde Ajustes → Privacidad y datos.</p>
        <button className="btn btn-primary mt-24" onClick={() => { this.setState({ err: null }); try { location.hash = '/app'; } catch { /* ignore */ } }}>Volver al inicio</button>
      </div>
    );
  }
}

createRoot(document.getElementById('root')!).render(<Boundary><App /></Boundary>);
