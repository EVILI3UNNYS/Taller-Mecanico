import React, { useState } from 'react';

const RefaccionesForm = ({ formData, setFormData }) => {
  const [item, setItem] = useState({ cantidad: '', descripcion: '', costo: '' });

  const add = () => {
    if (!item.descripcion || !item.costo) return;
    setFormData({ ...formData, refacciones: [...formData.refacciones, item] });
    setItem({ cantidad: '', descripcion: '', costo: '' });
  };

  const remove = (index) => {
    const nuevas = formData.refacciones.filter((_, i) => i !== index);
    setFormData({ ...formData, refacciones: nuevas });
  };

  const subtotal = formData.refacciones.reduce((acc, r) => acc + (r.cantidad * r.costo), 0);
  // Calculamos el IVA solo si la opción está activada
  const iva = formData.incluirIva ? subtotal * 0.16 : 0;
  const total = subtotal + iva;

  return (
    <div className="p-6 bg-slate-800 rounded-3xl shadow-lg border border-slate-700/50">
      
      {/* Encabezado con el Botón para alternar el IVA */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-slate-200 flex items-center gap-2">
          <span className="w-2 h-6 bg-indigo-500 rounded-full"></span>
          Piezas y Costos
        </h3>
        <button 
          onClick={() => setFormData({ ...formData, incluirIva: !formData.incluirIva })}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
            formData.incluirIva 
            ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300' 
            : 'bg-slate-700/50 border-slate-600 text-slate-400'
          }`}
        >
          {formData.incluirIva ? '✅ Incluye IVA' : '❌ Sin IVA'}
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        <input className="w-16 p-2 bg-slate-900/50 border border-slate-700 rounded-xl text-slate-200 focus:border-indigo-500 outline-none placeholder:text-slate-600" placeholder="Cant" type="number" value={item.cantidad} onChange={e => setItem({...item, cantidad: e.target.value})} />
        <input className="flex-1 p-2 bg-slate-900/50 border border-slate-700 rounded-xl text-slate-200 focus:border-indigo-500 outline-none placeholder:text-slate-600" placeholder="Pieza" value={item.descripcion} onChange={e => setItem({...item, descripcion: e.target.value})} />
        <input className="w-20 p-2 bg-slate-900/50 border border-slate-700 rounded-xl text-slate-200 focus:border-indigo-500 outline-none placeholder:text-slate-600" placeholder="$" type="number" value={item.costo} onChange={e => setItem({...item, costo: e.target.value})} />
        <button onClick={add} className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 rounded-xl font-bold transition-colors">+</button>
      </div>

      <div className="space-y-2 mb-4">
        {formData.refacciones.map((r, i) => (
          <div key={i} className="flex justify-between items-center text-sm bg-slate-900/40 p-3 rounded-xl text-slate-300 border border-slate-700/50">
            <span className="flex-1"><strong className="text-indigo-400">{r.cantidad}x</strong> {r.descripcion}</span>
            <span className="font-bold text-slate-200 mr-4">${r.costo}</span>
            <button onClick={() => remove(i)} className="text-red-400 hover:text-red-300 font-bold p-1 bg-red-400/10 rounded-lg">X</button>
          </div>
        ))}
      </div>

      {formData.refacciones.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-700 text-right text-sm">
          <p className="text-slate-400">Subtotal: <span className="text-slate-200 font-semibold">${subtotal.toFixed(2)}</span></p>
          {formData.incluirIva && (
            <p className="text-slate-400">IVA (16%): <span className="text-slate-200 font-semibold">${iva.toFixed(2)}</span></p>
          )}
          <p className="text-indigo-400 text-lg font-bold mt-1">Total: <span className="text-white">${total.toFixed(2)}</span></p>
        </div>
      )}
    </div>
  );
};
export default RefaccionesForm;