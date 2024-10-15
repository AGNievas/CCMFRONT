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

          <v-text-field
            v-model="usuarioActual.password"
            label="Contraseña"
            type="password"
            readonly
          ></v-text-field>

          <v-btn @click="openEditPasswordDialog" color="primary">Editar Contraseña</v-btn>

          <v-dialog v-model="editPasswordDialog" persistent max-width="400px">
            <v-card>
              <v-card-title>
                <span class="headline">Editar Contraseña</span>
              </v-card-title>

              <v-card-text>
                <v-form ref="form" v-model="formValid">
                  <v-text-field
                    v-model="currentPassword"
                    label="Contraseña Actual"
                    type="password"
                    required
                  ></v-text-field>
                  <v-text-field
                    v-model="newPassword"
                    label="Nueva Contraseña"
                    type="password"
                    required
                  ></v-text-field>
                  <v-text-field
                    v-model="repeatNewPassword"
                    label="Repetir Nueva Contraseña"
                    type="password"
                    required
                  ></v-text-field>
                </v-form>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click="closeEditPasswordDialog">Cancelar</v-btn>
                <v-btn text @click="updatePassword">Confirmar</v-btn>
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
    },
    closeEditPasswordDialog() {
      this.editPasswordDialog = false;
    },
    async updatePassword() {
      if (!this.currentPassword || !this.newPassword || !this.repeatNewPassword) {
        alert("Todos los campos son obligatorios.");
        return;
      }

      if (this.currentPassword !== this.usuarioActual.password) {
        alert("La contraseña actual es incorrecta.");
        return;
      }

      if (this.newPassword !== this.repeatNewPassword) {
        alert("Las nuevas contraseñas no coinciden.");
        return;
      }

      try {
        const updatedUser = {
          ...this.usuarioActual,
          password: this.newPassword,
        };

        // Llama al servicio para actualizar el usuario
        await updateUsuario(this.usuarioActual.id, updatedUser);
        
        // Actualiza el usuario en localStorage
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        alert("Contraseña actualizada con éxito.");
        this.closeEditPasswordDialog();
      } catch (error) {
        console.error("Error al actualizar la contraseña:", error);
        alert("Ocurrió un error al actualizar la contraseña.");
      }
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
  border-bottom: 1px solid #E0E0E0;
  margin-bottom: 16px;
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
</style>
