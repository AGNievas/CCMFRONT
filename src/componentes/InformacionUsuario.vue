<template>
  <v-container >
    <v-card >
      <v-card-title class="d-flex align-center pe-2">
        <span class="headline">Informacion de Usuario</span>
        <v-divider></v-divider>
      </v-card-title>

      <v-card-text class="text-center">
        <div v-if="usuarioActual" class="user-details">
          <v-text-field
            v-model="usuarioActual.fullNameUsuario"
            label="Nombre"
            readonl
            variant="solo"
            rounded
            dense
          ></v-text-field>

          <v-text-field
            v-model="usuarioActual.cuil"
            label="Cuil"
            readonl
            variant="solo"
            rounded
            dense
          ></v-text-field>

          <v-text-field
            v-model="usuarioActual.nombreArea"
            label="Área"
            readonl
            variant="solo"
            rounded
            dense
          ></v-text-field>

          <v-text-field
            v-model="usuarioActual.rolName"
            label="Rol"
            readonl
            variant="solo"
            rounded
            dense
            ></v-text-field>

          <v-btn @click="openEditPasswordDialog" class="btn-blue">Editar Contraseña</v-btn>
          
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
                  variant="solo"
                  rounded
                  dense
                  >
                  </v-text-field>
                  
                  <v-text-field v-model="newPassword" 
                  :type="showNewPassword ? 'text' : 'password'"
                  label="Nueva Contraseña" 
                  required
                  :append-inner-icon="showNewPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append-inner="toggleShowNewPassword"
                  variant="solo"
                  rounded
                  dense
                  >
                  </v-text-field>
                  
                  <v-text-field v-model="repeatNewPassword" 
                  :type="showRepeatNewPassword ? 'text' : 'password'"
                  label="Repetir Nueva Contraseña" 
                  required
                  :append-inner-icon="showRepeatNewPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append-inner="toggleShowRepeatNewPassword"
                  variant="solo"
                  rounded
                  dense
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
                
                <v-btn text @click="closeEditPasswordDialog" class="btn-blue">Cancelar</v-btn>
                <v-btn text @click="updatePassword" class="btn-blue">Confirmar</v-btn>
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

import usuariosService from "./servicios/usuariosService.js"; 
import { useGlobalStore } from "@/stores/global.js";

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
  mounted() {
    this.iniciarUsuario();
  },
  methods: {
    async iniciarUsuario() {
      const userLogueado = this.globalStore.getLogueado;
      
      if (userLogueado) {
        this.usuarioActual = {
          cuil: this.globalStore.getUsuarioCuil,
          usuarioId: this.globalStore.getUsuarioId,
          areaId: this.globalStore.getStockAreaId,
          nombreArea: this.globalStore.getAreaNombre,
          fullNameUsuario: this.globalStore.getFullNameUsuario,
          rolId: this.globalStore.getRolId,
          rolName: this.globalStore.getRolName,
          esAdmin: this.globalStore.getRolId === 1,
          
          
        };

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
