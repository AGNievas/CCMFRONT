<template>
  <div>
    <v-card class="custom-container">
      <v-card-title class="d-flex align-center pe-2">
        <v-text-field v-model="search" density="compact" label="Buscar" prepend-inner-icon="mdi-magnify" variant="solo"
          hide-details single-line class="rounded-search-bar"></v-text-field>
        <v-spacer></v-spacer>
        <v-btn @click="openAddUserDialog" class="btn-blue">Agregar Usuario</v-btn>
      </v-card-title>


      <Tabla :data="usuariosFiltradosParaVista" :headers="usuariosHeaders" :isListadoUsuarios="true" :eliminable="true"
        @edit="openEditDialog" @delete="confirmDelete" @restorePassword="confirmRestorePassword" />
    </v-card>

    <ConfirmDialog v-model="deleteDialog" :isDelete="true" title="Confirmar Eliminación"
      text="¿Estás seguro de que deseas eliminar este usuario?" @confirm="deleteUsuario" />

    <ConfirmDialog v-model="restoreDialog" title="Restaurar Contraseña"
      text="¿Estás seguro de que deseas restaurar la contraseña de este usuario?" @confirm="restorePassword" />

    <UsuarioDialog v-model="dialog" :is-editing="false" :usuario="newUsuario" @save="addUsuario" :roles="roles"
      :areas="areas" />
    <UsuarioDialog v-model="editDialog" :is-editing="true" :usuario="editUsuario" @update:usuario="editUsuario = $event"
      @save="updateUsuario" :roles="roles" :areas="areas" />
  </div>
</template>

<script>
import Tabla from './Tabla.vue';
import ConfirmDialog from './ConfirmDialog.vue';
import UsuarioDialog from './UsuarioDialog.vue';
import usuariosService from './servicios/usuariosService.js';
import { useGlobalStore } from '@/stores/global';
export default {
  name: 'ListadoDeUsuarios',
  components: {
    Tabla,
    ConfirmDialog,
    UsuarioDialog,
  },
  data() {
    return {
      search: '',
      usuarios: [],
      areas: [],
      roles: [],
      dialog: false,
      editDialog: false,
      deleteDialog: false,
      restoreDialog: false,
      confirmRestorePass: null,
      confirmDeleteId: null,
      globalStore: useGlobalStore(),
      newUsuario: { cuil: '', fullName: '', areaId: '', rolId: '' },
      editUsuario: { cuil: '', fullName: '', areaId: '', rolId: '' },
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
          nombreArea: usuario.Area.nombre,
          rolName: usuario.Rol.name,
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
        rolName: usuario.Rol.name,
        nombreArea: usuario.Area.nombre,
        id: usuario.id,
      }));


    },

  },
  async mounted() {
    this.loadUsuarios();
  },


  watch: {
    'globalStore.getAreas': {
      handler(newAreas) {
        if (newAreas.length) {
          this.areas = newAreas;
        }
      },
      immediate: true,
    },
    'globalStore.getRoles': {
      handler(newRoles) {
        if (newRoles.length) {
          this.roles = newRoles;
        }
      },
      immediate: true,
    },

  },
  methods: {

    async loadUsuarios() {
      this.usuarios = await usuariosService.getAllUsuarios();
    },
    openAddUserDialog() {
      this.dialog = true;
    },
    openEditDialog(usuario) {
      const user = this.usuarios.find(u => u.id == usuario.id)
      this.editUsuario = { ...user };
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
      this.newUsuario = { cuil: '', fullName: '', rol: '', areaId: '', rolId: '' };
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
          editUsuario.areaId,
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
      return usuario.cuil && usuario.fullName && usuario.rol !== null && usuario.areaId !== null;
    },
  },
};
</script>
