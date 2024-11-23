<template>
  <v-dialog v-model="localVisible" persistent max-width="600px">
    <v-card>
      <v-card-title>
        <span class="headline">{{ isEditing ? 'Editar Usuario' : 'Agregar Nuevo Usuario' }}</span>
        <v-btn class="btn-icon" icon small @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-text-field
            v-model="localUsuario.cuil"
            label="CUIL"
            required
            :rules="[cuilRule]"
            @input="formatAndCheckCuil"
            variant="solo"
            rounded
            dense
          />
          <v-text-field
            v-model="localUsuario.fullName"
            label="Nombre Completo"
            required
            :rules="[fullNameRule]"
            @input="checkFormValidity"
            @keypress="soloLetras"
            variant="solo"
            rounded
            dense
          />
          <v-select
            v-model="localUsuario.rolId"
            :items="roles"
            item-title="name"
            item-value="id"
            label="Rol"
            required
            :rules="[rolRule]"
            @change="checkFormValidity"
            variant="solo"
            rounded
            dense
          />
          <v-select
            v-model="localUsuario.areaId"
            :items="areas"
            item-title="nombre"
            item-value="id"
            label="Área"
            required :rules="[areaRule]"
            @change="checkFormValidity"
            variant="solo"
            rounded
            dense
          />
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-btn class="btn-blue" text @click="saveChanges" :disabled="!checkFormValidity()">Guardar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { formatearCuil, validarCuil, soloLetras } from '@/utils/utils';

export default {
  props: {
    modelValue: Boolean,
    isEditing: Boolean,
    usuario: Object,
    roles: Array,
    areas: Array
  },
  data() {
    return {
      localVisible: this.modelValue,
      localUsuario: this.createLocalUsuario(),
      isFormValid: false,
      cuilRule: v => validarCuil(v) || "Formato de CUIL incorrecto",
      fullNameRule: v => !!v || "El nombre completo es obligatorio",
      rolRule: v => !!v || "Debe seleccionar un rol",
      areaRule: v => !!v || "Debe seleccionar un área"
    };
  },


  methods: {

    checkFormValidity() {
      const isCuilValid = validarCuil(this.localUsuario.cuil);
      const isFullNameValid = !!this.localUsuario.fullName;
      const isRolValid = !!this.localUsuario.rolId;
      const isAreaValid = !!this.localUsuario.areaId;

      return this.isFormValid = isCuilValid && isFullNameValid && isRolValid && isAreaValid;
    },

    formatAndCheckCuil() {
      this.localUsuario.cuil = formatearCuil(this.localUsuario.cuil);
      this.checkFormValidity();
    },

    soloLetras(event) {
      return soloLetras(event)
    },

    createLocalUsuario() {
      return { ...this.usuario };
    },



    saveChanges() {
      if (!this.isFormValid) return;
      this.$emit('save', { ...this.localUsuario });
    },

    closeDialog() {
      this.localVisible = false;
      this.$emit('update:modelValue', false);
    }
  },

  watch: {
    modelValue(val) {
      this.localVisible = val;
    },

    usuario: {
      handler(newVal) {
        this.localUsuario = { ...newVal };
      },
      immediate: true,
      deep: true
    }
  }
};
</script>
