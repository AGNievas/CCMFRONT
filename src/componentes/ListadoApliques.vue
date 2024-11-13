<template>
  <v-dialog v-model="isDialogVisible" persistent max-width="1200px">
    <v-card>
      <v-card-title>
        <span class="headline">Historial Apliques</span>
        <span class="headline"> {{ this.pacienteId.nombre }} {{ this.pacienteId.apellido }}</span>
      </v-card-title>
      <v-card-actions class="jcc">
        <v-btn class="btn-blue" text @click="closeDialog">Cerrar</v-btn>
      </v-card-actions>

      <Tabla :data="valoresTabla" :headers="apliquesHeaders" :isListadoApliques="true" @edit="openEditarApliqueDialog"
        @delete="confirmDeleteAplique" />

      <v-dialog persistent v-model="apliqueDialogVisible" max-width="500px">
        <ApliqueDialog
          v-model="apliqueDialogVisible"
          :is-editing="isEditing"
          :aplique="apliqueToEdit"
          :paciente-id="pacienteId"
          :areas="areas"
          :stockAreas="stockAreas"
          :usuarios="usuarios"
          :medicamentos="medicamentos"
          @save="saveAplique"
        />
      </v-dialog>

      <ConfirmDialog
        :isDelete="true"
        v-model="confirmDeleteDialog"
        title="Confirmar Eliminación"
        text="¿Estás seguro de que deseas eliminar este aplique?"
        @confirm="deleteAplique"
      />
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
    areas: Array,
    stockAreas: Array,
    usuarios: Array,
    pacienteId: {
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
        { text: 'Área', value: 'areaNombre'},
        { text: 'Sub Área', value: 'stockAreaNombre' },
        { text: '', value: '' },
      ],
      
      apliques: [],
      apliqueDialogVisible: false,
      isEditing: false,
      apliqueToEdit: null,
      confirmDeleteDialog: false,
      apliqueIdToDelete: null,
    };
  },
   mounted() {
   
     this.loadApliques();
      
  },
  computed: {
    valoresTabla(){
      
      return this.apliques.map(aplique => {
        
         return {
          id: aplique.id, 
          aplicanteNombre: aplique.User.fullName,
          sku: aplique.Medicamento.sku,
          descripcion : aplique.Medicamento.descripcion,
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
    pacienteId: {
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

    formatearFecha(fecha){
      return formatearFechaYHora(fecha)
    },
    closeDialog() {
      this.$emit('update:modelValue', false);
    },
  
    
    async loadApliques() {
      try {
        this.apliques = await apliqueService.getApliquesByPacienteId(this.pacienteId.id);
      } catch (error) {
        console.error('Error al cargar apliques:', error);
      }
    },
   
    openEditarApliqueDialog(aplique) {
      this.isEditing = true;
      const apliqueId= aplique.id
      const apliqueSinMap = this.apliques.find(apl => apl.id ==apliqueId)
      this.apliqueToEdit = { ...apliqueSinMap};
      this.apliqueDialogVisible = true; 
    },
    async saveAplique(nuevoAplique) {
      try {
        const resultado = await saveApliqueHelper(this.isEditing, this.pacienteId.id, nuevoAplique);
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