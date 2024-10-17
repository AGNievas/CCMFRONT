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

          <v-alert v-if="error" type="error">{{ error }}</v-alert>

          <!-- Enlace para recuperar contraseña -->
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

      // cuil: "",
      // password: "",
      // error: null,

      cuilErrors: [],
      passwordErrors: [],
    };
  },
  async mounted() {

  },
  methods: {
  validateForm() {
    this.cuilErrors = [];
    this.passwordErrors = [];

    if (!this.formData.cuil) {
      this.cuilErrors.push("CUIL es requerido.");
    } else if (!this.validarCuil()) {
      this.cuilErrors.push("CUIL no es válido.");
    }
    if (!this.formData.password) {
      this.passwordErrors.push("Password es requerido.");
    }

    return !this.cuilErrors.length && !this.passwordErrors.length;
  },

  validarCuil() {
    var re = /^\d{2}-\d{8}-\d{1}$/;  // Definimos el regex que valida el formato CUIL.
    const formattedCuil = this.formData.cuil.replace(/(\d{2})(\d{8})(\d{1})/, '$1-$2-$3');
    return re.test(formattedCuil);
  },

  formatearCuil(cuil) {
    // Se asegura de mantener el formato correcto mientras el usuario ingresa los dígitos
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
    if (!this.validarCuil() || !this.validateForm()) {
      return;
    }
    try {
      const { cuil, password } = this.formData;
      console.log("login front", cuil, password)
      await loginService.login(cuil, password);
      // const { nameUsuario, stockAreaId, rolId, usuarioId } = 
      this.resetearFormulario();
      // this.globalStore.setUsuario(nameUsuario, stockAreaId, rolId, usuarioId);
      console.log('login exitoso');
    } catch (error) {
      this.error = "Hubo un error al intentar iniciar sesión";
    }

    
    localStorage.setItem('session', 'active');
    console.log(localStorage)
      // Guardar el objeto completo del usuario
    this.$router.push('/home');
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

<style scoped></style>
