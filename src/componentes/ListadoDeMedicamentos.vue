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
      >
        <template v-slot:thead>
          <thead>
            <tr>
              <th class="table-header text-start">SKU</th>
              <th class="table-header text-start">DESCRIPCIÓN</th>
              <th class="table-header text-start">TIPO DE MEDICAMENTO</th>
              <th class="table-header text-start">CANTIDAD COMPRIMIDOS</th>
              <th class="table-header text-start">ACCIONES</th>
            </tr>
          </thead>
        </template>

        <template v-slot:item="{ item }">
          <tr>
            <td class="text-start table-cell">{{ item.sku }}</td>
            <td class="text-start table-cell">{{ item.descripcion }}</td>
            <td class="text-start table-cell">{{ item.tipo_insumo }}</td>
            <td class="text-start table-cell">{{ item.cantidad_comprimidos }}</td>
            <td class="text-start table-cell">
              <v-btn small @click="openEditDialog(item)">Editar</v-btn>
              <v-btn small color="red" @click="deleteMedicamento(item.id)">Eliminar</v-btn>
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
              v-model.number="newMed.cantidad_comprimidos" 
              label="Cantidad Comprimidos" 
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
            <!-- SKU de solo lectura -->
            <v-text-field v-model="editMed.sku" label="SKU" required readonly></v-text-field>
            
            <!-- Campo para Descripción -->
            <v-text-field v-model="editMed.descripcion" label="Descripción" required></v-text-field>

            <!-- Select para Tipo de Medicamento -->
            <v-select
              v-model="editMed.tipo_insumo"
              :items="tipoInsumoOptions"
              label="Tipo de Medicamento"
              required
            ></v-select>

            <!-- Campo para Cantidad de Comprimidos -->
            <v-text-field 
              v-model.number="editMed.cantidad_comprimidos" 
              label="Cantidad Comprimidos" 
              required 
              type="number" 
              min="0"
            ></v-text-field>

            <!-- Mostrar error si falta algún campo -->
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
import { 
  getMedicamentos, 
  createMedicamento, 
  updateMedicamento, 
  deleteMedicamento 
} from "./servicios/medicamentos";

export default {
  name: "ListadoDeMedicamentos",
  data() {
    return {
      search: "",
      headers: [
        { text: "SKU", value: "sku" },
        { text: "DESCRIPCIÓN", value: "descripcion" },
      ],
      items: [],
      dialog: false,
      editDialog: false,
      tipoInsumoOptions: ["Medicamento"], // Lista de opciones para el tipo de insumo
      newMed: {
        sku: "",
        descripcion: "",
        tipo_insumo: "Medicamento", // Valor predeterminado
        cantidad_comprimidos: 0,    // Preseleccionado en 0
      },
      editMed: {
        id: "",
        sku: "",
        descripcion: "",
        tipo_insumo: "Medicamento", // Valor predeterminado
        cantidad_comprimidos: null,
      },
      skuError: false,
      formError: false,
      editFormError: false,
      snackbar: false,
      snackbarMessage: '',
    };
  },
  beforeMount() {
    // Cargar medicamentos desde la API
    this.loadMedicamentos();
  },
  methods: {
    // Cargar medicamentos
    async loadMedicamentos() {
      // Llamar al servicio para obtener medicamentos directamente
      this.items = await getMedicamentos();
    },

    // Abrir diálogo para agregar medicamento
    openDialog() {
      this.dialog = true;
      this.resetErrors();
      this.newMed = {
        sku: "",
        descripcion: "",
        tipo_insumo: "Medicamento", // Valor predeterminado
        cantidad_comprimidos: 0,    // Valor predeterminado en 0
      };
    },

    closeDialog() {
      this.dialog = false;
      this.resetForm();
    },

    // Agregar nuevo medicamento
    async addMedicamento() {
      this.skuError = false;
      this.formError = false;

      // Validar campos
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

      // Verificar si el SKU ya existe
      const exists = this.items.some((item) => item.sku === this.newMed.sku);

      if (!exists) {
        try {
          // Crear el medicamento a través del servicio
          await createMedicamento(this.newMed);
          await this.loadMedicamentos(); // Recargar medicamentos después de agregar
          this.closeDialog();
        } catch (error) {
          console.error("Error al agregar el medicamento:", error);
        }
      } else {
        this.skuError = true;
      }
    },

    // Abrir diálogo de edición
    openEditDialog(item) {
      this.editMed = { ...item }; // Incluir el id para la actualización
      this.editDialog = true;
      this.resetErrors();
    },

    closeEditDialog() {
      this.editDialog = false;
      this.resetEditForm();
    },

    // Actualizar medicamento sin try/catch
    async updateMedicamento() {
      this.editFormError = false;

      // Verificar que todos los campos estén completos
      if (
        !this.editMed.sku || // El SKU debe estar, pero ya es de solo lectura
        !this.editMed.descripcion ||
        !this.editMed.tipo_insumo ||
        this.editMed.cantidad_comprimidos === null || 
        isNaN(this.editMed.cantidad_comprimidos)
      ) {
        this.editFormError = true;
        return;
      }

      try {
        // Llamar al servicio para actualizar
        await updateMedicamento(this.editMed.id, this.editMed);
        await this.loadMedicamentos(); // Recargar la lista actualizada
        this.closeEditDialog();
      } catch (error) {
        console.error("Error al actualizar el medicamento:", error);
      }
    },

    // Eliminar medicamento
    async deleteMedicamento(id) {
      try {
        await deleteMedicamento(id);
        await this.loadMedicamentos(); // Recargar después de eliminar
      } catch (error) {
        console.error("Error al eliminar el medicamento:", error);
      }
    },

    // Resetear errores
    resetErrors() {
      this.skuError = false;
      this.formError = false;
      this.editFormError = false;
    },

    // Resetear formulario de nuevo medicamento
    resetForm() {
      this.newMed = {
        sku: "",
        descripcion: "",
        tipo_insumo: "Medicamento",
        cantidad_comprimidos: 0,
      };
    },

    // Resetear formulario de edición
    resetEditForm() {
      this.editMed = {
        id: "",
        sku: "",
        descripcion: "",
        tipo_insumo: "Medicamento",
        cantidad_comprimidos: null,
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
  margin-right: 5px;
}

.headline {
  font-weight: bold;
  color: #0E3746;
}
</style>