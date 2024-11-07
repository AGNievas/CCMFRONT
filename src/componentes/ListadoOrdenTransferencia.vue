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
  :isListadoOrdenTransferencia="true"
  @edit="openEditDialog"
  @delete="confirmDelete"
  @ver-items="openItemsDialog"
/>

      <OrdenTransferenciaDialog
        v-model="dialog"
        :is-editing="isEditing"
        :ordenTransferencia="selectedOrdenTransferencia"
        :areas="stockAreas"
        :errorMessage="errorMessage"
        @save="saveTransferencia"
      />

      <v-dialog persistent v-model="itemsDialogVisible" max-width="800px">
  <ListadoDeTransferencias 
    :isViewMode="true" 
    :items="selectedItems"
    :orderNumber="selectedOrderNumber"  
    @close="itemsDialogVisible = false" 
  />
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
import Listado from './Listado.vue';
import ConfirmDialog from './ConfirmDialog.vue';
import OrdenTransferenciaDialog from './OrdenTransferenciaDialog.vue';
import ordenTransferenciaService from './servicios/ordenTransferenciaService.js';
import stockAreaService from './servicios/stockAreaService.js';
import { useGlobalStore } from '@/stores/global';

import transferenciaStockService from './servicios/transferenciaStockService';
import ListadoDeTransferencias from './ListadoDeTransferencias.vue';
import UsuarioService from './servicios/usuariosService.js';
import MedicamentosService from './servicios/medicamentosService.js';

export default {
  components: {
    Listado,
    ConfirmDialog,
    OrdenTransferenciaDialog,
    
    ListadoDeTransferencias
  },
  data() {
    return {
      search: '',
      ordenesTransferencias: [],
      stockAreas: [],
      usuarios: [],
      itemsDialogVisible: false,
      selectedItems: [],
      selectedOrderNumber: null,
      isViewModeEnabled: true,
      dialog: false,
      isEditing: false,
      deleteDialog: false,
      selectedOrdenTransferencia: {},
      globalStore: useGlobalStore(),
      errorMessage:'',
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
    await this.loadStockAreas();
    // await this.loadUsuarios();
    await this.loadOrdenesTransferencias();
    
  },
  methods: {
    async loadOrdenesTransferencias() {
      this.ordenesTransferencias = await ordenTransferenciaService.getAllOrdenTransferencia();
      this.actualizarDatosEnTransferencias();
      console.log("transferencias ", this.ordenesTransferencias)
    },
    // async loadUsuarios(){
    //   this.usuarios = await UsuarioService.getAllUsuarios();
    // },
    async loadStockAreas() {
      this.stockAreas = await stockAreaService.getAllStockArea();
    },
  async actualizarDatosEnTransferencias() {
    for (const transferencia of this.ordenesTransferencias) {
      transferencia.fechaTransferencia = transferencia.fechaTransferencia.split('T')[0];
      transferencia.usuario = (await UsuarioService.getUsuarioById(transferencia.usuario)).fullName;
      transferencia.stockAreaIdDestino = (await stockAreaService.getStockAreaById(transferencia.stockAreaIdDestino)).nombre;
      transferencia.stockAreaIdOrigen = (await stockAreaService.getStockAreaById(transferencia.stockAreaIdOrigen)).nombre;

    }
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
        
        console.log("itms ", this.selectedItems);
        this.itemsDialogVisible = true;
      } catch (error) {
        console.error("Error al cargar los items de la orden:", error);
      }
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
    const { items, ...ordenData } = orden;

    if (this.isEditing) {
      await ordenTransferenciaService.updateOrdenTransferencia(ordenData);
    } else {
      await ordenTransferenciaService.createOrdenTransferencia(ordenData, items);
    }

    // Cerrar diálogo solo si no hay errores
    this.dialog = false;
    this.errorMessage = ''; // Limpiar el mensaje de error en caso de éxito
    await this.loadOrdenesTransferencias();
  } catch (error) {
    console.error('Error al guardar la transferencia:', error);
    
    this.errorMessage = error|| 'Error al guardar la orden de transferencia';
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