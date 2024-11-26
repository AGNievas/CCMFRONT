<template>
  <v-container>
    <v-card>
      <v-card-text class="text-center">
        <v-form @submit.prevent="login">
          <v-text-field 
            v-model="formData.cuil"  
            label="CUIL" 
            required 
            type="text"
            :error-messages="cuilErrors" 
            @input="formData.cuil = formatearCuil(formData.cuil)"
            variant="solo"
            rounded
            dense
          ></v-text-field>

          <v-text-field 
            v-model="formData.password"
            label="Contraseña" 
            required 
            :type="showPassword ? 'text' : 'password'"
            :error-messages="passwordErrors" 
            :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append-inner="toggleShowPassword"
            variant="solo"
            rounded
            dense
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
import { formatearCuil , validarCuil } from '@/utils/utils';
import areaService from "./servicios/areaService";
import usuariosService from "./servicios/usuariosService";
import rolService from "./servicios/rolService";
import stockAreaService from "./servicios/stockAreaService";
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
      } else if (!validarCuil) {
        this.cuilErrors.push("CUIL no es válido. Debe tener el formato 20-12345678-9.");
      }

      if (!this.formData.password) {
        this.passwordErrors.push("Password es requerido.");
      }

      return !this.cuilErrors.length && !this.passwordErrors.length;
    },

   
    formatearCuil(cuil) {
      return formatearCuil(cuil)
    },

    async login() {
      this.validateForm()
      try {
        const { cuil, password } = this.formData;
        const { payload: response } = await loginService.login(cuil, password);
        const { usuarioId, areaId, areaNombre, fullNameUsuario, rolId, rolName } = response
        sessionStorage.setItem('session', JSON.stringify({
          cuil, usuarioId, areaId, areaNombre, fullNameUsuario, rolId, rolName,
        }));
        this.globalStore.setUsuario(cuil, usuarioId, areaId, areaNombre, fullNameUsuario, rolId, rolName, rolId == 1, true)
        this.$router.push('/home');
        const areas = await areaService.getAllArea();
        const stockAreas = await stockAreaService.getAllStockArea();
        const usuarios = await usuariosService.getAllUsuarios();
        const roles = await rolService.getAllRol()
        this.globalStore.cargarAreasYUser(areas, usuarios,roles, stockAreas);


        this.resetearFormulario();
      } catch (error) {
        this.error = error;
      }
      if (!this.formData.cuil || !this.formData.password) {
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
.btn-blue {
  margin-top: 20px;
}
</style>