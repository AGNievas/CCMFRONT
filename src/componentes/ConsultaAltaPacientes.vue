<template>
  
  <div class="custom-container">
    <!-- Buscar Paciente -->
    <v-card flat>
      <v-card-title class="d-flex align-center pe-2">
        <v-text-field
          v-model="searchDni"
          density="compact"
          label="DNI"
          variant="solo"
          hide-details
          class="rounded-search-bar"
          prepend-inner-icon="mdi-account"
        ></v-text-field>

        <v-select
          v-model="searchGenero"
          :items="generos"
          density="compact"
          label="Género"
          variant="solo"
          hide-details
          class="mx-2"
        ></v-select>

        <v-btn @click="buscarPaciente" class="mx-2">Buscar</v-btn>

        <v-spacer></v-spacer>

        <!-- Botón de editar o agregar dependiendo de si se encuentra un paciente -->
        <v-btn v-if="paciente" @click="openEditarDialog" class="mx-2">Editar Paciente</v-btn>
        <v-btn v-else @click="openAgregarDialog" class="mx-2">Agregar Paciente</v-btn>
      </v-card-title>

      <!-- Tabla de Pacientes -->
      <v-data-table
        v-if="paciente"
        :items="[paciente]"
        :headers="pacienteHeaders"
        hide-default-footer
        class="mt-4"
      >
        <template v-slot:thead>
          <thead>
            <tr>
              <th class="table-header text-start">DNI</th>
              <th class="table-header text-start">Nombre</th>
              <th class="table-header text-start">Género</th>
              <th class="table-header text-start">Fecha de Nacimiento</th>
            </tr>
          </thead>
        </template>

        <template v-slot:item="{ item }">
          <tr>
            <td class="text-start table-cell">{{ item.dni }}</td>
            <td class="text-start table-cell">{{ item.nombre }} {{item.apellido}}</td>
            <td class="text-start table-cell">{{ item.genero }}</td>
            <td class="text-start table-cell">{{ item.fecha_nacimiento }}</td>
          </tr>
        </template>
      </v-data-table>
    </v-card>

    <!-- Tabla de Medicamentos (solo si hay paciente) -->
    <v-card v-if="paciente" flat class="mt-6">
      <v-card-title>
        <v-btn @click="darMedicamento" class="mx-2">Dar Medicamento</v-btn>
      </v-card-title>

      <v-data-table
        :items="medicamentos"
        :headers="medicamentoHeaders"
        hide-default-footer
      >
        <template v-slot:thead>
          <thead>
            <tr>
              <th class="table-header text-start">SKU</th>
              <th class="table-header text-start">Cantidad</th>
              <th class="table-header text-start">Aplicante</th>
              <th class="table-header text-start">Fecha</th>
            </tr>
          </thead>
        </template>

        <template v-slot:item="{ item }">
          <tr>
            <td class="text-start table-cell">{{ item.sku }}</td>
            <td class="text-start table-cell">{{ item.cantidad }}</td>
            <td class="text-start table-cell">{{ item.aplicante }}</td>
            <td class="text-start table-cell">{{ item.fecha }}</td>
          </tr>
        </template>
      </v-data-table>
    </v-card>

    <!-- Pop-up para agregar nuevo paciente -->
    <v-dialog v-model="agregarDialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Agregar Nuevo Paciente</span>
        </v-card-title>

        <v-card-text>
          <v-form ref="form">
            <v-text-field v-model="newPaciente.nombre" label="Nombre" required></v-text-field>
            <v-text-field v-model="newPaciente.apellido" label="Apellido" required></v-text-field>
            <v-text-field v-model="newPaciente.dni" label="DNI" required></v-text-field>
            <v-text-field v-model="newPaciente.fecha_nacimiento" label="Fecha de nacimiento" required></v-text-field>
            <v-select
          v-model="newPaciente.genero"
          :items="generos"
          density="compact"
          label="Género"
          variant="solo"
          hide-details
          class="mx-2"
        ></v-select>

            <v-alert v-if="formError" type="error" dismissible>
              Todos los campos son obligatorios. Por favor, completa la información.
            </v-alert>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="closeAgregarDialog">Cancelar</v-btn>
          <v-btn text @click="addPaciente">Agregar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Pop-up para editar paciente -->
    <v-dialog v-model="editarDialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Editar Paciente</span>
        </v-card-title>

        <v-card-text>
          <v-form ref="formEditar">
            <v-text-field v-model="pacienteEdit.nombre" label="Nombre" required></v-text-field>
            <v-text-field v-model="pacienteEdit.apellido" label="Apellido" required></v-text-field>
            <v-text-field v-model="pacienteEdit.dni" label="DNI" required></v-text-field>
            <v-text-field v-model="pacienteEdit.fecha_nacimiento" label="Fecha de nacimiento" required></v-text-field>
            <v-select
          v-model="pacienteEdit.genero"
          :items="generos"
          density="compact"
          label="Género"
          variant="solo"
          hide-details
          class="mx-2"
        ></v-select>

            <v-alert v-if="formError" type="error" dismissible>
              Todos los campos son obligatorios. Por favor, completa la información.
            </v-alert>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="eliminarPaciente">Eliminar Paciente</v-btn>
          <v-btn text @click="closeEditarDialog">Cancelar</v-btn>
          <v-btn text @click="confirmarEditar">Confirmar Cambios</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import pacientes from '@/assets/pacientes.json';
import historials from '@/assets/historials.json';
import apliques from '@/assets/apliques.json';


export default {
  data() {
    return {
      pacientes:[],
      historials:[],
      apliques:[],
      searchDni: '',
      searchGenero: '',
      generos: ['Masculino', 'Femenino','No binario'],
      paciente: null,
      medicamentos: [],
      pacienteHeaders: [
        { text: 'DNI', value: 'dni' },
        { text: 'Nombre', value: 'nombre' },
        { text: 'Género', value: 'genero' },
        { text: 'Fecha de Nacimiento', value: 'fecha_nacimiento' },
      ],
      medicamentoHeaders: [
        { text: 'SKU', value: 'sku' },
        { text: 'Cantidad', value: 'cantidad' },
        { text: 'Aplicante', value: 'aplicante' },
        { text: 'Fecha', value: 'fecha' },
      ],
      agregarDialog: false,
      editarDialog: false,
      newPaciente: {
        nombre: '',
        apellido: '',
        dni: '',
      },
      pacienteEdit: {},
      formError: false,
    };
  },
  mounted() {
    this.pacientes = pacientes;
    this.historials = historials;
    this.apliques = apliques;
  },
  methods: {
    buscarPaciente() {
    this.paciente = this.pacientes.find(
      (p) =>
        p.dni === this.searchDni &&
        (this.searchGenero ? p.genero === this.searchGenero : true)
    );

    if (!this.paciente) {
      alert('Paciente no encontrado');
    } else {
      // Obtener el historial del paciente
      const historial = this.historials.find(h => h.dni === this.paciente.dni);
      if (historial) {
        // Obtener los medicamentos/apliques asociados al historialId
        this.medicamentos = this.obtenerMedicamentos(historial.id);
      } else {
        alert('No se encontró historial para este paciente');
      }
    }
    },
    openAgregarDialog() {
      this.agregarDialog = true;
    },
    closeAgregarDialog() {
      this.agregarDialog = false;
    },
    addPaciente() {
      if (!this.newPaciente.nombre || !this.newPaciente.apellido || !this.newPaciente.dni) {
        this.formError = true;
      } else {
        this.paciente = { ...this.newPaciente };
        this.closeAgregarDialog();
      }
    },
    openEditarDialog() {
      this.pacienteEdit = { ...this.paciente }; // Copia de los datos del paciente encontrado
      this.editarDialog = true;
    },
    closeEditarDialog() {
      this.editarDialog = false;
    },
    confirmarEditar() {
      // Aquí podrías enviar los datos modificados a una API o guardarlos
      this.paciente = { ...this.pacienteEdit };
      this.closeEditarDialog();
    },
    eliminarPaciente() {
      // Lógica para eliminar paciente
      this.paciente = null;
      this.editarDialog = false;
      alert('Paciente eliminado');
    },
    obtenerMedicamentos(historialId) {
    // Filtrar los apliques que coinciden con el historialId
    return this.apliques.filter(aplique => aplique.historialId === historialId)
      .map(aplique => ({
        sku: aplique.sku,
        cantidad: aplique.cantidad,
        aplicante: aplique.aplicante,
        fecha: new Date().toLocaleDateString() // Usar una fecha ficticia por ahora
      }));
  },
  },
};
</script>

<style scoped>
.custom-container {
  padding: 40px 20px;
  border-radius: 16px;
  background-color: white;
  border: 1px solid #d9dcd1;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  max-width: 90%;
  margin: 0 auto;
}

.table-header {
  background-color: #E5E5E5;
  text-transform: uppercase;
  font-weight: bold;
  border: 1px solid #CECECE;
}

.table-cell {
  border: 1px solid #CECECE;
}

.v-btn {
  text-transform: none;
  background-color: #0E3746;
  color: white;
  margin-right: 5px;
}

.v-btn:hover {
  background-color: #09323b;
}

.headline {
  font-weight: bold;
  color: #0E3746;
}

.rounded-search-bar {
  border-radius: 16px;
}
</style>
