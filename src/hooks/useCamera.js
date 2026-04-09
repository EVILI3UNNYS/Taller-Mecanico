export const useCamera = () => {
  const takePhoto = () => {
    return new Promise((resolve) => {
      // Creamos un input de archivo invisible
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*'; // Solo aceptamos imágenes
      
      // ¿Qué pasa cuando el usuario selecciona una imagen?
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            // Le quitamos el prefijo (data:image/jpeg;base64,) para que el PDF lo lea bien
            const base64String = reader.result.split(',')[1];
            resolve(base64String);
          };
          // Leemos el archivo y lo convertimos a código base64
          reader.readAsDataURL(file);
        } else {
          resolve(null); // Si cancela, no hacemos nada
        }
      };
      
      // Simulamos un clic en este input invisible para abrir el buscador
      input.click();
    });
  };

  return { takePhoto };
};