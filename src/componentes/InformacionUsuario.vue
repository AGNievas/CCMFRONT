<template>
  <v-container >
    <v-card >
      <v-card-title class="d-flex align-center">
        <h3>Información del Usuario</h3>
      </v-card-title>

      <v-card-text class="text-center">
        <div v-if="usuarioActual" class="user-details">
          <v-text-field v-model="usuarioActual.fullNameUsuario" label="Nombre" readonly></v-text-field>
          <v-text-field v-model="usuarioActual.cuil" label="Cuil" readonly></v-text-field>
          <v-text-field v-model="usuarioActual.nombreArea" label="Área" readonly></v-text-field>
          <v-text-field v-model="usuarioActual.rolName" label="Rol" readonly></v-text-field>
          <v-btn @click="openEditPasswordDialog" class="btn-blue mx-2">Editar Contraseña</v-btn>

          <v-dialog v-model="editPasswordDialog" persistent max-width="400px">
            <v-card>
              <v-card-title>
                <span class="headline">Editar Contraseña</span>
              </v-card-title>

              <v-card-text>
                <v-form ref="form" v-model="formValid">
                  <v-text-field 
                  v-model="currentPassword" 
                  :type="showCurrentPassword ? 'text' : 'password'"
                  label="Contraseña Actual" 
                  required
                  :append-inner-icon="showCurrentPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append-inner="toggleShowCurrentPassword"
                  >
                  </v-text-field>

                  <v-text-field v-model="newPassword" 
                  :type="showNewPassword ? 'text' : 'password'"
                  label="Nueva Contraseña" 
                  required
                  :append-inner-icon="showNewPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append-inner="toggleShowNewPassword"
                  >
                  </v-text-field>

                  <v-text-field v-model="repeatNewPassword" 
                  :type="showRepeatNewPassword ? 'text' : 'password'"
                  label="Repetir Nueva Contraseña" 
                  required
                  :append-inner-icon="showRepeatNewPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append-inner="toggleShowRepeatNewPassword"
                  >
                  </v-text-field>

                  <v-alert v-if="formError" type="error" dismissible>
                    {{ errorMessage }}
                  </v-alert>
                  <v-alert v-if="passwordMismatchError" type="error" dismissible>
                    Las nuevas contraseñas no coinciden. Por favor, inténtalo de nuevo.
                  </v-alert>
                  <v-alert v-if="currentPasswordError" type="error" dismissible>
                    La contraseña actual es incorrecta. Inténtalo nuevamente.
                  </v-alert>
                </v-form>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click="closeEditPasswordDialog" class="btn-blue mx-2">Cancelar</v-btn>
                <v-btn text @click="updatePassword" class="btn-blue mx-2">Confirmar</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </div>
        <div v-else>
          <p>No hay información del usuario disponible.</p>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import stockAreaService from "./servicios/stockAreaService.js";
import usuariosService from "./servicios/usuariosService.js"; 
import { useGlobalStore } from "@/stores/global.js";
import rolService from "./servicios/rolService.js";
export default {
  name: 'InformacionUsuario',
  data() {
    return {
      usuarioActual: {
        cuil: null,
        usuarioId: null,
        stockAreaId: null,
        fullNameUsuario: null,
        rolId: null,
        esAdmin: false,
        nombreArea: "",
        rolName: ""
      },
      errorMessage: "",
      editPasswordDialog: false,
      currentPassword: "",
      newPassword: "",
      repeatNewPassword: "",
      formValid: false,
      formError: false,
      passwordMismatchError: false,
      currentPasswordError: false,
      showCurrentPassword: false,
      showNewPassword: false,
      showRepeatNewPassword: false,
      globalStore: useGlobalStore(),
    };
  },
  beforeMount() {
    this.iniciarUsuario();
  },
  methods: {
    async iniciarUsuario() {
      const userLogueado = this.globalStore.getLogueado;
      
      if (userLogueado) {
        this.usuarioActual = {
          cuil: this.globalStore.getUsuarioCuil,
          usuarioId: this.globalStore.getUsuarioId,
          stockAreaId: this.globalStore.getStockAreaId,
          fullNameUsuario: this.globalStore.getfullNameUsuario,
          rolId: this.globalStore.getRolId,
          esAdmin: this.globalStore.getRolId === 1,
          nombreArea: '',
          rolName: ''
        };
        try {
          const usuarioNombre = await usuariosService.getUsuarioById(this.usuarioActual.usuarioId)
          this.usuarioActual.fullNameUsuario = usuarioNombre.fullName
          const areaResponse = await stockAreaService.getStockAreaById(this.usuarioActual.stockAreaId);
          this.usuarioActual.nombreArea = areaResponse.nombre;
          const rolResponse = await rolService.getRolById(this.usuarioActual.rolId);
          this.usuarioActual.rolName = rolResponse.name;
        } catch (error) {
          console.error("Error al cargar el área o rol del usuario", error);
        }
      }
    },
    openEditPasswordDialog() {
      this.editPasswordDialog = true;
      this.currentPassword = "";
      this.newPassword = "";
      this.repeatNewPassword = "";
      this.resetErrors();
    },
    closeEditPasswordDialog() {
      this.editPasswordDialog = false;
      this.resetErrors();
    },
    async updatePassword() {
      this.resetErrors();
      if (!this.currentPassword || !this.newPassword || !this.repeatNewPassword) {
        this.formError = true;
        return;
      }
      if (this.newPassword !== this.repeatNewPassword) {
        this.passwordMismatchError = true;
        return;
      }
      try {
        await usuariosService.updatePassword(this.usuarioActual.usuarioId, this.currentPassword, this.newPassword);
        this.closeEditPasswordDialog();
      } catch (error) {
        this.formError = true;
        this.errorMessage = error;
      }
    },
    resetErrors() {
      this.formError = false;
      this.passwordMismatchError = false;
      this.currentPasswordError = false;
      this.errorMessage = "";
    },
    toggleShowCurrentPassword() {
      this.showCurrentPassword = !this.showCurrentPassword;
    },
    toggleShowNewPassword() {
      this.showNewPassword = !this.showNewPassword;
    },
    toggleShowRepeatNewPassword() {
      this.showRepeatNewPassword = !this.showRepeatNewPassword;
    },
  },
};
</script>
