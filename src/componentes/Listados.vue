<template>
  <div>
   
    <Tabla :data="filteredItems" :columns="columns" />
   
  </div>
</template>

<script>
import Tabla from '../componentes/Tabla.vue';

export default {
  name: 'Listados',
  components: {
    Tabla,
  },
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      searchTerm: '',
    };
  },
  computed: {
    filteredItems() {
      return this.items.filter(item =>
        Object.keys(item).some(key =>
          String(item[key]).toLowerCase().includes(this.searchTerm.toLowerCase())
        )
      );
    },
    columns() {
      return Object.keys(this.items[0] || {});
    },
  },
};
</script>

<style scoped>
/* Agregar estilos si es necesario */
</style>
