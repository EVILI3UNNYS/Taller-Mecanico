import React from 'react';

const PhotoCapture = ({ photos, onTakePhoto, onUpdateDescription, onRemovePhoto }) => {
  return (
    <div className="p-6 bg-slate-800 rounded-3xl shadow-lg border border-slate-700/50">
      <h3 className="font-semibold text-slate-200 mb-4 flex items-center gap-2">
        <span className="w-2 h-6 bg-indigo-500 rounded-full"></span>
        Evidencia Fotográfica
      </h3>

      {/* Botón Principal para tomar foto */}
      <button 
        onClick={onTakePhoto}
        className="w-full py-4 mb-6 border-2 border-dashed border-slate-600 rounded-2xl bg-slate-900/30 text-slate-400 hover:bg-slate-900/50 hover:border-indigo-500 transition-all flex flex-col items-center gap-2"
      >
        <span className="text-3xl">📷</span>
        <span className="text-sm font-bold uppercase tracking-widest">Agregar Nueva Foto</span>
      </button>

      {/* Lista de fotos capturadas */}
      <div className="space-y-4">
        {photos.map((photo, index) => (
          <div key={index} className="flex gap-4 p-3 bg-slate-900/50 rounded-2xl border border-slate-700/50 items-center">
            <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border border-slate-600">
              <img src={`data:image/jpeg;base64,${photo.base64}`} alt="preview" className="w-full h-full object-cover" />
            </div>
            
            <div className="flex-1">
              <input 
                type="text"
                placeholder="Descripción (ej. Golpe facia)"
                value={photo.descripcion}
                onChange={(e) => onUpdateDescription(index, e.target.value)}
                className="w-full bg-transparent border-b border-slate-700 text-slate-200 text-sm py-1 outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <button 
              onClick={() => onRemovePhoto(index)}
              className="p-2 text-red-400 hover:bg-red-400/10 rounded-full"
            >
              🗑️
            </button>
          </div>
        ))}
      </div>
      
      {photos.length === 0 && (
        <p className="text-center text-slate-500 text-xs italic">No has agregado fotos aún.</p>
      )}
    </div>
  );
};

export default PhotoCapture;