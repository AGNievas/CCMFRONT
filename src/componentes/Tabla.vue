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
            class="table-header"
            v-for="(header, index) in headers"
            :key="index"
            @click="sortTable(header.value)"
            style="cursor: pointer;"
          >
            {{ header.text }}
            <v-icon small v-if="index !== headers.length - 1">
              {{ sortKey === header.value ? (sortOrder === 'asc' ? 'mdi-arrow-up' : 'mdi-arrow-down') : 'mdi-filter-variant' }}
            </v-icon>
          </th>
        </tr>
      </thead>
    </template>

    <template v-slot:item="{ item }">
      <tr>
        <td class="text-start" v-for="(value, key) in visibleColumns(item)" :key="key">{{ value }}</td>
        <td class="text-start acciones-cell">
          <v-btn title="Editar" class="btn-icon" v-if="canVerEdit" icon dense x-small color="#0E3746" @click="$emit('edit', item)">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn title="Eliminar" class="btn-icon" v-if="canVerDelete" icon small color="red" @click="$emit('delete', item.id ? item.id : item.sku ? item.sku : index)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
          <v-btn title="Restaurar Contraseña" class="btn-icon" v-if="canRestorePassword" icon small color="blue" @click="$emit('restorePassword', item)">
            <v-icon>mdi-cached</v-icon>
          </v-btn>
          <v-btn title="Ver Historial de Apliques" class="btn-icon" v-if="canVerHistorial" icon small color="blue" @click="$emit('ver-historial', item)">
            <v-icon>mdi-file-document-outline</v-icon>
          </v-btn>
          <v-btn title="Agregar Aplique" class="btn-icon" v-if="canCreateAplique" icon small color="green" @click="$emit('crear-aplique', item)">
            <v-icon>mdi-pill</v-icon>
          </v-btn>
          <v-btn title="Ver Detalles" class="btn-icon" v-if="canVerDetail" icon @click="$emit('ver-items', item.id)">
            <v-icon>mdi-eye</v-icon>
          </v-btn>
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
    style="margin-bottom: 20px; padding: 10px;"
  >
    <v-card-text>
      <div v-for="(header, index) in headers" :key="header.value">
        <div v-if="index < (headers.length - 1)">{{ header.text }}:</div>
        <p class="text-h5 text--primary">{{ item[header.value] }}</p>
      </div>
    </v-card-text>

    <v-card-actions style="justify-content: center;">
      <v-btn text color="teal accent-4" @click="toggleCardExpansion(index)">
        {{ expandedCards[index] ? 'Cerrar' : 'Acciones' }}
      </v-btn>
    </v-card-actions>

    <v-expand-transition>
      <v-card
        v-if="expandedCards[index]"
        class="transition-fast-in-fast-out v-card--reveal"
      >
        <div style="display: flex; justify-content: center;">
          <v-btn title="Editar" class="btn-icon" v-if="canVerEdit" icon dense x-small color="#0E3746" @click="$emit('edit', item)">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn title="Eliminar" class="btn-icon" v-if="canVerDelete" icon small color="red" @click="$emit('delete', item.id ? item.id : item.sku ? item.sku : index)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
          <v-btn title="Restaurar Contraseña" class="btn-icon" v-if="canRestorePassword" icon small color="blue" @click="$emit('restorePassword', item)">
            <v-icon>mdi-cached</v-icon>
          </v-btn>
          <v-btn title="Ver Historial de Apliques" class="btn-icon" v-if="canVerHistorial" icon small color="blue" @click="$emit('ver-historial', item)">
            <v-icon>mdi-file-document-outline</v-icon>
          </v-btn>
          <v-btn title="Agregar Aplique" class="btn-icon" v-if="canCreateAplique" icon small color="green" @click="$emit('crear-aplique', item)">
            <v-icon>mdi-pill</v-icon>
          </v-btn>
          <v-btn title="Ver Detalles" class="btn-icon" v-if="canVerDetail" icon @click="$emit('ver-items', item.id)">
            <v-icon>mdi-eye</v-icon>
          </v-btn>
        </div>
        <v-card-actions style="justify-content: center;">
          <v-btn text color="teal accent-4" @click="toggleCardExpansion(index)">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-expand-transition>
  </v-card>
</div>
</template>

<script>
import { useGlobalStore } from '@/stores/global';

export default {
  name: 'Tabla',
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
      required: true,
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
    isEditable: {
      type: Boolean,
      default: false,
    },

  },
 
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
      return this.isListadoPacientes && this.globalStore.rolId != this.globalStore.getRolDataEntry
    },

    canVerHistorial() {
      return this.isListadoPacientes
    },

    canVerDetail() {
      return this.isListadoOrdenTransferencia && this.globalStore.rolId != this.globalStore.getRolDataEntry;
    },

    canVerEdit() {
      return (this.isListadoUsuarios && this.globalStore.getEsAdmin) ||
             (this.isListadoMedicamentos && this.globalStore.rolId !== this.globalStore.getRolDataEntry) ||
             (this.isListadoPacientes && this.globalStore.rolId !== this.globalStore.getRolDataEntry) ||
             (this.isListadoApliques && this.globalStore.rolId !== this.globalStore.getRolDataEntry) ||
             (this.isListadoOrdenTransferencia && this.globalStore.getEsAdmin) || this.isEditable;
    },

    canVerDelete() {
      return this.canVerEdit;
    }
  },

  methods: {
    toggleCardExpansion(index) {
      this.expandedCards[index] = !this.expandedCards[index];
    },
    loadExpandedCards(){
        this.expandedCards = new Array(this.data.length).fill(false); 
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
