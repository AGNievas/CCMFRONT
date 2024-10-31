<template>
  <v-dialog v-model="localVisible" persistent max-width="400px">
    <v-card>
      <v-card-title>
        <span class="headline">Agregar Item</span>
      </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-text-field v-model="localTransferencia.sku" label="SKU" required type="number" />
          <v-text-field v-model="localTransferencia.cantidad" label="Cantidad" required type="number" />
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
export default {
  props: {
    modelValue: Boolean,
  },
  data() {
    return {
      localVisible: this.modelValue,
      localTransferencia: { sku: '', cantidad: '' },
    };
  },
  methods: {
    saveChanges() {
      this.$emit('save', { ...this.localTransferencia });
      this.closeDialog();
    },
    closeDialog() {
      this.localVisible = false;
      this.$emit('update:modelValue', false);
    },
  },
  watch: {
    modelValue(val) {
      this.localVisible = val;
    },
  },
};
</script>
