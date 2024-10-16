<template>
  <div>
    <v-app-bar :elevation="2" class="navbar">
      <v-app-bar-title class="headline">Control y Consumo de Medicamentos</v-app-bar-title>
    </v-app-bar>

    <v-container>
      <v-card>
        <v-card-text class="text-center">
          <v-form @submit.prevent="login">
            <v-text-field
              v-model="mail"
              label="Mail"
              required
              type="mail"
              :error-messages="mailErrors"
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

            <v-btn class="btn-blue" type="submit">Iniciar Sesión</v-btn>
          </v-form>

          <v-alert v-if="error" type="error">{{ error }}</v-alert>

          <!-- Enlace para recuperar contraseña -->
          <RouterLink to="/recuperarPassword" class="recuperar-link">recuperar contraseña</RouterLink>
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
      mail: "",
      password: "",
      error: null,
      usuarios: [],
      mailErrors: [],
      passwordErrors: [],
    };
  },
  async mounted() {
    this.usuarios = await getUsuarios();
  },
  methods: {
    validarMail() {
      var re = /\S+@\S+\.\S+/;
      return re.test(this.mail);
    },
    validateForm() {
      this.mailErrors = [];
      this.passwordErrors = [];

      if (!this.mail) {
        this.mailErrors.push("Mail es requerido.");
      } else if (!this.validarMail()) {
        this.mailErrors.push("Mail no es válido.");
      }
      if (!this.password) {
        this.passwordErrors.push("Password es requerido.");
      }

      return !this.mailErrors.length && !this.passwordErrors.length;
    },
    async login() {
      this.error = null;

      if (!this.validateForm()) {
        return;
      }

      const user = this.usuarios.find(user => user.mail === this.mail && user.password === this.password);
      if (!user) {
        this.error = "Mail o contraseña incorrectos";
        this.mail = "";
        this.password = "";
        return;
      }

      // Guardar la sesión del usuario en localStorage
      localStorage.setItem('session', 'active');
      localStorage.setItem('user', JSON.stringify(user)); // Guardar el objeto completo del usuario

      // Redireccionar a la vista Navbar usando RouterLink programáticamente
      this.$router.push('/home');
    },
  },
};
</script>

<style scoped>
</style>
