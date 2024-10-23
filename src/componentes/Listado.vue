<template>
    <div>
      <Tabla
        :headers="headers"
        :data="filteredItems"
        :isListadoUsuarios="isListadoUsuarios" 
        @edit="$emit('edit', $event)"
        @delete="$emit('delete', $event)"
        @restorePassword="showRestorePassword ? $emit('restorePassword', $event) : null"
      />
    </div>
  </template>
  
  <script>
  import Tabla from './Tabla.vue';
  
  export default {
    name: 'Listado',
    components: {
      Tabla,
    },
    props: {
      search: {
        type: Array,
        required: true,
      },
      headers: {
        type: Array,
        required: true, // Recibimos los headers desde ListadoDeUsuarios
      },
      items: {
        type: Array,
        required: true,
      },
      showRestorePassword: {
        type: Boolean,
        default: false, // Por defecto no muestra el botón de restaurar contraseña
      },
      isListadoUsuarios: {
        type: Boolean,
        default: false, // Por defecto asumimos que no es un listado de usuarios
      },
    },
    computed: {
      filteredItems() {
        return this.items; // Enviamos todos los campos, incluyendo el 'id'
      },
    },
  };
  </script>
  