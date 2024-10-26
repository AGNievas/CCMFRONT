<template>
  <div>
    <v-card class="custom-container">
      <v-card-title class="d-flex align-center pe-2">
        <v-text-field
          v-model="searchDni"
          density="compact"
          label="Buscar por DNI o Apellido"
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
      <Listado :items="pacientesFiltradosFormateados" :headers="pacientesHeaders" :isListadoPacientes=true @edit="openEditarDialog" @delete="confirmDelete" @ver-historial="verHistorialApliques" />

      <!-- Diálogos -->
      <PacienteDialog
  ref="pacienteDialog"
  v-model="agregarDialog"
  :is-editing="false"
  @save="addPaciente"
  :error-mensaje="errorMensaje"
  @update:errorMensaje="errorMensaje = ''"
/>
<PacienteDialog
  v-model="editarDialog"
  :is-editing="true"
  :paciente="pacienteEdit"
  @save="editarPaciente"
  :error-mensaje="errorMensaje"
  @update:errorMensaje="errorMensaje = ''"
/>
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
import { differenceInYears } from 'date-fns'
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
    errorMensaje: '', // Estado para el mensaje de error
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
        { text: 'Acciones', value: '' }
      ];
    },
    // pacientesFiltradosFormateados() {
    //   return this.pacientes
    //     .filter(paciente => {
    //       const dniMatch = this.searchDni
    //         ? paciente.dni.includes(this.searchDni)
    //         : true;
    //       const generoMatch =
    //         this.searchGenero && this.searchGenero !== 'Indistinto'
    //           ? paciente.genero === this.searchGenero
    //           : true;
    //       return dniMatch && generoMatch;
    //     })
    //     .map(paciente => ({
    //       id: paciente.id, 
    //       dni: paciente.dni,
    //       nombre: paciente.nombre,
    //       apellido: paciente.apellido,
    //       genero: paciente.genero,
    //       edad: this.calcularEdad(paciente.fechaNacimiento),
    //       fechaNacimiento: this.formatearFecha(paciente.fechaNacimiento),
          
    //     }));
    // },

// Mapea y formatea la lista de pacientes filtrados

pacientesFiltradosFormateados() {
    const pacientesFiltrados = this.filtrarPacientes();
    return this.formatearPacientes(pacientesFiltrados);
}


  },
  async mounted() {
    this.loadPacientes();
  },
  methods: {
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

// Filtra la lista de pacientes
filtrarPacientes() {
    return this.pacientes.filter(paciente => {
        const dniApellidoMatch = this.searchDni
            ? paciente.dni.includes(this.searchDni) || 
              paciente.apellido.toLowerCase().includes(this.searchDni.toLowerCase())
            : true;
        const generoMatch =
            this.searchGenero && this.searchGenero !== 'Indistinto'
                ? paciente.genero === this.searchGenero
                : true;
        return dniApellidoMatch && generoMatch;
    });
}

,
    async loadPacientes() {
      this.pacientes = await pacienteService.getAllPaciente();
    },
    formatearFecha(fecha) {
      const date = new Date(fecha);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },

    calcularEdad(fechaNacimiento){
      return differenceInYears(new Date(), new Date(fechaNacimiento))
      
    },
    
    async addPaciente(nuevoPaciente) {
  try {
    const pacienteCreado = await pacienteService.createPaciente(nuevoPaciente);
    if (pacienteCreado) {
      this.pacientes.push(pacienteCreado);
      this.agregarDialog = false; // Cerrar el diálogo solo si el paciente fue creado con éxito
      this.errorMensaje = ''; // Limpiar mensaje de error al crear correctamente
    }
  } catch (error) {
    // Capturar y mostrar el mensaje de error específico del backend
    this.errorMensaje = error.response?.data?.message || 'Error al agregar el paciente.';
    console.error('Error al agregar paciente:', error);
    this.agregarDialog = true; // Mantener el diálogo abierto si hay error
  }
  this.loadPacientes();
}
,

async editarPaciente(pacienteEditado) {
  try {
    const pacienteActualizado = await pacienteService.updatePaciente(pacienteEditado);
    const index = this.pacientes.findIndex(p => p.id === pacienteActualizado.id);
    if (index !== -1) {
      this.pacientes.splice(index, 1, pacienteActualizado);
    }
    this.editarDialog = false; // Cerrar el diálogo solo si el paciente fue actualizado con éxito
    this.errorMensaje = ''; // Limpiar mensaje de error al editar correctamente
  } catch (error) {
    // Manejar el error si ya existe un paciente con el mismo DNI
    this.errorMensaje = error.response?.data?.message || 'Error al actualizar el paciente.';
    console.error('Error al actualizar paciente:', error);
    this.editarDialog = true; // Mantener el diálogo abierto si hay error
  }
  this.loadPacientes();
}
,

openAgregarDialog() {
    this.$refs.pacienteDialog.resetPacienteLocal(); // Llama al método de reseteo del componente hijo
    this.pacienteEdit = {}; // Limpiar el objeto paciente editado
    this.errorMensaje = ''; // Limpiar mensaje de error al abrir el diálogo
    this.agregarDialog = true; // Abrir el diálogo para agregar un paciente
  },
  openEditarDialog(paciente) {
    this.pacienteEdit = { ...paciente };
    this.errorMensaje = ''; // Limpiar mensaje de error al abrir el diálogo
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
    verHistorialApliques(paciente) {
      // Redirigimos a la ruta de apliques con el ID del paciente
      this.$router.push({ name: 'ListadoDeApliques', params: { pacienteId: paciente.id } });
    },
  },
};
</script>
