"use client";

import { useState, type ComponentProps } from "react";
import { Eye, EyeOff } from "lucide-react";

/** Password field with a show/hide toggle. */
export default function PasswordInput(props: Omit<ComponentProps<"input">, "type">) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="adm-password">
      <input {...props} type={visible ? "text" : "password"} />
      <button
        type="button"
        className="adm-password-toggle"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Masquer le mot de passe" : "Afficher le mot de passe"}
        aria-pressed={visible}
        aria-controls={props.id}
      >
        {visible ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
      </button>
    </div>
  );
}
