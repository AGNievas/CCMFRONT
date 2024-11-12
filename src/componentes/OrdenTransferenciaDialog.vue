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
          <v-select v-if="!this.isEditing"
            v-model="localOrdenTransferencia.stockAreaIdOrigen"
            :items="mostrarAreasNombre"
            item-title="nombre"
            item-value="id"
            :label="areaOrigenLabel"
            :disabled="!globalStore.getEsAdmin"
            required
          />
          <v-select v-if="!this.isEditing"
            v-model="localOrdenTransferencia.stockAreaIdDestino"
            :items="mostrarAreasNombre"
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
          <ListadoDeTransferencias v-if="!this.isEditing"
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

import { formatearFechaYHora } from '@/utils/utils';
export default {
  props: {
    modelValue: Boolean,
    isEditing: Boolean,
    ordenTransferencia: {
      type: Object,
      default: () => ({ stockAreaIdOrigen: null, stockAreaIdDestino: null, motivo: '', items: [] })
    },
     stockAreas:{
      type:Array,
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
      localVisible: this.modelValue,
      localOrdenTransferencia: {
        stockAreaIdOrigen:'',
        stockAreaIdDestino:'',
        areaIdOrigen:'',
        areaIdDestino:'',
        fechaTransferencia:'',
        userId: '',
        motivo:'',
        listaItems:[],
      },
      itemDialogVisible: false,
      selectedItemIndex: null,
      selectedItem: null,
      userAreaName: '',
      globalStore: useGlobalStore(),
      localErrorMessage: '',
      areasAMostrar :[],
      // user: !this.isEditing ? this.globalStore.getUsuarioIdYNombre : ''
    };
  },
  computed: {
    mostrarAreasNombre(){
        
            
      return this.stockAreas.map(areas => {console.log(areas)
        return {
          id: areas.id,
          nombre:  areas.Area.nombre + " - " + areas.nombre,
          Area:{
            id: areas.Area.id,
            nombre: areas.Area.nombre
          } 
        }
      }, )
    
    },
 
    areaOrigenLabel() {
      return !this.globalStore.getEsAdmin ? this.userAreaName : 'Área Origen';
    },
    isFormValid() {
      if(!this.isEditing){
        const { stockAreaIdOrigen, stockAreaIdDestino, motivo, items } = this.localOrdenTransferencia;
        return stockAreaIdOrigen&& stockAreaIdDestino&& motivo && items ? items.length!=0 : false
      }else{
        const { motivo } = this.localOrdenTransferencia;
      return  motivo ;
      }
     
    },
  },
  async mounted() {
    this.traerAreaUsuario();
  
  },
  methods: {

    formatearFechaYHora(fecha){
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
      
      if(!this.isEditing){
        this.localOrdenTransferencia.userId = this.globalStore.getUsuarioId,
        this.localOrdenTransferencia.areaIdOrigen = this.mostrarAreasNombre.find(stockArea => stockArea.id == this.localOrdenTransferencia.stockAreaIdOrigen).Area.id
        this.localOrdenTransferencia.areaIdDestino = this.mostrarAreasNombre.find(stockArea => stockArea.id == this.localOrdenTransferencia.stockAreaIdDestino).Area.id
        this.localOrdenTransferencia.fechaTransferencia= this.formatearFechaYHora(new Date())
      }
      
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
  //   'globalStore.getStockAreas': {
  //   handler(newStockAreas) {
  //     console.log(newStockAreas, "GLOBALSOTRE EN WATCH EN OPEN DIALOG")
  //     if (Array.isArray(newStockAreas) && newStockAreas.length > 0) {
  //       this.stockAreas = newStockAreas;
  //     }
  //   },
  //   immediate: true,
  // },
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
    // stockAreas: {
    //   immediate: true,
    //   handler(newStockAreas) {
    //     console.log(newStockAreas, "stockAreas Watch en ORDEN DIALOG")
    //     if (newStockAreas.length > 0) {
    //       this.traerAreaUsuario();
    //     }
    //   }
    // },
  },
};
</script>
