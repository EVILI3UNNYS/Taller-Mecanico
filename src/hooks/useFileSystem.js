import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { generarPDFReporte } from '../services/pdfGenerator';

export const useFileSystem = () => {
  const guardarExpedienteLocal = async (formData, photos) => {
    try {
      const idUnico = `${formData.placa}_${new Date().getTime()}`;
      const ruta = `Taller Educar - Autos/${idUnico}`;
      await Filesystem.mkdir({ path: ruta, directory: Directory.Documents, recursive: true });

      for (const [name, base64] of Object.entries(photos)) {
        await Filesystem.writeFile({ path: `${ruta}/${name}.jpg`, data: base64, directory: Directory.Documents });
      }

      const pdfBase64 = await generarPDFReporte(formData, photos);
      const res = await Filesystem.writeFile({ path: `${ruta}/Reporte_${formData.placa}.pdf`, data: pdfBase64, directory: Directory.Documents });

      await Share.share({ title: 'Reporte Taller Educar', url: res.uri });
      return { success: true };
    } catch (e) { return { success: false, error: e.message }; }
  };
  return { guardarExpedienteLocal };
};