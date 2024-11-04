<template>
    <v-container>
      <v-card>
        <v-card-text class="text-center">
          <v-form @submit.prevent="login">
            <v-text-field v-model="formData.cuil" placeholder="CUIL" label="CUIL" required type="text"
              :error-messages="cuilErrors"
              @input="formData.cuil = formatearCuil(formData.cuil)"></v-text-field>
            <v-text-field 
            v-model="formData.password" 
            label="Password" 
            required 
            :type="showPassword ? 'text' : 'password'"
            :error-messages="passwordErrors"
            :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append-inner="toggleShowPassword"
            ></v-text-field>

            <v-btn class="btn-blue" type="submit">Iniciar Sesión</v-btn>
          </v-form>
          <br>

          <v-alert v-if="error" type="error" dense icon="mdi-alert-circle-outline" elevation="1" rounded outlined>{{ error }}</v-alert>
          <RouterLink to="/recuperarPassword" class="recuperar-link">recuperar contraseña</RouterLink>
        </v-card-text>
      </v-card>
    </v-container>
  
</template>

<script>
import loginService from "./servicios/loginService";
import { useGlobalStore } from "@/stores/global";
import  parsearCuil  from '@/utils/parsearCuil';
import stockAreaService from "./servicios/stockAreaService";
import usuariosService from "./servicios/usuariosService";
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
      globalStore: useGlobalStore(),
      showPassword: false,
    };
  },
  methods: {
    toggleShowPassword() {
      this.showPassword = !this.showPassword;
    },
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

    formatearCuil(cuil){
      return parsearCuil.formatearCuil(cuil)
    },

    async login() {
      this.validateForm()

      try {
        const { cuil, password } = this.formData;
        const { payload: response } = await loginService.login(cuil, password);
        const { usuarioId, stockAreaId, fullNameUsuario, rolId } = response
        sessionStorage.setItem('session', JSON.stringify({
          cuil,
          usuarioId,
          stockAreaId,
          fullNameUsuario,
          rolId
        }));
        this.globalStore.setUsuario(cuil, usuarioId, stockAreaId, fullNameUsuario, rolId, rolId == 1, true)
        this.$router.push('/home');
        
        const areas = await stockAreaService.getAllStockArea();
    const usuarios = await usuariosService.getAllUsuarios();
    this.globalStore.cargarAreasYUser(areas, usuarios);

        this.resetearFormulario();
      } catch (error) {
        this.error = error;
      }
      if(!this.formData.cuil || !this.formData.password){
        this.error = "Complete los campos para continuar.";
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

/* v-card-text {
  min-height: 150px;
} */

.btn-blue {
  margin-top: 20px;
}
</style>