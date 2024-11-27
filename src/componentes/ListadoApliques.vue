<template>
  <v-dialog v-model="isDialogVisible" persistent max-width="1200px">
    <v-card>
      <v-card-title>
        <span class="headline">Historial de Apliques de {{ this.paciente.nombre }} {{ this.paciente.apellido }}</span>
        <v-btn class="btn-icon" icon small @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        
      </v-card-title>

      <Tabla
        :data="valoresTabla"
        :headers="apliquesHeaders"
        :isListadoApliques="true"
        @edit="openEditarApliqueDialog"
        @delete="confirmDeleteAplique"
      />

      <v-dialog persistent v-model="apliqueDialogVisible" max-width="500px">
        <ApliqueDialog
          v-model="apliqueDialogVisible"
          :is-editing="isEditing"
          :aplique="apliqueToEdit"
          :paciente-id="paciente"
          :areas="areas" :stockAreas="stockAreas"
          :usuarios="usuarios"
          :medicamentos="medicamentos" @save="saveAplique"
        />
      </v-dialog>

      <ConfirmDialog :isDelete="true" v-model="confirmDeleteDialog" title="Confirmar Eliminación"
        text="¿Estás seguro de que deseas eliminar este aplique?" @confirm="deleteAplique" />
    </v-card>
  </v-dialog>
</template>

<script>
import Tabla from './Tabla.vue';
import ApliqueDialog from './ApliqueDialog.vue';
import ConfirmDialog from './ConfirmDialog.vue';
import apliqueService from './servicios/apliqueService.js';
import { formatearFechaYHora } from '@/utils/utils';
import { saveApliqueHelper } from '../utils/apliqueHelper.js';

export default {
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    visita: {
      type: Object,
      required: true
    },
    areas: Array,
    stockAreas: Array,
    usuarios: Array,
    paciente: {
      type: Object,
      required: true,
    },
    medicamentos: Array
  },
  components: {
    Tabla,
    ApliqueDialog,
    ConfirmDialog,
  },
  data() {
    return {
      apliquesHeaders: [
        { text: 'Aplicante', value: 'aplicanteNombre' },
        { text: 'SKU', value: 'sku' },
        { text: 'Descripcion', value: 'descripcion' },
        { text: 'Cantidad', value: 'cantidad' },
        { text: 'Fecha y Hora Aplique', value: 'fechaAplicacion' },
        { text: 'Área', value: 'areaNombre' },
        { text: 'Sub Área', value: 'stockAreaNombre' },
        { text: '', value: '', sortable: false },
      ],

      apliques: [],
      apliqueDialogVisible: false,
      isEditing: false,
      apliqueToEdit: null,
      confirmDeleteDialog: false,
      apliqueIdToDelete: null,
    };
  },

  computed: {
    valoresTabla() {

      return this.apliques.map(aplique => {

        return {
          id: aplique.id,
          aplicanteNombre: aplique.User.fullName,
          sku: aplique.Medicamento.sku,
          descripcion: aplique.Medicamento.descripcion,
          cantidad: aplique.cantidad,
          fechaAplicacion: this.formatearFecha(aplique.fechaAplicacion),
          areaNombre: aplique.StockArea.Area.nombre,
          stockAreaNombre: aplique.StockArea.nombre,

        };

      });
    },


    isDialogVisible: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit('update:modelValue', value);
      }
    }
  },
  watch: {
    paciente: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.loadApliques();

        }
      }
    },
    modelValue(val) {
      if (!val) this.closeDialog();
    },

  },
  methods: {

    formatearFecha(fecha) {
      return formatearFechaYHora(fecha)
    },
    closeDialog() {
      this.$emit('update:modelValue', false);
    },


    async loadApliques() {
      try {
        console.log(this.apliques,"APLIQUES")
        console.log(this.visita,"VIIISIIIIITAAAAA")
        const visitaId = this.visita.id
        console.log(visitaId, "ID DE LA VISITA")
        this.apliques = await apliqueService.getApliquesByVisitaId(visitaId);
        console.log(this.apliques,"APLIQUES")
      } catch (error) {
        console.error('Error al cargar apliques:', error);
      }
    },

    openEditarApliqueDialog(aplique) {
   this.isEditing = true;
   const apliqueId = aplique.id;
   const apliqueSinMap = this.apliques.find(apl => apl.id == apliqueId);
   const formattedAplique = { ...apliqueSinMap };
   
   if (formattedAplique.fechaAplicacion) {
      const fechaAplicacion = new Date(formattedAplique.fechaAplicacion);
      formattedAplique.fechaAplicacion = fechaAplicacion.toISOString().split('.')[0];
   }

   this.apliqueToEdit = formattedAplique;
   this.apliqueDialogVisible = true;
},
    async saveAplique(nuevoAplique) {
      try {
        
        const resultado = await saveApliqueHelper(this.isEditing, nuevoAplique);
        if (this.isEditing) {
          const index = this.apliques.findIndex(a => a.id === resultado.id);
          if (index !== -1) {
            this.apliques.splice(index, 1, resultado);
          }
        }
        this.apliqueDialogVisible = false;
      } catch (error) {
        console.error('Error al guardar aplique:', error);
      }
      this.loadApliques();
    },

    confirmDeleteAplique(apliqueId) {
      this.apliqueIdToDelete = apliqueId;
      this.confirmDeleteDialog = true;
    },

    async deleteAplique() {
      try {
        await apliqueService.deleteAplique(this.apliqueIdToDelete);
        this.apliques = this.apliques.filter(aplique => aplique.id !== this.apliqueIdToDelete);
        this.confirmDeleteDialog = false;
      } catch (error) {
        console.error('Error al eliminar aplique:', error);
      }
    },
  }
};
</script>