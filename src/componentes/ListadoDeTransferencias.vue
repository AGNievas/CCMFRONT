<template>
    <v-card-title class="d-flex align-center pe-2">
      <span v-if="isViewMode" class="headline">Listado de Medicamentos Orden N°: {{ orderNumber }}</span>
      <v-spacer></v-spacer>
      <v-btn v-if="!isViewMode" @click="$emit('add-item')" class="btn-blue">Agregar Item</v-btn>
    </v-card-title>

    <Listado :items="items" :headers="transferenciasHeaders" :isEditable="!isViewMode"
      @edit="(item) => $emit('edit-item', item)" @delete="(item) => $emit('delete-item', item.index)" />
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
    orderNumber: Number,
  },
  components: {
    Listado,
  },
  computed: {
    transferenciasHeaders() {
      return [
        { text: 'SKU', value: 'sku' },
        { text: 'Cantidad', value: 'cantidad' },
        { text: 'Descripcion', value: 'descripcion' },
        { text: '', value: '', sortable: false },
      ];
    },
  },
};
</script>