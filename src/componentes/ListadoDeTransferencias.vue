<template>
  <div>
    <v-btn v-if="!isViewMode" @click="$emit('add-item')" class="btn-blue">Agregar Item</v-btn>
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
    
    isViewMode: {
      type: Boolean,
      default: false,
    },
  },
  
  components:{
    Listado
  },

  mounted() {
  console.log("isViewMode en ListadoDeTransferencias:", this.isViewMode);
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
