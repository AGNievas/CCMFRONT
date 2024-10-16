<template>
  <v-container class="user-info-container">
    <v-card flat>
      <v-card-title class="d-flex align-center">
        <h2>Información del Usuario</h2>
      </v-card-title>

      <v-card-text>
        <div v-if="usuarioActual" class="user-details">
          <v-text-field
            v-model="usuarioActual.name"
            label="Nombre"
            readonly
          ></v-text-field>

          <v-text-field
            v-model="usuarioActual.mail"
            label="Mail"
            readonly
          ></v-text-field>

          <v-btn @click="openEditPasswordDialog" class="mx-2">Editar Contraseña</v-btn>

          <v-dialog v-model="editPasswordDialog" persistent max-width="400px">
            <v-card>
              <v-card-title>
                <span class="headline">Editar Contraseña</span>
              </v-card-title>

              <v-card-text>
                <v-form ref="form" v-model="formValid">
                  <!-- Contraseña Actual -->
                  <v-text-field
                    v-model="currentPassword"
                    :type="showCurrentPassword ? 'text' : 'password'"
                    label="Contraseña Actual"
                    required
                  >
                    <template v-slot:append>
                      <v-icon @click="toggleShowCurrentPassword">
                        {{ showCurrentPassword ? 'mdi-eye-off' : 'mdi-eye' }}
                      </v-icon>
                    </template>
                  </v-text-field>

                  <!-- Nueva Contraseña -->
                  <v-text-field
                    v-model="newPassword"
                    :type="showNewPassword ? 'text' : 'password'"
                    label="Nueva Contraseña"
                    required
                  >
                    <template v-slot:append>
                      <v-icon @click="toggleShowNewPassword">
                        {{ showNewPassword ? 'mdi-eye-off' : 'mdi-eye' }}
                      </v-icon>
                    </template>
                  </v-text-field>

                  <!-- Repetir Nueva Contraseña -->
                  <v-text-field
                    v-model="repeatNewPassword"
                    :type="showRepeatNewPassword ? 'text' : 'password'"
                    label="Repetir Nueva Contraseña"
                    required
                  >
                    <template v-slot:append>
                      <v-icon @click="toggleShowRepeatNewPassword">
                        {{ showRepeatNewPassword ? 'mdi-eye-off' : 'mdi-eye' }}
                      </v-icon>
                    </template>
                  </v-text-field>

                  <!-- Mostrar errores si faltan campos o las contraseñas no coinciden -->
                  <v-alert v-if="formError" type="error" dismissible>
                    Todos los campos son obligatorios. Por favor, completa la información.
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
                <v-btn text @click="closeEditPasswordDialog" class="mx-2">Cancelar</v-btn>
                <v-btn text @click="updatePassword" class="mx-2">Confirmar</v-btn>
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
import { updateUsuario } from "./servicios/usuarios"; // Importa la función del servicio

export default {
  name: 'InformacionUsuario',
  data() {
    return {
      usuarioActual: null,
      editPasswordDialog: false,
      currentPassword: "",
      newPassword: "",
      repeatNewPassword: "",
      formValid: false,
      formError: false,
      passwordMismatchError: false,
      currentPasswordError: false,
      showCurrentPassword: false, // Para alternar visibilidad de la contraseña actual
      showNewPassword: false, // Para alternar visibilidad de la nueva contraseña
      showRepeatNewPassword: false, // Para alternar visibilidad de repetir contraseña
    };
  },
  mounted() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      this.usuarioActual = user;
    }
  },
  methods: {
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

      // Verificar que todos los campos estén completos
      if (!this.currentPassword || !this.newPassword || !this.repeatNewPassword) {
        this.formError = true;
        return;
      }

      // Verificar que la contraseña actual sea correcta
      if (this.currentPassword !== this.usuarioActual.password) {
        this.currentPasswordError = true;
        return;
      }

      // Verificar que las nuevas contraseñas coincidan
      if (this.newPassword !== this.repeatNewPassword) {
        this.passwordMismatchError = true;
        return;
      }

      try {
        const updatedUser = {
          ...this.usuarioActual,
          password: this.newPassword,
        };

        // Actualizar el usuario a través del servicio
        await updateUsuario(this.usuarioActual.id, updatedUser);

        // Guardar los cambios en localStorage
        localStorage.setItem('user', JSON.stringify(updatedUser));

        alert("Contraseña actualizada con éxito.");
        this.closeEditPasswordDialog();
      } catch (error) {
        console.error("Error al actualizar la contraseña:", error);
        alert("Ocurrió un error al actualizar la contraseña.");
      }
    },
    resetErrors() {
      this.formError = false;
      this.passwordMismatchError = false;
      this.currentPasswordError = false;
    },
    // Métodos para alternar la visibilidad de las contraseñas
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
.user-info-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

.v-card-title {
  font-size: 24px;
  color: #0E3746;
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.v-card {
  border: 1px solid #d9dcd1;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border-radius: 16px;
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
