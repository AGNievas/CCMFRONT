<template>
  <v-dialog v-model="localVisible" persistent max-width="600px">
    <v-card>
      <v-card-title>
        <span class="headline">{{ isEditing ? 'Editar Orden de Transferencia' : 'Agregar Nueva Orden de Transferencia' }}</span>
      </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-select
            v-model="localOrdenTransferencia.stockAreaIdOrigen"
            :items="areas"
            item-title="nombre"
            item-value="id"
            label="Área Origen"
            required
          />
          <v-select
            v-model="localOrdenTransferencia.stockAreaIdDestino"
            :items="areas"
            item-title="nombre"
            item-value="id"
            label="Área Destino"
            required
          />
          <v-text-field
            v-model="localOrdenTransferencia.motivo"
            label="Motivo"
            required
          />
          <ListadoDeTransferencias
            :items="localOrdenTransferencia.items"
            @add-item="openAddItemDialog"
          />
        </v-form>
      </v-card-text>

      <TransferenciaDialog
        v-model="itemDialogVisible"
        @save="addItem"
      />

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn class="btn-blue" text @click="closeDialog">Cancelar</v-btn>
        <v-btn class="btn-blue" text @click="saveChanges">Guardar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import ListadoDeTransferencias from './ListadoDeTransferencias.vue';
import TransferenciaDialog from './TransferenciaDialog.vue';

export default {
  props: {
    modelValue: Boolean,
    isEditing: Boolean,
    ordenTransferencia: {
      type: Object,
      default: () => ({ stockAreaIdOrigen: null, stockAreaIdDestino: null, motivo: '', items: [] })
    },
    areas: Array,
  },
  components: {
    ListadoDeTransferencias,
    TransferenciaDialog,
  },
  data() {
    return {
      localVisible: this.modelValue,
      localOrdenTransferencia: { ...this.ordenTransferencia },  // Direct initialization from prop
      itemDialogVisible: false,
    };
  },
  methods: {
    saveChanges() {
      // Emit all updated data
      this.$emit('save', { ...this.localOrdenTransferencia });
      this.closeDialog();
    },
    closeDialog() {
      this.localVisible = false;
      this.$emit('update:modelValue', false);
    },
    openAddItemDialog() {
      this.itemDialogVisible = true;
    },
    addItem(item) {
      this.localOrdenTransferencia.items.push(item);
      this.itemDialogVisible = false;
    },
  },
  watch: {
    modelValue(val) {
      this.localVisible = val;
    },
    ordenTransferencia: {
      handler(newVal) {
        this.localOrdenTransferencia = { ...newVal };
      },
      immediate: true,
      deep: true,
    },
  },
};
</script>
