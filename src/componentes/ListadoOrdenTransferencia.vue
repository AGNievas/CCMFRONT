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

    <Tabla
      :data="valoresTabla"
      :headers="ordenTransferenciaHeaders"
      :isListadoOrdenTransferencia="true"
      @edit="openEditDialog"
      @delete="confirmDelete"
      @ver-items="openItemsDialog"
    />

    <OrdenTransferenciaDialog
      v-model="dialog"
      :is-editing="isEditing"
      :user="globalStore.getUsuarioIdYNombre"
      :ordenTransferencia="selectedOrdenTransferencia"
      :stockAreas="stockAreas"
      :errorMessage="errorMessage"
      @save="saveTransferencia"
    />

    <v-dialog v-model="itemsDialogVisible" max-width="800px">
      <div class="v-card">
          <ListadoDeTransferencias 
            :isViewMode="true" 
            :items="selectedItems"
            :orderNumber="selectedOrderNumber"  
          @close="itemsDialogVisible = false"
          />
      </div> 
    </v-dialog>

    <ConfirmDialog
      v-model="deleteDialog"
      :isDelete="true"
      title="Confirmar Eliminación"
      text="¿Estás seguro de que deseas eliminar esta transferencia?"
      @confirm="deleteTransferencia"
    />
    </v-card>
  </div>
</template>

<script>
import Tabla from './Tabla.vue';
import ConfirmDialog from './ConfirmDialog.vue';
import OrdenTransferenciaDialog from './OrdenTransferenciaDialog.vue';
import ordenTransferenciaService from './servicios/ordenTransferenciaService.js';

import { useGlobalStore } from '@/stores/global';
import transferenciaStockService from './servicios/transferenciaStockService';
import ListadoDeTransferencias from './ListadoDeTransferencias.vue';
import MedicamentosService from './servicios/medicamentosService.js';
import { formatearFecha } from '@/utils/utils';
export default {
  components: {
    Tabla,
    ConfirmDialog,
    OrdenTransferenciaDialog,
    ListadoDeTransferencias
  },
  data() {
    return {
      search: '',
      ordenesTransferencias: [],
      stockAreas: [],
      itemsDialogVisible: false,
      selectedItems: [],
      selectedOrderNumber: null,
      dialog: false,
      isEditing: false,
      deleteDialog: false,
      selectedOrdenTransferencia: {},
      globalStore: useGlobalStore(),
      errorMessage:'',
      usuario:'',
    };
  },

  watch:{
    
    'globalStore.getStockAreas': {
      handler(newStockAreas) {
        if (newStockAreas.length) {
          this.stockAreas = newStockAreas;
        }
      },
      immediate: true,
    },
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

    valoresTabla() {
  if (!this.stockAreas || this.stockAreas.length == 0) {
    return []; // Retorna un array vacío si stockAreas no está definido o está vacío
  }
  return this.ordenesTransferencias.map(transferencia => {
    const stockAreaOrigen = this.stockAreas.find(element => element.id == transferencia.stockAreaIdOrigen) || 'Área no encontrada';
    const stockAreaDestino = this.stockAreas.find(element => element.id == transferencia.stockAreaIdDestino)|| 'Área no encontrada';
    
    return {
      id: transferencia.id,
      usuarioAutorizante: transferencia.User.fullName,
      nombreAreaOrigen : stockAreaOrigen.Area.nombre,
      nombreAreaDestino: stockAreaDestino.Area.nombre,
      fecha: this.formatearFecha(transferencia.fechaTransferencia),
      motivo: transferencia.motivo
    };
  });
}},
  async mounted() {
  
  await this.loadStockAreas();
  await this.loadOrdenesTransferencias(); 
 
},
 
  methods: {

    formatearFecha(fecha){
      return formatearFecha(fecha)
    },
    async loadOrdenesTransferencias() {
  try {
    const data = await ordenTransferenciaService.getAllOrdenTransferencia();
    this.ordenesTransferencias = Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error al cargar las órdenes de transferencia:", error);
  }
},
    async loadStockAreas() {
      this.stockAreas = this.globalStore.getStockAreas;
    },

    openAddOrdenTransferDialog() {
      this.selectedOrdenTransferencia = { items: [] };
      this.isEditing = false;
      this.dialog = true;
    },
    async openItemsDialog(ordenId) {
      try {
        const ordenSeleccionada = this.ordenesTransferencias.find(orden => orden.id === ordenId);
        this.selectedOrderNumber = ordenSeleccionada ? ordenSeleccionada.id : null;
        const items = await transferenciaStockService.getTransferenciasStockByOrdenId(ordenId);
        this.selectedItems = [];
        for (const item of items) {
          const descripcion = (await MedicamentosService.getMedicamentoBySku(item.sku)).descripcion;
          this.selectedItems.push({
            sku: item.sku,
            cantidad: item.cantidad,
            descripcion: descripcion
          });
        }
        this.itemsDialogVisible = true;
      } catch (error) {
        console.error("Error al cargar los items de la orden:", error);
      }
    },
    openEditDialog(orden) {
      const listaItems = this.selectedOrdenTransferencia.listaItems
      this.selectedOrdenTransferencia = { ...orden,  listaItems};
      this.isEditing = true;
      this.dialog = true;
    },
    confirmDelete(id) {
      this.selectedOrdenTransferencia = this.ordenesTransferencias.find(trans => trans.id === id);
      this.deleteDialog = true;
    },
    async saveTransferencia(orden) {
      try {
        const { items, ...ordenData } = orden;
        if (this.isEditing) {
          await ordenTransferenciaService.updateOrdenTransferencia(ordenData);
        } else {
          await ordenTransferenciaService.createOrdenTransferencia(ordenData, items);
        }
        this.dialog = false;
        this.errorMessage = '';
        await this.loadOrdenesTransferencias();
      } catch (error) {
        console.error('Error al guardar la transferencia:', error);
        this.errorMessage = error|| 'Error al guardar la orden de transferencia';
      }
    },
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