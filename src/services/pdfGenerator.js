import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';

export const generarPDFReporte = async (formData, photos) => {
  const doc = new jsPDF();
  const fechaActual = new Date().toLocaleDateString('es-MX');
  const pageWidth = doc.internal.pageSize.width;

  // --- ENCABEZADO ---
  doc.setFillColor(30, 64, 175);
  doc.rect(10, 10, 190, 25, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold"); 
  doc.setFontSize(24);
  doc.text("EDU-CAR", 20, 22);
  doc.setFontSize(14); 
  doc.text("AUTOMOTRIZ", 20, 30);
  
  doc.setTextColor(0, 0, 0); 
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold"); 
  doc.text(`FECHA: ${fechaActual}`, 160, 42);

  // --- DATOS DEL VEHÍCULO ---
  doc.setFillColor(240, 240, 240);
  doc.rect(10, 48, 190, 8, 'F');
  doc.text("DATOS DEL VEHICULO", 105, 53, { align: "center" });

  doc.setFontSize(9);
  doc.setFont("helvetica", "bold"); doc.text("CLIENTE:", 12, 63); doc.setFont("helvetica", "normal"); doc.text(formData.cliente || '', 30, 63);
  doc.setFont("helvetica", "bold"); doc.text("MARCA:", 12, 70);   doc.setFont("helvetica", "normal"); doc.text(formData.marca || '', 28, 70);
  doc.setFont("helvetica", "bold"); doc.text("MODELO:", 70, 70);  doc.setFont("helvetica", "normal"); doc.text(formData.modelo || '', 88, 70);
  doc.setFont("helvetica", "bold"); doc.text("AÑO:", 140, 70);    doc.setFont("helvetica", "normal"); doc.text(formData.año || '', 150, 70);
  
  doc.setFont("helvetica", "bold"); doc.text("SERIE:", 12, 77);   doc.setFont("helvetica", "normal"); doc.text(formData.noSerie || '', 25, 77);
  doc.setFont("helvetica", "bold"); doc.text("PLACAS:", 70, 77);  doc.setFont("helvetica", "normal"); doc.text(formData.placa || '', 88, 77);
  doc.setFont("helvetica", "bold"); doc.text("KM:", 140, 77);     doc.setFont("helvetica", "normal"); doc.text(formData.km || '', 148, 77);

  doc.setFont("helvetica", "bold"); doc.text("NO. ECON:", 12, 84); doc.setFont("helvetica", "normal"); doc.text(formData.noEconomico || 'N/A', 32, 84);

  // --- REPORTE DEL USUARIO ---
  doc.setFont("helvetica", "bold"); doc.text("REPORTE DE USUARIO:", 12, 93);
  doc.setFont("helvetica", "normal"); doc.text(formData.reporte || 'Sin reporte', 12, 98, { maxWidth: 180 });

  // --- NUEVA SECCIÓN: OBSERVACIONES Y COMENTARIOS ---
  let nextSectionY = 112; // Posición base después del reporte de usuario
  
  if (formData.comentarios) {
    doc.setFont("helvetica", "bold"); 
    doc.text("OBSERVACIONES GENERALES:", 12, 108);
    doc.setFont("helvetica", "normal");
    const splitComments = doc.splitTextToSize(formData.comentarios, 180);
    doc.text(splitComments, 12, 113);
    
    // Calculamos espacio dinámico para que la tabla no se encime
    nextSectionY = 113 + (splitComments.length * 5) + 10;
  }

  // --- TABLA DE REFACCIONES ---
  const tableData = formData.refacciones.map(item => [
    item.cantidad, 
    item.descripcion, 
    `$${parseFloat(item.costo).toFixed(2)}`, 
    `$${(parseFloat(item.cantidad) * parseFloat(item.costo)).toFixed(2)}`
  ]);

  const subtotal = formData.refacciones.reduce((acc, r) => acc + (r.cantidad * r.costo), 0);
  const iva = formData.incluirIva ? subtotal * 0.16 : 0;
  const total = subtotal + iva;

  tableData.push([{ content: '', colSpan: 2, styles: { fillColor: [255, 255, 255] } }, { content: 'SUBTOTAL', styles: { fontStyle: 'bold' } }, `$${subtotal.toFixed(2)}`]);
  
  if (formData.incluirIva) {
    tableData.push([{ content: '', colSpan: 2, styles: { fillColor: [255, 255, 255] } }, { content: 'IVA (16%)', styles: { fontStyle: 'bold' } }, `$${iva.toFixed(2)}`]);
  }
  
  tableData.push([{ content: '', colSpan: 2, styles: { fillColor: [255, 255, 255] } }, { content: 'TOTAL', styles: { fontStyle: 'bold', textColor: [255, 255, 255], fillColor: [30, 64, 175] } }, { content: `$${total.toFixed(2)}`, styles: { fontStyle: 'bold', textColor: [255, 255, 255], fillColor: [30, 64, 175] } }]);

  autoTable(doc, {
    startY: nextSectionY, // Usamos la posición dinámica
    head: [['CANTIDAD', 'DESCRIPCION', 'MONTO', 'TOTAL']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [30, 64, 175], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center' },
    columnStyles: { 0: { halign: 'center', cellWidth: 30 }, 2: { halign: 'right', cellWidth: 30 }, 3: { halign: 'right', cellWidth: 30 } },
    styles: { fontSize: 9 }
  });

  // --- EVIDENCIA FOTOGRÁFICA ---
  if (photos && photos.length > 0) {
    doc.addPage();
    doc.setFillColor(240, 240, 240);
    doc.rect(10, 10, 190, 8, 'F');
    doc.setFont("helvetica", "bold");
    doc.text("EVIDENCIA FOTOGRÁFICA", 105, 15, { align: "center" });

    let y = 30;
    let xPos = 15;
    
    photos.forEach((photo, i) => {
      if (i > 0 && i % 3 === 0) { 
        xPos = 15; 
        y += 65; 
      }
      if (y > 230) { 
        doc.addPage(); 
        y = 30; 
        xPos = 15; 
      }

      try {
        doc.addImage(`data:image/jpeg;base64,${photo.base64}`, 'JPEG', xPos, y, 50, 50);
        doc.setFontSize(7);
        const desc = photo.descripcion || `FOTO ${i+1}`;
        doc.text(desc.toUpperCase(), xPos + 25, y + 55, { align: "center", maxWidth: 50 });
      } catch (e) {
        console.error("Error al añadir imagen al PDF", e);
      }
      
      xPos += 65;
    });
  }

  return doc.output('datauristring').split(',')[1];
};