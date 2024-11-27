<template>
  <v-card-title class="d-flex align-center pe-2">
    <span v-if="isViewMode" class="headline">Lista Items Orden N°: {{ orderNumber }}</span>
    <v-spacer></v-spacer>
    <v-btn v-if="!isViewMode" @click="$emit('add-item')" class="btn-blue" :disabled="disabled">Agregar Item</v-btn>
    <v-spacer></v-spacer>
  </v-card-title>
  

  <Tabla :data="items" :headers="transferenciasHeaders" :isEditable="!isViewMode"
    @edit="(item) => $emit('edit-item', item)" @delete="(item) => $emit('delete-item', item.index)" />
<v-card-actions v-if="isViewMode">
  <v-btn  class="btn-blue" text @click="$emit('close')">Cerrar</v-btn>
</v-card-actions>  
  


</template>

<script>
import Tabla from './Tabla.vue';
export default {
  props: {
    disabled: Boolean,
    items: Array,
    isViewMode: {
      type: Boolean,
      default: false,
    },
    orderNumber: Number,
  },
  components: {
    Tabla,
  },
  emits: ['add-item', 'edit-item', 'delete-item', 'close'],
  data() {
    return {
      transferenciasHeaders: [
        { text: 'SKU', value: 'sku' },
        { text: 'Descripcion', value: 'descripcion' },
        { text: 'Cantidad', value: 'cantidad' },
        { text: '', value: '', sortable: false },
      ],
    };
  },
};
</script>