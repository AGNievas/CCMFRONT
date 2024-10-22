<template>
  <v-container>
    <v-card>
     
      <div v-if="!archivoCargado">
        <v-row class="d-flex flex-column align-center">
          <v-btn @click="subirArchivo" class="mx-2 btn-blue">Subir Archivo</v-btn>
          <p class="recuperar-link" @click="descargarPlantilla">Descargar Plantilla</p>
        </v-row>
      </div>

      
      <div v-if="archivoCargado && !archivoImportado">
        <p class="recuperar-link" @click="descargarArchivo">{{ nombreArchivo }}</p>
        <v-btn @click="importarArchivo" class="mx-2 btn-blue">Importar</v-btn>
        <v-btn @click="cancelarArchivo" class="mx-2 btn-blue">Cancelar</v-btn>
      </div>
    
      <div v-if="archivoImportado">
        <v-btn @click="descargarArchivo" class="mx-2 btn-blue">Descargar Archivo</v-btn>
       
      </div>
    </v-card>
  </v-container>
</template>

<script>
import Papa from "papaparse";
import medicamentosService from "./servicios/medicamentosService";
export default {
  name: "CargaDeMedicamentos",
  data() {
    return {
      archivoCargado: false,
      archivoImportado: false,
      nombreArchivo: "",
      archivo: null,
      archivoCsvEnviado: null,
      archivoADescargar:null
    };
  },
  methods: {
    subirArchivo() {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".csv";
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
          this.nombreArchivo = file.name;
          this.archivo = file;

          // Usando PapaParse para leer el archivo CSV

          
          Papa.parse(file, {
            header:true,
            dynamicTyping:true,
            complete: (result) => {
              console.log("CSV Parsed Data:", result.data);
              this.archivoCargado = true;
              this.archivoCsvEnviado= result.data
              
            },

           
            
            error: (error) => {
              console.error("Error al leer el archivo CSV:", error);
            },
          });
         
         
        }
        console.log(this.archivo, input,"en subir archivos")
      };
      input.click();
    },
    descargarPlantilla() {
    
    },
    descargarArchivo() {
   const blob = new Blob([this.archivoADescargar], { type: 'text/csv' });
   const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'medicamentos.csv'); 
  document.body.appendChild(link);
  link.click();

  // Limpiar el enlace temporal
  document.body.removeChild(link);
},
    async importarArchivo() {
      console.log(this.archivoCsvEnviado)
        this.archivoADescargar = await medicamentosService.cargaMasivaMedicamento(this.archivoCsvEnviado)
       console.log(this.archivoADescargar, "archivo devuelto")

      
      this.archivoImportado = true;
    },
    cancelarArchivo() {
      // Restablecer el estado y permitir cargar un nuevo archivo
      this.archivoCargado = false;
      this.archivoImportado = false;
      this.nombreArchivo = "";
      this.archivo = null;
    },
    descargarArchivoImportado() {
      // Lógica para descargar el archivo CSV desde assets
      const link = document.createElement("a");
      link.href = require('@/assets/resultado.csv'); // Ruta al archivo CSV en assets
      link.download = "resultado.csv"; // Nombre con el que se descargará el archivo
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link); // Remover el enlace del DOM después de la descarga
    },
  },
};
</script>

<style scoped>
.v-container {
  padding-top: 50px !important; 
}
</style>
