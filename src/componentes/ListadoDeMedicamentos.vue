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
        <v-btn @click="openTransferDialog" class="mx-2 btn-blue">Transferir Stock</v-btn>
        <v-btn @click="openAddDialog" class="mx-2 btn-blue">Agregar Medicamento</v-btn>
      </v-card-title>

      <Listado
        :items="filteredMedicamentosConStock"
        :headers="usuariosHeaders"
        :isListadoMedicamentos="true"
        @edit="openEditDialog"
        @delete="confirmDelete"
      />
    </v-card>

     <!-- Pop-up para transferencia de stock  -->
    <v-dialog v-model="transferDialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Transferir Stock</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="form">
            <!-- <v-text-field v-model="transfer.sku" label="SKU" required></v-text-field> -->
            <v-select
              v-model="transfer.sku"
              :items="medicamentos"
              item-title="sku"
              item-value="sku"
              label="Sku"
              required
            ></v-select>

            <v-text-field
              v-model.number="transfer.cantidad"
              label="Cantidad"
              required
              type="number"
              min="1"
            ></v-text-field>

            <v-select
              v-model="transfer.stockAreaIdOrigen"
              :items="areas"
              item-title="nombre"
              item-value="id"
              label="Origen"
              required
            ></v-select>

            <v-select
              v-model="transfer.stockAreaIdDestino"
              :items="areas"
              item-title="nombre"
              item-value="id"
              label="Destino"
              required
            ></v-select>

            <v-text-field v-model="transfer.motivo" label="Motivo" required></v-text-field>

            <v-alert v-if="transferFormError" type="error" dismissible>
              Todos los campos son obligatorios. Por favor, completa la información.
            </v-alert>

            <v-alert v-if="transferCantError" type="error" dismissible>
              Cantidad no disponible para transferir.
            </v-alert>

          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="btn-blue" text @click="closeTransferDialog">Cancelar</v-btn>
          <v-btn class="btn-blue" text @click="transferMedicamento">Agregar</v-btn>
        </v-card-actions> 
      </v-card>
    </v-dialog>

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
  </div> 
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

export default {
  name: "ListadoDeMedicamentos",
  components: {
    Listado,
    ConfirmDialog,
    MedicamentoDialog
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
      transferFormError: false,
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

    usuariosHeaders() {
      return [
        { text: 'SKU', value: 'sku' },
        { text: 'DESCRIPCIÓN', value: 'descripcion' },
        { text: 'TIPO DE INSUMO', value: 'tipo_insumo' },
        { text: 'STOCK', value: 'cantidad' },
        { text: '', value: 'acciones', sortable: false },
      ];
    },

    filteredMedicamentosConStock() {
      const searchTerm = this.search.toLowerCase();
      return this.medicamentosConStock.filter(medicamento => {
        const skuMatch = String(medicamento.sku).includes(searchTerm); // Convierte sku a string para poder buscar
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
      this.resetTransferErrors();
      this.transfer = {
        sku: "",
        cantidad: null,
        stockAreaIdOrigen: "",
        stockAreaIdDestino: "",
        motivo: "",
      }
    },

    closeTransferDialog(){
      this.transferDialog= false;
      this.resetTransferForm();
    },

    async transferMedicamento(){
      this.resetTransferErrors();
      console.log("sku ",this.transfer.sku," cant ",this.transfer.cantidad," orig ",this.transfer.stockAreaIdOrigen," dest ",this.transfer.stockAreaIdDestino," mot ",this.transfer.motivo)
      console.log(this.transfer.stockAreaIdDestino)
      if(!this.transfer.sku ||
        !this.transfer.cantidad ||
        !this.transfer.stockAreaIdOrigen ||
        !this.transfer.stockAreaIdDestino ||
        !this.transfer.motivo
        ) {
          this.transferFormError = true;
          return;
        }

      let itemExist = this.itemsMed.find(
        (itemMed) => (itemMed.sku == this.transfer.sku) && (itemMed.stockAreaId == this.transfer.stockAreaIdOrigen)
      );

      if(itemExist != null && itemExist.stock >= this.transfer.cantidad){
        try {
            await ordenTransferenciaService.createTransferencia(this.globalStore.getUsuarioId , this.transfer.sku, this.transfer.cantidad, this.transfer.stockAreaIdOrigen, this.transfer.stockAreaIdDestino, this.transfer.motivo);
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
      console.log("medicamentoEmitido A AGREGAR", medicamentoEmitido)
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
        console.log("DEBERIA ACTUALIZAR SKU ERROR")
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
          console.log("actualizar item", itemActualizar.id, medicamentoEmitido.sku, medicamentoEmitido.stock, this.area)
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
      this.resetTransferErrors();
    },

    resetTransferErrors(){
      this.transferFormError = false;
      this.transferCantError = false;
    }
  }
};
</script>

<style scoped>

</style>