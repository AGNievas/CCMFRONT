const parsearCuil = {
    extraerNumeroDelCuil(cuil) {
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
      },

  formatearCuil(cuil) {
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
  },
};

export default parsearCuil;
