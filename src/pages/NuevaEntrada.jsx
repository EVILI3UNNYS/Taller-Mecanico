import React, { useState } from 'react';
import VehicleForm from '../components/forms/VehicleForm';
import RefaccionesForm from '../components/forms/RefaccionesForm';
import PhotoCapture from '../components/camera/PhotoCapture';
import { useCamera } from '../hooks/useCamera';
import { generarPDFReporte } from '../services/pdfGenerator';

// IMPORTACIONES NATIVAS DE CAPACITOR
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';

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
    // Validaciones básicas
    if (!formData.placa || !formData.noSerie || !formData.cliente || !formData.reporte) {
      return alert("Completa los campos obligatorios (Placa, Serie, Cliente y Reporte) *");
    }

    setIsSaving(true);

    try {
      // 1. Generar el PDF en formato Base64
      const base64PDF = await generarPDFReporte(formData, photos);
      const fecha = new Date().toISOString().split('T')[0];
      const fileName = `Reporte_${formData.placa}_${fecha}.pdf`;

      // 2. Guardar el archivo de forma nativa en el dispositivo
      // Esto es necesario tanto para descargar como para compartir
      const result = await Filesystem.writeFile({
        path: fileName,
        data: base64PDF,
        directory: Directory.Documents,
        recursive: true
      });

      if (tipo === 'share') {
        // 3. Compartir usando el menú nativo de Android/iOS
        await Share.share({
          title: 'Reporte de Servicio EDU-CAR',
          text: `Adjunto reporte de unidad: ${formData.marca} ${formData.modelo} - Placas: ${formData.placa}`,
          url: result.uri, // Dirección interna del archivo guardado
          dialogTitle: 'Compartir reporte con...',
        });
      } else {
        // Opción descargar: En móvil, avisamos que ya está en Documentos
        alert(`¡Éxito! El archivo se guardó en tu carpeta de Documentos como: ${fileName}`);
      }

    } catch (error) {
      console.error("Error en la operación nativa:", error);
      alert("Hubo un problema al procesar el archivo. Verifica los permisos de almacenamiento.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen pb-20 max-w-xl mx-auto px-4">
      <div className="py-8 text-center">
        <h1 className="text-3xl font-bold text-slate-100 tracking-tight">Taller Educar</h1>
        <p className="text-indigo-400/80 text-xs uppercase tracking-widest font-semibold mt-1">Registro de Unidad</p>
      </div>

      <div className="space-y-6">
        
        <VehicleForm formData={formData} setFormData={setFormData} />
        
        {/* CUADRO DE COMENTARIOS */}
        <div className="bg-slate-900/50 border border-slate-700/50 p-5 rounded-3xl space-y-3">
          <label className="text-indigo-300 text-xs uppercase tracking-widest font-bold ml-1">
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
            className="bg-slate-700 hover:bg-slate-600 text-white py-4 rounded-2xl transition-colors font-bold flex items-center justify-center gap-2"
          >
            {isSaving ? 'Generando...' : '⬇️ Guardar'}
          </button>
          <button 
            onClick={() => handleAction('share')} 
            disabled={isSaving} 
            className="bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-2xl transition-colors font-bold flex items-center justify-center gap-2"
          >
            {isSaving ? 'Generando...' : '📤 Compartir'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NuevaEntrada;