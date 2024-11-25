<template>
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

        <v-select
          :disabled="puedeCambiarArea"
          v-model="area"
          :items="areasTodo"
          item-title="nombre"
          item-value="id"
          label="Area de Stock"
          density="compact"
          variant="solo"
          hide-details
          @update:modelValue="onAreaChange"
        ></v-select>

        <v-select
          :disabled="area == 0"
          v-model="stockArea"
          :items="stockAreasTodo"
          item-title="nombre"
          item-value="id"
          label="SubArea de Stock"
          density="compact"
          variant="solo"
          hide-details
          @update:modelValue="onStockAreaChange"
        ></v-select>

        <v-spacer></v-spacer>
        <v-btn @click="openAddOrdenTransferDialog" class=" btn-blue">Agregar Orden Transferencia</v-btn>
        <v-btn v-if="puedeAgregarMedicamento" @click="openAddDialog" class="btn-blue">Agregar Medicamento</v-btn>
      </v-card-title>

      <Tabla
        :data="filteredMedicamentos"
        :headers="usuariosHeaders"
        :isListadoMedicamentos="true"
        @edit="openEditDialog"
        @delete="confirmDelete"
        :eliminable="this.area != 0 && this.stockArea != 0"
        :editable="!(this.area != 0 && this.stockArea == 0)"
      />

      <OrdenTransferenciaDialog
        v-model="dialog"
        :is-editing="false"
        :user="globalStore.getUsuarioIdYNombre"
        :ordenTransferencia="selectedOrdenTransferencia"
        :stockAreas="this.globalStore.getStockAreas"
        :errorMessage="errorMessage"
        @save="saveTransferencia"
      />
    </v-card>

    <ConfirmDialog
      v-model="deleteDialog"
      :isDelete="true"
      title="Confirmar Eliminación"
      text="¿Estás seguro de que deseas eliminar este medicamento?"
      @confirm="deleteMedicamento"
    />

    <MedicamentoDialog
      :dialogVisible="this.addDialog"
      :isEditing="false"
      :area = this.area
      :medicamento= this.newMed
      :skuError= skuError
      @closeDialog="closeAddDialog"
      @confirm="addMedicamento"
    />

    <MedicamentoDialog
      :dialogVisible="this.editDialog"
      :isEditing="true"
      :area = this.area
      :stockArea= this.stockArea
      :medicamento= this.editMed
      @closeDialog="closeEditDialog"
      @confirm="updateMedicamento"
    />
</template>

<script>
import Tabla from './Tabla.vue';
import ConfirmDialog from './ConfirmDialog.vue';
import MedicamentoDialog from './MedicamentoDialog.vue';
import stockAreasService from "./servicios/stockAreaService.js";
import itemService from "./servicios/itemService";
import medicamentosService from "./servicios/medicamentosService.js";
import ordenTransferenciaService from "./servicios/ordenTransferenciaService.js";
import { useGlobalStore } from "@/stores/global.js";
import OrdenTransferenciaDialog from './OrdenTransferenciaDialog.vue';
import areaService from './servicios/areaService.js'
export default {
  name: "ListadoDeMedicamentos",
  components: {
    ConfirmDialog,
    MedicamentoDialog,
    OrdenTransferenciaDialog,
    Tabla,
    },
  data() {
    return {
      search: '',
      medicamentos: [],
      areas: [],
      areasTodo: [],
      stockAreas: [],
      stockAreasTodo: [],
      itemsMed: [],
      area: null,
      stockArea: null,
      
      addDialog: false,
      skuError: false,
      newMed: {
        sku: "",
        descripcion: "",
        tipo_medicamento: "",
        stock: null,
      },

      editDialog: false,
      editMed: {
        sku: "",
        descripcion: "",
        tipo_medicamento: "",
        stock: null,
      },

      deleteDialog: false,
      confirmDeleteSku: null,
      dialog: null,
      errorMessage: "",
      selectedOrdenTransferencia: {},
      globalStore: useGlobalStore(),
    };
  },

  beforeMount(){
    this.loadAreasId()
    this.loadMedicamentos()
    this.loadItemsMed()
  },

  computed: {

    stockHeaderText() {
      const areaSeleccionada = this.areasTodo.find(area => area.id === this.area);
      const stockAreaSeleccionada = this.stockAreasTodo.find(stockArea => stockArea.id === this.stockArea)
      return `STOCK - ${areaSeleccionada ? areaSeleccionada.nombre : ''} ${stockAreaSeleccionada ? stockAreaSeleccionada.nombre : ''}`;
    },

    usuariosHeaders() {
      return [
        { text: 'SKU', value: 'sku' },
        { text: 'DESCRIPCIÓN', value: 'descripcion' },
        { text: 'TIPO DE MEDICAMENTO', value: 'tipo_medicamento' },
        { text: this.stockHeaderText, value: 'stock' },
        { text: '', value: 'acciones', sortable: false },
      ];
    },

    filteredMedicamentos() {
      const searchTerm = this.search.toLowerCase();
      
      return this.medicamentos.filter(medicamento => {
        const skuMatch = String(medicamento.sku).includes(searchTerm); 
        const descripcionMatch = medicamento.descripcion.toLowerCase().includes(searchTerm);
        return skuMatch || descripcionMatch;
      });
    },

    puedeCambiarArea(){
      let puedeCambiarArea = true;
      if(this.globalStore.getRolName == "Admin" || this.globalStore.getRolName == "Super Admin"){
        puedeCambiarArea = false;
      }
      return puedeCambiarArea;
    },

    puedeAgregarMedicamento(){
      return this.globalStore.getRolId == this.globalStore.getRolAdmin || this.globalStore.getRolId == this.globalStore.getRolSuperAdmin
    }
  },

  methods: {
    async onAreaChange(selectedArea) {
      this.area = selectedArea; 
      if(this.area == 0){
        this.stockArea = null;
        this.loadMedicamentos()
      } else {
        await this.loadStockAreasId()
        this.onStockAreaChange(this.stockArea)
      }
    },

    onStockAreaChange(selectedStockArea){
      this.stockArea = selectedStockArea;
        if(this.stockArea == 0){
          this.loadMedicamentosByAreaId(this.area)
        }else{
          this.loadMedicamentosByStockAreaId(this.area, this.stockArea)
        }
    },

    async loadMedicamentosByStockAreaId(areaId, stockAreaId){
      this.medicamentos = await medicamentosService.getAllMedicamentoByStockAreaId(areaId, stockAreaId)
     
    },

    async loadMedicamentosByAreaId(id){
      this.medicamentos = await medicamentosService.getMedicamentosByAreaId(id)
   
    },

    openAddOrdenTransferDialog() {
      this.selectedOrdenTransferencia = { items: [], stockAreaIdOrigen: null, stockAreaIdDestino: null, motivo: '' };
      this.isEditing = false;
      this.dialog = true;
    },

    async saveTransferencia(orden) {
      try {
        const { items, ...ordenData } = orden;
        await ordenTransferenciaService.createOrdenTransferencia(ordenData, items);
        this.dialog = false;
        this.errorMessage = ''; 
      } catch (error) {
        console.error('Error al guardar la transferencia:', error);
        this.errorMessage = error || 'Error al guardar la orden de transferencia';
      } finally {
        this.selectedOrdenTransferencia = { items: [], stockAreaIdOrigen: null, stockAreaIdDestino: null, motivo: '' };
        this.loadItemsMed()
        this.onAreaChange(this.area)
      }
    },

    async loadMedicamentos() {
      this.medicamentos = await medicamentosService.getAllMedicamento();
    },

    async loadAreasId(){
      this.areas = await areaService.getAllArea();
      this.areasTodo = [{nombre: "Todo", id: 0}, ...this.areas];
      if(this.globalStore.getRolName == "Super Admin" || this.globalStore.getRolName == "Admin" ){
        this.area = this.areasTodo[0].id;
      }else{
        this.area = this.areasTodo[this.globalStore.getAreaId].id
      }
      this.onAreaChange(this.area)
    },

    async loadStockAreasId(){
      this.stockAreas = await stockAreasService.getStockAreaByArea(this.area);
      this.stockAreasTodo = [{nombre: "Todo", id: 0}, ...this.stockAreas];
      this.stockArea = this.stockAreasTodo[0].id;
    },

    async loadItemsMed(){
      this.itemsMed = await itemService.getAllItem();
      
    },

    openAddDialog() {
      this.addDialog = true;
      this.resetForm();
    },

    closeAddDialog() {
      this.addDialog = false;
      this.resetForm();
    },

    async addMedicamento({medicamentoEmitido}) {
      this.skuError = false;
      let medicamentos = await medicamentosService.getAllMedicamento()
      const exists = medicamentos.some(
        (medicamento) => medicamento.sku == medicamentoEmitido.sku
      );

      if (!exists) {
        try {
          await medicamentosService.createMedicamento(medicamentoEmitido.sku, medicamentoEmitido.descripcion, medicamentoEmitido.tipo_medicamento)
          await itemService.createItem(medicamentoEmitido.sku, medicamentoEmitido.stock);
          this.onAreaChange(this.area)
          this.closeAddDialog();
        } catch (error) {
          console.error("Error al agregar el medicamento:", error);
        }
      } else {
        this.skuError = true;
      }
    },

    async openEditDialog(medicamento) {
    
      this.editDialog = true;
      this.editMed = { ...medicamento,
        sku: medicamento.sku,
        descripcion: medicamento.descripcion,
        tipo_medicamento: medicamento.tipo_medicamento,
        stockAreaId: this.stockArea
      
       };
      
      await this.loadMedicamentos()
      await this.loadItemsMed()
    },

    closeEditDialog() {
      this.editDialog = false;
      this.resetEditForm();
    },

    async updateMedicamento({medicamentoEmitido}) {
      try { await this.loadMedicamentos()
        await this.loadItemsMed()
        if(this.area != 0 && this.stockArea != 0){
          let itemActualizar = this.itemsMed.find(
            (itemMed) => (itemMed.Medicamento.sku == medicamentoEmitido.sku) && (itemMed.StockArea.areaId == this.area) && (itemMed.StockArea.id == this.stockArea)
          );
          await itemService.updateItem(itemActualizar.id, medicamentoEmitido.sku, medicamentoEmitido.stock, medicamentoEmitido.stockAreaId)
          this.onStockAreaChange(this.stockArea)
        
         
        }else{
          await medicamentosService.updateMedicamento(medicamentoEmitido.sku, medicamentoEmitido.descripcion, medicamentoEmitido.tipo_medicamento);
          this.onAreaChange(this.area)          
        }
       
        this.closeEditDialog();
      } catch (error) {
        console.error("Error al actualizar el medicamento:", error);
      }
    },

    confirmDelete(medicamento) {
      const itemAEliminar = this.itemsMed.filter(item => item.Medicamento.sku == medicamento.sku && item.StockArea.id == this.stockArea);
      this.confirmDeleteSku = itemAEliminar[0].id
      this.deleteDialog = true;
    },

    closeDeleteDialog() {
      this.deleteDialog = false;
      this.confirmDeleteSku = null;
    },

    async deleteMedicamento() {
      try {
        let itemDelete = this.itemsMed.find(
          (itemMed) => (itemMed.id == this.confirmDeleteSku)
        );
        console.log("AVERSI ENTRO")
        await itemService.deleteItem(itemDelete.id);
        this.closeDeleteDialog();
      } catch (error) {
        console.error("Error al eliminar el medicamento:", error);
      }
      finally{
        this.onStockAreaChange(this.stockArea)
      }
    },

    resetForm() {
      this.newMed = {
        sku: "",
        descripcion: "",
        tipo_medicamento: "",
        stock: null,
      };
      this.skuError = false;
    },

    resetEditForm() {
      this.editMed = {
        sku: "",
        descripcion: "",
        tipo_medicamento: "",
        stock: null,
      };
    },
  }
};
</script>