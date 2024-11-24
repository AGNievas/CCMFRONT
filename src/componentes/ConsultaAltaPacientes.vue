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

        <v-btn v-if="puedeAgregarPaciente" @click="openAgregarDialog"
          class="btn-blue">Agregar Paciente</v-btn>
      </v-card-title>

      <Tabla :data="pacientesFiltradosFormateados" :headers="pacientesHeaders" :isListadoPacientes="true"
        :eliminable="true" @edit="openEditarDialog" @delete="confirmDelete" @ver-visitas="openListadoVisitas"
        />

      <PacienteDialog ref="pacienteDialog" v-model="agregarDialog" :is-editing="false" @save="addPaciente"
        :error-mensaje="errorMensaje" @update:errorMensaje="errorMensaje = ''" />

      <PacienteDialog v-model="editarDialog" :is-editing="true" :paciente="pacienteEdit" @save="editarPaciente"
        :error-mensaje="errorMensaje" @update:errorMensaje="errorMensaje = ''" />

      <ListadoVisitas v-if="listadoVisitasVisible" v-model="listadoVisitasVisible" :paciente="selectedPaciente" :areas="globalStore.getAreas"
          :stockAreas="globalStore.getStockAreas" :usuarios="globalStore.getUsuarios" :medicamentos="medicamentos" />
          
          <ConfirmDialog :isDelete="true" v-model="deleteDialog" title="Confirmar Eliminación"
          text="¿Estás seguro de que deseas eliminar este aplique?" @confirm="deletePaciente" />

    </v-card>
  </div>
</template>

<script>
import Tabla from './Tabla.vue';
import PacienteDialog from './PacienteDialog.vue';
import pacienteService from './servicios/pacienteService';
import { formatearFecha, calcularEdad } from '@/utils/utils';
import { useGlobalStore } from '@/stores/global';
import itemService from './servicios/itemService';
import visitaService from './servicios/visitaService';
import ListadoVisitas from './ListadoVisitas.vue';
import ConfirmDialog from './ConfirmDialog.vue';
export default {
  components: {
    Tabla,
    PacienteDialog,
    ListadoVisitas,
    ConfirmDialog
  },

  data() {
    return {

      pacientesHeaders:
       [

        { text: 'DNI', value: 'dni' },
        { text: 'Nombre', value: 'nombre' },
        { text: 'Apellido', value: 'apellido' },
        { text: 'Genero', value: 'genero' },
        { text: 'Edad', value: 'edad' },
        { text: 'Fecha Nacimiento', value: 'fechaNacimiento' },
        { text: '', value: '', sortable: false }

      ],
    
      searchDni: '',
      searchGenero: 'Todos',
      generos: ['Todos', 'Masculino', 'Femenino', 'No binario'],
      agregarDialog: false,
      editarDialog: false,
      pacienteEdit: {},
      apliqueDialogVisible: false,
      listadoApliquesVisible: false,
      listadoVisitasVisible: false,
      selectedPacienteId: null,
      errorMensaje: '',
      pacientes: [],
      medicamentos: [],
      globalStore: useGlobalStore(),
      visitas: [],
      selectedPaciente: {},
      deleteDialog: false

    };
  },
  async mounted() {
    this.loadPacientes();
    this.loadMedicamentos();


  },
  computed: {
    puedeAgregarPaciente(){
      return (this.globalStore.getRolId != this.globalStore.getRolAdmin && this.globalStore.getAreaId != this.globalStore.getFarmaciaId) || this.globalStore.getRolId == this.globalStore.getRolSuperAdmin
    },

    pacientesFiltradosFormateados() {
      const pacientesFiltrados = this.filtrarPacientes();
      return this.formatearPacientes(pacientesFiltrados);
    }
  },

  methods: {

    async loadVisitas() {
      try {
        this.visitas = await visitaService.getAllVisitas()
      } catch (error) {
        console.log('Error al cargar las visitas: ', error)
      }
    },

    async loadMedicamentos() {
      const response = await itemService.getAllItem()
      this.medicamentos = response
    },
    formatearPacientes(pacientesFiltrados) {
      return pacientesFiltrados.map(paciente => ({
        id: paciente.id,
        dni: paciente.dni,
        nombre: paciente.nombre,
        apellido: paciente.apellido,
        genero: paciente.genero,
        edad: calcularEdad(paciente.fechaNacimiento),
        fechaNacimiento: formatearFecha(paciente.fechaNacimiento),
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

     openListadoVisitas(paciente) {
      if (paciente && Object.keys(paciente).length) {
        this.selectedPaciente = paciente;
        this.listadoVisitasVisible = true;
      } else {
        console.warn('Paciente inválido al intentar abrir el diálogo de visitas:', paciente);
      }
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
      console.log(id,"id paciente")
      this.confirmDeleteId = id;
      this.deleteDialog = true;
    },

    async deletePaciente(){
      try{
        console.log(this.confirmDeleteId,"en delete")
        await pacienteService.deletePaciente(this.confirmDeleteId)
        this.deleteDialog=false;
      }catch(error){
        console.error('Error al eliminar aplique:', error);
      }
      this.loadPacientes();
    }
  },
};
</script>