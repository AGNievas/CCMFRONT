<template>
  <v-dialog v-model="localVisible" persistent max-width="600px">
    <v-card>
      <v-card-title>
        <span class="headline">{{ isEditing ? 'Editar Orden de Transferencia' : 'Agregar Nueva Orden de Transferencia' }}</span>
      </v-card-title>
      <v-card-text>
        <v-alert
          v-if="localErrorMessage"
          type="error"
          dismissible
          @input="localErrorMessage = ''"
        >
          {{ localErrorMessage }}
        </v-alert>

        <v-form ref="form">
          <v-select
            v-model="localOrdenTransferencia.stockAreaIdOrigen"
            :items="areas"
            item-title="nombre"
            item-value="id"
            :label="areaOrigenLabel"
            :disabled="!globalStore.getEsAdmin"
            required
          />
          <v-select
            v-model="localOrdenTransferencia.stockAreaIdDestino"
            :items="areas"
            item-title="nombre"
            item-value="id"
            label="Área Destino"
            required
          />
          <v-text-field
            v-model="localOrdenTransferencia.motivo"
            label="Motivo"
            required
          />
          <ListadoDeTransferencias
            :items="localOrdenTransferencia.items"
            :item="selectedItem"
            @add-item="openAddItemDialog"
            @edit-item="openEditItemDialog"
            @delete-item="deleteItem"
          />
        </v-form>
      </v-card-text>

      <TransferenciaDialog
        v-model="itemDialogVisible"
        :item="selectedItem"
        @save="saveItem"
      />

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn class="btn-blue" text @click="closeDialog">Cancelar</v-btn>
        <v-btn class="btn-blue" text @click="saveChanges" :disabled="!isFormValid">Guardar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import ListadoDeTransferencias from './ListadoDeTransferencias.vue';
import TransferenciaDialog from './TransferenciaDialog.vue';
import { useGlobalStore } from '@/stores/global';

export default {
  props: {
    modelValue: Boolean,
    isEditing: Boolean,
    ordenTransferencia: {
      type: Object,
      default: () => ({ stockAreaIdOrigen: null, stockAreaIdDestino: null, motivo: '', items: [] })
    },
    areas: Array,
    errorMessage: {
      type: String,
      default: '',
    }
  },
  components: {
    ListadoDeTransferencias,
    TransferenciaDialog,
  },
  data() {
    return {
      localVisible: this.modelValue,
      localOrdenTransferencia: JSON.parse(JSON.stringify(this.ordenTransferencia)), // Copia profunda
      itemDialogVisible: false,
      selectedItemIndex: null,
      selectedItem: null,
      userAreaName: '',
      globalStore: useGlobalStore(),
      localErrorMessage: '',
    };
  },
  computed: {
    areaOrigenLabel() {
      return !this.globalStore.getEsAdmin ? this.userAreaName : 'Área Origen';
    },
    isFormValid() {
      const { stockAreaIdOrigen, stockAreaIdDestino, motivo, items } = this.localOrdenTransferencia;
      return stockAreaIdOrigen && stockAreaIdDestino && motivo && items.length > 0;
    },
  },
  mounted() {
    this.traerAreaUsuario();
  },
  methods: {
    traerAreaUsuario() {
      if (!this.globalStore.getEsAdmin) {
        this.localOrdenTransferencia.stockAreaIdOrigen = this.globalStore.getStockAreaId;
        const userArea = this.areas.find(area => area.id == this.globalStore.getStockAreaId);
        this.userAreaName = userArea ? userArea.nombre : 'Área no encontrada';
      }
    },
    saveChanges() {
      this.$emit('save', JSON.parse(JSON.stringify(this.localOrdenTransferencia))); // Evita referencias reactivas
    },
    closeDialog() {
      this.localVisible = false;
      this.localErrorMessage = '';
      this.$emit('update:modelValue', false);
    },
    openAddItemDialog() {
      this.selectedItem = null;
      this.itemDialogVisible = true;
    },
    openEditItemDialog(item) {
      this.selectedItemIndex = this.localOrdenTransferencia.items.findIndex(i => i.id === item.id);
      this.selectedItem = { ...item };
      this.itemDialogVisible = true;
    },
    deleteItem(index) {
      if (index !== -1) {
        this.localOrdenTransferencia.items.splice(index, 1);
      }
    },
    saveItem(item) {
      if (this.selectedItemIndex !== null) {
        this.localOrdenTransferencia.items.splice(this.selectedItemIndex, 1, item);
        this.selectedItemIndex = null;
      } else {
        this.localOrdenTransferencia.items.push(item);
      }
      this.itemDialogVisible = false;
      
    },
  },
  watch: {
    modelValue(val) {
      this.localVisible = val;
    },
    errorMessage(newVal) {
      this.localErrorMessage = newVal;
    },
    ordenTransferencia: {
      handler(newVal) {
        this.localOrdenTransferencia = JSON.parse(JSON.stringify(newVal)); // Crea una copia profunda al actualizar
      },
      immediate: true,
      deep: true,
    },
    areas: {
      immediate: true,
      handler(newAreas) {
        if (newAreas.length > 0) {
          this.traerAreaUsuario();
        }
      }
    },
  },
};
</script>
