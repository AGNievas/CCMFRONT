<template>
  <div>
    <v-card class="mx-auto" max-width="800">
      <v-card-title>
        Historial de Apliques para Paciente {{ pacienteId }}
        <v-spacer></v-spacer>
        <v-btn @click="openApliqueDialog" class="mx-2 btn-blue">Agregar Aplique</v-btn>
      </v-card-title>

      <!-- Componente reutilizado para mostrar la lista de apliques -->
      <Listado :items="apliques" :headers="apliquesHeaders" isListadoApliques @edit="editAplique" @delete="confirmDeleteAplique" />

      <!-- Diálogo para agregar/editar apliques -->
      <ApliqueDialog v-model="apliqueDialogVisible" :is-editing="isEditing" :aplique="apliqueToEdit" @save="saveAplique" />

      <!-- Diálogo de confirmación para eliminar apliques -->
      <ConfirmDialog
        v-model="confirmDeleteDialog"
        title="Confirmar Eliminación"
        text="¿Estás seguro de que deseas eliminar este aplique?"
        @confirm="deleteAplique"
      />
    </v-card>
  </div>
</template>

<script>
import ConfirmDialog from './ConfirmDialog.vue';
import ApliqueDialog from './ApliqueDialog.vue';
import Listado from './Listado.vue';
import apliqueService from './servicios/apliqueService'; // Servicio para los apliques

export default {
  props: {
    pacienteId: {
      type: String,
      required: true, // Paciente seleccionado desde los params de la URL
    },
  },
  components: {
    ConfirmDialog,
    ApliqueDialog,
    Listado,
  },
  data() {
    return {
      apliquesHeaders: [
        { text: 'SKU', value: 'sku' },
        { text: 'Cantidad', value: 'cantidad' },
        { text: 'Aplicante', value: 'aplicante' },
        { text: 'Fecha', value: 'fecha' },
        { text: 'Acciones', value: 'acciones' },
      ],
      apliques: [], // Apliques del paciente
      apliqueDialogVisible: false,
      isEditing: false,
      apliqueToEdit: null,
      confirmDeleteDialog: false,
      apliqueIdToDelete: null,
    };
  },
  async mounted() {
    await this.loadApliques();
  },
  methods: {
    async loadApliques() {
      try {
       
        this.apliques = await apliqueService.getApliquesByPacienteId(this.pacienteId);
      } catch (error) {
        console.error('Error al cargar apliques:', error);
      }
    },
    openApliqueDialog() {
      this.isEditing = false;
      this.apliqueToEdit = null;
      this.apliqueDialogVisible = true;
    },
    editAplique(aplique) {
      this.isEditing = true;
      this.apliqueToEdit = { ...aplique };
      this.apliqueDialogVisible = true;
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
    async saveAplique(aplique) {
      try {
        if (this.isEditing) {
          await apliqueService.updateAplique(aplique);
        } else {
          const apliqueGuardado = await apliqueService.createAplique(this.pacienteId, aplique);
          this.apliques.push(apliqueGuardado);
        }
        this.apliqueDialogVisible = false;
      } catch (error) {
        console.error('Error al guardar aplique:', error);
      }
    },
  },
};
</script>
