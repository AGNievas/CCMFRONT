<template>

  <v-card>
    <v-card-title>{{ isEditing ? 'Editar Aplique' : 'Agregar Aplique' }}</v-card-title>
    <v-card-text>
      <v-text-field
    v-if="!isEditing"
    v-model="apliqueLocal.sku"
    label="SKU"
    required
    type="number"
  ></v-text-field>

  <v-select
    v-if="!isEditing"
    v-model="apliqueLocal.descripcion"
    :items="medicamentos"
    item-title="descripcion"
    item-value="id"
    label="Medicamento"
    required
  ></v-select>


      <v-text-field v-if="!isEditing" v-model="apliqueLocal.cantidad" label="Cantidad" type="number" min="1" required></v-text-field>
      <v-select
        v-model="apliqueLocal.aplicante"
        :items="usuarios"
        item-title="fullName"
        item-value="id"
        label="Aplicante"
        required
      ></v-select>
      <v-select v-if="!isEditing"
        v-model="apliqueLocal.stockAreaId"
        :items="areas"
        item-title="nombre"
        item-value="id"
        label="Área de Stock"
        required
      ></v-select>
      <v-text-field
        v-model="apliqueLocal.fechaAplicacion"
        label="Fecha Aplicación"
        type="date"
        required
      ></v-text-field>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="blue darken-1" text @click="closeDialog">Cancelar</v-btn>
      <v-btn color="blue darken-1" text @click="save" :disabled="!isFormValid">Guardar</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>


export default {
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    isEditing: Boolean,
    aplique: Object,
    areas: Array,
    usuarios: Array,
    medicamentos: Array,
    pacienteId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      dialogVisible: this.modelValue,
      apliqueLocal: {
        sku: '',
        descripcion:'',
        cantidad: '',
        aplicante: '',
        stockAreaId: '',
        fechaAplicacion: '',
        pacienteId: this.pacienteId,
      },
    };
  },
  computed: {
    isFormValid() {
      if(!this.isEditing){
        return (
        this.apliqueLocal.descripcion &&
        this.apliqueLocal.sku &&
        this.apliqueLocal.cantidad &&
        this.apliqueLocal.aplicante &&
        this.apliqueLocal.stockAreaId &&
        this.apliqueLocal.fechaAplicacion
      );
      } else {
        return this.apliqueLocal.aplicante && this.apliqueLocal.fechaAplicacion
      }
      
    },
  },
  watch: {
    modelValue(val) {
      this.dialogVisible = val;
    },
    dialogVisible(val) {
      this.$emit('update:modelValue', val);
    },
    'apliqueLocal.sku'(newSku) {
      const medicamento = this.medicamentos.find(med => med.sku == newSku);
      console.log(medicamento,newSku, "sku")
      if (medicamento) {
        this.apliqueLocal.descripcion = medicamento.descripcion;
      } else {
        this.apliqueLocal.descripcion = '';
      }
    },
    'apliqueLocal.descripcion'(newDescripcion) {
      const medicamento = this.medicamentos.find(med => med.descripcion == newDescripcion);
      console.log(medicamento, newDescripcion, "descripcion")
      if (medicamento) {
        this.apliqueLocal.sku = medicamento.sku;
      } else {
        this.apliqueLocal.sku = '';
      }
    },
    aplique: {
    immediate: true,
    handler(newAplique) {
      if (this.isEditing && newAplique) {
        // Copia todos los valores del aplique al objeto apliqueLocal, incluyendo el id
        this.apliqueLocal = { id: newAplique.id, ...newAplique };
      } else {
        // Si no estamos editando, resetea apliqueLocal para el modo agregar
        this.resetApliqueLocal();
      }
    },
  },
  },
  methods: {
    save() {
      this.$emit('save', this.apliqueLocal);
      console.log(this.apliqueLocal, "aplique Local")
      this.closeDialog();
    },
    resetApliqueLocal() {
      this.apliqueLocal = {
        sku: '',
        descripcion: '',
        cantidad: '',
        aplicante: '',
        stockAreaId: '',
        fechaAplicacion: '',
        pacienteId: this.pacienteId,
      };
    },
    closeDialog() {
      this.$emit('update:modelValue', false);
      this.resetApliqueLocal();
    },
  },
};
</script>
