<template>
  <div class="custom-container">
    <v-card flat>
      <v-card-title class="d-flex align-center pe-2">
        <v-text-field
          v-model="search"
          density="compact"
          label="Buscar"
          prepend-inner-icon="mdi-magnify"
          variant="solo-filled"
          flat
          hide-details
          single-line
          class="rounded-search-bar"
        ></v-text-field>

        <v-spacer></v-spacer>

        <v-btn @click="openDialog" class="mx-2">Agregar Medicamento</v-btn>
      </v-card-title>

      <v-data-table
        :search="search"
        :items="items"
        :headers="headers"
        hide-default-header
        :footer-props="{
          'items-per-page-text': 'Elementos por página',
          'page-text': '{0}-{1} de {2}',
          'next-icon': 'mdi-chevron-right',
          'prev-icon': 'mdi-chevron-left'
        }"
        no-data-text="No hay datos disponibles"
      >
        <template v-slot:thead>
          <thead>
            <tr>
              <th class="table-header text-start">SKU</th>
              <th class="table-header text-start">DESCRIPCIÓN</th>
              <th class="table-header text-start">TIPO DE MEDICAMENTO</th>
              <th class="table-header text-start">CANTIDAD STOCK</th>
              <th class="table-header text-start">ACCIONES</th>
            </tr>
          </thead>
        </template>

        <template v-slot:item="{ item }">
          <tr>
            <td class="text-start table-cell">{{ item.sku }}</td>
            <td class="text-start table-cell">{{ item.descripcion }}</td>
            <td class="text-start table-cell">{{ item.tipo_insumo }}</td>
            <td class="text-start table-cell">{{ item.stock }}</td>
            <td class="text-start table-cell">
              <v-btn small @click="openEditDialog(item)">Editar</v-btn>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card>

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
              v-model.number="newMed.stock" 
              label="Cantidad Stock" 
              required 
              type="number" 
              min="0"
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
          <v-btn text @click="closeDialog">Cancelar</v-btn>
          <v-btn text @click="addMedicamento">Agregar</v-btn>
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
              v-model.number="editMed.stock" 
              label="Cantidad Stock" 
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
          <v-btn text @click="closeEditDialog">Cancelar</v-btn>
          <v-btn text @click="updateMedicamento">Actualizar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>



<script>
import medicamentos from "@/assets/medicamentos.json";

export default {
  name: "ListadoDeMedicamentos",
  data() {
    return {
      search: "",
      headers: [
        { text: "SKU", value: "sku" },
        { text: "DESCRIPCIÓN", value: "descripcion" },
        { text: "TIPO DE MEDICAMENTO", value: "tipo_insumo" },
      ],
      items: [],
      dialog: false,
      editDialog: false,
      tipoInsumoOptions: ["Medicamento"], // Lista de opciones para el tipo de insumo
      newMed: {
        sku: "",
        descripcion: "",
        tipo_insumo: "Medicamento", // Valor predeterminado
        stock: null,
      },
      editMed: {
        sku: "",
        descripcion: "",
        tipo_insumo: "Medicamento", // Valor predeterminado
        stock: null,
      },
      skuError: false,
      formError: false,
      editFormError: false,
    };
  },
  mounted() {
    this.items = medicamentos;
  },
  methods: {
    openDialog() {
      this.dialog = true;
      this.resetErrors();
    },
    closeDialog() {
      this.dialog = false;
      this.resetForm();
    },
    addMedicamento() {
      this.skuError = false;
      this.formError = false;

      if (
        !this.newMed.sku ||
        !this.newMed.descripcion ||
        !this.newMed.tipo_insumo ||
        this.newMed.stock === null || 
        isNaN(this.newMed.stock)
      ) {
        this.formError = true;
        return;
      }

      const exists = this.items.some((item) => item.sku === this.newMed.sku);

      if (exists) {
        this.skuError = true;
      } else {
        this.skuError = false;
        this.items.push({ ...this.newMed });
        this.closeDialog();
      }
    },
    openEditDialog(item) {
      this.editMed = { ...item };
      this.editDialog = true;
      this.resetErrors();
    },
    closeEditDialog() {
      this.editDialog = false;
      this.resetEditForm();
    },
    updateMedicamento() {
      this.editFormError = false;

      if (
        !this.editMed.sku ||
        !this.editMed.descripcion ||
        !this.editMed.tipo_insumo ||
        this.editMed.stock === null || 
        isNaN(this.editMed.stock)
      ) {
        this.editFormError = true;
        return;
      }

      const index = this.items.findIndex((item) => item.sku === this.editMed.sku);
      
      if (index !== -1) {
        this.items.splice(index, 1, { ...this.editMed });
        this.closeEditDialog();
      }
    },
    resetForm() {
      this.newMed = {
        sku: "",
        descripcion: "",
        tipo_insumo: "Medicamento", // Restablecer el valor por defecto
        stock: null,
      };
      this.skuError = false;
    },
    resetEditForm() {
      this.editMed = {
        sku: "",
        descripcion: "",
        tipo_insumo: "Medicamento", // Restablecer el valor por defecto
        stock: null,
      };
    },
    resetErrors() {
      this.formError = false;
      this.skuError = false;
      this.editFormError = false;
    },
  },
};
</script>


<style scoped>
.custom-container {
  padding: 40px 20px;
  border-radius: 16px;
  background-color: white;
  border: 1px solid #d9dcd1;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  max-width: 90%;
  margin: 0 auto;
}

.table-header {
  background-color: #E5E5E5;
  text-transform: uppercase;
  font-weight: bold;
  border: 1px solid #CECECE;
}

.table-cell {
  border: 1px solid #CECECE;
}

.v-btn {
  text-transform: none;
  background-color: #0E3746;
  color: white;
}

.headline {
  font-weight: bold;
  color: #0E3746;
}
</style>
