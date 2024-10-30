<template>
  <v-dialog v-model="localDialogVisible" persistent max-width="600px">
    <v-card>
      <v-card-title>
        <span class="headline">{{ dialogTitle }}</span>
      </v-card-title>

      <v-card-text>
        <v-form ref="form">
          <v-text-field
            v-model="localMedicamento.sku"
            label="SKU"
            :readonly="isEditing"
            required
          ></v-text-field>

          <v-text-field
            v-model="localMedicamento.descripcion"
            label="Descripción"
            required
            :readonly="isEditing && area !== 0"
          ></v-text-field>

          <v-select
            v-model="localMedicamento.tipo_insumo"
            :items="tipoInsumoOptions"
            label="Tipo de Insumo"
            required
          ></v-select>

          <v-text-field
            v-if="(isEditing && area !== 0) || !isEditing"
            v-model.number="localMedicamento.stock"
            label="Stock"
            required
            type="number"
            min="0"
          ></v-text-field>

          <!-- Alertas de error -->
          <v-alert v-if="formError" type="error" dismissible>
            Todos los campos son obligatorios. Por favor, completa la información.
          </v-alert>

          <v-alert v-if="skuErrorLocal && !isEditing" type="error" dismissible>
            El SKU ya existe. Por favor, elige otro.
          </v-alert>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn class="btn-blue" text @click="closeDialog">Cancelar</v-btn>
        <v-btn class="btn-blue" text @click="confirmAction">{{ dialogButton }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "MedicamentoDialog",
  props: {
    dialogVisible: Boolean,
    isEditing: Boolean,
    area: Number,
    tipoInsumoOptions: Array,
    medicamento: Object,
    skuError: Boolean
  },
  emits: ['confirm', 'closeDialog'],
  data() {
    return {
      formError: false,
      skuErrorLocal: this.skuError,
      localDialogVisible: this.dialogVisible,
      localMedicamento: { ...this.medicamento },
    };
  },
  computed: {
    dialogTitle() {
      return this.isEditing ? "Editar Medicamento" : "Agregar Nuevo Medicamento" ;
    },
    dialogButton() {
      return this.isEditing ? "Actualizar" : "Agregar" ;
    },
  },
  methods: {
    closeDialog() {
      this.formError = false;
      this.$emit('closeDialog');
    },

    confirmAction() {
      this.formError = false;
      this.skuErrorLocal = false;

      if((this.isEditing && this.area != 0 && !this.localMedicamento.stock) || (!this.isEditing && !this.localMedicamento.stock) ){
        this.formError = true;
        return;
      }
      if (
        !this.localMedicamento.sku ||
        !this.localMedicamento.descripcion ||
        !this.localMedicamento.tipo_insumo 
      ) {
        this.formError = true;
        return;
      }
      this.$emit("confirm", { medicamentoEmitido: { ...this.localMedicamento } });
    },

  },
  watch: {
    dialogVisible(val) {
      this.localDialogVisible = val;
      if (!val) {
        this.formError = false;
        this.skuErrorLocal = false;
      }
    },
    skuError(val){
      this.skuErrorLocal = val;
    },
    medicamento: {
      handler(newValue) {
        this.localMedicamento = { ...newValue };
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>