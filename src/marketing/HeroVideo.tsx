// Vídeo que explica PROPO (se ve en la propia página, sin abrir ventanas). Cuando esté el vídeo explicativo nuevo,
// basta con cambiar VIDEO.
import React, { useState } from 'react';
import { LuPlay } from 'react-icons/lu';
import { LogoMark } from '../components/ui';
import { track } from '../lib/store';

const VIDEO = 'media/anuncio-propo.mp4';

export function HeroVideo({ where = 'signup' }: { where?: string }) {
  const [on, setOn] = useState(false);
  return (
    <div className="hero-vid">
      {on ? <video src={VIDEO} controls autoPlay playsInline /> : (
        <button className="hero-vid-cover" onClick={() => { setOn(true); track('video_play', { where }); }} aria-label="Ver el vídeo: cómo funciona PROPO">
          <span className="hero-vid-logo"><LogoMark size={30} /> PROPO</span>
          <span className="hero-vid-play"><LuPlay /></span>
          <span className="hero-vid-t">Así funciona PROPO</span>
          <span className="hero-vid-s">De la licitación a la propuesta lista para firmar · con sonido</span>
        </button>
      )}
    </div>
  );
}
