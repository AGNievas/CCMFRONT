<template>
  <v-card class="custom-container">
    <v-card-title class="d-flex align-center pe-2">
      <v-spacer></v-spacer>
      <v-btn @click="$emit('add-item')" class="btn-blue">Agregar Item</v-btn>
    </v-card-title>  
    <Listado
      :items="items"
      :headers="transferenciasHeaders"
    />
  </v-card>
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
        { text: '', value: '', sortable: false },
      ];
    },
  },
};
</script>
