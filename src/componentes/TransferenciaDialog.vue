<template>
  <v-dialog v-model="localVisible" persistent max-width="600px">
    <v-card>
      <v-card-title>
        <span class="headline">{{ isEditing ? 'Editar Transferencia' : 'Agregar Nueva Transferencia' }}</span>
      </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-text-field 
            v-model="localTransferencia.sku" 
            label="SKU" 
            required 
            type="number"
          />
          <v-text-field 
            v-model="localTransferencia.cantidad" 
            label="Cantidad" 
            required 
            type="number"
          />
          <v-select 
            v-model="localTransferencia.stockAreaIdOrigen" 
            :items="areas" 
            item-title="nombre" 
            item-value="id" 
            label="Área Origen" 
            required
          />
          <v-select 
            v-model="localTransferencia.stockAreaIdDestino" 
            :items="areas" 
            item-title="nombre" 
            item-value="id" 
            label="Área Destino" 
            required
          />
          <v-text-field 
            v-model="localTransferencia.motivo" 
            label="Motivo" 
            required
          />
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
    isEditing: Boolean,
    transferencia: Object,
    areas: Array,
  },
  data() {
    return {
      localVisible: this.modelValue,
      localTransferencia: this.createLocalTransferencia(),
    };
  },
  methods: {
    createLocalTransferencia() {
      return { ...this.transferencia };
    },
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
    transferencia: {
      handler(newVal) {
        this.localTransferencia = { ...newVal };
      },
      immediate: true,
      deep: true,
    },
  },
};
</script>
