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
        <v-spacer></v-spacer>
        <v-btn @click="openAddUserDialog" class="btn-blue">Agregar Usuario</v-btn>
      </v-card-title>

      
      <Listado
        :items="usuariosFiltradosParaVista"
        :headers="usuariosHeaders"
        :showRestorePassword="true"
        :isListadoUsuarios="true"
        @edit="openEditDialog"
        @delete="confirmDelete"
        @restorePassword="confirmRestorePassword"
      />
    </v-card>
  
    <ConfirmDialog
      v-model="deleteDialog"
      :isDelete="true"
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
import Listado from './Listado.vue';
import ConfirmDialog from './ConfirmDialog.vue';
import UsuarioDialog from './UsuarioDialog.vue';
import usuariosService from './servicios/usuariosService.js';
import stockAreaService from './servicios/stockAreaService.js';
import rolService from './servicios/rolService';
export default {
  name: 'ListadoDeUsuarios',
  components: {
    Listado,
    ConfirmDialog,
    UsuarioDialog,
  },
  data() {
    return {
      search: '',
      usuarios: [],
      stockAreas: [],
      roles: [],
      dialog: false,
      editDialog: false,
      deleteDialog: false,
      restoreDialog: false,
      confirmRestorePass: null,
      confirmDeleteId: null,
      newUsuario: { cuil: '', fullName: '', stockAreaId: '', rolId: '' },
      editUsuario: { cuil: '', fullName: '', stockAreaId: '', rolId: '' },
    };
  },
  computed: {
    usuariosHeaders() {
      return [
        { text: 'CUIL', value: 'cuil' },
        { text: 'Nombre Completo', value: 'fullName' },
        { text: 'Rol', value: 'rolName' },
        { text: 'Área', value: 'nombreArea' },
        { text: '', value: 'acciones', sortable: false },
      ];
    },
    usuariosConArea() {
      const searchTrimmed = this.search.trim().toLowerCase();
      return [...this.usuarios]
        .map(usuario => ({
          ...usuario,
          nombreArea: this.getNombreArea(usuario.stockAreaId),
          rolName: this.getNombreRol(usuario.rolId),
        }))
        .filter(usuario => {
          const cuilMatches = usuario.cuil.toLowerCase().includes(searchTrimmed);
          const nameMatches = usuario.fullName.toLowerCase().includes(searchTrimmed);
          return cuilMatches || nameMatches;
        });
    },
    usuariosFiltradosParaVista() {
      return this.usuariosConArea.map(usuario => ({
        cuil: usuario.cuil,
        fullName: usuario.fullName,
        rolName: this.getNombreRol(usuario.rolId), 
        nombreArea: this.getNombreArea(usuario.stockAreaId), 
        id: usuario.id, 
  }));
},
  },
  async mounted() {
    this.loadUsuarios();
    this.loadStockAreas();
    this.loadRols();
 
  },
  methods: {
    async loadRols() {
      this.roles = await rolService.getAllRol();
    },
    async loadUsuarios() {
      this.usuarios = await usuariosService.getAllUsuarios();
    },
    async loadStockAreas() {
      this.stockAreas = await stockAreaService.getAllStockArea();
    },
    getNombreArea(stockAreaId) {
      const area = this.stockAreas.find(area => area.id === stockAreaId);
      return area ? area.nombre : 'Área no encontrada';
    },
    getNombreRol(rolId) {
      const rol = this.roles.find(rol => rol.id === rolId);
      return rol ? rol.name : 'Rol no encontrado';
    },
    openAddUserDialog() {
      this.dialog = true;
    },
    openEditDialog(usuario) {
      this.editUsuario = { ...usuario };
      this.editDialog = true;
    },
    confirmDelete(id) {
      this.confirmDeleteId = id;
      this.deleteDialog = true;
    },
    confirmRestorePassword(usuario) {
      this.confirmRestorePass = usuario;
      this.restoreDialog = true;
    },
    async addUsuario(newUsuario) {
      if (!this.validarFormulario(newUsuario)) {
        this.formError = true;
        return;
      }
      try {
        await usuariosService.createUsuario(newUsuario);
        await this.loadUsuarios();
        this.dialog = false;
        this.resetNewUsuario();
      } catch (error) {
        console.error('Error al agregar el usuario:', error);
      }
    },
    resetNewUsuario() {
      this.newUsuario = { cuil: '', fullName: '', rol: '', stockAreaId: '', rolId: '' };
      this.formError = false;
    },
    async updateUsuario(editUsuario) {
      if (!this.validarFormulario(editUsuario)) {
        this.editFormError = true;
        return;
      }
      try {
        await usuariosService.updateUsuario(
          editUsuario.id,
          editUsuario.cuil,
          editUsuario.fullName,
          editUsuario.stockAreaId,
          editUsuario.rolId
        );
        await this.loadUsuarios();
        this.editDialog = false;
      } catch (error) {
        console.error('Error al actualizar el usuario:', error);
      }
    },
    async deleteUsuario() {
      try {
        await usuariosService.deleteUsuario(this.confirmDeleteId);
        await this.loadUsuarios();
        this.deleteDialog = false;
      } catch (error) {
        console.error('Error al eliminar el usuario:', error);
      }
    },
    async restorePassword() {
      try {
        await usuariosService.restorePassword(this.confirmRestorePass);
        await this.loadUsuarios();
        this.restoreDialog = false;
      } catch (error) {
        console.error('Error al restaurar la contraseña del usuario:', error);
      }
    },
    validarFormulario(usuario) {
      return usuario.cuil && usuario.fullName && usuario.rol !== null && usuario.stockAreaId !== null;
    },
  },
};
</script>
