<template>
  <v-dialog v-model="localVisible" persistent max-width="600px">
    <v-card>
      <v-card-title>
        <span class="headline">{{ isEditing ? 'Editar Usuario' : 'Agregar Nuevo Usuario' }}</span>
      </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-text-field 
            v-model="localUsuario.cuil" 
            label="CUIL" 
            required 
            @input="localUsuario.cuil = formatearCuil(localUsuario.cuil)" 
          />
          <v-text-field v-model="localUsuario.fullName" label="Nombre Completo" required></v-text-field>
          <v-select v-model="localUsuario.rolId" :items="roles" item-title="name" item-value="id" label="Rol" required></v-select>
          <v-select v-model="localUsuario.stockAreaId" :items="areas" item-title="nombre" item-value="id" label="Área" required></v-select>

          <v-alert v-if="formError" type="error" dismissible>
            Todos los campos son obligatorios. Por favor, completa la información.
          </v-alert>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn class="btn-blue" text @click="closeDialog">Cancelar</v-btn>
        <v-btn class="btn-blue" text @click="saveChanges">Guardar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import  parsearCuil  from '@/utils/parsearCuil';

export default {
  props: {
    modelValue: Boolean, 
    isEditing: Boolean, 
    usuario: Object,
    roles: Array, 
    areas: Array, 
    formError: Boolean
  },
  data() {
    return {
      localVisible: this.modelValue, 
      localUsuario: this.createLocalUsuario() 
    };
  },
  methods: {
    
    formatearCuil(cuil) {
      return parsearCuil.formatearCuil(cuil);
    },
    
    createLocalUsuario() {
      return { ...this.usuario }; 
    },
   
    saveChanges() {
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
