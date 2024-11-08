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
          v-model="area"
          :items="areasTodo"
          item-title="nombre"
          item-value="id"
          label="Area de Stock"
          density="compact"
          variant="solo"
          hide-details
          class="mx-2"
          @update:modelValue="onAreaChange"
        ></v-select>

        <v-spacer></v-spacer>
        <v-btn @click="openAddOrdenTransferDialog" class=" btn-blue">Transferir Stock</v-btn>
        <v-btn @click="openAddDialog" class="mx-2 btn-blue">Agregar Medicamento</v-btn>
      </v-card-title>

      <Listado
        :items="filteredMedicamentosConStock"
        :headers="usuariosHeaders"
        :isListadoMedicamentos="true"
        @edit="openEditDialog"
        @delete="confirmDelete"
      />

      <OrdenTransferenciaDialog
        v-model="dialog"
        :is-editing="false"
        :ordenTransferencia="selectedOrdenTransferencia"
        :areas="areas"
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
      :tipoInsumoOptions= this.tipoInsumoOptions
      :medicamento= this.newMed
      :skuError= skuError
      @closeDialog="closeAddDialog"
      @confirm="addMedicamento"
    />

    <MedicamentoDialog
      :dialogVisible="this.editDialog"
      :isEditing="true"
      :area = this.area
      :tipoInsumoOptions= this.tipoInsumoOptions
      :medicamento= this.editMed
      @closeDialog="closeEditDialog"
      @confirm="updateMedicamento"
    />

   
</template>

<script>
import Listado from './Listado.vue';
import ConfirmDialog from './ConfirmDialog.vue';
import MedicamentoDialog from './MedicamentoDialog.vue';

import stockAreasIdService from "./servicios/stockAreaService.js";
import itemService from "./servicios/itemService";
import medicamentosService from "./servicios/medicamentosService.js";
import ordenTransferenciaService from "./servicios/ordenTransferenciaService.js";
import { useGlobalStore } from "@/stores/global.js";
import OrdenTransferenciaDialog from './OrdenTransferenciaDialog.vue';
export default {
  name: "ListadoDeMedicamentos",
  components: {
    Listado,
    ConfirmDialog,
    MedicamentoDialog,
   OrdenTransferenciaDialog,
    },
  data() {
    return {
      search: '',
      medicamentos: [],
      areas: [],
      areasTodo: [],
      itemsMed: [],
      medicamentosConStock: [],
      area: null,
      tipoInsumoOptions: ["Medicamento"],
      
      addDialog: false,
      skuError: false,
      newMed: {
        sku: "",
        descripcion: "",
        tipo_insumo: "Medicamento",
        stock: null,
      },

      editDialog: false,
      editMed: {
        sku: "",
        descripcion: "",
        tipo_insumo: "Medicamento",
        stock: null,
      },

      deleteDialog: false,
      confirmDeleteSku: null,
      dialog: null,
      errorMessage: "",
      selectedOrdenTransferencia: {},
      globalStore: useGlobalStore(),
      STOCK_AREA_ID_DEPOSITO_GENERAL: 1,
    };
  },

  beforeMount(){
    this.loadStockAreasId()
    this.loadMedicamentos()
    this.loadItemsMed()
  },

  computed: {

    stockHeaderText() {
      const areaSeleccionada = this.areasTodo.find(area => area.id === this.area);
      return `STOCK - ${areaSeleccionada ? areaSeleccionada.nombre : ''}`;
    },

    usuariosHeaders() {
      return [
        { text: 'SKU', value: 'sku' },
        { text: 'DESCRIPCIÓN', value: 'descripcion' },
        { text: 'TIPO DE INSUMO', value: 'tipo_insumo' },
        { text: this.stockHeaderText, value: 'cantidad' },
        { text: '', value: 'acciones', sortable: false },
      ];
    },

    filteredMedicamentosConStock() {
      const searchTerm = this.search.toLowerCase();
      return this.medicamentosConStock.filter(medicamento => {
        const skuMatch = String(medicamento.sku).includes(searchTerm); 
        const descripcionMatch = medicamento.descripcion.toLowerCase().includes(searchTerm);
        return skuMatch || descripcionMatch;
      });
    },
  },

  methods: {
    onAreaChange(selectedArea) {
      this.area = selectedArea; 
      if(this.area == 0){
        this.loadMedicamentos()
      } else {
        this.loadMedicamentosByAreaId(this.area)
      }
    },

    async loadMedicamentosByAreaId(id){
      this.medicamentosConStock = await medicamentosService.getAllMedicamentoByStockAreaId(id)
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
    this.selectedOrdenTransferencia = { items: [], stockAreaIdOrigen: null, stockAreaIdDestino: null, motivo: '' }; // Reiniciar el objeto después de guardar
    if(this.area == 0){
      await this.loadMedicamentos();
    }else{
      await this.loadItemsMed();
     await this.loadMedicamentosByAreaId(this.area)
    }
  }
}
,

    async loadMedicamentos() {
      this.medicamentos = await medicamentosService.getAllMedicamento();
      this.medicamentosConStock = this.calcularMedicamentosConStock(this.medicamentos);
    },

    async loadStockAreasId(){
      this.areas = await stockAreasIdService.getAllStockArea();
      this.areasTodo = [{nombre: "Todo", id: 0}, ...this.areas];
      this.area = this.areasTodo[0].id;
      this.onAreaChange(this.area)
    },

    async loadItemsMed(){
      this.itemsMed = await itemService.getAllItem();
    },

    calcularMedicamentosConStock(medicamentos){
      medicamentos.forEach(medicamento => {
          medicamento.cantidad = this.calcularStock(medicamento);
      });
      return medicamentos;

    },

    calcularStock(medicamento) {
        let totalStock = 0;
        this.itemsMed.forEach((itemMed) => {
          if (itemMed.sku === medicamento.sku) {
            totalStock += itemMed.stock;
          }
        });
        return totalStock;
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

      const exists = this.medicamentos.some(
        (medicamento) => medicamento.sku == medicamentoEmitido.sku
      );

      if (!exists) {
        try {
          await medicamentosService.createMedicamento(medicamentoEmitido.sku, medicamentoEmitido.descripcion, medicamentoEmitido.tipo_insumo)
          await itemService.createItem(medicamentoEmitido.sku, medicamentoEmitido.stock,this.STOCK_AREA_ID_DEPOSITO_GENERAL );
          await this.loadItemsMed();
          this.area = 0;
          await this.loadMedicamentos();
          this.closeAddDialog();
        } catch (error) {
          console.error("Error al agregar el medicamento:", error);
        }
      } else {
        this.skuError = true;
      }
    },

    openEditDialog(medicamento) {
      this.editDialog = true;
      this.editMed = { 
        sku: medicamento.sku,
        descripcion: medicamento.descripcion,
        tipo_insumo: medicamento.tipo_insumo,
       };
      if(this.area != 0){
      let itemMed = this.itemsMed.find(
        (itemMed) => (itemMed.sku == medicamento.sku) && (itemMed.stockAreaId == this.area)
      );
      this.editMed.tipo_insumo= medicamento.tipoInsumo,
      this.editMed.stock = itemMed.stock;
      }        
    },

    closeEditDialog() {
      this.editDialog = false;
      this.resetEditForm();
    },

    async updateMedicamento({medicamentoEmitido}) {
      try {
        
        if(this.area != 0){
          let itemActualizar = this.itemsMed.find(
            (itemMed) => (itemMed.sku == medicamentoEmitido.sku) && (itemMed.stockAreaId == this.area)
          );
          await itemService.updateItem(itemActualizar.id, medicamentoEmitido.sku, medicamentoEmitido.stock)
          await this.loadItemsMed();
          await this.loadMedicamentosByAreaId(this.area)
        }else{
          await medicamentosService.updateMedicamento(medicamentoEmitido.sku, medicamentoEmitido.descripcion, medicamentoEmitido.tipo_insumo);
          await this.loadMedicamentos();
        }
        
        this.closeEditDialog();
      } catch (error) {
        console.error("Error al actualizar el medicamento:", error);
      }
    },

    confirmDelete(sku) {
      this.confirmDeleteSku = sku;
      this.deleteDialog = true;
    },

    closeDeleteDialog() {
      this.deleteDialog = false;
      this.confirmDeleteSku = null;
    },

    async deleteMedicamento() {
      try {
        if(this.area == 0 && this.globalStore.getEsAdmin){
          await itemService.deleteItemsBySku(this.confirmDeleteSku);
          await medicamentosService.deleteMedicamento(this.confirmDeleteSku);
        }else{
          let itemDelete = this.itemsMed.find(
            (itemMed) => (itemMed.sku == this.confirmDeleteSku) && (itemMed.stockAreaId == this.area)
          );
          await itemService.deleteItem(itemDelete.id);
        }
       
        this.closeDeleteDialog();
      } catch (error) {
        console.error("Error al eliminar el medicamento:", error);
      }
      finally{
      
        await this.loadItemsMed();
        await this.loadMedicamentosByAreaId(this.area)
        // await this.loadMedicamentos();
        // this.area = 0;
       
      }
    },

    resetForm() {
      this.newMed = {
        sku: "",
        descripcion: "",
        tipo_insumo: "Medicamento",
        stock: null,
      };
      this.skuError = false;
    },

    resetEditForm() {
      this.editMed = {
        sku: "",
        descripcion: "",
        tipo_insumo: "Medicamento",
        stock: null,
      };
    },

    resetTransferForm(){
      this.transfer={
        sku: "",
        cantidad: null,
        stockAreaIdOrigen: "",
        stockAreaIdDestino: "",
        motivo: "",
      };
      this.transferCantError = false;
    },
  }
};
</script>