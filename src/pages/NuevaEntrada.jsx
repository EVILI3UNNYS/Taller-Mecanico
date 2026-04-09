import React, { useState } from 'react';
import VehicleForm from '../components/forms/VehicleForm';
import RefaccionesForm from '../components/forms/RefaccionesForm';
import PhotoCapture from '../components/camera/PhotoCapture';
import { useCamera } from '../hooks/useCamera';
import { useFileSystem } from '../hooks/useFileSystem';
import { generarPDFReporte } from '../services/pdfGenerator';

const NuevaEntrada = () => {
  const [formData, setFormData] = useState({ 
    marca: '', modelo: '', año: '', km: '',
    placa: '', noSerie: '', cliente: '', noEconomico: '', 
    reporte: '', reporteTaller: '', refacciones: [],
    incluirIva: true 
  });
  
  const [photos, setPhotos] = useState([]); 
  const [isSaving, setIsSaving] = useState(false);
  const { takePhoto } = useCamera();
  const { guardarExpedienteLocal } = useFileSystem();

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
      reporte: '', reporteTaller: '', refacciones: [],
      incluirIva: true 
    });
    setPhotos([]); 
  };

  const crearArchivoPDF = async () => {
    const base64PDF = await generarPDFReporte(formData, photos);
    const byteCharacters = atob(base64PDF);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });
    const fecha = new Date().toISOString().split('T')[0];
    const fileName = `Reporte_${formData.placa}_${fecha}.pdf`;
    return new File([blob], fileName, { type: 'application/pdf' });
  };

  const handleAction = async (tipo) => {
    if (!formData.placa || !formData.noSerie || !formData.cliente || !formData.reporte) {
      return alert("Completa los campos obligatorios *");
    }
    setIsSaving(true);
    try {
      const file = await crearArchivoPDF();
      if (tipo === 'share') {
        await navigator.share({ files: [file], title: 'Reporte' });
      } else {
        const url = URL.createObjectURL(file);
        const a = document.createElement('a'); a.href = url; a.download = file.name; a.click();
      }
    } catch (e) { console.error(e); }
    setIsSaving(false);
  };

  return (
    <div className="min-h-screen pb-20 max-w-xl mx-auto px-4">
      <div className="py-8 text-center">
        <h1 className="text-3xl font-bold text-slate-100 tracking-tight">Taller Educar</h1>
        <p className="text-indigo-400/80 text-xs uppercase tracking-widest font-semibold mt-1">Registro de Unidad</p>
      </div>

      <div className="space-y-6">
        
        <VehicleForm formData={formData} setFormData={setFormData} />
        <RefaccionesForm formData={formData} setFormData={setFormData} />
        
        <PhotoCapture 
          photos={photos} 
          onTakePhoto={handleAddPhoto} 
          onUpdateDescription={handleUpdatePhotoDesc}
          onRemovePhoto={handleRemovePhoto}
        />
        
        <button 
          onClick={handleLimpiar}
          className="w-full bg-slate-800 hover:bg-slate-700 text-slate-400 py-3 rounded-2xl transition-colors text-sm font-bold uppercase tracking-widest border border-slate-700 mt-4"
        >
          🗑️ Limpiar Formulario
        </button>

        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => handleAction('download')} 
            disabled={isSaving} 
            className="bg-slate-700 hover:bg-slate-600 text-white py-4 rounded-2xl transition-colors font-bold"
          >
            {isSaving ? 'Generando...' : '⬇️ Descargar'}
          </button>
          <button 
            onClick={() => handleAction('share')} 
            disabled={isSaving} 
            className="bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-2xl transition-colors font-bold"
          >
            📤 Compartir
          </button>
        </div>
      </div>
    </div>
  );
};

export default NuevaEntrada;