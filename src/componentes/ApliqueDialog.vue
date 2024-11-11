<template>
  <v-card>
    <v-card-title>{{ isEditing ? 'Editar Aplique' : 'Agregar Aplique' }}</v-card-title>
    <v-card-text>

      <v-select v-if="!isEditing" v-model="areaId" :items="areas" item-title="nombre" item-value="id" label="Área"
        :disabled="!puedeSeleccionarArea" :readonly="!puedeSeleccionarArea" required></v-select>
      <v-select v-if="!isEditing" v-model="apliqueLocal.stockAreaId" :items="stockAreasDeArea" item-title="nombre"
        item-value="id" label="Sub Área de Stock" required></v-select>

      <v-select v-if="!isEditing" v-model="apliqueLocal.sku" :items="medicamentosPorStockArea" item-title="sku"
        item-value="sku" label="SKU" required></v-select>
      <v-select v-if="!isEditing" v-model="apliqueLocal.descripcion" :items="medicamentosPorStockArea"
        item-title="descripcion" item-value="descripcion" label="Medicamento" required></v-select>

      <v-text-field v-if="!isEditing" v-model="apliqueLocal.cantidad" label="Cantidad" type="number" min="1"
        required></v-text-field>
      <v-select v-model="apliqueLocal.User" :items="usuariosPorArea" item-title="fullName" item-value="id"
        label="Aplicante"  required></v-select>

      <v-text-field v-model="apliqueLocal.fechaAplicacion" label="Fecha Aplicación" type="date" required></v-text-field>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn class="btn-blue" text @click="closeDialog">Cancelar</v-btn>
      <v-btn class="btn-blue" text @click="save" :disabled="!isFormValid">Guardar</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { useGlobalStore } from '@/stores/global';

export default {
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    isEditing: Boolean,
    aplique: Object,
    areas: Array,
    stockAreas: Array,
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

      areaId: '',
      apliqueLocal: {
        sku: '',
        descripcion: '',
        cantidad: '',
        User: '',
        stockAreaId: '',
        fechaAplicacion: '',
        areaId:'',
        pacienteId: this.pacienteId,
      },
      globalStore: useGlobalStore(),
    };
  },

  mounted() {
    this.definirArea()
    this.usuarioBaseEdit()
  },
  computed: {
    puedeSeleccionarArea() {
      return this.globalStore.getRolId == 1 || this.globalStore.getRolId == 2;
    },


    usuariosPorArea() {
     let areaId
     
      if(this.isEditing){
        areaId = this.aplique.StockArea.Area.id
      }else{  
        areaId = this.areaId
      }
      return this.usuarios.filter(usuario => usuario.areaId == areaId )
    },

    stockAreasDeArea() {
      return this.globalStore.getStockAreas.filter(
        stockArea => stockArea.Area.id == this.areaId
      );
    },
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
      if (!this.isEditing) {
              return (
          this.apliqueLocal.descripcion &&
          this.apliqueLocal.sku &&
          this.apliqueLocal.cantidad &&
          this.apliqueLocal.User &&
          this.apliqueLocal.stockAreaId &&
          this.apliqueLocal.fechaAplicacion
        );
      } else {
        return this.apliqueLocal.User && this.apliqueLocal.fechaAplicacion;
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
      const medicamento = this.medicamentosPorStockArea.find(
        med => med.sku === newSku
      );
      if (medicamento) {
        this.apliqueLocal.descripcion = medicamento.descripcion;
      } else {
        this.apliqueLocal.descripcion = '';
      }
    },


    'apliqueLocal.descripcion'(newDescripcion) {
      const medicamento = this.medicamentosPorStockArea.find(
        med => med.descripcion === newDescripcion
      );
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
        this.apliqueLocal = { id: newAplique.id, ...newAplique };
        } else {
         this.resetApliqueLocal();
        }
        
      },
    },
  },
  methods: {
    usuarioBaseEdit(){
      this.apliqueLocal.User = this.isEditing ? this.aplique.User.id : ''
    },
    definirArea() {
      if (!this.puedeSeleccionarArea) {
        this.areaId = this.globalStore.getAreaId
      }
    },
    save() {
      this.$emit('save', this.apliqueLocal);
     
      this.closeDialog();
    },
    resetApliqueLocal() {
      this.apliqueLocal = {
        sku: '',
        descripcion: '',
        cantidad: '',
        User: '',
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