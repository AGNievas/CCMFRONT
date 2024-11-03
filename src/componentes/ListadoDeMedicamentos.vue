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
        <v-btn @click="openTransferDialog" class=" btn-blue">Transferir Stock</v-btn>
        <v-btn @click="openAddDialog" class=" btn-blue">Agregar Medicamento</v-btn>
      </v-card-title>

      <Listado
        :items="filteredMedicamentosConStock"
        :headers="usuariosHeaders"
        :isListadoMedicamentos="true"
        @edit="openEditDialog"
        @delete="confirmDelete"
      />
    </v-card>

    <ConfirmDialog
      v-model="deleteDialog"
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

    <TransferenciaStockDialog
      :dialogVisible="this.transferDialog"
      :transferencia= this.transfer
      :cantidadError= transferCantError
      :medicamentos= this.medicamentos
      :areas= this.areas
      @closeDialog="closeTransferDialog"
      @confirm="transferMedicamento"
    /> 
</template>

<script>
import Listado from './Listado.vue';
import ConfirmDialog from './ConfirmDialog.vue';
import MedicamentoDialog from './MedicamentoDialog.vue';
import TransferenciaStockDialog from "./TransferenciaStockDialog.vue";
import stockAreasIdService from "./servicios/stockAreaService.js";
import itemService from "./servicios/itemService";
import medicamentosService from "./servicios/medicamentosService.js";
import ordenTransferenciaService from "./servicios/ordenTransferenciaService.js";
import { useGlobalStore } from "@/stores/global.js";

export default {
  name: "ListadoDeMedicamentos",
  components: {
    Listado,
    ConfirmDialog,
    MedicamentoDialog,
    TransferenciaStockDialog,
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

      transferDialog: false,
      transferCantError: false,
      transfer: {
        sku: "",
        cantidad: null,
        stockAreaIdOrigen: "",
        stockAreaIdDestino: "",
        motivo: "",
      },

      globalStore: useGlobalStore(),
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

    openTransferDialog(){
      this.loadMedicamentos();
      this.area = this.areasTodo[0]
      this.transferDialog = true;
      this.resetTransferForm()
    },

    closeTransferDialog(){
      this.transferDialog= false;
      this.resetTransferForm();
    },

    async transferMedicamento({transferenciaEmitida}){
      this.transferCantError = false;

      let itemExist = this.itemsMed.find(
        (itemMed) => (itemMed.sku == transferenciaEmitida.sku) && (itemMed.stockAreaId == transferenciaEmitida.stockAreaIdOrigen)
      );

      if(itemExist != null && itemExist.stock >= transferenciaEmitida.cantidad){
        try {
            await ordenTransferenciaService.createTransferencia(this.globalStore.getUsuarioId , transferenciaEmitida.sku, transferenciaEmitida.cantidad, transferenciaEmitida.stockAreaIdOrigen, transferenciaEmitida.stockAreaIdDestino, transferenciaEmitida.motivo);
            this.closeTransferDialog();
          } catch (error) {
            console.error("Error al transferir stock: ", error);
          }
      }else{
        this.transferCantError = true;
      }

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
          await itemService.createItem(medicamentoEmitido.sku, medicamentoEmitido.descripcion, medicamentoEmitido.tipo_insumo, medicamentoEmitido.stock);
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
        await this.loadMedicamentos();
       
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

<style scoped>

</style>