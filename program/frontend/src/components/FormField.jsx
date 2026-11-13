import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
export default function FormField({ icon: Icon, label, name, error, type = 'text', ...props }) {
  const [visible, setVisible] = useState(false);
  const password = type === 'password';
  return <div className="field-group"><label className="sr-only" htmlFor={name}>{label}</label>
    <div className={`input-wrap ${error ? 'has-error' : ''}`}><Icon aria-hidden="true" />
      <input id={name} name={name} type={password && visible ? 'text' : type} placeholder={label} aria-invalid={Boolean(error)} aria-describedby={error ? `${name}-error` : undefined} {...props} />
      {password && <button className="password-toggle" type="button" aria-label={`${label} ${visible ? 'elrejtése' : 'megjelenítése'}`} aria-pressed={visible} onClick={() => setVisible(!visible)}>{visible ? <Eye /> : <EyeOff />}</button>}
    </div>{error && <p className="field-error" id={`${name}-error`}>{error}</p>}
  </div>;
}
