import apliqueService from '../componentes/servicios/apliqueService.js';

export async function saveApliqueHelper(isEditing,  nuevoAplique, visitaId) {
  try {
    if (isEditing) {
    
      const apliqueActualizado = await apliqueService.updateAplique( nuevoAplique);
      return apliqueActualizado;
    } else {
     
      const apliqueCreado = await apliqueService.createAplique( nuevoAplique, visitaId);
      return apliqueCreado;
    }
  } catch (error) {
    console.error('Error al guardar aplique:', error);
    throw error;
  }
}

