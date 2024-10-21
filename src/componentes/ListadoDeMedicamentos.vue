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
          :items="areas"
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
        <v-btn  class="mx-2 btn-blue">Transferir Stock</v-btn>
        <v-btn @click="openAddDialog" class="mx-2 btn-blue">Agregar Medicamento</v-btn>
      </v-card-title>

      <v-data-table
        :search="search"
        :items="medicamentos"
        :headers="headers"
        hide-default-header
      >
        <template v-slot:thead>
          <thead>
            <tr>
              <th class="table-header text-start">SKU</th>
              <th class="table-header text-start">DESCRIPCIÓN</th>
              <th class="table-header text-start">TIPO DE INSUMO</th>
              <th class="table-header text-start">STOCK</th>
              <th class="table-header text-start"></th>
            </tr>
          </thead>
        </template>

        <template v-slot:item="{ item: medicamento }">
          <tr>
            <td class="text-start">{{ medicamento.sku }}</td>
            <td class="text-start">{{ medicamento.descripcion }}</td>
            <td class="text-start">{{ medicamento.tipo_insumo }}</td>

            <td v-if="area === 0" class="text-start">{{ calcularStock(medicamento) }}</td>
            <td v-else>{{ medicamento.cantidad }}</td>

            <td class="text-start acciones-cell">
              <v-btn icon small color= "#0E3746" @click="openEditDialog(medicamento)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon small color="red" @click="confirmDelete(medicamento.sku)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card>

    <!-- Pop-up para confirmar eliminación -->
    <v-dialog v-model="deleteDialog" persistent max-width="400px">
      <v-card>
        <v-card-title class="headline">Confirmar Eliminación</v-card-title>
        <v-card-text>¿Estás seguro de que deseas eliminar este medicamento?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="btn-blue" text @click="closeDeleteDialog">Cancelar</v-btn>
          <v-btn class="btn-blue" text @click="deleteMedicamento(confirmDeleteSku)">Confirmar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
            <v-text-field v-model="editMed.descripcion" label="Descripción" required></v-text-field>
            <v-select
              v-model="editMed.tipo_insumo"
              :items="tipoInsumoOptions"
              label="Tipo de Medicamento"
              required
            ></v-select>


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
import stockAreasIdService from "./servicios/stockAreaService.js";
import itemService from "./servicios/itemService";
import medicamentosService from "./servicios/medicamentosService.js";



export default {
  name: "ListadoDeMedicamentos",
  data() {
    return {
      search: "",
      headers: [
        { text: "SKU", value: "sku" },
        { text: "DESCRIPCIÓN", value: "descripcion" }
      ],
      medicamentos: [],
      areas: [],
      itemsMed: [],
      area: null,
      addDialog: false,
      editDialog: false,
      deleteDialog: false,
      confirmDeleteSku: null,
      tipoInsumoOptions: ["Medicamento"],
      newMed: {
        sku: "",
        descripcion: "",
        tipo_insumo: "Medicamento",
      },
      editMed: {
        id: "",
        sku: "",
        descripcion: "",
        tipo_insumo: "Medicamento",
      },
      skuError: false,
      formError: false,
      editFormError: false,
      snackbar: false,
      snackbarMessage: ''
    };
  },

  beforeMount(){
    this.loadStockAreasId()
    this.loadMedicamentos()
    this.loadItemsMed()
  },

  methods: {

    onAreaChange(selectedArea) {
      console.log("holaaaa")
      this.area = selectedArea; 
      if(this.area == 0){
        this.loadMedicamentos()
      } else {
        this.loadMedicamentosByAreaId(this.area)
      }
    },

    async loadMedicamentosByAreaId(id){
      this.medicamentos = await medicamentosService.getAllMedicamentoByStockAreaId(id)
    },

    async loadMedicamentos() {
      this.medicamentos = await medicamentosService.getAllMedicamento();
      console.log("load medicamentos",this.medicamentos)
      // this.calcularStockMedicamentos();
    },

    async loadStockAreasId(){
      this.areas = await stockAreasIdService.getAllStockArea();
      // console.log("load stockAreasId",this.areas)
      this.area = this.areas[0].id; // Área por defecto
      // console.log("area", this.area)
    },

    async loadItemsMed(){
      this.itemsMed = await itemService.getAllItem();
      console.log("load items",this.itemsMed)
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
      this.resetErrors();
      this.newMed = {
        sku: "",
        descripcion: "",
        tipo_insumo: "Medicamento",
      };
    },

    closeAddDialog() {
      this.addDialog = false;
      this.resetForm();
    },

    async addMedicamento() {
      this.skuError = false;
      this.formError = false;

      if (
        !this.newMed.sku ||
        !this.newMed.descripcion ||
        !this.newMed.tipo_insumo 
      ) {
        this.formError = true;
        return;
      }

      const exists = this.medicamentos.some(
        (medicamento) => medicamento.sku == this.newMed.sku
      );

      if (!exists) {
        try {
          await medicamentosService.createMedicamento(this.newMed.sku, this.newMed.descripcion, this.newMed.tipo_insumo);
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
      this.editMed = { ...medicamento };
      this.resetEditErrors();
    },

    closeEditDialog() {
      this.editDialog = false;
      this.resetEditForm();
    },

    async updateMedicamento() {
      this.editFormError = false;

      if (
        !this.editMed.sku ||
        !this.editMed.descripcion ||
        !this.editMed.tipo_insumo 
      ) {
        this.editFormError = true;
        return;
      }

      try {
        await medicamentosService.updateMedicamento(this.editMed.sku, this.editMed.descripcion, this.editMed.tipo_insumo);
        await this.loadMedicamentos();
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

    async deleteMedicamento(sku) {
      try {
        await medicamentosService.deleteMedicamento(sku);
        await this.loadMedicamentos();
        this.closeDeleteDialog();
      } catch (error) {
        console.error("Error al eliminar el medicamento:", error);
      }
    },

    resetForm() {
      this.newMed = {
        sku: "",
        descripcion: "",
        tipo_insumo: "Medicamento",
      };
      this.skuError = false;
      this.formError = false;
    },

    resetEditForm() {
      this.editMed = {
        sku: "",
        descripcion: "",
        tipo_insumo: "Medicamento",
      };
      this.editFormError = false;
    },

    resetErrors() {
      this.skuError = false;
      this.formError = false;
    },

    resetEditErrors() {
      this.editFormError = false;
    }
  }
};
</script>

<style scoped>

</style>