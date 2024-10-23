<script>
import ConfirmDialog from './ConfirmDialog.vue';
import ApliqueDialog from './ApliqueDialog.vue';

export default {
  props: {
    apliques: Array,
  },
  components: {
    ConfirmDialog, // Asegúrate de usar este componente en el template
    ApliqueDialog, // Asegúrate de usar este componente en el template
  },
  data() {
    return {
      headers: [
        { text: 'SKU', value: 'sku' },
        { text: 'Cantidad', value: 'cantidad' },
        { text: 'Aplicante', value: 'aplicante' },
        { text: 'Fecha', value: 'fecha' },
        { text: 'Acciones', value: 'acciones' },
      ],
      confirmDeleteDialog: false,
      apliqueDialogVisible: false,
      isEditing: false,
      apliqueToEdit: null,
      apliqueIdToDelete: null,
    };
  },
  methods: {
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
    deleteAplique() {
      this.$emit('delete-aplique', this.apliqueIdToDelete);
    },
    saveAplique(aplique) {
      this.$emit('save-aplique', aplique);
    },
  },
};
</script>
