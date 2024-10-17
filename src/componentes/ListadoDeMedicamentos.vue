<template>
  <div class="custom-container">
    <v-card flat>
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
        ></v-select>

        <v-spacer></v-spacer>
        <v-btn  class="mx-2 btn-blue">Transferir Stock</v-btn>
        <v-btn @click="openDialog" class="mx-2 btn-blue">Agregar Medicamento</v-btn>
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
              <th class="table-header text-start">TIPO DE MEDICAMENTO</th>
              <th class="table-header text-start">STOCK</th>
              <th class="table-header text-start"></th>
            </tr>
          </thead>
        </template>

        <template v-slot:item="{ item: medicamento }">
          <tr>
            <td class="text-start">{{ medicamento.sku }}</td>
            <td class="text-start">{{ medicamento.descripcion }}</td>
            <td class="text-start">{{ medicamento.tipoInsumo }}</td>
            <td class="text-start">{{ medicamento.cantidad }}</td>
            <td class="text-start acciones-cell">
              <v-btn icon small color= "#0E3746" @click="openEditDialog(medicamento)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon small color="red" @click="confirmDelete(medicamento.id)">
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
          <v-btn class="btn-blue" text @click="deleteMedicamento(confirmDeleteId)">Confirmar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Pop-up para agregar medicamento -->
    <v-dialog v-model="dialog" persistent max-width="600px">
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

            <v-text-field
              v-model.number="newMed.cantidad_comprimidos"
              label="Cantidad Comprimidos"
              required
              type="number"
              min="1"

            ></v-text-field>

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
          <v-btn class="btn-blue" text @click="closeDialog">Cancelar</v-btn>
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
            <v-text-field
              v-model.number="editMed.cantidad_comprimidos"
              label="Cantidad Comprimidos"
              required
              type="number"
              min="1"

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
import {
  // getMedicamentos,
  getMedicamentosByStockAreaId,
  createMedicamento,
  updateMedicamento,
  deleteMedicamento
} from "./servicios/medicamentosService.js";

// import medicamentosService from "./servicios/medicamentosService.js"
// import stockAreasId from "../assets/stockAreasId.json";
// import items from "../assets/items.json";

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
      items: [],
      area: null,
      dialog: false,
      editDialog: false,
      deleteDialog: false,
      confirmDeleteId: null, // ID del medicamento a eliminar
      tipoInsumoOptions: ["Medicamento"],
      newMed: {
        sku: "",
        descripcion: "",
        tipo_insumo: "Medicamento",
        cantidad_comprimidos: 1
      },
      editMed: {
        id: "",
        sku: "",
        descripcion: "",
        tipo_insumo: "Medicamento",
        cantidad_comprimidos: 1
      },
      skuError: false,
      formError: false,
      editFormError: false,
      snackbar: false,
      snackbarMessage: ''
    };
  },
  watch: {
    area() {
      this.calcularStockMedicamentos(); // Llamamos al método que calcula el stock para todos los medicamentos
    }
  },
  // beforeMount() {
  //   this.loadMedicamentos().then(() => {
  //     this.calcularStockMedicamentos(); // Calcular el stock cuando se carguen los medicamentos
  //   });
  //   this.areas = stockAreaService.getAllStockAreas();
  //   this.area = this.areas[0].id; // Área por defecto
  //   this.items = items;
  // },


  mounted(){
     this.loadMedicamentos()
  },

  methods: {


    
    async loadMedicamentos() {
      this.medicamentos = await getMedicamentosByStockAreaId(1);
      console.log("load medicamentos",this.medicamentos)
      // this.calcularStockMedicamentos();
    },

    // calcularStock(medicamento) {
    //   if (this.area === 0) {
    //     let totalStock = 0;
    //     this.items.forEach((item) => {
    //       if (item.sku === medicamento.sku) {
    //         totalStock += item.stock;
    //       }
    //     });
    //     return totalStock;
    //   } else {
    //     const itemEncontrado = this.items.find(
    //       (item) => item.sku === medicamento.sku && item.areaId === this.area
    //     );
    //     return itemEncontrado ? itemEncontrado.stock : 0;
    //   }
    // },

    // calcularStockMedicamentos() {
    //   // Actualiza el stock de cada medicamento basado en el área seleccionada
    //   this.medicamentos.forEach((medicamento) => {
    //     medicamento.stock = this.calcularStock(medicamento); // Asignar el stock calculado al medicamento
    //   });
    // },

    openDialog() {
      this.dialog = true;
      this.resetErrors();
      this.newMed = {
        sku: "",
        descripcion: "",
        tipo_insumo: "Medicamento",
        cantidad_comprimidos: 1
      };
    },

    closeDialog() {
      this.dialog = false;
      this.resetForm();
    },

    async addMedicamento() {
      this.skuError = false;
      this.formError = false;

      if (
        !this.newMed.sku ||
        !this.newMed.descripcion ||
        !this.newMed.tipo_insumo ||
        this.newMed.cantidad_comprimidos === null ||
        isNaN(this.newMed.cantidad_comprimidos)
      ) {
        this.formError = true;
        return;
      }

      const exists = this.medicamentos.some(
        (medicamento) => medicamento.sku === this.newMed.sku
      );

      if (!exists) {
        try {
          await createMedicamento(this.newMed);
          await this.loadMedicamentos();
          this.closeDialog();
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
        !this.editMed.tipo_insumo ||
        this.editMed.cantidad_comprimidos === null ||
        isNaN(this.editMed.cantidad_comprimidos)
      ) {
        this.editFormError = true;
        return;
      }

      try {
        await updateMedicamento(this.editMed.id, this.editMed);
        await this.loadMedicamentos();
        this.closeEditDialog();
      } catch (error) {
        console.error("Error al actualizar el medicamento:", error);
      }
    },

    confirmDelete(id) {
      this.confirmDeleteId = id;
      this.deleteDialog = true;
    },

    closeDeleteDialog() {
      this.deleteDialog = false;
      this.confirmDeleteId = null;
    },

    async deleteMedicamento(id) {
      try {
        await deleteMedicamento(id);
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
        cantidad_comprimidos: 1
      };
      this.skuError = false;
      this.formError = false;
    },

    resetEditForm() {
      this.editMed = {
        sku: "",
        descripcion: "",
        tipo_insumo: "Medicamento",
        cantidad_comprimidos: 1
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