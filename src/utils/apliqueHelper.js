import apliqueService from '../componentes/servicios/apliqueService.js';

export async function saveApliqueHelper(isEditing, pacienteId, nuevoAplique, visitaId) {
  try {console.log("en el update de helper",isEditing, pacienteId, visitaId, nuevoAplique )
    if (isEditing) {
    
      console.log("en el update de helper",isEditing, pacienteId, visitaId, nuevoAplique,  )
      const apliqueActualizado = await apliqueService.updateAplique(pacienteId, nuevoAplique);
      return apliqueActualizado;
    } else {
      const visitaId = nuevoAplique.Visitum.id
      const apliqueCreado = await apliqueService.createAplique(pacienteId, nuevoAplique, visitaId);
      return apliqueCreado;
    }
  } catch (error) {
    console.error('Error al guardar aplique:', error);
    throw error;
  }
}

