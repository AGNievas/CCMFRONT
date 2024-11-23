<template>
  <v-dialog v-model="dialogVisible" persistent max-width="600px">
    <v-card class="custom-container">
      <v-card-title class="d-flex align-center pe-2">
        <span class="headline">{{ darAlta ? 'Ingrese Fecha de Alta' :isEditing ? 'Editar Visita' : 'Agregar Visita' }}</span>
        <v-btn class="btn-icon" icon small @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-select
          v-if="!darAlta"
          v-model="visitaLocal.StockArea"
          :items="stockAreasPorArea"
          item-title="nombre"
          item-value="id"
          label="Sub Area"
          required
          variant="solo"
          rounded
          dense
        />

        <v-select
          v-if="!darAlta"
          v-model="visitaLocal.User"
          :items="usuariosPorAreas"
          item-title="fullName"
          item-value="id"
          label="Medico"
          required
          variant="solo"
          rounded
          dense
        />

        <v-text-field
          v-if="!darAlta"
          v-model="visitaLocal.diagnostico"
          label="Diagnostico Presunto"
          type="text"
          variant="solo"
          rounded
          dense
        />

        <v-text-field 
          v-if="!darAlta"
          v-model="visitaLocal.fechaIngreso"
          label="Fecha de Ingreso"
          type="datetime-local"
          required
          variant="solo"
          rounded
          dense
        />

        <v-select
          v-if="!darAlta"
          v-model="visitaLocal.seInterno"
          :items="opciones"
          item-title="text"
          item-value="valor"
          label="¿Requiere Internación?"
          outlined
          variant="solo"
          rounded
          dense
        />

        <v-text-field
          v-if="darAlta || isEditing"
          v-model="visitaLocal.fechaAlta"
          label="Fecha Alta"
          type="datetime-local"
          variant="solo"
          rounded
          dense
        />
      </v-card-text>
      <v-card-actions>
        <v-btn class="btn-blue" text @click="save" :disabled="!isFormValid">Guardar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>


<script>
import { useGlobalStore } from '@/stores/global';
export default {
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    darAlta: Boolean,
    isEditing: Boolean,
    visita: Object,
    areas: Array,
    stockAreas: Array,
    usuarios: Array,
    medicamentos: Array,
    paciente: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {   
      dialogVisible: this.modelValue,
      visitaLocal: this.isEditing || this.darAlta ? {...this.visita}:{
        User: {
          id: '',
          fullName: '',
          StockArea: {
            id: '',
            nombre: '',
            Area: {
              id: '',
              nombre: '',
            }
          },
        },
        diagnostico: '',
        fechaIngreso: '',
        fechaAlta: '',
        seInterno: null,
        paciente: { ...this.paciente }
      },
      opciones: [
        { text: 'Si', valor: true },
        { text: 'No', valor: false },
      ],
      globalStore: useGlobalStore(),
    }
  },
  computed: {
    stockAreasPorArea() {
      let areaId
      if(this.isEditing){
        areaId= this.visita.StockArea.Area.id
      } else {
        areaId= this.globalStore.getAreaId
      }
      return this.stockAreas.filter(stockArea => stockArea.Area.id == areaId)
    },
    usuariosPorAreas() {
      let areaId
      if (this.isEditing) {
        areaId = this.visita.StockArea.Area.id
      } else {
        areaId = this.globalStore.getAreaId
      }
      return this.usuarios.filter(usuario => usuario.areaId == areaId)
    },
    isFormValid() {
      return !this.darAlta ? (this.visitaLocal.StockArea &&
                            this.visitaLocal.User &&
                            this.visitaLocal.diagnostico &&
                            this.visitaLocal.fechaIngreso &&
                            this.visitaLocal.seInterno!=null) : this.visitaLocal.fechaAlta
    }
  },
  watch: {
    modelValue(val) {
      this.dialogVisible = val
    },
    dialogVisible(val) {
      this.$emit('update:modelValue', val)
    },
    visita: {
      immediate: true,
      handler(newVisita) {
        if (this.isEditing && newVisita) {
          this.visitaLocal = { id: newVisita.id, ...newVisita };
          // Convertir fechaIngreso al formato 'YYYY-MM-DD'
          if (this.visitaLocal.fechaIngreso) {
            const fechaIngreso = new Date(this.visitaLocal.fechaIngreso);
            this.visitaLocal.fechaIngreso = fechaIngreso.toISOString().slice(0, 10); // Solo fecha sin tiempo
          }
          // Convertir fechaAlta al formato 'YYYY-MM-DD' si no es null
          if (this.visitaLocal.fechaAlta) {
            const fechaAlta = new Date(this.visitaLocal.fechaAlta);
            this.visitaLocal.fechaAlta = fechaAlta.toISOString().slice(0, 10); // Solo fecha sin tiempo
          }
        } else {
          this.resetVisitaLocal();
        }
      },
    },
  },
  methods: {
    save() { 
      this.visitaLocal.StockArea = this.stockAreas.filter(stockAreas => stockAreas.id == this.visitaLocal.StockArea)[0]
      this.visitaLocal.User = this.usuarios.filter(user => user.id == this.visitaLocal.User)[0]
      if(!this.visitaLocal.StockArea && this.isEditing) {
        this.visitaLocal.StockArea  = this.visita.StockArea
      }
      if(!this.visitaLocal.User && this.isEditing){
        this.visitaLocal.User = this.visita.User
      }
      this.$emit('save', this.visitaLocal);
      this.closeDialog()
    },
    closeDialog() {
      this.$emit('update:modelValue', false);
      this.resetVisitaLocal(); 
    },
    resetVisitaLocal() {
      this.visitaLocal = {
        User: {
          id: '',
          fullName: '',
          StockArea: {
            id: '',
            nombre: '',
            Area: {
              id: '',
              nombre: '',
            }
          },
        },
        diagnostico: '',
        fechaIngreso: '',
        fechaAlta: '',
        seInterno: false,
      }
    },
  }
}
</script>