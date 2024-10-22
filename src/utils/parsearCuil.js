const parsearCuil = {

    async extraerNumeroDelCuil(cuil) {
       try{
        const dni = cuil.split('-');
        return dni[1];
       }
        catch(error){
            throw new Error (error.message)
        }
      }
}

export default parsearCuil;