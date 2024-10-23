<template>
    <v-dialog v-model="localVisible" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ isEditing ? 'Editar Aplique' : 'Agregar Aplique' }}</span>
        </v-card-title>
  
        <v-card-text>
          <v-form ref="form">
            <v-text-field v-model="apliqueLocal.sku" label="SKU" required></v-text-field>
            <v-text-field v-model="apliqueLocal.cantidad" label="Cantidad" required></v-text-field>
            <v-text-field v-model="apliqueLocal.aplicante" label="Aplicante" required></v-text-field>
            <v-text-field v-model="apliqueLocal.fecha" label="Fecha de Aplicación" required></v-text-field>
          </v-form>
        </v-card-text>
  
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="closeDialog">Cancelar</v-btn>
          <v-btn text @click="save">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script>
  export default {
    props: {
      modelValue: Boolean,
      isEditing: Boolean,
      aplique: Object,
    },
    data() {
      return {
        localVisible: this.modelValue,
        apliqueLocal: { ...this.aplique }, // Creamos una copia local del aplique
      };
    },
    watch: {
      aplique: {
        immediate: true,
        handler(newAplique) {
          this.apliqueLocal = { ...newAplique }; // Actualizamos la copia local si cambian las props
        },
      },
      modelValue(val) {
        this.localVisible = val;
      },
      localVisible(val) {
        this.$emit('update:modelValue', val);
      },
    },
    methods: {
      closeDialog() {
        this.localVisible = false;
      },
      save() {
        this.$emit('save', this.apliqueLocal); // Emitimos la copia local
        this.closeDialog();
      },
    },
  };
  </script>
  