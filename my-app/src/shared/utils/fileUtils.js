/**
 * Descarga una imagen desde una URL y la convierte a un objeto File
 * @param {string} url - URL de la imagen
 * @param {string} filename - Nombre del archivo (opcional)
 * @returns {Promise<File>} - Objeto File
 */
export async function urlToFile(url, filename = 'image.jpg') {
    try {
      // Descargar la imagen
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error al descargar imagen: ${response.statusText}`);
      }
      
      // Convertir a blob
      const blob = await response.blob();
      
      // Extraer el tipo MIME y extensión
      const mimeType = blob.type || 'image/jpeg';
      
      // Si no se proporciona filename, intentar extraerlo de la URL
      if (!filename || filename === 'image.jpg') {
        const urlParts = url.split('/');
        filename = urlParts[urlParts.length - 1] || 'image.jpg';
      }
      
      // Crear objeto File desde el blob
      const file = new File([blob], filename, { 
        type: mimeType,
        lastModified: Date.now()
      });
      
      return file;
    } catch (error) {
      console.error('Error convirtiendo URL a File:', error);
      throw error;
    }
  }
  
  /**
   * Convierte múltiples URLs a objetos File
   * @param {Array<{url: string, filename?: string}>} imageUrls - Array de objetos con url y filename
   * @returns {Promise<File[]>} - Array de objetos File
   */
  export async function urlsToFiles(imageUrls) {
    const promises = imageUrls.map(({ url, filename }) => 
      urlToFile(url, filename)
    );
    
    return Promise.all(promises);
  }