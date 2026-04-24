import React from 'react';
import Input from '../ui/Input';

const VehicleForm = ({ formData, setFormData }) => {
  const up = (field, val) => setFormData({ ...formData, [field]: val });

  return (
    <div className="p-6 bg-slate-800 rounded-3xl shadow-lg border border-slate-700/50">
      <Input label="Cliente/Empresa" required value={formData.cliente} onChange={v => up('cliente', v)} />
      
      <div className="grid grid-cols-2 gap-4 mt-2">
        <Input label="Marca" value={formData.marca} onChange={v => up('marca', v)} uppercase />
        <Input label="Modelo" value={formData.modelo} onChange={v => up('modelo', v)} uppercase />
        <Input label="Año" value={formData.año} onChange={v => up('año', v)} />
        <Input label="Kilometraje" value={formData.km} onChange={v => up('km', v)} />
        <Input label="Placa" required uppercase value={formData.placa} onChange={v => up('placa', v)} />
        {/* Límite de 8 caracteres aquí */}
        <Input label="No. Serie" required uppercase maxLength={20} value={formData.noSerie} onChange={v => up('noSerie', v)} />
      </div>
      
      <Input label="No. Económico (Opcional)" value={formData.noEconomico} onChange={v => up('noEconomico', v)} uppercase />

      <div className="mt-2">
        <label className="block text-slate-400 text-xs font-semibold mb-1 ml-1 uppercase tracking-wide">
          Reporte Usuario <span className="text-indigo-400">*</span>
        </label>
        <textarea className="w-full p-3 border border-slate-700 bg-slate-900/50 text-slate-200 rounded-2xl h-20 mt-1 outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-colors placeholder:text-slate-600" 
                  value={formData.reporte} onChange={e => up('reporte', e.target.value)} />
      </div>
    </div>
  );
};
export default VehicleForm;