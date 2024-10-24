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
        <v-btn v-if="false" @click="openTransferDialog" class="mx-2 btn-blue">Transferir Stock</v-btn>
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

    <!-- Pop-up para agregar medicamento -->
    <v-dialog v-model="addDialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Agregar Nuevo Medicamento</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-text-field v-model="newMed.sku" label="SKU" required></v-text-field>
            <v-text-field v-model="newMed.descripcion" label="Descripción" required></v-text-field>

            <v-select
              v-model="newMed.tipo_insumo"
              :items="tipoInsumoOptions"
              label="Tipo de Medicamento"
              required

            ></v-select>

            <!-- stock -->
            <v-text-field
              v-model.number="newMed.stock"
              label="Stock"
              required
              type="number"
              min="0"
            ></v-text-field>

            <!-- areaid -->
            <!-- <v-select
              v-model="newMed.area"
              :items="areas"
              item-title="nombre"
              item-value="id"
              label="Area"
              required
            ></v-select> -->

            <v-alert v-if="formError" type="error" dismissible>
              Todos los campos son obligatorios. Por favor, completa la información.
            </v-alert>

            <v-alert v-if="skuError" type="error" dismissible>
              El SKU ya existe. Por favor, elige otro.
            </v-alert>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="btn-blue" text @click="closeAddDialog">Cancelar</v-btn>
          <v-btn class="btn-blue" text @click="addMedicamento">Agregar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Pop-up para editar medicamento -->
    <v-dialog v-model="editDialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Editar Medicamento</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="editForm">
            <v-text-field v-model="editMed.sku" label="SKU" required readonly></v-text-field>
            <v-text-field v-model="editMed.descripcion" label="Descripción" required :readonly="this.area != 0"></v-text-field>
            <v-select
              v-model="editMed.tipo_insumo"
              :items="tipoInsumoOptions"
              label="Tipo de Medicamento"
              required
            ></v-select>

            <v-text-field
              v-if = "this.area != 0"
              v-model.number="editMed.stock"
              label="Stock"
              required
              type="number"
              min="0"
            ></v-text-field>

            <v-alert v-if="editFormError" type="error" dismissible>
              Todos los campos son obligatorios. Por favor, completa la información.
            </v-alert>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="btn-blue" text @click="closeEditDialog">Cancelar</v-btn>
          <v-btn class="btn-blue" text @click="updateMedicamento">Actualizar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>

</template>

<script>
import Listado from './Listado.vue';
import ConfirmDialog from './ConfirmDialog.vue';
import stockAreasIdService from "./servicios/stockAreaService.js";
import itemService from "./servicios/itemService";
import medicamentosService from "./servicios/medicamentosService.js";
import ordenTransferenciaService from "./servicios/ordenTransferenciaService.js";
import { useGlobalStore } from "@/stores/global.js";



export default {
  name: "ListadoDeMedicamentos",
  components: {
    Listado,
    ConfirmDialog
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
      formError: false,
      newMed: {
        sku: "",
        descripcion: "",
        tipo_insumo: "Medicamento",
        stock: null,
      },

      editDialog: false,
      editFormError: false,
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
      this.resetErrors();
      this.newMed = {
        sku: "",
        descripcion: "",
        tipo_insumo: "Medicamento",
        stock: null,
      };
    },

    closeAddDialog() {
      this.addDialog = false;
      this.resetForm();
    },

    async addMedicamento() {
      this.resetErrors();

      if (
        !this.newMed.sku ||
        !this.newMed.descripcion ||
        !this.newMed.tipo_insumo ||
        !this.newMed.stock
      ) {
        this.formError = true;
        return;
      }

      const exists = this.medicamentos.some(
        (medicamento) => medicamento.sku == this.newMed.sku
      );

      if (!exists) {
        try {
          await itemService.createItem(this.newMed.sku, this.newMed.descripcion, this.newMed.tipo_insumo, this.newMed.stock);
          await this.loadItemsMed();
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

      this.resetEditErrors();
    },

    closeEditDialog() {
      this.editDialog = false;
      this.resetEditForm();
    },

    async updateMedicamento() {
      this.resetEditErrors();

      if(this.area != 0 && !this.editMed.stock){
        this.editFormError = true;
        return;
      }
      if (
        !this.editMed.sku ||
        !this.editMed.descripcion ||
        !this.editMed.tipo_insumo 
      ) {
        this.editFormError = true;
        return;
      }
      ////////////////////////
      try {
        if(this.area != 0){
          let itemActualizar = this.itemsMed.find(
            (itemMed) => (itemMed.sku == this.editMed.sku) && (itemMed.stockAreaId == this.area)
          );
          console.log("actualizar item", itemActualizar.id, this.editMed.sku, this.editMed.stock, this.area)
          await itemService.updateItem(itemActualizar.id, this.editMed.sku, this.editMed.stock)
          await this.loadItemsMed();
        }else{
          await medicamentosService.updateMedicamento(this.editMed.sku, this.editMed.descripcion, this.editMed.tipo_insumo);
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
      this.resetErrors();
    },

    resetEditForm() {
      this.editMed = {
        sku: "",
        descripcion: "",
        tipo_insumo: "Medicamento",
        stock: null,
      };
      this.resetEditErrors();
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

    resetErrors() {
      this.skuError = false;
      this.formError = false;
    },

    resetEditErrors() {
      this.editFormError = false;
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