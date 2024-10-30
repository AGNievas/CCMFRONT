<template>
  <!-- Pop-up para transferencia de stock  -->
    <v-dialog v-model="localDialogVisible" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Transferir Stock</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-select
              v-model="localTransferencia.sku"
              :items="medicamentos"
              item-title="sku"
              item-value="sku"
              label="Sku"
              required
            ></v-select>

            <v-text-field
              v-model.number="localTransferencia.cantidad"
              label="Cantidad"
              required
              type="number"
              min="1"
            ></v-text-field>

            <v-select
              v-model="localTransferencia.stockAreaIdOrigen"
              :items="areas"
              item-title="nombre"
              item-value="id"
              label="Origen"
              required
            ></v-select>

            <v-select
              v-model="localTransferencia.stockAreaIdDestino"
              :items="areas"
              item-title="nombre"
              item-value="id"
              label="Destino"
              required
            ></v-select>

            <v-text-field v-model="localTransferencia.motivo" label="Motivo" required></v-text-field>

            <v-alert v-if="formError" type="error" dismissible>
              Todos los campos son obligatorios. Por favor, completa la información.
            </v-alert>

            <v-alert v-if="areasError" type="error" dismissible>
              Las areas seleccionadas deben ser distintas.
            </v-alert>

            <v-alert v-if="cantidadLocalError" type="error" dismissible>
              Cantidad no disponible para transferir.
            </v-alert>

          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="btn-blue" text @click="closeDialog">Cancelar</v-btn>
          <v-btn class="btn-blue" text @click="confirmAction">Agregar</v-btn>
        </v-card-actions> 
      </v-card>
    </v-dialog>
</template>
<script>
export default{
  name: "TransferenciaStockDialog",
  props:{
    dialogVisible: Boolean,
    transferencia: Object,
    cantidadError: Boolean,
    medicamentos: Array,
    areas: Array,
    //errors
  },
  emits: ['confirm', 'closeDialog'],
  data(){
    return{
      formError: false,
      areasError: false,
      cantidadLocalError: false,
      localDialogVisible: this.dialogVisible,
      localTransferencia: { ...this.transferencia },
    };
  },
  methods: {
    closeDialog() {
      this.formError = false;
      this.areasError = false;
      this.cantidadLocalError = false;
      this.$emit('closeDialog');
    },
    confirmAction() {
      this.formError = false;
      this.areasError = false;

      if(!this.localTransferencia.sku ||
        !this.localTransferencia.cantidad ||
        !this.localTransferencia.stockAreaIdOrigen ||
        !this.localTransferencia.stockAreaIdDestino ||
        !this.localTransferencia.motivo
        ) {
          this.formError = true;
          return;
        }
      if(this.localTransferencia.stockAreaIdOrigen == this.localTransferencia.stockAreaIdDestino){
        this.areasError = true;
      }  
      this.$emit("confirm", { transferenciaEmitida: { ...this.localTransferencia } });
    }
  },
  watch: {
    dialogVisible(val) {
      this.localDialogVisible = val;
      if (!val) {
        this.formError = false;
        this.areasError = false;
        this.cantidadLocalError = false;
      }
    },
    cantidadError: {
      handler(newValue) {
        this.cantidadLocalError = newValue;
      },
      immediate: true,
    },
    transferencia: {
      handler(newValue) {
        this.localTransferencia = { ...newValue };
      },
      deep: true,
      immediate: true,
    },
  },
}
</script>
