import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { asset } from './FarmUI';

export default function BackToTop({ enabled }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!enabled) { setVisible(false); return; }
    let frame = null;
    const update = () => {
      frame = null;
      setVisible(window.scrollY > 360);
    };
    const onScroll = () => {
      if (frame === null) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      if (frame !== null) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
    };
  }, [enabled]);
  if (!enabled || !visible) return null;
  return createPortal(
    <button type="button" className="back-to-top" aria-label="맨 위로 이동" title="맨 위로 이동"
      onClick={event => {
        if (event.detail === 0) document.querySelector('.brand-link')?.focus({ preventScroll: true });
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        window.scrollTo({ top: 0, behavior: reduced ? 'instant' : 'smooth' });
      }}>
      <img src={asset + 'fami.webp'} alt="" width="34" height="41" draggable="false" />
      <span className="back-to-top-arrow" aria-hidden="true">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 14 6-6 6 6" /></svg>
      </span>
    </button>, document.body,
  );
}
