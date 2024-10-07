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

  <v-btn @click="openEditDialog" class="mx-2">Editar Medicamento</v-btn>
  <v-btn @click="openDialog" class="mx-2">Agregar Medicamento</v-btn>
</v-card-title>


      <!-- Tabla con borde completo alrededor del encabezado y filas -->
      <v-data-table
        :search="search"
        :items="items"
        :headers="headers"
        hide-default-header
      >
        <template v-slot:thead>
          <thead>
            <tr>
              <th class="table-header text-start">SKU</th>
              <th class="table-header text-start">DESCRIPCIÓN</th>
              <th class="table-header text-start">TIPO DE MEDICAMENTO</th>
              <th class="table-header text-start">CANTIDAD DE COMPRIMIDOS</th>
              <th class="table-header text-start">CANTIDAD STOCK</th>
            </tr>
          </thead>
        </template>

        <template v-slot:item="{ item }">
          <tr>
            <td class="text-start table-cell">{{ item.sku }}</td>
            <td class="text-start table-cell">{{ item.descripcion }}</td>
            <td class="text-start table-cell">{{ item.tipo_insumo }}</td>
            <td class="text-start table-cell">{{ item.cantidad_comprimidos }}</td>
            <td class="text-start table-cell">{{ item.stock }}</td>
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
            <v-text-field v-model="newMed.tipo_insumo" label="Tipo de Medicamento" required></v-text-field>
            <v-text-field v-model="newMed.cantidad_comprimidos" label="Cantidad de Comprimidos" required></v-text-field>
            <v-text-field v-model="newMed.stock" label="Cantidad Stock" required></v-text-field>

            <!-- Mostrar mensaje de error si algún campo está vacío -->
            <v-alert v-if="formError" type="error" dismissible>
              Todos los campos son obligatorios. Por favor, completa la información.
            </v-alert>

            <!-- Mostrar mensaje de error si el SKU ya existe -->
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
            <v-select
              v-model="editMed.sku"
              :items="items.map(item => item.sku)"
              label="Seleccionar SKU"
              @change="selectMed"
              required
            ></v-select>
            <v-text-field v-model="editMed.descripcion" label="Descripción" required></v-text-field>
            <v-text-field v-model="editMed.tipo_insumo" label="Tipo de Medicamento" required></v-text-field>
            <v-text-field v-model="editMed.cantidad_comprimidos" label="Cantidad de Comprimidos" required></v-text-field>
            <v-text-field v-model="editMed.stock" label="Cantidad Stock" required></v-text-field>
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
// Importa el archivo JSON
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
        { text: "CANTIDAD STOCK", value: "stock" },
      ],
      items: [], // Inicialmente vacío
      dialog: false, // Controla la apertura/cierre del pop-up de agregar
      editDialog: false, // Controla el pop-up de editar
      newMed: {
        sku: "",
        descripcion: "",
        tipo_insumo: "",
        cantidad_comprimidos: "",
        stock: "",
      },
      editMed: {
        sku: "",
        descripcion: "",
        tipo_insumo: "",
        cantidad_comprimidos: "",
        stock: "",
      },
      skuError: false, // Indica si hay un error de SKU duplicado
      formError: false, // Indica si hay campos vacíos
    };
  },
  mounted() {
    // Asigna los datos del archivo JSON a items
    this.items = medicamentos;
  },
  methods: {
    // Abrir diálogo de agregar medicamento
    openDialog() {
      this.dialog = true;
    },
    closeDialog() {
      this.dialog = false;
      this.resetForm();
      this.skuError = false;
      this.formError = false; // Resetea también el error de formulario
    },
    addMedicamento() {
      // Reseteamos los mensajes de error
      this.skuError = false;
      this.formError = false;

      // Verifica si algún campo está vacío
      if (
        !this.newMed.sku ||
        !this.newMed.descripcion ||
        !this.newMed.tipo_insumo ||
        !this.newMed.cantidad_comprimidos ||
        !this.newMed.stock
      ) {
        this.formError = true; // Muestra error si faltan campos
        return;
      }

      // Valida si el SKU ya existe en la lista de medicamentos
      const exists = this.items.some((item) => item.sku === this.newMed.sku);

      if (exists) {
        this.skuError = true; // Muestra error si el SKU ya existe
      } else {
        // Si no hay errores, agrega el nuevo medicamento
        this.skuError = false;

        this.items.push({ ...this.newMed });

        // Cierra el diálogo y resetea el formulario
        this.closeDialog();
      }
    },
    // Abrir diálogo de editar medicamento
    openEditDialog() {
      this.editDialog = true;
    },
    closeEditDialog() {
      this.editDialog = false;
      this.resetEditForm();
    },
    selectMed() {
      const selectedMed = this.items.find(item => item.sku === this.editMed.sku);
      if (selectedMed) {
        this.editMed = { ...selectedMed };
      }
    },
    updateMedicamento() {
      const index = this.items.findIndex(item => item.sku === this.editMed.sku);
      if (index !== -1) {
        this.items.splice(index, 1, { ...this.editMed });
        this.closeEditDialog();
      }
    },
    resetForm() {
      // Resetea el formulario y elimina los mensajes de error
      this.newMed = {
        sku: "",
        descripcion: "",
        tipo_insumo: "",
        cantidad_comprimidos: "",
        stock: "",
      };
      this.skuError = false;
    },
    resetEditForm() {
      this.editMed = {
        sku: "",
        descripcion: "",
        tipo_insumo: "",
        cantidad_comprimidos: "",
        stock: "",
      };
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