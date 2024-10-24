<template>
    <div>
      <Tabla
        :headers="headers"
        :data="filteredItems"
        :isListadoUsuarios="isListadoUsuarios" 
        :isListadoApliques="isListadoApliques"
        @edit="$emit('edit', $event)"
        @delete="$emit('delete', $event)"
        @restorePassword="showRestorePassword ? $emit('restorePassword', $event) : null"
        @ver-historial="$emit('ver-historial', $event)"
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
      required: true, 
    },
    items: {
      type: Array,
      required: true,
    },
    showRestorePassword: {
      type: Boolean,
      default: false,
    },
    isListadoUsuarios: {
      type: Boolean,
      default: false,
    },
    isListadoApliques: {
      type: Boolean,
      default: false, // Nueva propiedad para identificar si es el listado de apliques
    },
  },
  computed: {
    filteredItems() {
      return this.items;
    },
  },
};
</script>