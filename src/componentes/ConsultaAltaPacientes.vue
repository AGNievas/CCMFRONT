<template>
  <div>
    <v-card class="custom-container">
      <v-card-title class="d-flex align-center pe-2">
        <v-text-field
          v-model="searchDni"
          density="compact"
          label="Buscar por DNI"
          prepend-inner-icon="mdi-magnify"
          variant="solo"
          hide-details
          single-line
          class="rounded-search-bar"
        ></v-text-field>
        <v-select v-model="searchGenero" :items="generos" label="Género"></v-select>
        <v-spacer></v-spacer>
        <v-btn @click="openAgregarDialog" class="mx-2 btn-blue">Agregar Paciente</v-btn>
      </v-card-title>

      <!-- Usamos el componente Listado -->
      <Listado :items="pacientesFiltradosFormateados" :headers="pacientesHeaders" @edit="openEditarDialog" @delete="confirmDelete" />
      
      <!-- Diálogos -->
      <PacienteDialog v-model="agregarDialog" :is-editing="false" @save="addPaciente" />
      <PacienteDialog v-model="editarDialog" :is-editing="true" :paciente="pacienteEdit" @save="editarPaciente" />
      <ConfirmDialog
        v-model="deleteDialog"
        title="Confirmar Eliminación"
        text="¿Estás seguro de que deseas eliminar este paciente?"
        @confirm="deletePaciente"
      />
    </v-card>
  </div>
</template>

<script>
import Listado from './Listado.vue';
import PacienteDialog from './PacienteDialog.vue';
import ConfirmDialog from './ConfirmDialog.vue';
import pacienteService from './servicios/pacienteService';

export default {
  components: {
    Listado,
    PacienteDialog,
    ConfirmDialog,
  },
  data() {
    return {
      searchDni: '',
      searchGenero: '',
      generos: ['Indistinto', 'Masculino', 'Femenino', 'No binario'],
      pacientes: [], // Lista completa de pacientes
      agregarDialog: false,
      editarDialog: false,
      deleteDialog: false,
      pacienteEdit: {},
      confirmDeleteId: null,
    };
  },
  computed: {

    pacientesHeaders(){
      return [
        {text: 'DNI', value: 'dni'},
        {text: 'Nombre', value: 'nombre'},
        {text: 'Apellido', value: 'apellido'},
        {text: 'Fecha Nacimiento', value: 'fechaNacimiento'},
        {text: 'Genero', value: 'Genero'},
      ]
    },
    pacientesFiltradosFormateados() {
    return this.pacientes
      .filter(paciente => {
        const dniMatch = this.searchDni
          ? paciente.dni.includes(this.searchDni)
          : true;
        const generoMatch =
          this.searchGenero && this.searchGenero !== 'Indistinto'
            ? paciente.genero === this.searchGenero
            : true;
        return dniMatch && generoMatch;
      })
      .map(paciente => ({
        id: paciente.id, // Asegúrate de mantener el ID
        dni: paciente.dni,
        nombre: paciente.nombre,
        apellido: paciente.apellido,
        genero: paciente.genero,
        fechaNacimiento: this.formatearFecha(paciente.fechaNacimiento),
      }));
  },

  },
  async mounted() {
   this.loadPacientes() ;
  },
  methods: {

    async loadPacientes(){
      this.pacientes = await pacienteService.getAllPaciente();
    },
    formatearFecha(fecha) {
      const date = new Date(fecha);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
    openAgregarDialog() {
      this.pacienteEdit = {};
      this.agregarDialog = true;
    },
    async addPaciente(nuevoPaciente) {
      try {
        const pacienteCreado = await pacienteService.createPaciente(nuevoPaciente);
        if (pacienteCreado) {
          this.pacientes.push(pacienteCreado);
          this.agregarDialog = false;
        }
      } catch (error) {
        console.error('Error al agregar paciente:', error);
      }
      this.loadPacientes();
    },
    openEditarDialog(paciente) {
      this.pacienteEdit = { ...paciente };
      this.editarDialog = true;
    },
    async editarPaciente(pacienteEditado) {
      try {
        console.log(pacienteEditado,"front editar paciente")
        const pacienteActualizado = await pacienteService.updatePaciente(
          pacienteEditado
        );
        const index = this.pacientes.findIndex(p => p.id === pacienteActualizado.id);
        if (index !== -1) {
          this.pacientes.splice(index, 1, pacienteActualizado);
        }
        this.editarDialog = false;
      } catch (error) {
        console.error('Error al actualizar paciente:', error);
      }
      this.loadPacientes();
    },
    confirmDelete(id) {
      this.confirmDeleteId = id;
      console.log(id, "confirmdelete")
      this.deleteDialog = true;
    },
    async deletePaciente() {
      try {
        console.log(this.confirmDeleteId, "delete paciente")
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
