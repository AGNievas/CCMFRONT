<template>
  <div>
    <v-btn @click="$emit('add-item')" class="btn-blue">Agregar Item</v-btn>
    <Listado
      :items="items"
      :headers="transferenciasHeaders"
    />
  </div>
</template>

<script>
import Listado from './Listado.vue';

export default {
  props: {
    items: Array,
  },
  components:{
    Listado
  },
  computed: {
    transferenciasHeaders() {
      return [
        { text: 'SKU', value: 'sku' },
        { text: 'Cantidad', value: 'cantidad' },
        { text: '', value: 'acciones', sortable: false },
      ];
    },
  },
};
</script>
