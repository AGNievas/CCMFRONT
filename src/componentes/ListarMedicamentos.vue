<template>
  <div>
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
    <Tabla :data="filteredItems" :columns="columns" />
    <!-- Componente Listados.vue reutilizable -->
    <Listados v-if="selectedArea" :tipoListado="'medicamentos'" :items="medicamentosAMostrar" />
    <Tabla :data="filteredItems" :columns="columns" />
  </div>
</template>

<script>
import stockAreaService from './servicios/stockAreaService';
import medicamentosService from './servicios/medicamentosService';
import Listados from '../componentes/Listados';

export default {
  name: 'ListarMedicamentos',
  components: {
    Listados,
  },
  data() {
    return {
      selectedArea: null,
      areasBusqueda: [],
      medicamentosAMostrar: [],
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
    async traerMedicamentos() {
      try {
        if (this.selectedArea) {
          console.log(this.selectedArea, 'traerMedicamentos');
          this.medicamentosAMostrar = await medicamentosService.getAllMedicamentoByStockAreaId(this.selectedArea);
        }
      } catch (error) {
        console.error('Error al obtener medicamentos:', error);
      }
    },
  },
  watch: {
    selectedArea(newVal) {
      if (newVal) {
        this.traerMedicamentos();
      }
    },
  },
};
</script>

<style scoped>
/* Agregar estilos si es necesario */
</style>
