<template>
  <div>
    <v-app-bar :elevation="2" class="navbar">
      <v-app-bar-title class="headline">Control y Consumo de Medicamentos</v-app-bar-title>
    </v-app-bar>

    <v-container>
      <v-card>
        <v-card-text class="text-center">
          <v-form @submit.prevent="login">
            <v-text-field v-model="formData.cuil" placeholder="CUIL" label="CUIL" required type="text"
              :error-messages="cuilErrors" style="border: none; box-shadow: none;"
              @input="formData.cuil = formatearCuil(formData.cuil)"></v-text-field>
            <v-text-field v-model="formData.password" label="Password" required type="password"
              :error-messages="passwordErrors" style="border: none; box-shadow: none;"></v-text-field>

            <v-btn class="btn-blue" type="submit">Iniciar Sesión</v-btn>
          </v-form>
          <br>

          <v-card-text v-if="error" style="color: red; font-weight: bold;">{{ error }}</v-card-text>
          <!-- <v-alert v-if="error" type="error" dense icon="mdi-alert-circle-outline" elevation="1" rounded outlined>{{ error }}</v-alert> -->
          <RouterLink to="/recuperarPassword" class="recuperar-link">recuperar contraseña</RouterLink>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import loginService from "./servicios/loginService";

export default {
  data() {
    return {
      formData: {
        cuil: "",
        password: "",
      },
      error: null,
      cuilErrors: [],
      passwordErrors: [],
    };
  },
  methods: {
    validateForm() {
      this.cuilErrors = [];
      this.passwordErrors = [];

      if (!this.formData.cuil) {
        this.cuilErrors.push("CUIL es requerido.");
      } else if (!this.validarCuil()) {
        this.cuilErrors.push("CUIL no es válido. Debe tener el formato 20-12345678-9.");
      }

      if (!this.formData.password) {
        this.passwordErrors.push("Password es requerido.");
      }

      return !this.cuilErrors.length && !this.passwordErrors.length;
    },

    validarCuil() {
      const re = /^\d{2}-\d{8}-\d{1}$/;
      return re.test(this.formData.cuil);
    },

    formatearCuil(cuil) {
      let cleanedCuil = cuil.replace(/[^\d]/g, '');
      let formattedCuil = '';

      if (cleanedCuil.length > 0) {
        formattedCuil += cleanedCuil.slice(0, 2);
      }
      if (cleanedCuil.length > 2) {
        formattedCuil += '-' + cleanedCuil.slice(2, 10);
      }
      if (cleanedCuil.length > 10) {
        formattedCuil += '-' + cleanedCuil.slice(10, 11);
      }

      return formattedCuil;
    },

    async login() {
      if (!this.validateForm()) {
        this.error = "Por favor, corrige los errores antes de continuar.";
        return;
      }

      try {
        const { cuil, password } = this.formData;
        await loginService.login(cuil, password);
        this.resetearFormulario();
        localStorage.setItem('session', 'active');
        this.$router.push('/home');
      } catch (error) {
        this.error = error;
      }
    },

    resetearFormulario() {
      this.formData = {
        cuil: '',
        password: '',
      };
    },
  },
};
</script>

<style scoped>

.custom-alert {
  max-height: 60px;
  overflow-y: auto; 
  margin-bottom: 10px;
}


v-card-text {
  min-height: 150px; 
}

.btn-blue {
  margin-top: 20px; 
}
</style>
