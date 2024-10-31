<template>
  <div>
    <v-card class="custom-container">
      <v-card-title class="d-flex align-center pe-2">
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
        <v-btn @click="openAddOrdenTransferDialog" class="mx-2 btn-blue">Agregar Orden Transferencia</v-btn>
      </v-card-title>

      <Listado
        :items="ordenesTransferencias"
        :headers="ordenTransferenciaHeaders"
        @edit="openEditDialog"
        @delete="confirmDelete"
      />

      <OrdenTransferenciaDialog
        v-model="dialog"
        :is-editing="isEditing"
        :ordenTransferencia="selectedOrdenTransferencia"
        :areas="stockAreas"
        @save="saveTransferencia"
      />

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
import OrdenTransferenciaDialog from './OrdenTransferenciaDialog.vue';
import ordenTransferenciaService from './servicios/ordenTransferenciaService.js';
import stockAreaService from './servicios/stockAreaService.js';

export default {
  components: {
    Listado,
    ConfirmDialog,
    OrdenTransferenciaDialog,
  },
  data() {
    return {
      search: '',
      ordenesTransferencias: [],
      stockAreas: [],
      dialog: false,
      isEditing: false,
      deleteDialog: false,
      selectedOrdenTransferencia: {},
    };
  },
  computed: {
    ordenTransferenciaHeaders() {
      return [
        { text: 'Usuario', value: 'usuarioAutorizante' },
        { text: 'Área Origen', value: 'nombreAreaOrigen' },
        { text: 'Área Destino', value: 'nombreAreaDestino' },
        { text: 'Fecha', value: 'fecha' },
        { text: 'Motivo', value: 'motivo' },
        { text: '', value: 'acciones', sortable: false },
      ];
    },
  },
  async mounted() {
    await this.loadOrdenesTransferencias();
    await this.loadStockAreas();
  },
  methods: {
    async loadOrdenesTransferencias() {
      this.ordenesTransferencias = await ordenTransferenciaService.getAllOrdenTransferencia();
    },
    async loadStockAreas() {
      this.stockAreas = await stockAreaService.getAllStockArea();
    },
    openAddOrdenTransferDialog() {
      this.selectedOrdenTransferencia = { items: [] };
      this.isEditing = false;
      this.dialog = true;
    },
    openEditDialog(orden) {
      this.selectedOrdenTransferencia = { ...orden };
      this.isEditing = true;
      this.dialog = true;
    },
    confirmDelete(id) {
      this.selectedOrdenTransferencia = this.ordenesTransferencias.find(trans => trans.id === id);
      this.deleteDialog = true;
    },


   async saveTransferencia(orden) {
  try {
    console.log("Orden recibida en saveTransferencia:", orden);

    const { items, ...ordenData } = orden;
    console.log("Items:", items, "Orden Data:", ordenData);

    if (this.isEditing) {
      await ordenTransferenciaService.updateOrdenTransferencia(ordenData);
    } else {
      await ordenTransferenciaService.createOrdenTransferencia(ordenData, items);
    }
    
    this.dialog = false;
    await this.loadOrdenesTransferencias();
  } catch (error) {
    console.error('Error al guardar la transferencia:', error);
  }
}
,
    async deleteTransferencia() {
      try {
        await ordenTransferenciaService.deleteOrdenTransferencia(this.selectedOrdenTransferencia.id);
        this.deleteDialog = false;
        await this.loadOrdenesTransferencias();
      } catch (error) {
        console.error('Error al eliminar la transferencia:', error);
      }
    },
  },
};
</script>
