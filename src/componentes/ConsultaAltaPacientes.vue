<template>
  <div>
    <v-card class="custom-container ">
      <v-card-title class="d-flex align-center pe-2">
        <v-text-field v-model="searchDni" density="compact" label="Buscar por DNI o Apellido"
          prepend-inner-icon="mdi-magnify" variant="solo" hide-details single-line
          class="rounded-search-bar"></v-text-field>

        <v-select v-model="searchGenero" :items="generos" label="Género" density="compact" variant="solo"
          hide-details></v-select>

        <v-spacer></v-spacer>
        <v-btn v-if="globalStore.rolId <= 2" @click="openAgregarDialog" class="mx-2 btn-blue">Agregar Paciente</v-btn>
      </v-card-title>

      <Listado :items="pacientesFiltradosFormateados" :headers="pacientesHeaders" :isListadoPacientes="true"
        @edit="openEditarDialog" @delete="confirmDelete" @ver-historial="openListadoApliques"
        @crear-aplique="openApliqueDialog" />

      <PacienteDialog ref="pacienteDialog" v-model="agregarDialog" :is-editing="false" @save="addPaciente"
        :error-mensaje="errorMensaje" @update:errorMensaje="errorMensaje = ''" />

      <PacienteDialog v-model="editarDialog" :is-editing="true" :paciente="pacienteEdit" @save="editarPaciente"
        :error-mensaje="errorMensaje" @update:errorMensaje="errorMensaje = ''" />

      <v-dialog persistent v-model="apliqueDialogVisible" max-width="600px">
        <ApliqueDialog v-model="apliqueDialogVisible" :is-editing="isEditing" :paciente-id="selectedPacienteId"
          :areas="stockAreas" :usuarios="usuarios" :medicamentos="medicamentos" @save="saveApliqueFromDialog" @delete="confirmDeleteAplique" />
      </v-dialog>
      
      <ListadoApliques v-model="listadoApliquesVisible" :paciente-id="selectedPacienteId" :areas="stockAreas" :usuarios="usuarios"
        :medicamentos="medicamentos"  />
          
      <ConfirmDialog :isDelete="true" v-model="deleteDialog" title="Confirmar Eliminación"
        text="¿Estás seguro de que deseas eliminar este paciente?" @confirm="deletePaciente" />
    </v-card>
  </div>
</template>

<script>
import Listado from './Listado.vue';
import PacienteDialog from './PacienteDialog.vue';
import ConfirmDialog from './ConfirmDialog.vue';
import pacienteService from './servicios/pacienteService';
import { differenceInYears } from 'date-fns'
import { formatearFecha } from '@/utils/formatearFecha';
import ApliqueDialog from './ApliqueDialog.vue';
import ListadoApliques from './ListadoApliques.vue';
import { useGlobalStore } from '@/stores/global';
import { saveApliqueHelper } from '../utils/apliqueHelper.js';
import itemService from './servicios/itemService';
export default {
  components: {
    Listado,
    PacienteDialog,
    ConfirmDialog,
    ApliqueDialog,
    ListadoApliques
  },
  data() {
    return {
      searchDni: '',
      searchGenero: 'Todos',
      generos: ['Todos', 'Masculino', 'Femenino', 'No binario'],
      agregarDialog: false,
      editarDialog: false,
      isEditing: false,
      deleteDialog: false,
      pacienteEdit: {},
      confirmDeleteId: null,
      apliqueDialogVisible: false,
      listadoApliquesVisible: false,
      selectedPacienteId: null,
      errorMensaje: '',
      stockAreas: [],
      usuarios: [],
      pacientes: [],
      medicamentos: [],
      globalStore: useGlobalStore()
    };
  },
  computed: {
    pacientesHeaders() {
      return [
        { text: 'DNI', value: 'dni' },
        { text: 'Nombre', value: 'nombre' },
        { text: 'Apellido', value: 'apellido' },
        { text: 'Genero', value: 'genero' },
        { text: 'Edad', value: 'edad' },
        { text: 'Fecha Nacimiento', value: 'fechaNacimiento' },
        { text: '', value: '' }
      ];
    },
    pacientesFiltradosFormateados() {
      const pacientesFiltrados = this.filtrarPacientes();
      return this.formatearPacientes(pacientesFiltrados);
    }
  },
  async mounted() {
    this.loadPacientes();
    this.loadMedicamentos();

  },
  watch: {
    'globalStore.getAreas': {
      handler(newAreas) {
        if (newAreas.length) {
          this.stockAreas = newAreas;
        }
      },
      immediate: true,
    },
    'globalStore.getUsuarios': {
      handler(newUsuarios) {
        if (newUsuarios.length) {
          this.usuarios = newUsuarios;
        }
      },
      immediate: true,
    },
  },
  methods: {
    async loadMedicamentos() {
      const response = await itemService.getAllItem()
      console.log(response, "CARGA MEDICAMENTOS EN PACIENTE")
      this.medicamentos = response
    },
    formatearPacientes(pacientesFiltrados) {
      return pacientesFiltrados.map(paciente => ({
        id: paciente.id,
        dni: paciente.dni,
        nombre: paciente.nombre,
        apellido: paciente.apellido,
        genero: paciente.genero,
        edad: this.calcularEdad(paciente.fechaNacimiento),
        fechaNacimiento: this.formatearFecha(paciente.fechaNacimiento),
      }));
    },
    filtrarPacientes() {
      return this.pacientes.filter(paciente => {
        const dniApellidoMatch = this.searchDni
          ? paciente.dni.includes(this.searchDni) ||
          paciente.apellido.toLowerCase().includes(this.searchDni.toLowerCase())
          : true;
        const generoMatch =
          this.searchGenero && this.searchGenero !== 'Todos'
            ? paciente.genero === this.searchGenero
            : true;
        return dniApellidoMatch && generoMatch;
      });
    },
    async loadPacientes() {
      this.pacientes = await pacienteService.getAllPaciente();
    },
    formatearFecha(fecha) {
      return formatearFecha(fecha)
    },
    calcularEdad(fechaNacimiento) {
      return differenceInYears(new Date(), new Date(fechaNacimiento))
    },
    async addPaciente(nuevoPaciente) {
      try {
        const pacienteCreado = await pacienteService.createPaciente(nuevoPaciente);
        if (pacienteCreado) {
          this.pacientes.push(pacienteCreado);
          this.agregarDialog = false;
          this.errorMensaje = '';
        }
      } catch (error) {
        this.errorMensaje = error.response?.data?.message || 'Error al agregar el paciente.';
        console.error('Error al agregar paciente:', error);
        this.agregarDialog = true;
      }
      this.loadPacientes();
    },
    async editarPaciente(pacienteEditado) {
      try {
        const pacienteActualizado = await pacienteService.updatePaciente(pacienteEditado);
        const index = this.pacientes.findIndex(p => p.id === pacienteActualizado.id);
        if (index !== -1) {
          this.pacientes.splice(index, 1, pacienteActualizado);
        }
        this.editarDialog = false;
        this.errorMensaje = '';
      } catch (error) {
        this.errorMensaje = error.response?.data?.message || 'Error al actualizar el paciente.';
        console.error('Error al actualizar paciente:', error);
        this.editarDialog = true;
      }
      this.loadPacientes();
    },
    openApliqueDialog(pacienteId) {
      this.selectedPacienteId = pacienteId;
      this.isEditing = false;
      this.apliqueDialogVisible = true;
    },
    openListadoApliques(paciente) {
      this.selectedPacienteId = String(paciente.id);
      this.listadoApliquesVisible = true;
    },
    handleSaveAplique() {
      this.apliqueDialogVisible = false;
    },
    async saveApliqueFromDialog(nuevoAplique) {
      try {
        const resultado = await saveApliqueHelper(this.isEditing, this.selectedPacienteId.id, nuevoAplique);
        if (!this.isEditing) {
          console.log(resultado);
        }
        this.apliqueDialogVisible = false;
      } catch (error) {
        console.error('Error al guardar aplique desde ConsultaAltaPacientes:', error);
      }
    },
    saveApliqueFromListado(nuevoAplique) {

      this.$refs.listadoApliques.saveAplique(nuevoAplique);
      this.apliqueDialogVisible = false;
    },
    openAgregarDialog() {
      this.$refs.pacienteDialog.resetPacienteLocal();
      this.pacienteEdit = {};
      this.errorMensaje = '';
      this.agregarDialog = true;
    },
    openEditarDialog(paciente) {
      this.pacienteEdit = { ...paciente };
      this.errorMensaje = '';
      this.editarDialog = true;
    },
    confirmDelete(id) {
      this.confirmDeleteId = id;
      this.deleteDialog = true;
    },
    async deletePaciente() {
      try {
        await pacienteService.deletePaciente(this.confirmDeleteId);
        this.pacientes = this.pacientes.filter(p => p.id !== this.confirmDeleteId);
        this.deleteDialog = false;
      } catch (error) {
        console.error('Error al eliminar paciente:', error);
      }
    },
  },
};
</script>