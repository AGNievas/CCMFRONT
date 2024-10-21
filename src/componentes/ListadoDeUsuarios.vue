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

        <v-spacer></v-spacer>
        
        <v-btn @click="openDialog" class="mx-2 btn-blue">Agregar Usuario</v-btn>
      </v-card-title>

      <v-data-table
        :search="search"
        :items="usuarios"
        :headers="headers"
        hide-default-header
      >
        <template v-slot:thead>
          <thead>
            <tr>
              <th class="table-header text-start">CUIL</th>
              <th class="table-header text-start">NOMBRE COMPLETO</th>
              <th class="table-header text-start">ROL</th>
              <th class="table-header text-start">AREA?</th>
              <th class="table-header text-start"></th>
            </tr>
          </thead>
        </template>

        <template v-slot:item="{ item: usuario }">
          <tr>
            <td class="text-start">{{ usuario.cuil }}</td>
            <td class="text-start">{{ usuario.fullName }}</td>
            <td class="text-start">{{ usuario.rolId }}</td>
            <td class="text-start">{{ usuario.stockAreaId }}</td>
            <td class="text-start acciones-cell">
              <v-btn icon small color= "#0E3746" @click="openEditDialog(usuario)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon small color="red" @click="confirmDelete(usuario.id)">
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
        <v-card-text>¿Estás seguro de que deseas eliminar este usuario?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="btn-blue" text @click="closeDeleteDialog">Cancelar</v-btn>
          <v-btn class="btn-blue" text @click="deleteUsuario(confirmDeleteId)">Confirmar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Pop-up para agregar usuario -->
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Agregar Nuevo Usuario</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-text-field v-model="newUsuario.cuil" label="CUIL" required></v-text-field>
            <v-text-field v-model="newUsuario.fullName" label="Nombre Completo" required></v-text-field>

            <v-select
              v-model="newUsuario.rol"
              :items="tipoRoles"
              label="Rol"
              required

            ></v-select>

            <v-select
              v-model="newUsuario.stockAreaId"
              :items="stockAreas"
              item-title="nombre"
              item-value="id"
              label="Area"
              required

            ></v-select>

            <v-alert v-if="formError" type="error" dismissible>
              Todos los campos son obligatorios. Por favor, completa la información.
            </v-alert>

            <v-alert v-if="cuilError" type="error" dismissible>
              El CUIL ya existe. Por favor, elige otro.
            </v-alert>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="btn-blue" text @click="closeDialog">Cancelar</v-btn>
          <v-btn class="btn-blue" text @click="addUsuario">Agregar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Pop-up para editar medicamento -->
    <v-dialog v-model="editDialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Editar Usuario</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="editForm">
            <v-text-field v-model="editUsuario.cuil" label="CUIL" required></v-text-field>
            <v-text-field v-model="editUsuario.fullName" label="Nombre Completo" required></v-text-field>

            <v-select
              v-model="editUsuario.rol"
              :items="tipoRoles"
              label="Roles"
              required
            ></v-select>
            <v-select
              v-model="editUsuario.stockAreaId"
              :items="stockAreas"
              item-title="nombre"
              item-value="id"
              label="Area"
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
          <v-btn class="btn-blue" text @click="updateUsuario">Actualizar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import usuariosService from "./servicios/usuariosService.js";
import stockAreaService from "./servicios/stockAreaService.js";

export default {
  name: "ListadoDeUsuarios",
  data() {
    return {
      search: "",
      headers: [
        { text: "CUIL", value: "cuil" },
        { text: "NOMBRE COMPLETO", value: "fullname" }
      ],
      usuarios: [],
      items: [],
      dialog: false,
      editDialog: false,
      deleteDialog: false,
      confirmDeleteId: null, // ID del usuario a eliminar
      tipoRoles: ["Enfermero"],
      stockAreas:[],
      newUsuario: {
        id: "",
        cuil: "",
        fullName: "",
        rol: "",
        stockAreaId: ""
      },
      editUsuario: {
        id: "",
        cuil: "",
        fullName: "",
        rol: "",
        stockAreaId: ""
      },
      cuilError: false,
      formError: false,
      editFormError: false,
      snackbar: false,
      snackbarMessage: ''
    };
  },

  mounted() {
    this.loadUsuarios();
    this.loadStockAreas();
  },

  methods: {
    async loadUsuarios() {
      this.usuarios = await usuariosService.getAllUsuarios();
      console.log("load usuarios", this.usuarios);
    },

    async loadStockAreas() {
      this.stockAreas = await stockAreaService.getAllStockArea();
      console.log("load stockAreas", this.stockAreas);
    },

    openDialog() {
      this.dialog = true;
      this.resetErrors();
      this.newUsuario = {
        id: "",
        cuil: "",
        fullName: "",
        rol: "",
        stockAreaId: "",
      };
    },

    closeDialog() {
      this.dialog = false;
      this.resetForm();
    },

    async addUsuario() {
      this.cuilError = false;
      this.formError = false;

      if (
        !this.newUsuario.cuil ||
        !this.newUsuario.fullName ||
        this.newUsuario.rol === null ||
        this.newUsuario.stockAreaId === null
      ) {
        this.formError = true;
        return;
      }

      const exists = this.usuarios.some(
        (usuario) => usuario.cuil === this.newUsuario.cuil
      );

      if (!exists) {
        try {
          await usuariosService.createUsuario(this.newUsuario.cuil,this.newUsuario.cuil,this.newUsuario.fullName,this.newUsuario.stockAreaId);
          await this.loadUsuarios();
          this.closeDialog();
        } catch (error) {
          console.error("Error al agregar el usuario:", error);
        }
      } else {
        this.cuilError = true;
      }
    },

    openEditDialog(usuario) {
      this.editDialog = true;
      this.editUsuario = { ...usuario };
      this.resetEditErrors();
    },

    closeEditDialog() {
      this.editDialog = false;
      this.resetEditForm();
    },

    async updateUsuario() {
      this.editFormError = false;

      if (
        !this.editUsuario.cuil ||
        !this.editUsuario.fullName ||
        this.editUsuario.rol === null ||
        this.editUsuario.stockAreaId === null
      ) {
        this.editFormError = true;
        return;
      }

      try {
        await usuariosService.updateUsuario(this.editUsuario.cuil, this.editUsuario);
        await this.loadUsuarios();
        this.closeEditDialog();
      } catch (error) {
        console.error("Error al actualizar el usuario:", error);
      }
    },

    confirmDelete(cuil) {
      this.confirmDeleteId = cuil;
      this.deleteDialog = true;
    },

    closeDeleteDialog() {
      this.deleteDialog = false;
      this.confirmDeleteId = null;
    },

    async deleteUsuario(cuil) {
      try {
        await usuariosService.deleteUsuario(cuil);
        await this.loadUsuarios();
        this.closeDeleteDialog();
      } catch (error) {
        console.error("Error al eliminar el usuario:", error);
      }
    },

    resetForm() {
      this.newUsuario = {
        id: "",
        cuil: "",
        fullName: "",
        rol: "",
        stockAreaId: ""
      };
      this.cuilError = false;
      this.formError = false;
    },

    resetEditForm() {
      this.editUsuario = {
        cuil: "",
        fullName: "",
        rol: "",
        stockAreaId: ""
      };
      this.editFormError = false;
    },

    resetErrors() {
      this.cuilError = false;
      this.formError = false;
    },

    resetEditErrors() {
      this.editFormError = false;
    }
  }
};
</script>
