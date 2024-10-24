<template>
  <v-dialog v-model="dialogVisible" max-width="500px">
    <v-card>
      <v-card-title>{{ isEditing ? 'Editar Aplique' : 'Agregar Aplique' }}</v-card-title>
      <v-card-text>
        <v-text-field v-model="apliqueLocal.sku" label="SKU"></v-text-field>
        <v-text-field v-model="apliqueLocal.cantidad" label="Cantidad"></v-text-field>
        <v-text-field v-model="apliqueLocal.aplicante" label="Aplicante"></v-text-field>
        <v-menu
          v-model="menu"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          min-width="290px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="apliqueLocal.fecha"
              label="Fecha"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker v-model="apliqueLocal.fecha" no-title @input="menu = false"></v-date-picker>
        </v-menu>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="dialogVisible = false">Cancelar</v-btn>
        <v-btn color="blue darken-1" text @click="save">Guardar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    isEditing: {
      type: Boolean,
      required: true,
    },
    aplique: {
      type: Object,
      default: () => ({
        sku: '',
        cantidad: '',
        aplicante: '',
        fecha: new Date().toISOString().substr(0, 10), // Fecha por defecto al día de hoy
      }),
    },
  },
  data() {
    return {
      dialogVisible: true,
      apliqueLocal: { ...this.aplique }, // Clonamos la prop aplique
      menu: false, // Para controlar el menú del datepicker
    };
  },
  methods: {
    save() {
      // Emitimos el evento de guardar el aplique, enviando apliqueLocal
      this.$emit('save', this.apliqueLocal);
      this.dialogVisible = false; // Cerramos el diálogo
    },
  },
  watch: {
    aplique: {
      handler(newVal) {
        // Cada vez que cambie el aplique (en caso de editar), actualizamos el local
        this.apliqueLocal = { ...newVal };
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>
