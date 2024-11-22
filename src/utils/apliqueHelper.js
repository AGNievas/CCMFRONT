import apliqueService from '../componentes/servicios/apliqueService.js';

export async function saveApliqueHelper(isEditing,  nuevoAplique, visitaId) {
  try {console.log("en el update de helper",isEditing,  visitaId, nuevoAplique )
    if (isEditing) {
    
      console.log("en el update de helper",isEditing,  visitaId, nuevoAplique,  )
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

