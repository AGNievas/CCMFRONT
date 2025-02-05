<template>
  <v-dialog v-model="isDialogVisible" persistent max-width="1200px">
    <v-card>
      <v-card-title>
        <span class="headline">Historial Apliques</span>
        <span class="headline">{{ pacienteNombreCompleto }}</span>
      </v-card-title>
      <v-card-actions style="justify-content: center;">
        <v-btn class="btn-blue" text v-if="globalStore.rolId <= 2" @click="openAgregarApliqueDialog">
          Agregar Aplique
        </v-btn>
        <v-btn class="btn-blue" text @click="closeDialog">Cerrar</v-btn>
      </v-card-actions>

      <Listado :items="apliques" :headers="apliquesHeaders" :isListadoApliques="true" @edit="openEditarApliqueDialog"
        @delete="confirmDeleteAplique" />

      <v-dialog persistent v-model="apliqueDialogVisible" max-width="500px">
        <ApliqueDialog
          v-model="apliqueDialogVisible"
          :is-editing="isEditing"
          :aplique="apliqueToEdit"
          :paciente-id="pacienteId"
          :areas="stockAreas"
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
import stockAreaService from './servicios/stockAreaService';
import usuariosService from './servicios/usuariosService';
import { useGlobalStore } from '@/stores/global';
import { formatearFecha } from '@/utils/formatearFecha';
import PacienteService from './servicios/pacienteService';
import { saveApliqueHelper } from '../utils/apliqueHelper.js';

export default {
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    pacienteId: String,
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
        { text: 'Área', value: 'stockAreaNombre' },
        { text: '', value: '' },
      ],
      pacienteNombreCompleto: '',
      apliques: [],
      stockAreas: [],
      usuarios: [],
      apliqueDialogVisible: false,
      isEditing: false,
      apliqueToEdit: null,
      confirmDeleteDialog: false,
      apliqueIdToDelete: null,
      globalStore: useGlobalStore(),
    };
  },
  async mounted() {
    await this.loadStockAreas();
    await this.loadUsuarios();
    await this.loadApliques();
    if (this.pacienteId) {
      this.loadPacienteNombreCompleto();
    }
  },
  computed: {
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
          this.loadPacienteNombreCompleto();
        }
      }
    },
    modelValue(val) {
      if (!val) this.closeDialog();
    }
  },
  methods: {
    closeDialog() {
      this.$emit('update:modelValue', false);
    },
    async loadPacienteNombreCompleto() {
      try {
        const paciente = await PacienteService.getPacienteById(this.pacienteId);
        this.pacienteNombreCompleto = `${paciente.nombre} ${paciente.apellido}`;
      } catch (error) {
        console.error('Error al cargar nombre completo del paciente:', error);
      }
    },
    async loadApliques() {
      try {
        const apliquesRaw = await apliqueService.getApliquesByPacienteId(this.pacienteId);
        this.apliques = this.mapApliques(apliquesRaw);
      } catch (error) {
        console.error('Error al cargar apliques:', error);
      }
    },
    mapApliques(apliquesRaw) {
      return apliquesRaw.map(aplique => {
        const stockArea = this.stockAreas.find(area => area.id === aplique.stockAreaId);
        const usuario = this.usuarios.find(user => user.id === aplique.aplicante);
        const medicamento = this.medicamentos.find(medicamento => medicamento.sku === aplique.sku)
        return {
          id: aplique.id, 
          aplicanteNombre: usuario ? usuario.fullName : 'Desconocido',
          sku: aplique.sku,
          descripcion : medicamento.descripcion,
          cantidad: aplique.cantidad,
          fechaAplicacion: formatearFecha(aplique.fechaAplicacion),
          stockAreaNombre: stockArea ? stockArea.nombre : 'Desconocido',
        };
      });
    },
    async loadStockAreas() {
      this.stockAreas = await stockAreaService.getAllStockArea();
    },
    async loadUsuarios() {
      const stockAreaId = this.globalStore.stockAreaId;
      this.usuarios = await usuariosService.getAllUsuariosByStockAreaId(stockAreaId);
    },
    openAgregarApliqueDialog() {
      this.isEditing = false;
      this.apliqueToEdit = null; 
      this.apliqueDialogVisible = true; 
    },
    openEditarApliqueDialog(aplique) {
      this.isEditing = true;
      this.apliqueToEdit = { ...aplique };
      this.apliqueDialogVisible = true; 
    },
    async saveAplique(nuevoAplique) {
      try {
        const resultado = await saveApliqueHelper(this.isEditing, this.pacienteId, nuevoAplique);
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