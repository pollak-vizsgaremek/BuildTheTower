import { Link } from 'react-router';
import { ArrowLeft, HardHat } from 'lucide-react';
export default function WorkspacePlaceholder({ title }) {
  return <main className="page-status"><HardHat size={48} color="#c64b00" /><h1>{title}</h1><p>Ez a modul még fejlesztés alatt áll.</p><Link className="back-link" to="/Vezerlopult"><ArrowLeft />Vissza a vezérlőpultra</Link></main>;
}
