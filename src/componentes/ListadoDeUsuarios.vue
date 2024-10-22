<template>
  <div>
    <v-card class="custom-container">
      <v-card-title class="d-flex align-center pe-2">
        <v-text-field v-model="search" density="compact" label="Buscar" prepend-inner-icon="mdi-magnify" variant="solo" hide-details single-line class="rounded-search-bar"></v-text-field>
        <v-spacer></v-spacer>
        <v-btn @click="openAddUserDialog" class="mx-2 btn-blue">Agregar Usuario</v-btn>
      </v-card-title>

      
      <v-data-table :items="usuariosConArea" :headers="headers" hide-default-header>
        <template v-slot:thead>
          <thead>
            <tr>
              <th class="table-header text-start">CUIL</th>
              <th class="table-header text-start">NOMBRE COMPLETO</th>
              <th class="table-header text-start">ROL</th>
              <th class="table-header text-start">AREA</th>
              <th class="table-header text-start"></th>
            </tr>
          </thead>
        </template>

        <template v-slot:item="{ item: usuario }">
          <tr>
            <td class="text-start">{{ usuario.cuil }}</td>
            <td class="text-start">{{ usuario.fullName }}</td>
            <td class="text-start">{{ usuario.rolName }}</td>
            <td class="text-start">{{ usuario.nombreArea }}</td>
            <td class="text-start acciones-cell">
              <v-btn icon small color="#0E3746" @click="openEditDialog(usuario)"><v-icon>mdi-pencil</v-icon></v-btn>
              <v-btn icon small color="#0E3746" @click="confirmRestorePassword(usuario)"><v-icon>mdi-cached</v-icon></v-btn>
              <v-btn icon small color="red" @click="confirmDelete(usuario.id)"><v-icon>mdi-delete</v-icon></v-btn>
            </td>
          </tr>
        </template>
      </v-data-table>

    
    
    </v-card>

   
    <ConfirmDialog
      v-model="deleteDialog"
      title="Confirmar Eliminación"
      text="¿Estás seguro de que deseas eliminar este usuario?"
      @confirm="deleteUsuario"
    />
    <ConfirmDialog
      v-model="restoreDialog"
      title="Restaurar Contraseña"
      text="¿Estás seguro de que deseas restaurar la contraseña de este usuario?"
      @confirm="restorePassword"
    />
    
    
    <UsuarioDialog 
  v-model="dialog" 
  :is-editing="false" 
  :usuario="newUsuario"   
  @save="addUsuario" 
  :roles="roles" 
  :areas="stockAreas" 
/>

<UsuarioDialog 
    v-model="editDialog" 
    :is-editing="true" 
    :usuario="editUsuario" 
    @update:usuario="editUsuario = $event"
    @save="updateUsuario" 
    :roles="roles" 
    :areas="stockAreas" 
  />
  </div>
</template>

<script>
import ConfirmDialog from './ConfirmDialog.vue';
import UsuarioDialog from './UsuarioDialog.vue';
import usuariosService from './servicios/usuariosService.js';
import stockAreaService from './servicios/stockAreaService.js';
import rolService from './servicios/rolService';


export default {
  name: "ListadoDeUsuarios",
  components: {
    ConfirmDialog,
    UsuarioDialog,
  },
  data() {
    return {
      search: "",
      headers: [
        { text: "CUIL", value: "cuil" },
        { text: "NOMBRE COMPLETO", value: "fullname" }
      ],
      usuarios: [],
      stockAreas: [],
      roles:[],
      dialog: false,         
      editDialog: false,    
      deleteDialog: false,  
      restoreDialog: false,  
      confirmRestorePass: null,
      confirmDeleteId: null,
      newUsuario: { cuil: "", fullName: "", stockAreaId: "", rolId:"" },
      editUsuario: { cuil: "", fullName: "", stockAreaId: "" , rolId:""},
      cuilError: false,
      formError: false,
      editFormError: false,
      snackbar: false,
      snackbarMessage: ''
    };
  },

  computed: {
    usuariosConArea() {
    const searchTrimmed = this.search.trim().toLowerCase();
    
    return [...this.usuarios] 
      .map(usuario => ({
        ...usuario,
        nombreArea: this.getNombreArea(usuario.stockAreaId),
        rolName: this.getNombreRol(usuario.rolId)
      }))
      .filter(usuario => {
        const cuilMatches = usuario.cuil.toLowerCase().includes(searchTrimmed);
        const nameMatches = usuario.fullName.toLowerCase().includes(searchTrimmed);

        return cuilMatches || nameMatches;
      });
  }
  },

  mounted() {
    this.loadUsuarios();
    this.loadStockAreas();
    this.loadRols();
  },

  methods: {
    
    async loadRols(){
      this.roles = await rolService.getAllRol();
    },

    // Método para cargar la lista de usuarios
    async loadUsuarios() {
      this.usuarios = await usuariosService.getAllUsuarios();
    },

    // Método para cargar las áreas
    async loadStockAreas() {
      this.stockAreas = await stockAreaService.getAllStockArea();
    },

    // Obtener nombre de área
    getNombreArea(stockAreaId) {
      const area = this.stockAreas.find(area => area.id === stockAreaId);
      return area ? area.nombre : 'Área no encontrada';
    },

    getNombreRol(rolId){
      const rol = this.roles.find(rol => rol.id === rolId);
      return rol ? rol.name : 'Rol no encontrado';
    },

    // Abrir el diálogo de agregar usuario
    openAddUserDialog() {
      this.dialog = true;
    },

    // Abrir el diálogo de edición de usuario
    openEditDialog(usuario) {
      this.editUsuario = { ...usuario };
      this.editDialog = true;
    },

    // Confirmar eliminación de usuario
    confirmDelete(cuil) {
      this.confirmDeleteId = cuil;
      this.deleteDialog = true;
    },

    // Confirmar restauración de contraseña
    confirmRestorePassword(usuario) {
      this.confirmRestorePass = usuario;
      this.restoreDialog = true;
    },

    // Método para agregar usuario
    async addUsuario(newUsuario) {
      console.log(newUsuario, "nuevo user")
  if (!this.validarFormulario(newUsuario)) {
    this.formError = true;
    return;
  }

  try {
    console.log(newUsuario, "usuarionuevito")
    await usuariosService.createUsuario(
     newUsuario
    );

    await this.loadUsuarios();
    this.dialog = false; // Cerrar diálogo
    this.resetNewUsuario();
  } catch (error) {
    console.error('Error al agregar el usuario:', error);
  }
},


    // Método para resetear el formulario de nuevo usuario
    resetNewUsuario() {
      this.newUsuario = { cuil: "", fullName: "", rol: "", stockAreaId: "", rolId:"" };
      this.formError = false;
    },

    // Método para actualizar usuario
    async updateUsuario(editUsuario) {
      // Validar el formulario antes de actualizar
      if (!this.validarFormulario(editUsuario)) {
        this.editFormError = true;
        return;
      }

      console.log(editUsuario,"editanding")
      try {
        // Llamar al servicio de actualización del usuario
        await usuariosService.updateUsuario(
          editUsuario.id,
          editUsuario.cuil,
          editUsuario.fullName,
          editUsuario.stockAreaId,
          editUsuario.rolId
        );

        // Recargar la lista de usuarios y cerrar el diálogo
        await this.loadUsuarios();
        this.editDialog = false;
      
      } catch (error) {
        console.error("Error al actualizar el usuario:", error);
      }
    },

    // Método para eliminar usuario
    async deleteUsuario() {
      try {
        await usuariosService.deleteUsuario(this.confirmDeleteId);
        await this.loadUsuarios();
        this.deleteDialog = false; // Cerrar diálogo de eliminación
      } catch (error) {
        console.error("Error al eliminar el usuario:", error);
      }
    },

    // Método para restaurar contraseña
    async restorePassword() {
      try {
        await usuariosService.restorePassword(this.confirmRestorePass);
        await this.loadUsuarios();
        this.restoreDialog = false; // Cerrar diálogo de restaurar contraseña
      } catch (error) {
        console.error("Error al restaurar la contraseña del usuario:", error);
      }
    },

    // Validar formulario
    validarFormulario(usuario) {
      return usuario.cuil && usuario.fullName && usuario.rol !== null && usuario.stockAreaId !== null;
    }
  }
};
</script>
