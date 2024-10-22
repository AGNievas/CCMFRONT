<template>
  <v-dialog v-model="localVisible" persistent max-width="400px">
    <v-card>
      <v-card-title class="headline">{{ title }}</v-card-title>
      <v-card-text>{{ text }}</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn class="btn-blue" text @click="closeDialog">Cancelar</v-btn>
        <v-btn class="btn-blue" text @click="confirmAction">Confirmar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    modelValue: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: "Confirmar Acción"
    },
    text: {
      type: String,
      default: "¿Estás seguro de que deseas continuar?"
    }
  },
  data() {
    return {
      localVisible: this.modelValue
    };
  },
  watch: {
    modelValue(val) {
      this.localVisible = val;
    },
    localVisible(val) {
      this.$emit('update:modelValue', val); // Emitimos para cerrar o abrir el diálogo
    }
  },
  methods: {
    closeDialog() {
      this.localVisible = false;
    },
    confirmAction() {
      this.$emit('confirm');
      this.closeDialog();
    }
  }
};
</script>
