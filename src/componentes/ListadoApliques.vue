<template>
  <v-dialog v-model="isDialogVisible" persistent max-width="1200px">
    <v-card>
      <v-card-title>
        <span class="headline">Historial Apliques</span>
        <span class="headline"> {{ this.pacienteId.nombre }} {{ this.pacienteId.apellido }}</span>
      </v-card-title>
      <v-card-actions style="justify-content: center;">
        <v-btn class="btn-blue" text v-if="globalStore.rolId <=globalStore.getRolAutorizante" @click="openAgregarApliqueDialog">
          Agregar Aplique
        </v-btn>
        <v-btn class="btn-blue" text @click="closeDialog">Cerrar</v-btn>
      </v-card-actions>

      <Listado :items="valoresTabla" :headers="apliquesHeaders" :usuarios="usuarios" :isListadoApliques="true" @edit="openEditarApliqueDialog"
        @delete="confirmDeleteAplique" />

      <v-dialog persistent v-model="apliqueDialogVisible" max-width="500px">
        <ApliqueDialog
          v-model="apliqueDialogVisible"
          :is-editing="isEditing"
          :aplique="apliqueToEdit"
          :paciente-id="this.pacienteId"
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
import Listado from './Listado.vue';
import ApliqueDialog from './ApliqueDialog.vue';
import ConfirmDialog from './ConfirmDialog.vue';
import apliqueService from './servicios/apliqueService.js';
import { useGlobalStore } from '@/stores/global';
 import { formatearFecha } from '@/utils/formatearFecha';
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
    Listado,
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
        { text: 'Fecha Aplicación', value: 'fechaAplicacion' },
        { text: 'Área', value: 'areaNombre'},
        { text: 'Sub Área', value: 'stockAreaNombre' },
        { text: '', value: '' },
      ],
      pacienteNombreCompleto: '',
      apliques: [],
      apliqueDialogVisible: false,
      isEditing: false,
      apliqueToEdit: null,
      confirmDeleteDialog: false,
      apliqueIdToDelete: null,
      globalStore: useGlobalStore(),
    };
  },
  async mounted() {
   
    await this.loadApliques();
      console.log(this.pacienteId, "AVER SI LLEGA COMO UNDEFINED?")
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
          fechaAplicacion: formatearFecha(aplique.fechaAplicacion),
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
    closeDialog() {
      this.$emit('update:modelValue', false);
    },
  
    
    async loadApliques() {

      try {
        this.apliques = await apliqueService.getApliquesByPacienteId(this.pacienteId.id);
        
      } catch (error) {
        console.error('Error al cargar apliques:', error);
      }
    
      try {
        const apliquesRaw = await apliqueService.getApliquesByPacienteId(this.pacienteId.id);
        this.apliques = this.mapApliques(apliquesRaw);
      } catch (error) {
        console.error('Error al cargar apliques:', error);
      }
    },
   
   
     openAgregarApliqueDialog() {
      this.isEditing = false;
      this.apliqueToEdit = null; 
      this.apliqueDialogVisible = true; 
    },
    openEditarApliqueDialog(apliqueId) {
      this.isEditing = true;
      const aplique = this.apliques.find(apl => apl.id ==apliqueId)
      this.apliqueToEdit = { ...aplique};
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
        } else {
          this.apliques.push(resultado);
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