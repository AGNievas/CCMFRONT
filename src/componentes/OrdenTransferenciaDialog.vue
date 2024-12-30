<template>
  <v-dialog v-model="localVisible" persistent max-width="700px">
    <v-card>
      <v-card-title>
        <span class="headline">{{ isEditing ? 'Editar Orden de Transferencia' : 'Agregar Orden de Transferencia'
          }}</span>
        <v-btn class="btn-icon" icon small @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-alert v-if="localErrorMessage" type="error" dismissible @input="localErrorMessage = ''">
          {{ localErrorMessage }}
        </v-alert>

        <v-form ref="form">
          <v-select v-if="puedeSeleccionarStockArea" v-model="localOrdenTransferencia.stockAreaIdOrigen"
            :items="mapeoAreas" item-title="nombre" item-value="id" :label="areaOrigenLabel"
            :disabled="!globalStore.getEsAdmin" required variant="solo" rounded dense />

          <v-select v-if="!this.isEditing" v-model="localOrdenTransferencia.stockAreaIdDestino"
            :items="mostrarAreasNombre" item-title="nombre" item-value="id" label="Área Destino" required variant="solo"
            rounded dense />

          <v-text-field v-model="localOrdenTransferencia.motivo" label="Motivo" required variant="solo" rounded dense />

          <ListadoDeTransferencias v-if="!this.isEditing" :items="localOrdenTransferencia.items"
            @add-item="openAddItemDialog" @edit-item="openEditItemDialog" @delete-item="deleteItem" @close="closeDialog"
            :disabled="deshabilitar" />
        </v-form>
      </v-card-text>

      <TransferenciaDialog v-if="itemDialogVisible" v-model="itemDialogVisible" :isEditing="isEditingItem"
        :item="selectedItem" :areaId="selectedArea" :stockAreaId="selectedStockArea" @save="saveItem" />

      <v-card-actions>
        <v-btn class="btn-blue" text @click="saveChanges" :disabled="!isFormValid">Guardar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import ListadoDeTransferencias from './ListadoDeTransferencias.vue';
import TransferenciaDialog from './TransferenciaDialog.vue';
import { useGlobalStore } from '@/stores/global';

import { formatearFechaYHora } from '@/utils/utils';
export default {
  props: {
    modelValue: Boolean,
    isEditing: Boolean,
    ordenTransferencia: {
      type: Object,
      default: () => ({ stockAreaIdOrigen: null, stockAreaIdDestino: null, motivo: '', items: [] })
    },
    stockAreas: {
      type: Array,
    },
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
      STOCK_AREA_DEPOSITO_FARMACIA: 1,
      AREA_FARMACIA: 1,
      localVisible: this.modelValue,
      localOrdenTransferencia: {
        stockAreaIdOrigen: '',
        stockAreaIdDestino: '',
        areaIdOrigen: '',
        areaIdDestino: '',
        fechaTransferencia: '',
        userId: '',
        motivo: '',
        listaItems: [],
      },
      medicamentos: [],
      isEditingItem: false,
      itemDialogVisible: false,
      selectedItemIndex: null,
      selectedItem: null,
      userAreaName: '',
      globalStore: useGlobalStore(),
      localErrorMessage: '',
      areasAMostrar: [],

    };
  },
  computed: {

    puedeSeleccionarStockArea() {
      return !this.isEditing && this.globalStore.getRolId == this.globalStore.getRolSuperAdmin
    },

    selectedStockArea() {
      return this.puedeSeleccionarStockArea ? this.localOrdenTransferencia.stockAreaIdOrigen : this.STOCK_AREA_DEPOSITO_FARMACIA
    },
    selectedArea() {
      return this.puedeSeleccionarStockArea ? this.stockAreas.find(stockArea => stockArea.id == this.localOrdenTransferencia.stockAreaIdOrigen).Area.id : this.AREA_FARMACIA
    },


    mostrarAreasNombre() {

      if (this.localOrdenTransferencia.stockAreaIdOrigen) {
        return this.mapeoAreas.filter(
          area => area.id !== this.localOrdenTransferencia.stockAreaIdOrigen
        );
      } else {
        return this.mapeoAreas;
      }



    },

    deshabilitar() {

      return !this.localOrdenTransferencia.stockAreaIdOrigen && this.globalStore.getRolId == this.globalStore.getRolSuperAdmin
    },

    mapeoAreas() {
      return this.stockAreas
        .filter(areas => {

          if (!this.puedeSeleccionarStockArea) {
            return areas.id !== this.STOCK_AREA_DEPOSITO_FARMACIA &&
              areas.Area.id !== this.AREA_FARMACIA;
          }
          return true;
        })
        .map(areas => {
          return {
            id: areas.id,
            nombre: areas.Area.nombre + " - " + areas.nombre,
            Area: {
              id: areas.Area.id,
              nombre: areas.Area.nombre
            }
          };
        });
    },


    areaOrigenLabel() {
      return !this.globalStore.getEsAdmin ? this.userAreaName : 'Área Origen';
    },
    isFormValid() {
      if (!this.isEditing) {
        const { stockAreaIdDestino, motivo, items } = this.localOrdenTransferencia;
        return this.selectedStockArea && stockAreaIdDestino && motivo && items ? items.length != 0 : false
      } else {
        const { motivo } = this.localOrdenTransferencia;
        return motivo;
      }

    },
  },
  async mounted() {
    this.traerAreaUsuario();


  },
  methods: {



    formatearFechaYHora(fecha) {
      return formatearFechaYHora(fecha)
    },

    async traerAreaUsuario() {


      if (!this.globalStore.getEsAdmin) {
        this.localOrdenTransferencia.stockAreaIdOrigen = this.globalStore.getStockAreas;
        const userArea = this.stockAreas.find(area => area.id == this.globalStore.getStockAreas);
        this.userAreaName = userArea ? userArea.nombre : 'Área no encontrada';
      }
    },
    saveChanges() {

      if (!this.isEditing) {
        if (!this.puedeSeleccionarStockArea) {
          this.localOrdenTransferencia.stockAreaIdOrigen = this.STOCK_AREA_DEPOSITO_FARMACIA
        }
        this.localOrdenTransferencia.userId = this.globalStore.getUsuarioId,
          this.localOrdenTransferencia.areaIdOrigen = this.puedeSeleccionarStockArea ? this.mapeoAreas.find(stockArea => stockArea.id == this.localOrdenTransferencia.stockAreaIdOrigen).Area.id : this.AREA_FARMACIA
        this.localOrdenTransferencia.areaIdDestino = this.mostrarAreasNombre.find(stockArea => stockArea.id == this.localOrdenTransferencia.stockAreaIdDestino).Area.id
        this.localOrdenTransferencia.fechaTransferencia = this.formatearFechaYHora(new Date())
      }

      this.$emit('save', JSON.parse(JSON.stringify(this.localOrdenTransferencia)));
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
      this.isEditingItem = true;
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
        this.localOrdenTransferencia = JSON.parse(JSON.stringify(newVal));
      },
      immediate: true,
      deep: true,
    },

  },
};
</script>
