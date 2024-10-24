<template>
  <v-container class="v-container">
    <v-card flat>
      <v-card-title class="d-flex align-center">
        <h2>Información del Usuario</h2>
      </v-card-title>

      <v-card-text>
        <div v-if="usuarioActual" class="user-details">
          <v-text-field v-model="usuarioActual.fullNameUsuario" label="Nombre" readonly></v-text-field>

          <v-text-field v-model="usuarioActual.cuil" label="Cuil" readonly></v-text-field>

          <v-text-field v-model="usuarioActual.nombreArea" label="Área" readonly></v-text-field>

          <v-text-field v-model="usuarioActual.rolName" label="Rol" readonly></v-text-field>

          <v-btn @click="openEditPasswordDialog" class="btn-blue mx-2">Editar Contraseña</v-btn>

          <!-- Diálogo de edición de contraseña (código correcto, no modificado) -->
          <v-dialog v-model="editPasswordDialog" persistent max-width="400px">
            <v-card>
              <v-card-title>
                <span class="headline">Editar Contraseña</span>
              </v-card-title>

              <v-card-text>
                <v-form ref="form" v-model="formValid">
                  <!-- Contraseña Actual -->
                  <v-text-field v-model="currentPassword" :type="showCurrentPassword ? 'text' : 'password'"
                    label="Contraseña Actual" required>
                    <template v-slot:append>
                      <v-icon @click="toggleShowCurrentPassword">
                        {{ showCurrentPassword ? 'mdi-eye-off' : 'mdi-eye' }}
                      </v-icon>
                    </template>
                  </v-text-field>

                  <!-- Nueva Contraseña -->
                  <v-text-field v-model="newPassword" :type="showNewPassword ? 'text' : 'password'"
                    label="Nueva Contraseña" required>
                    <template v-slot:append>
                      <v-icon @click="toggleShowNewPassword">
                        {{ showNewPassword ? 'mdi-eye-off' : 'mdi-eye' }}
                      </v-icon>
                    </template>
                  </v-text-field>

                  <!-- Repetir Nueva Contraseña -->
                  <v-text-field v-model="repeatNewPassword" :type="showRepeatNewPassword ? 'text' : 'password'"
                    label="Repetir Nueva Contraseña" required>
                    <template v-slot:append>
                      <v-icon @click="toggleShowRepeatNewPassword">
                        {{ showRepeatNewPassword ? 'mdi-eye-off' : 'mdi-eye' }}
                      </v-icon>
                    </template>
                  </v-text-field>

                  <!-- Mostrar errores si faltan campos o las contraseñas no coinciden -->
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
import usuariosService from "./servicios/usuariosService.js"; // Importamos el servicio para los roles
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
          console.log(this.usuarioActual.usuarioId)
          const usuarioNombre = await usuariosService.getUsuarioById(this.usuarioActual.usuarioId)
          this.usuarioActual.fullNameUsuario = usuarioNombre.fullName
          console.log("oa")
          const areaResponse = await stockAreaService.getStockAreaById(this.usuarioActual.stockAreaId);
          this.usuarioActual.nombreArea = areaResponse.nombre;
          console.log(areaResponse.nombre)
          // Obtener el nombre del rol
          const rolResponse = await rolService.getRolById(this.usuarioActual.rolId);
          console.log(rolResponse,"aca'?")
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

<style scoped>
.v-container {
  max-width: 900px !important;
  padding: 20px !important;
}
</style>
