<template>
  <v-data-table
    :headers="headers"
    :items="sortedData"
    hide-default-header
    v-if="!isMobile"
  >
    <template v-slot:thead>
      <thead>
        <tr>
          <th
            :class="{ sorted: sortKey === header.value }"
            class="table-header celdas"
            v-for="(header, index) in headers"
            :key="index"
            @click="sortTable(header.value)"
          >
            {{ header.text }}
            <v-icon small v-if="index !== headers.length - 1">
              {{ sortKey === header.value ? (sortOrder === 'asc' ? 'mdi-sort-ascending' : 'mdi-sort-descending') : 'mdi-sort' }}
            </v-icon>
          </th>
        </tr>
      </thead>
    </template>

    <template v-slot:item="{ item }">
      <tr>
        <td class="text-start" v-for="(value, key) in visibleColumns(item)" :key="key">{{ value }}</td>
        <td class="text-start acciones-cell">
          <AccionButtons
            :item="item"
            :editable="editable"
            :eliminable="eliminable"
            :canVerEdit="canVerEdit"
            :canVerDelete="canVerDelete"
            :canRestorePassword="canRestorePassword"
            :canCreateAplique="canCreateAplique"
            :canVerHistorial="canVerHistorial"
            :canVerDetail="canVerDetail"
            :canVerVisitas="canVerVisitas"
            :puedeDarAlta="puedeDarAlta"
            @edit="$emit('edit', item)"
            @delete="$emit('delete', isListadoMedicamentos ? item : item.id ? item.id : item.sku ? item.sku : index)"
            @restorePassword="$emit('restorePassword', item)"
            @ver-historial="$emit('ver-historial', item)"
            @crear-aplique="$emit('crear-aplique', item)"
            @ver-items="$emit('ver-items', item.id)"
            @ver-visitas="$emit('ver-visitas', item)"
            @dar-alta="$emit('dar-alta', item)"
          />
        </td>
      </tr>
    </template>
  </v-data-table>

  <div style="max-height: 600px; overflow-y: auto;" v-if="isMobile">
  <v-card
  class="mx-auto"
  max-width="400"
  v-for="(item, index) in sortedData"
  :key="index"
  style="margin-bottom: 20px; padding: 20px;"
>
  <v-card-text>
    <div v-for="(header, index) in headers" :key="header.value">
      <div v-if="index < (headers.length - 1)" class="text-caption text-muted">{{ header.text }}:</div>
      <p class="text-h5 text--primary">{{ item[header.value] }}</p>
    </div>
  </v-card-text>

  <v-card-actions>
    <v-btn class="btn-cards" text color="teal accent-4" @click="toggleCardExpansion(index)">
       Acciones
    </v-btn>
  </v-card-actions>

  <v-expand-transition>
    <v-card v-if="expandedCards[index]" class="v-card--reveal">
      <div class="df jcc">
        <AccionButtons
          :item="item"
          :editable="editable"
          :eliminable="eliminable"
          :canVerEdit="canVerEdit"
          :canVerDelete="canVerDelete"
          :canRestorePassword="canRestorePassword"
          :canCreateAplique="canCreateAplique"
          :canVerHistorial="canVerHistorial"
          :canVerDetail="canVerDetail"
          :canVerVisitas="canVerVisitas"
          :puedeDarAlta="puedeDarAlta"
          @edit="$emit('edit', item)"
          @delete="$emit('delete', item.id ? item.id : item.sku ? item.sku : index)"
          @restorePassword="$emit('restorePassword', item)"
          @ver-historial="$emit('ver-historial', item)"
          @crear-aplique="$emit('crear-aplique', item)"
          @ver-items="$emit('ver-items', item.id)"
          @ver-visitas="$emit('ver-visitas', item)"
          @dar-alta="$emit('dar-alta', item)"
        />
      </div>
      <v-card-actions>
        <v-btn class="btn-cards" text color="teal accent-4" @click="toggleCardExpansion(index)">Cerrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-expand-transition>
</v-card>

</div>
</template>

<script>
import { useGlobalStore } from '@/stores/global';
import AccionButtons from './AccionButtons.vue'

export default {
  name: 'Tabla',
  components: {
    AccionButtons,
  },
  props: {
    data: {
      type: Array,
      required: true,
    },
    headers: {
      type: Array,
      required: true,
    },
    isListadoUsuarios: {
      type: Boolean,
      default: false,
    },
    isListadoApliques: {
      type: Boolean,
      default: false,
    },
    isListadoPacientes: {
      type: Boolean,
      default: false,
    },
    isListadoMedicamentos: {
      type: Boolean,
      default: false,
    },
    isListadoOrdenTransferencia: {
      type: Boolean,
      default: false,
    },
    isListadoVisitas: {
      type: Boolean,
      default: false,
    },
    isEditable: {
      type: Boolean,
      default: false,
    },
    eliminable: {
      type: Boolean,
      default: true,
    },
    editable: {
      type: Boolean,
      default: true,
    },  
  },
  emits:['close','edit', 'delete', 'restorePassword','ver-historial','crear-aplique','ver-items', 'ver-visitas', 'dar-alta'],
 
  data() {
    return {
      globalStore: useGlobalStore(),
      sortKey: null,
      sortOrder: 'asc',   
      isMobile: false,
      expandedCards: [],
    };
  },

  mounted() {
    this.checkScreenSize();
    window.addEventListener("resize", this.checkScreenSize);
    this.loadExpandedCards();
    
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.checkScreenSize);
  },

  computed: {
    sortedData() {
      if (!this.sortKey) return this.data;
      return [...this.data].sort((a, b) => {
        const sortMultiplier = this.sortOrder === 'asc' ? 1 : -1;
        return a[this.sortKey] > b[this.sortKey] ? sortMultiplier : -sortMultiplier;
      });
    },
    canRestorePassword() {
      const globalStore = useGlobalStore();
      return this.isListadoUsuarios && globalStore.getEsAdmin == true;
    },

    canCreateAplique() {
      return this.isListadoVisitas && ((this.globalStore.rolId != this.globalStore.getRolAdmin && this.globalStore.getAreaId != this.globalStore.getFarmaciaId) || this.globalStore.getRolId == this.globalStore.getRolSuperAdmin)
    },

    canVerHistorial() {
      return this.isListadoVisitas
    },

    canVerVisitas() {
      return this.isListadoPacientes
    },

    canVerDetail() {
      return this.isListadoOrdenTransferencia && this.globalStore.areaId == this.globalStore.getFarmaciaId;
    },

    canVerEdit() {
      return ((this.isListadoUsuarios && this.globalStore.getRolId== this.globalStore.getRolSuperAdmin) ||
             ((this.isListadoMedicamentos && this.globalStore.rolId !== this.globalStore.getRolDataEntry && this.globalStore.rolId !== this.globalStore.getRolAutorizante) && this.globalStore.getAreaId == this.globalStore.getFarmaciaId)||
             (this.isListadoPacientes && (this.globalStore.rolId == this.globalStore.getRolSuperAdmin || (this.globalStore.getAreaId !== this.globalStore.getFarmaciaId ))) ||
             (this.isListadoApliques && (this.globalStore.rolId == this.globalStore.getRolSuperAdmin || (this.globalStore.getAreaId !== this.globalStore.getFarmaciaId ))) ||
             (this.isListadoOrdenTransferencia && (this.globalStore.getRolId == this.globalStore.getRolSuperAdmin || this.globalStore.getRolId == this.globalStore.getRolAdmin )) || 
             (this.isListadoVisitas && (this.globalStore.rolId == this.globalStore.getRolSuperAdmin || (this.globalStore.getAreaId !== this.globalStore.getFarmaciaId )))) || this.isEditable;
    },

    canVerDelete() {
      return this.canVerEdit;
    },

    puedeDarAlta(){
      
      return this.isListadoVisitas && ( this.globalStore.getRolId == this.globalStore.getRolSuperAdmin || (this.globalStore.getAreaId !=this.globalStore.getFarmaciaId))
    }


  },

  methods: {
    toggleCardExpansion(index) {
      this.expandedCards[index] = !this.expandedCards[index];
    },
    loadExpandedCards(){
        this.expandedCards = new Array(this.data ? this.data.length: 0).fill(false); 
    },
    visibleColumns(item) {
      if (!item) return {};
      const visibleData = {};
      Object.keys(item).forEach((key) => {
        if (key !== 'id' ) {
          visibleData[key] = item[key];
        }
      });
      return visibleData;
    },
    sortTable(column) {
      const header = this.headers.find((h) => h.value === column);
      if (header && header.sortable === false) {
        return;
      }

      if (this.sortKey === column) {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortKey = column;
        this.sortOrder = 'asc';
      }
    },
    checkScreenSize() {
      this.isMobile = window.innerWidth <= 600;
    },
  },
};
</script>
