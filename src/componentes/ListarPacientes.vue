<template>
    <div class="custom-container">
        <v-card flat>
            <v-card-title class="d-flex align-center pe-2">
      <v-select
        v-model="selectedArea"
        :items="areasBusqueda"
        item-title="nombre"
        item-value="id"
        label="Área de Stock"
        density="compact"
        variant="solo"
        hide-details
        class="mx-2"
      ></v-select>
    </v-card-title>

      <!-- Componente Listados.vue reutilizable -->
      <Listados v-if="selectedArea" :tipoListado="'pacientes'" :items="itemsAMostrar" />

   
</v-card>
    </div>
  </template>
  
  <script>
  import stockAreaService from './servicios/stockAreaService';
  import Listados from '../componentes/Listados';
  import pacienteService from './servicios/pacienteService';
  
  export default {
    name: 'ListarPacientes',
    components: {
      Listados,
    },
    data() {
      return {
        selectedArea: null,
        areasBusqueda: [],
        itemsAMostrar: [],
      };
    },
    async mounted() {
      try {
        this.areasBusqueda = await stockAreaService.getAllStockArea();
      } catch (error) {
        console.error('Error al obtener las áreas de stock:', error);
      }
    },
    methods: {
      async traerPacientes() {
        try {
          if (this.selectedArea) {
            console.log(this.selectedArea, 'traerPacientes');
            this.itemsAMostrar = await pacienteService.getAllPacienteByStockAreaId(this.selectedArea);
          }
        } catch (error) {
          console.error('Error al obtener pacientes:', error);
        }
      },
    },
    watch: {
      selectedArea(newVal) {
        if (newVal) {
          this.traerPacientes();
        }
      },
    },
  };
  </script>
  
  <style scoped>
  /* Agregar estilos si es necesario */
  </style>