<template>
  <v-container>
    <v-file-input
      label="Subir archivo CSV"
      accept=".csv"
      v-model="file"
      @change="handleFileChange"
    ></v-file-input>
  </v-container>
</template>

<script>
import Papa from 'papaparse';

export default {
  data() {
    return {
      file: null,
    };
  },
  methods: {
    handleFileChange() {
      if (this.file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const csvData = e.target.result;
          Papa.parse(csvData, {
            header: true, // Para leer con encabezados
            complete: (result) => {
              console.log(result.data); // Aquí tienes los datos en formato JSON
            },
            error: (error) => {
              console.error('Error al leer el archivo:', error);
            },
          });
        };
        reader.readAsText(this.file);
      }
    },
  },
};
</script>

<style></style>