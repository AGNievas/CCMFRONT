<template>
    <div >
      <Tabla
        :headers="headers"
        :data="filteredItems"
        :isListadoUsuarios="isListadoUsuarios" 
        :isListadoApliques="isListadoApliques"
        :isListadoPacientes="isListadoPacientes"
        :isListadoMedicamentos="isListadoMedicamentos"
        :isListadoOrdenTransferencia="isListadoOrdenTransferencia"
        @edit="$emit('edit', $event)"
        @delete="$emit('delete', $event)"
        @restorePassword="showRestorePassword ? $emit('restorePassword', $event) : null"
        @ver-historial="$emit('ver-historial', $event)"
        @crear-aplique="$emit('crear-aplique', $event)"
        @ver-items="$emit('ver-items', $event)"
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
      default: false, 
    },
    isListadoPacientes: {
      type: Boolean,
      default: false, 
    },
    isListadoMedicamentos: {
      type: Boolean,
      default: false, 
    },
    isListadoOrdenTransferencia:{
      type:Boolean,
      default: false,
    },
  },
  computed: {
    filteredItems() {
      return this.items;
    },
  },
};
</script>