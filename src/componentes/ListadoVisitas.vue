<template>
  <v-dialog v-model="isDialogVisible" persistent max-width="1500px">
    <v-card>
      <v-card-title>
        <span class="headline">Historial de Visitas de {{ this.paciente.nombre }} {{ this.paciente.apellido }}</span>
        <v-btn class="btn-icon" icon small @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-actions class="jcc">
        <v-btn v-if="puedeAgregarVisita" class="btn-blue" text @click="openAddVisitaDialog">Agregar Visita</v-btn>
      </v-card-actions>
      <Tabla :data="valoresTabla" :headers="visitasHeader" :isListadoVisitas="true" @darAlta="openAltaDialog"
        @edit="openEditarVisitaDialog" @delete="confirmDeleteVisita" @ver-historial="openListadoApliques"
        @crear-aplique="openApliqueDialog" />

      <v-dialog persistent v-model="apliqueDialogVisible" max-width="600px">
        <ApliqueDialog v-model="apliqueDialogVisible" :paciente="paciente" :visita="selectedVisita"
          :areas="globalStore.getAreas" :stockAreas="globalStore.getStockAreas" :usuarios="globalStore.getUsuarios"
          :medicamentos="medicamentos" @save="saveApliqueFromDialog" @delete="confirmDelete" />
      </v-dialog>

      <ListadoApliques v-if="listadoApliquesVisible" v-model="listadoApliquesVisible" :visita="selectedVisita"
        :areas="globalStore.getAreas" :usuarios="globalStore.getUsuarios" :paciente="paciente"
        :medicamentos="medicamentos" />

      <VisitasDialog v-if="visitaDialogVisible" v-model="visitaDialogVisible" :isEditing="isEditing"
        :visita="selectedVisita" :paciente="paciente" :usuarios="usuarios" :darAlta="darAlta" :stockAreas="stockAreas"
        :areas="areas" @save="saveVisita" :errorMensaje="errorMensaje" @update:errorMensaje="errorMensaje = ''" />

      <ConfirmDialog :isDelete="true" v-model="visitaDeleteDialog" title="Confirmar Eliminación"
        text="¿Estás seguro de que deseas eliminar esta visita?" @confirm="deleteVisita" />
    </v-card>
  </v-dialog>
</template>


<script>
import VisitasDialog from './VisitasDialog.vue';
import Tabla from './Tabla.vue';
import ApliqueDialog from './ApliqueDialog.vue';
import ListadoApliques from './ListadoApliques.vue';
import { useGlobalStore } from '@/stores/global';
import { saveApliqueHelper } from '@/utils/apliqueHelper';
import visitaService from './servicios/visitaService';
import ConfirmDialog from './ConfirmDialog.vue';
export default {
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    areas: Array,
    stockAreas: Array,
    usuarios: Array,
    paciente: {
      type: Object,
      required: true,
    },
    medicamentos: Array,
  },
  components: {
    Tabla,
    ApliqueDialog,
    ListadoApliques,
    VisitasDialog,
    ConfirmDialog
  },
  data() {
    return {
      visitasHeader:
        [
          { text: 'Medico', value: 'usuarioFullName' },
          { text: 'Diagnostico', value: 'diagnostico' },
          { text: 'Fecha Ingreso', value: 'fechaIngreso' },
          { text: 'Fecha Alta', value: 'fechaAlta' },
          { text: 'Requiere Internacion', value: 'seInterno' },
          { text: 'Sub Area', value: 'stockAreaNombre' },
          { text: 'Area', value: 'areaNombre' },
          { text: '', value: '', sortable: false }
        ],
      searchDate: '',
      agregarDialog: false,
      editarDialog: false,
      selectedVisita: false,
      visitaToDelete: '',
      visitaDeleteDialog: false,
      visitaDialogVisible: false,
      isEditing: false,
      errorMensaje: '',
      visitas: [],
      darAlta: false,
      globalStore: useGlobalStore(),
      apliqueDialogVisible: false,
      listadoApliquesVisible: false,
      editingAplique: false,
    }
  },
  async mounted() {
    this.loadVisitas()
  },
  computed: {
    valoresTabla() {
      return this.visitas.map(vis => {
        return {
          id: vis.id,
          usuarioFullName: vis.User.fullName,
          diagnostico: vis.diagnostico,
          fechaIngreso: this.tiempoUniversalATiempoLocal(vis.fechaIngreso),
          fechaAlta: vis.fechaAlta != null ? this.tiempoUniversalATiempoLocal(vis.fechaAlta) : '',
          seInterno: vis.seInterno ? 'Si' : 'No',
          stockAreaNombre: vis.StockArea.nombre,
          areaNombre: vis.StockArea.Area.nombre,
        };
      },);
    },
    isDialogVisible: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit('update:modelValue', value);
      }
    },
    puedeAgregarVisita() {
      return this.globalStore.getAreaId != this.globalStore.getFarmaciaId || this.globalStore.getRolId == this.globalStore.getRolSuperAdmin
    }
  },
  watch: {
    paciente: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.loadVisitas()
        }
      }
    },
    modelValue(val) {
      if (!val) this.closeDialog();
    }
  },
  methods: {
    tiempoUniversalATiempoLocal(fecha) {
      const fechaLocal = new Date(fecha)
      return fechaLocal.toLocaleString();
    },
    closeDialog() {
      this.$emit('update:modelValue', false);
    },
    async loadVisitas() {
      try {
        this.visitas = await visitaService.getVisitasByPacienteId(this.paciente.id)
      } catch (error) {
        console.log('Error al cargar las visitas: ', error)
      }
    },
    openAddVisitaDialog() {
      this.darAlta = false;
      this.isEditing = false,
        this.selectedVisita = {},
        this.errorMensaje = '',
        this.visitaDialogVisible = true
    },
    openEditarVisitaDialog(visita) {
      this.darAlta = false;
      this.isEditing = true;
      const visitaId = visita.id;
      const visitaSinMap = this.visitas.find((vis) => vis.id === visitaId);
      const formattedVisita = { ...visitaSinMap };
      if (formattedVisita.fechaIngreso) {
        formattedVisita.fechaIngreso = new Date(formattedVisita.fechaIngreso)
          .toISOString()
          .slice(0, 16);
      }
      if (formattedVisita.fechaAlta) {
        formattedVisita.fechaAlta = new Date(formattedVisita.fechaAlta)
          .toISOString()
          .slice(0, 16);
      }
      this.selectedVisita = formattedVisita;
      this.visitaDialogVisible = true;
    },
    openAltaDialog(visita) {
      this.darAlta = true;
      const visitaId = visita.id;
      const visitaSinMap = this.visitas.find(vis => vis.id == visitaId)
      this.selectedVisita = { ...visitaSinMap };
      this.visitaDialogVisible = true;
    },
    confirmDeleteVisita(visita) {

      this.visitaToDelete = visita;
      this.visitaDeleteDialog = true;
    },
    async deleteVisita() {
      try {
        await visitaService.delete(this.visitaToDelete);
        this.visitas = this.visitas.filter(visita => visita.id !== this.visitaToDelete);
        this.visitaDeleteDialog = false;
      } catch (error) {
        console.error('Error al eliminar visita:', error);
      }
    },
    async saveVisita(nuevaVisita) {
      try {
        if (!this.isEditing && !this.darAlta) {
          const visitaCreada = await visitaService.createVisita(nuevaVisita, this.paciente.id);
          if (visitaCreada) {
            this.agregarDialog = false;
            this.errorMensaje = '';
          }
        }
        if (this.isEditing) {
          const visitaModificada = await visitaService.updateVisita(nuevaVisita, this.paciente.id);
          if (visitaModificada) {
            this.editarDialog = false;
            this.errorMensaje = '';
          }
        }
        if (this.darAlta) {
          const visitaAlta = { ...this.selectedVisita }
          visitaAlta.fechaAlta = nuevaVisita.fechaAlta
          const visitaModificada = await visitaService.updateVisita(visitaAlta, this.paciente.id);
          if (visitaModificada) {
            this.editarDialog = false;
            this.errorMensaje = '';
          }
        }
      } catch (error) {
        this.errorMensaje = error.response?.data?.message || !this.isEditing ? 'Error al crear visita' : 'Error al editar Visita';
        console.log('Error al agregar Visita: ', error)
        !this.isEditing ? this.agregarDialog = true : this.editarDialog = true;
      } finally {
        this.loadVisitas()
      }
    },
    async editarVisita(selectedVisita) {
      try {
        const visitaActualizar = await visitaService.updateVisita(selectedVisita);
        const index = this.visitas.findIndex(vis => vis.id == visitaActualizar.id);
        if (index !== -1) {
          this.visitas.splice(index, 1, visitaActualizar);
        }
        this.editarDialog = false;
        this.errorMensaje = '';
      } catch (error) {
        this.errorMensaje = error.response?.data?.message || 'Error al actualizar visita';
        console.log('Error al actualizar visita: ', error);
        this.editarDialog = true;
      }
      finally {
        this.loadVisitas()
      }
    },
    openApliqueDialog(visita) {
      this.selectedVisita = visita;
      this.editingAplique = false;
      this.apliqueDialogVisible = true;
    },
    openListadoApliques(visita) {
      this.selectedVisita = visita;
      this.listadoApliquesVisible = true;
    },
    async saveApliqueFromDialog(nuevoAplique) {
      try {

        const resultado = await saveApliqueHelper(this.isEditing, nuevoAplique, this.selectedVisita.id,);
        if (!this.isEditing) {
          console.log(resultado);
        }
        this.apliqueDialogVisible = false;
      } catch (error) {
        console.error('Error al guardar aplique desde Listado Visitas:', error);
      }
    },
  }
}
</script>