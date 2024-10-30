<template>
    <v-dialog v-model="localVisible" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ isEditing ? 'Editar Orden de Transferencia' : 'Agregar Nueva Orden deTransferencia' }}</span>
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
      ordenTransferencia: Object,
      areas: Array,
    },
    data() {
      return {
        localVisible: this.modelValue,
        localOrdenTransferencia: this.createLocalOrdenTransferencia(),
      };
    },
    methods: {
      createLocalOrdenTransferencia() {
        return { ...this.OrdenTransferencia };
      },
      saveChanges() {
        this.$emit('save', { ...this.localOrdenTransferencia });
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
      OrdenTransferencia: {
        handler(newVal) {
          this.localOrdenTransferencia = { ...newVal };
        },
        immediate: true,
        deep: true,
      },
    },
  };
  </script>
  