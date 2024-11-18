<template>
  <v-dialog v-model="localVisible" persistent max-width="400px" @keydown.esc="closeDialog">
    <v-card>
      <v-card-title>
        <span class="headline">{{ isEditing ? 'Editar Item' : 'Agregar Item' }}</span>
        <v-spacer></v-spacer>
       
      </v-card-title>
      <v-card-text>
        <v-form ref="form">

          <v-text-field v-model="localTransferencia.sku" :items="medicamentosPorStockArea" item-title="sku" item-value="sku"
            label="SKU" required/>

          <v-select v-model="localTransferencia.descripcion" :items="medicamentosPorStockArea" item-title="descripcion"
            item-value="descripcion" label="Descripcion" required/>

          <v-text-field v-model="localTransferencia.cantidad" label="Cantidad" required type="number"
            :rules="[cantidadRule]" />
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
import { useGlobalStore } from '@/stores/global';
import itemService from './servicios/itemService';
export default {
  props: {
    isEditing: Boolean,
    modelValue: Boolean,
    stockAreaId: Number,
    areaId: Number
  },
  data() {
    return {
      globalStore: useGlobalStore(),
      medicamentos: [],
      localVisible: this.modelValue,
      localTransferencia: { sku: '', descripcion: '', cantidad: '' },
    };
  },

  async mounted() {
    await this.loadMedicamentosByStockAreaId(this.stockAreaId, this.areaId)
    console.log(this.medicamentos, "MEDICAMENTOS")

  },

  computed: {

    medicamentosPorStockArea() {
      return this.medicamentos
        .filter(medicamento => medicamento.StockArea?.id == this.stockAreaId)
        .map(medicamento => ({
          sku: String(medicamento.Medicamento.sku),
          descripcion: String(medicamento.Medicamento.descripcion),
        }))

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

    async loadMedicamentosByStockAreaId() {
      this.medicamentos = await itemService.getAllItem();
    },



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

    'localTransferencia.sku'(newSku) {
      const medicamento = this.medicamentosPorStockArea.find(
        med => med.sku == newSku
      );

      if (medicamento) {
        this.localTransferencia.descripcion = medicamento.descripcion;
      } else {
        this.localTransferencia.descripcion = '';
      }
    },

    'localTransferencia.descripcion'(newDescripcion) {
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
