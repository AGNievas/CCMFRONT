export function validarDni(dni) {
  return /^\d{8}$/.test(dni);
}

export function validarNombre(nombre) {
  return /^[a-zA-Z\s]+$/.test(nombre); 
}

export function validarFechaNacimiento(fecha) {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(fecha)) {
    return false;
  }
  
  const [year, month, day] = fecha.split('-').map(Number);
  const date = new Date(year, month - 1, day); 

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}
  