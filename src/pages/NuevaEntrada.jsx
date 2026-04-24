import React, { useState } from 'react';
import VehicleForm from '../components/forms/VehicleForm';
import RefaccionesForm from '../components/forms/RefaccionesForm';
import PhotoCapture from '../components/camera/PhotoCapture';
import { useCamera } from '../hooks/useCamera';
import { generarPDFReporte } from '../services/pdfGenerator';

const NuevaEntrada = () => {
  const [formData, setFormData] = useState({ 
    marca: '', modelo: '', año: '', km: '',
    placa: '', noSerie: '', cliente: '', noEconomico: '', 
    reporte: '', reporteTaller: '', 
    comentarios: '', 
    refacciones: [],
    incluirIva: true 
  });
  
  const [photos, setPhotos] = useState([]); 
  const [isSaving, setIsSaving] = useState(false);
  const { takePhoto } = useCamera();

  const handleAddPhoto = async () => {
    const base64 = await takePhoto(); 
    if (base64) {
      setPhotos([...photos, { base64, descripcion: '' }]);
    }
  };

  const handleUpdatePhotoDesc = (index, desc) => {
    const newPhotos = [...photos];
    newPhotos[index].descripcion = desc;
    setPhotos(newPhotos);
  };

  const handleRemovePhoto = (index) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleLimpiar = () => {
    setFormData({
      marca: '', modelo: '', año: '', km: '',
      placa: '', noSerie: '', cliente: '', noEconomico: '', 
      reporte: '', reporteTaller: '', 
      comentarios: '', 
      refacciones: [],
      incluirIva: true 
    });
    setPhotos([]); 
  };

  const handleAction = async (tipo) => {
    if (!formData.placa || !formData.cliente) {
      return alert("Por favor escribe al menos el nombre del Cliente y las Placas.");
    }
    
    setIsSaving(true);
    try {
      const base64 = await generarPDFReporte(formData, photos);
      const fileName = `Reporte_${formData.placa || 'Sin_Placa'}.pdf`;

      // --- LÓGICA PARA NAVEGADOR (PC) ---
      if (!window.Capacitor && !window.electronAPI) {
        const byteCharacters = atob(base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        if (tipo === 'share') alert("En PC usa 'Descargar' para compartir el archivo manualmente.");
      } 
      // --- LÓGICA PARA ANDROID (CAPACITOR) ---
      else if (window.Capacitor) {
        // Importación dinámica para evitar errores si no está instalada la librería
        const { Filesystem, Directory } = await import('@capacitor/filesystem');
        const { Share } = await import('@capacitor/share');

        const result = await Filesystem.writeFile({
          path: fileName,
          data: base64,
          directory: Directory.Documents,
        });

        if (tipo === 'share') {
          await Share.share({ title: 'Reporte Educar', files: [result.uri] });
        } else {
          alert("Guardado en Documentos");
        }
      }
    } catch (e) {
      console.error(e);
      alert('Error: ' + e.message);
    }
    setIsSaving(false);
  };

  return (
    <div className="min-h-screen pb-20 max-w-xl mx-auto px-4 text-slate-200">
      <div className="py-8 text-center">
        <h1 className="text-3xl font-bold text-slate-100">EDU-CAR</h1>
        <p className="text-indigo-400 text-xs uppercase tracking-widest">Sistema de Reportes</p>
      </div>

      <div className="space-y-6">
        <VehicleForm formData={formData} setFormData={setFormData} />
        
        <div className="bg-slate-900/50 border border-slate-700/50 p-5 rounded-3xl">
          <label className="text-indigo-300 text-xs font-bold uppercase block mb-2">📝 Observaciones</label>
          <textarea
            value={formData.comentarios}
            onChange={(e) => setFormData({...formData, comentarios: e.target.value})}
            placeholder="Detalles adicionales..."
            className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-4 text-sm resize-none focus:ring-2 focus:ring-indigo-500 outline-none"
            rows="3"
          />
        </div>

        <RefaccionesForm formData={formData} setFormData={setFormData} />
        <PhotoCapture photos={photos} onTakePhoto={handleAddPhoto} onUpdateDescription={handleUpdatePhotoDesc} onRemovePhoto={handleRemovePhoto} />
        
        <button onClick={handleLimpiar} className="w-full bg-slate-800 text-slate-400 py-3 rounded-2xl text-xs font-bold uppercase border border-slate-700">
          Limpiar Todo
        </button>

        <div className="grid grid-cols-2 gap-4">
          <button onClick={() => handleAction('download')} disabled={isSaving} className="bg-slate-700 py-4 rounded-2xl font-bold">
            {isSaving ? '...' : '⬇️ Descargar'}
          </button>
          <button onClick={() => handleAction('share')} disabled={isSaving} className="bg-indigo-600 py-4 rounded-2xl font-bold">
            {isSaving ? '...' : '📤 Compartir'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NuevaEntrada;