import apliqueService from '../componentes/servicios/apliqueService.js';

export async function saveApliqueHelper(isEditing, pacienteId, nuevoAplique) {
  try {
    if (isEditing) {
      const apliqueActualizado = await apliqueService.updateAplique(pacienteId, nuevoAplique);
      return apliqueActualizado;
    } else {
      
      const apliqueCreado = await apliqueService.createAplique(pacienteId, nuevoAplique);
      return apliqueCreado;
    }
  } catch (error) {
    console.error('Error al guardar aplique:', error);
    throw error;
  }
}

