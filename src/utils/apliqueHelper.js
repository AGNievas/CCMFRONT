// apliqueHelper.js
import apliqueService from '../componentes/servicios/apliqueService.js';

export async function saveApliqueHelper(isEditing, pacienteId, nuevoAplique) {
  try {
    if (isEditing) {
      const apliqueActualizado = await apliqueService.updateAplique(pacienteId, nuevoAplique);
      console.log(apliqueActualizado, "aplique actualizado en util")
      return apliqueActualizado;
    } else {
      const apliqueCreado = await apliqueService.createAplique(pacienteId, nuevoAplique);
      console.log(apliqueCreado, "aplique Creado en util")
      return apliqueCreado;
    }
  } catch (error) {
    console.error('Error al guardar aplique:', error);
    throw error;
  }

  
}

