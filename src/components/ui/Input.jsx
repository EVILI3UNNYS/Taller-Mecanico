import React from 'react';

const Input = ({ label, placeholder, required, value, onChange, type = "text", uppercase = false, maxLength }) => (
  <div className="mb-4 w-full">
    <label className="block text-slate-400 text-xs font-semibold mb-1 ml-1 uppercase tracking-wide">
      {label} {required && <span className="text-indigo-400">*</span>}
    </label>
    <input
      type={type} 
      value={value}
      maxLength={maxLength} // <-- Agregamos el límite
      onChange={(e) => {
        const val = uppercase ? e.target.value.toUpperCase() : e.target.value;
        onChange(val);
      }}
      placeholder={placeholder}
      className="w-full px-4 py-3 rounded-2xl border border-slate-700 bg-slate-900/50 text-slate-200 
                 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-colors placeholder:text-slate-600"
    />
  </div>
);

export default Input;