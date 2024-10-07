<template>
  <div>
    <v-app-bar :elevation="2" style="background-color: #A3DEC3;">
      <v-app-bar-title class="app-bar-title">Control y Consumo de Medicamentos</v-app-bar-title>
    </v-app-bar>

    <v-container>
      <v-card>
        <v-card-text>
          <v-form @submit.prevent="login">
            <v-text-field
              v-model="email"
              label="Email"
              required
              type="email"
              :error-messages="emailErrors"
              style="border: none; box-shadow: none;"
            ></v-text-field>
            <v-text-field
              v-model="password"
              label="Password"
              required
              type="password"
              :error-messages="passwordErrors"
              style="border: none; box-shadow: none;"
            ></v-text-field>

            <v-btn type="submit">Iniciar Sesión</v-btn>
          </v-form>
          <v-alert v-if="error" type="error">{{ error }}</v-alert>
          <v-alert v-if="success" type="success">{{ successMessage }}</v-alert>

          <a @click="$router.push('/recuperar-password')" class="recuperar-link">recuperar contraseña</a>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import { getUsuarios } from "./servicios/usuarios";

export default {
  data() {
    return {
      email: "",
      password: "",
      error: null,
      success: false,
      successMessage: "",
      usuarios: [],
      emailErrors: [],
      passwordErrors: []
    };
  },
  async mounted() {
    this.usuarios = await getUsuarios();
  },
  methods: {
    validarEmail() {
      var re = /\S+@\S+\.\S+/;
      return re.test(this.email);
    },
    validateForm() {
      this.emailErrors = [];
      this.passwordErrors = [];

      if (!this.email) {
        this.emailErrors.push("Email es requerido.");
      } else if (!this.validarEmail()) {
        this.emailErrors.push("Email no es válido.");
      }
      if (!this.password) {
        this.passwordErrors.push("Password es requerido.");
      }

      return !this.emailErrors.length && !this.passwordErrors.length;
    },
    async login() {
      this.error = null;
      this.success = false;

      if (!this.validateForm()) {
        return;
      }

      const user = this.usuarios.find(user => user.email === this.email && user.password === this.password);
      if (!user) {
        this.error = "Email o contraseña incorrectos";
        this.email = "";
        this.password = "";
        return;
      }

      localStorage.setItem('session', 'active');
      localStorage.setItem('user', JSON.stringify({ id: user.id }));

      this.success = true;
      this.successMessage = "Inicio de sesión exitoso";
      this.$router.push('/navbar');
    }
  }
};
</script>

<style scoped>
.v-container {
  max-width: 500px;
  margin: 0 auto;
  padding-top: 150px; 
}

.v-card {
  padding: 40px 20px;
  border-radius: 16px;
  background-color: white;
  border: 1px solid #d9dcd1;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}
.app-bar-title {
  font-weight: bold;
  color: #0E3746;
}

.recuperar-link {
  display: block;
  font-size: 14px;
  color: #5c4dff;
  text-decoration: none;
  cursor: pointer;
  margin-top: 20px;
}

.v-btn {
  text-transform: none; 
  background-color: #0E3746;
  color: white;
}
</style>
