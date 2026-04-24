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
    // Validación de campos obligatorios
    if (!formData.placa || !formData.cliente) {
      return alert("Completa los campos obligatorios (Cliente y Placa) *");
    }

    setIsSaving(true);

    try {
      // 1. Generar el PDF
      const base64 = await generarPDFReporte(formData, photos);
      const fileName = `Reporte_${formData.placa}_${new Date().getTime()}.pdf`;

      // 2. Lógica de descarga universal para PC (Navegador / Electron)
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

      // 3. Feedback al usuario
      if (tipo === 'share') {
        alert("Archivo generado con éxito. En PC puedes compartir el archivo descargado por correo o WhatsApp Web.");
      } else {
        alert("Reporte descargado correctamente.");
      }

    } catch (e) {
      console.error("Error al generar el PDF:", e);
      alert('Error crítico al procesar el PDF. Revisa los datos e intenta de nuevo.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen pb-20 max-w-xl mx-auto px-4 text-slate-200">
      <div className="py-8 text-center">
        <h1 className="text-3xl font-bold text-slate-100 tracking-tight">EDU-CAR</h1>
        <p className="text-indigo-400 text-xs uppercase tracking-widest font-semibold mt-1">Sistema de Reportes</p>
      </div>

      <div className="space-y-6">
        {/* Formulario de datos del vehículo */}
        <VehicleForm formData={formData} setFormData={setFormData} />
        
        {/* Sección de Observaciones Generales */}
        <div className="bg-slate-900/50 border border-slate-700/50 p-5 rounded-3xl space-y-3">
          <label className="text-indigo-300 text-xs font-bold uppercase tracking-widest ml-1 block">
            📝 Observaciones Generales
          </label>
          <textarea
            value={formData.comentarios}
            onChange={(e) => setFormData({...formData, comentarios: e.target.value})}
            placeholder="Anota detalles adicionales, estado visual del vehículo o peticiones del cliente..."
            rows="4"
            className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl p-4 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none text-sm"
          />
        </div>

        {/* Formulario de Refacciones */}
        <RefaccionesForm formData={formData} setFormData={setFormData} />
        
        {/* Captura de Fotos */}
        <PhotoCapture 
          photos={photos} 
          onTakePhoto={handleAddPhoto} 
          onUpdateDescription={handleUpdatePhotoDesc}
          onRemovePhoto={handleRemovePhoto}
        />
        
        {/* Botón de Limpieza */}
        <button 
          onClick={handleLimpiar} 
          className="w-full bg-slate-800 hover:bg-slate-700 text-slate-400 py-3 rounded-2xl transition-colors text-xs font-bold uppercase tracking-widest border border-slate-700 mt-4"
        >
          🗑️ Limpiar Todo el Formulario
        </button>

        {/* Acciones de PDF */}
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => handleAction('download')} 
            disabled={isSaving} 
            className="bg-slate-700 hover:bg-slate-600 text-white py-4 rounded-2xl transition-all font-bold disabled:opacity-50"
          >
            {isSaving ? 'Generando...' : '⬇️ Descargar'}
          </button>
          <button 
            onClick={() => handleAction('share')} 
            disabled={isSaving} 
            className="bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-2xl transition-all font-bold disabled:opacity-50"
          >
            {isSaving ? 'Generando...' : '📤 Compartir'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NuevaEntrada;