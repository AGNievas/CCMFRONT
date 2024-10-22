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
    modelValue: Boolean, // Para controlar la visibilidad del diálogo
    isEditing: Boolean, // Para saber si estamos en modo edición o creación
    usuario: Object, // Objeto usuario que se pasa desde el componente padre
    roles: Array, // Lista de roles disponibles
    areas: Array, // Lista de áreas disponibles
    formError: Boolean
  },
  data() {
    return {
      localVisible: this.modelValue, // Sincroniza la visibilidad localmente
      localUsuario: this.createLocalUsuario() // Inicializa el usuario local
    };
  },
  methods: {
    // Método para formatear el CUIL
    formatearCuil(cuil) {
      return parsearCuil.formatearCuil(cuil);
    },
    // Crear una copia local del objeto usuario
    createLocalUsuario() {
      return { ...this.usuario }; // Copia del usuario para trabajar localmente
    },
    // Método para confirmar y guardar los cambios
    saveChanges() {
      this.$emit('save', { ...this.localUsuario }); // Envía el objeto usuario actualizado al componente padre
    },
    // Método para cerrar el diálogo
    closeDialog() {
      this.localVisible = false; // Cierra el diálogo localmente
      this.$emit('update:modelValue', false); // Notifica al padre para que cierre el diálogo
    }
  },
  watch: {
    // Observa los cambios en la prop modelValue para sincronizar la visibilidad
    modelValue(val) {
      this.localVisible = val; // Sincroniza la visibilidad con el valor del padre
    },
    // Observa los cambios en la prop usuario para actualizar la copia local
    usuario: {
      handler(newVal) {
        this.localUsuario = { ...newVal }; // Actualiza la copia local del usuario
      },
      immediate: true, // Ejecuta inmediatamente para inicializar localUsuario
      deep: true // Observa cambios profundos en el objeto usuario
    }
  }
};
</script>
