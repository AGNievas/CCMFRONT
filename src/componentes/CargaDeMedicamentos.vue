<template>
  <div class="background-image"></div>
  <v-container>
    <v-card>
      <!-- Si no hay archivo cargado, mostrar botones de subir y descargar -->
      <div v-if="!archivoCargado">
        <v-row class="d-flex flex-column align-center">
          <v-btn @click="subirArchivo" class="mx-2 btn-blue">Subir Archivo</v-btn>
          <p class="recuperar-link" @click="descargarPlantilla">Descargar Plantilla</p>
        </v-row>
      </div>

      <!-- Si ya hay un archivo cargado pero aún no se ha importado, mostrar su nombre y los botones de Importar/Cancelar -->
      <div v-if="archivoCargado && !archivoImportado">
        <p class="recuperar-link" @click="descargarArchivo">{{ nombreArchivo }}</p>
        <v-btn @click="importarArchivo" class="mx-2 btn-blue">Importar</v-btn>
        <v-btn @click="cancelarArchivo" class="mx-2 btn-blue">Cancelar</v-btn>
      </div>

      <!-- Si el archivo ya ha sido importado, mostrar solo el botón de descarga -->
      <div v-if="archivoImportado">
        <v-btn @click="descargarArchivoImportado" class="mx-2 btn-blue">Descargar Archivo</v-btn>
      </div>
    </v-card>
  </v-container>
</template>

<script>
import Papa from "papaparse";

export default {
  name: "CargaDeMedicamentos",
  data() {
    return {
      archivoCargado: false,
      archivoImportado: false,
      nombreArchivo: "",
      archivo: null,
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
            complete: (result) => {
              console.log("CSV Parsed Data:", result.data);
              this.archivoCargado = true;
            },
            error: (error) => {
              console.error("Error al leer el archivo CSV:", error);
            },
          });
        }
      };
      input.click();
    },
    descargarPlantilla() {
      // Lógica para descargar plantilla, si es necesario
      console.log("Descargando plantilla...");
    },
    descargarArchivo() {
      // Implementar la lógica de descarga si es necesario
      console.log("Descargando archivo:", this.nombreArchivo);
    },
    importarArchivo() {
      // Simular una importación exitosa, y cambiar el estado
      console.log("Importando archivo al backend...");
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
