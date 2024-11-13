<template>
  <v-dialog v-model="localVisible" persistent max-width="400px" @keydown.esc="closeDialog">
    <v-card>
      <v-card-title>
        <span class="headline">Agregar Item</span>
        <v-spacer></v-spacer>
        <v-btn icon @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-select v-if="!isEditing"
            v-model="localTransferencia.sku" 
            label="SKU" 
            required 
            type="number" 
          ></v-select>
          <v-select v-if="!isEditing"
            v-model="localTransferencia.descripcion" 
            label="Descripcion" 
            required 
            type="text" 
          ></v-select>
          <v-text-field v-if="!isEditing" 
            v-model="localTransferencia.cantidad" 
            label="Cantidad" 
            required 
            type="number" 
            :rules="[cantidadRule]"
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn class="btn-blue" text @click="closeDialog">Cancelar</v-btn>
        <v-btn class="btn-blue" text :disabled="!isFormValid" @click="saveChanges">Guardar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    medicamentos: Array,
    modelValue: Boolean,
  },
  data() {
    return {
      localVisible: this.modelValue,
      localTransferencia: { sku: '', descripcion:'', cantidad: '' },
    };
  },
  computed: {

    medicamentosPorStockArea() {
      return this.medicamentos
        .filter(medicamento => medicamento.StockArea?.id == this.apliqueLocal.stockAreaId)
        .map(medicamento => ({
          sku: medicamento.Medicamento.sku,
          descripcion: medicamento.Medicamento.descripcion,
          id: medicamento.Medicamento.id,
        }));
    },
    isFormValid() {
      return (
        this.localTransferencia.sku !== '' &&
        this.localTransferencia.cantidad !== '' &&
        this.localTransferencia.cantidad > 0
      );
    },
    cantidadRule() {
      return value => value > 0 || 'La cantidad debe ser mayor a 0';
    },
  },
  methods: {
    saveChanges() {
      if (this.isFormValid) {
        this.$emit('save', { ...this.localTransferencia });
        this.closeDialog();
      }
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

    'localTransferencia.sku'(newSku){
      const medicamento = this.medicamentosPorStockArea(
        med => med.sku == newSku
      );
      if(medicamento){
        this.localTransferencia.descripcion = medicamento.descripcion;
      }else{
        this.apliqueLocal.descripcion= '';
      }
    },

    'localTransferencia.descripcion'(newDescripcion){
      const medicamento = this.medicamentosPorStockArea.find(
        med => med.descripcion === newDescripcion
      );
      if (medicamento) {
        this.localTransferencia.sku = medicamento.sku;
      } else {
        this.localTransferencia.sku = '';
      }
    }
  },
};
</script>
