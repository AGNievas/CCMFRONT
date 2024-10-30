<template>
  <div>
    <v-card class="custom-container">
      <v-card-title class="d-flex align-center pe-2 responsive-card-title">
        <v-text-field
          v-model="search"
          density="compact"
          label="Buscar"
          prepend-inner-icon="mdi-magnify"
          variant="solo"
          hide-details
          single-line
          class="rounded-search-bar"
        ></v-text-field>
        <v-spacer></v-spacer>
        <v-btn @click="openAddTransferDialog" class="btn-blue">Agregar Transferencia</v-btn>
      </v-card-title>

      <Listado
        :items="transferenciasFiltradasParaVista"
        :headers="transferenciasHeaders"
        @edit="openEditDialog"
        @delete="confirmDelete"
      />

      <TransferenciaDialog
        v-model="dialog"
        :is-editing="isEditing"
        :transferencia="selectedTransferencia"
        :areas="stockAreas"
        @save="saveTransferencia"
      />
      <!-- Diálogos de confirmación y edición/agregado -->
      <ConfirmDialog
        v-model="deleteDialog"
        title="Confirmar Eliminación"
        text="¿Estás seguro de que deseas eliminar esta transferencia?"
        @confirm="deleteTransferencia"
      />

    
    </v-card>
  </div>
</template>

<script>
import Listado from './Listado.vue';
import ConfirmDialog from './ConfirmDialog.vue';
import TransferenciaDialog from './TransferenciaDialog.vue';
import transferenciaStockService from './servicios/transferenciaStockService.js';
import ordenTransferenciaService from './servicios/ordenTransferenciaService.js';
import stockAreaService from './servicios/stockAreaService.js';

export default {
  name: 'ListadoDeTransferencias',
  components: {
    Listado,
    ConfirmDialog,
    TransferenciaDialog,
  },
  data() {
    return {
      search: '',
      transferencias: [],
      stockAreas: [],
      dialog: false,
      isEditing: false,
      deleteDialog: false,
      selectedTransferencia: {},
    };
  },
  computed: {
    transferenciasHeaders() {
      return [
        { text: 'SKU', value: 'sku' },
        { text: 'Cantidad', value: 'cantidad' },
        { text: 'Área Origen', value: 'nombreAreaOrigen' },
        { text: 'Área Destino', value: 'nombreAreaDestino' },
        { text: 'Motivo', value: 'motivo' },
        { text: '', value: 'acciones', sortable: false },
      ];
    },
     transferenciasFiltradasParaVista() {
    return (this.transferencias || []) // esta puesto para que no tire error mientras transferencias esta como undefined
      .filter(trans => trans.sku.toString().includes(this.search))
      .map(trans => ({
        ...trans,
        nombreAreaOrigen: this.getNombreArea(trans.stockAreaIdOrigen),
        nombreAreaDestino: this.getNombreArea(trans.stockAreaIdDestino),
      }));
    },
  },
  async mounted() {
    await this.loadTransferencias();
    await this.loadStockAreas();
  },
  methods: {
    async loadTransferencias() {
      this.transferencias = await transferenciaStockService.getAllTransferenciaStock();
    },
    async loadStockAreas() {
      this.stockAreas = await stockAreaService.getAllStockArea();
    },
    getNombreArea(stockAreaId) {
      const area = this.stockAreas.find(area => area.id === stockAreaId);
      return area ? area.nombre : 'Área no encontrada';
    },
    openAddTransferDialog() {
      this.selectedTransferencia = {};
      this.isEditing = false;
      this.dialog = true;
    },
    openEditDialog(transferencia) {
      this.selectedTransferencia = { ...transferencia };
      this.isEditing = true;
      this.dialog = true;
    },
    confirmDelete(id) {
      this.selectedTransferencia = this.transferencias.find(trans => trans.id === id);
      this.deleteDialog = true;
    },
    async saveTransferencia(transferencia) {
      try {
        if (this.isEditing) {
          await transferenciaStockService.updateTransferenciaStock(transferencia);
        } else {
          await ordenTransferenciaService.createTransferencia(transferencia);
        }
        await this.loadTransferencias();
        this.dialog = false;
      } catch (error) {
        console.error('Error al guardar la transferencia:', error);
      }
      await this.loadTransferencias();
    },
    async deleteTransferencia() {
      try {
        await transferenciaStockService.deleteTransferenciaStock(this.selectedTransferencia.id);
        
        this.deleteDialog = false;
      } catch (error) {
        console.error('Error al eliminar la transferencia:', error);
      }

      await this.loadTransferencias();
    },
  },
};
</script>
