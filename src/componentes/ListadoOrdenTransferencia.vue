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
          <v-btn @click="openAddTransferDialog" class="mx-2 btn-blue">Agregar Transferencia</v-btn>
        </v-card-title>
  



        <Listado
          :items="ordenTransferenciasFiltradasParaVista"
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
  import ordenTransferenciaService from './servicios/ordenTransferenciaService.js';
  import stockAreaService from './servicios/stockAreaService.js';
  import OrdenTransferenciaDialog from './OrdenTransferenciaDialog.vue';
  export default {
    name: 'ListadoDeTransferencias',
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
        selectedTransferencia: {},
      };
    },
    computed: {
        ordenTransferenciaHeaders() {
        return [
         
         {text: 'Usuario', value: 'usuarioAutorizante'},
          { text: 'Área Origen', value: 'nombreAreaOrigen' },
          { text: 'Área Destino', value: 'nombreAreaDestino' },
          { text: 'Motivo', value: 'motivo' },
          { text: 'Fecha', value: 'fecha' },
          { text: '', value: 'acciones', sortable: false },
        ];
      },
      ordenTransferenciasFiltradasParaVista() {
      return (this.ordenesTransferencias || []) // esta puesto para que no tire error mientras transferencias esta como undefined
        .filter(orden => orden.sku.toString().includes(this.search))
        .map(orden => ({
          ...orden,
          nombreAreaOrigen: this.getNombreArea(orden.stockAreaIdOrigen),
          nombreAreaDestino: this.getNombreArea(orden.stockAreaIdDestino),
        }));
      },
    },
    async mounted() {
      await this.loadOrdenesTransferencias();
      await this.loadStockAreas();
    },
    methods: {
      async loadOrdenesTransferencias() {
        this.transferencias = await ordenTransferenciaService.getAllOrdenTransferencia();
      },
      async loadStockAreas() {
        this.stockAreas = await stockAreaService.getAllStockArea();
      },
      getNombreArea(stockAreaId) {
        const area = this.stockAreas.find(area => area.id === stockAreaId);
        return area ? area.nombre : 'Área no encontrada';
      },
      openAddTransferDialog() {
        this.selectedOrdenTransferencia = {};
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
          if (this.isEditing) {
            await ordenTransferenciaService.updateOrdenTransferencia(orden);
          } else {
            await ordenTransferenciaService.createOrdenTransferencia(orden);
          }
          
          this.dialog = false;
        } catch (error) {
          console.error('Error al guardar la transferencia:', error);
        }
        await this.loadTransferencias();
      },
      async deleteTransferencia() {
        try {
          await ordenTransferenciaService.deleteOrdenTransferencia(this.selectedOrdenTransferencia.id);
          
          this.deleteDialog = false;
        } catch (error) {
          console.error('Error al eliminar la transferencia:', error);
        }
  
        await this.loadTransferencias();
      },
    },
  };
  </script>
  