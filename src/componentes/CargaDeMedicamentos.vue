<template>
  <v-container v-if="puedeVerCargaMasiva">
    <v-card>
      <v-card-title class="d-flex align-center pe-2">
        <span class="headline">Carga de Medicamentos</span>
        <v-divider></v-divider>
      </v-card-title>
      <div v-if="!archivoCargado">
        <v-row class="d-flex flex-column align-center">
          <v-btn @click="subirArchivo" class="my-2 mx-5 btn-blue btn-tamano">Subir Archivo</v-btn>
          <v-btn @click="descargarArchivo(this.plantilla, 'plantilla')" class="my-2 mx-5 btn-blue btn-tamano">Descargar
            Plantilla</v-btn>
        </v-row>
      </div>

      <div v-if="archivoCargado && !archivoImportado">
        <v-row class="d-flex flex-column align-center">
          <p class="recuperar-link" @click="descargarArchivo(this.archivoADescargar)">{{ nombreArchivo }}</p>
          <v-btn @click="importarArchivo" class="my-2 mx-5 btn-blue btn-tamano">Importar</v-btn>
          <v-btn @click="cancelarArchivo" class="my-2 mx-5 btn-blue btn-tamano">Cancelar</v-btn>
        </v-row>
      </div>

      <div v-if="archivoImportado">
        <v-row class="d-flex flex-column align-center">
          <p class="tac">{{ this.mensajeCarga }}</p>
          <v-btn @click="descargarArchivo(this.archivoADescargar, 'informe')"
            class="my-2 mx-5 btn-blue btn-tamano">Descargar
            Informe</v-btn>
          <v-btn @click="cancelarArchivo" class="my-2 mx-5 btn-blue btn-tamano">Volver a la Carga</v-btn>
        </v-row>
      </div>

    </v-card>
  </v-container>
</template>

<script>
import Papa from "papaparse";
import medicamentosService from "./servicios/medicamentosService";
import { useGlobalStore } from "@/stores/global";
export default {
  name: "CargaDeMedicamentos",
  data() {
    return {
      globalStore: useGlobalStore(),
      archivoCargado: false,
      archivoImportado: false,
      nombreArchivo: "",
      archivo: null,
      archivoCsvEnviado: null,
      archivoADescargar: null,
      mensajeCarga: "",
      plantilla: [
        ["sku", "descripcion", "tipo_medicamento", "stock"],
      ]
        .map(e => e.join(","))
        .join("\n")
    };

  },

  computed: {
    puedeVerCargaMasiva() {
      return (this.globalStore.getRolId == this.globalStore.getRolSuperAdmin || this.globalStore.getRolId == this.globalStore.getRolAdmin) && this.globalStore.getAreaId == this.globalStore.getFarmaciaId
    }
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
          Papa.parse(file, {
            header: true,
            dynamicTyping: true,
            complete: (result) => {

              this.archivoCargado = true;
              this.archivoCsvEnviado = result.data
            },
            error: (error) => {
              console.error("Error al leer el archivo CSV:", error);
            },
          });
        }
      };
      input.click();
    },
    descargarArchivo(archivo, titulo) {
      const blob = new Blob([archivo], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', titulo + '.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    async importarArchivo() {
      this.archivoADescargar = await medicamentosService.cargaMasivaMedicamento(this.archivoCsvEnviado)
      const { estado } = this.parsearData(this.archivoADescargar)
      this.mensajeCarga = estado
      this.archivoImportado = true;
    },

    parsearData(data) {
      let ultimoElemento
      Papa.parse(data, {
        header: true,
        complete: (result) => {
          const dataArray = result.data
          ultimoElemento = dataArray[dataArray.length - 1]
        },

      })
      return ultimoElemento
    },
    cancelarArchivo() {
      this.archivoCargado = false;
      this.archivoImportado = false;
      this.nombreArchivo = "";
      this.archivo = null;
    },


  },
};
</script>

<style scoped>
.btn-tamano {
  min-width: 200px;
}
</style>
