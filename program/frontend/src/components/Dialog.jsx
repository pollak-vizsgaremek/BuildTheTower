import { useEffect, useRef, useId } from 'react';
import { X } from 'lucide-react';

export default function Dialog({ title, children, onClose, wide = false }) {
  const ref = useRef(null);
  const titleId = useId();
  useEffect(() => {
    const dialog = ref.current;
    dialog.showModal();
    return () => dialog.close();
  }, []);
  return <dialog ref={ref} className={`project-dialog ${wide ? 'dialog-wide' : ''}`} aria-labelledby={titleId} onCancel={event => { event.preventDefault(); onClose(); }} onClose={onClose}>
    <header className="dialog-heading"><h2 id={titleId}>{title}</h2><button className="icon-button" aria-label="Bezárás" type="button" onClick={onClose}><X size={21} /></button></header>
    {children}
  </dialog>;
}
