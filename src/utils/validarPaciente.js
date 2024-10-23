// Permite solo 8 dígitos numéricos
export function validarDni(dni) {
    return /^\d{8}$/.test(dni); // Acepta exactamente 8 dígitos
  }
  
  // Permite solo caracteres alfabéticos (mayúsculas y minúsculas) y espacios
  export function validarNombre(nombre) {
    return /^[a-zA-Z\s]+$/.test(nombre); // Acepta solo letras y espacios
  }
  
  // Valida que la fecha tenga el formato correcto YYYY-MM-DD
  export function validarFechaNacimiento(fecha) {
    // Expresión regular para validar el formato YYYY-MM-DD
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    
    // Verificamos si la fecha cumple con el formato YYYY-MM-DD
    if (!regex.test(fecha)) {
      return false;
    }
    
    // Comprobamos que sea una fecha válida
    const [year, month, day] = fecha.split('-').map(Number);
    const date = new Date(year, month - 1, day); // Restamos 1 al mes porque los meses en Date van de 0 a 11
  
    return (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    );
  }
  