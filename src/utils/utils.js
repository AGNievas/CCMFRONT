import { differenceInYears } from 'date-fns'

export function formatearFecha(fecha) {
    const date = new Date(fecha);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${day}-${month}-${year}`;
  }

  export function formatearFechaYHora(fecha) {
    const date = new Date(fecha);
    // Formato de fecha y hora ajustada
    return date.toLocaleString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  export function validarNombre(nombre) {
    return /^[a-zA-Z\s]+$/.test(nombre); 
  }

  export function validarDni(dni) {
    return /^\d{8}$/.test(dni);
  }

  export function  validarCuil(cuil) {
    const re = /^\d{2}-\d{8}-\d{1}$/;
    return re.test(cuil);
  }
  

  export function  extraerNumeroDelCuil(cuil) {
    try {
      const cuilString = String(cuil).trim(); 

      if (!/^\d{2}-\d{8}-\d{1}$/.test(cuilString)) {
        throw new Error('El formato de CUIL es incorrecto. Debe ser XX-12345678-X');
      }
  
      const dni = cuilString.split("-");
      return dni[1];
    } catch (error) {
      throw new Error(`Error al extraer número del CUIL: ${error.message}`);
    }
  }

  export function formatearCuil(cuil) {
    let cleanedCuil = cuil.replace(/[^\d]/g, "");
    let formattedCuil = "";

    if (cleanedCuil.length > 0) {
      formattedCuil += cleanedCuil.slice(0, 2);
    }
    if (cleanedCuil.length > 2) {
      formattedCuil += "-" + cleanedCuil.slice(2, 10);
    }
    if (cleanedCuil.length > 10) {
      formattedCuil += "-" + cleanedCuil.slice(10, 11);
    }
    return formattedCuil;
  }

  export function soloNumeros(event) {
    const key = event.key;
    if (!/[0-9]/.test(key)) {
      event.preventDefault();
    }
  }

  export function soloLetras(event) {
    const key = event.key;
    if (!/[a-zA-Z\s]/.test(key)) {
      event.preventDefault();
    }
  }
  export function calcularEdad(fechaNacimiento) {
    return differenceInYears(new Date(), new Date(fechaNacimiento))
  }