<template>
  <v-data-table
    :headers="headers"
    :items="sortedData"
    hide-default-header
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
              <!-- Icono que cambia según el orden actual -->
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
          <v-btn class="btn-icon" v-if="canVerEdit" icon dense x-small color="#0E3746" @click="$emit('edit', item)">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn class="btn-icon" v-if="canVerDelete" icon small color="red" @click="$emit('delete', item.id ? item.id : item.sku ? item.sku : index)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
          <v-btn class="btn-icon" v-if="canRestorePassword" icon small color="blue" @click="$emit('restorePassword', item)">
            <v-icon>mdi-cached</v-icon>
          </v-btn>
          <v-btn class="btn-icon" v-if="canVerHistorial" icon small color="blue" @click="$emit('ver-historial', item)">
            <v-icon>mdi-file-document-outline</v-icon>
          </v-btn>
          <v-btn class="btn-icon" v-if="canCreateAplique" icon small color="green" @click="$emit('crear-aplique', item)">
            <v-icon>mdi-pill</v-icon>

            
          </v-btn>
          <v-btn class="btn-icon" v-if="canVerDetail" icon @click="$emit('ver-items', item.id)">
  <v-icon>mdi-eye</v-icon>
</v-btn>
        </td>
      </tr>
    </template>
  </v-data-table>
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
  mounted(){
    console.log("es orden transferencia?",this.isListadoOrdenTransferencia)
  },

  data() {
    return {
      ROL_ID_USER: 3,
      globalStore: useGlobalStore(),
      sortKey: null,       // Columna seleccionada para ordenar
      sortOrder: 'asc',    // Orden de clasificación (asc o desc)
    };
  },

  computed: {
    // Lista de items ordenados según la columna y orden seleccionados
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

      return this.isListadoPacientes && this.globalStore.rolId != this.ROL_ID_USER
    },

    canVerHistorial() {

      return this.isListadoPacientes
    },

    canVerDetail() {
      return this.isListadoOrdenTransferencia && this.globalStore.rolId != this.ROL_ID_USER;
    },

    canVerEdit() {
      return (this.isListadoUsuarios && this.globalStore.getEsAdmin) ||
             (this.isListadoMedicamentos && this.globalStore.rolId !== this.ROL_ID_USER) ||
             (this.isListadoPacientes && this.globalStore.rolId !== this.ROL_ID_USER) ||
             (this.isListadoApliques && this.globalStore.rolId !== this.ROL_ID_USER) ||
             (this.isListadoOrdenTransferencia && this.globalStore.getEsAdmin) || this.isEditable;
    },

    canVerDelete() {
      return this.canVerEdit;
    }
  },

  methods: {
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

    // Método para alternar la clasificación por columnas
    sortTable(column) {
      if (this.sortKey === column) {
        // Cambia el orden si ya está seleccionada la columna
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        // Cambia la columna y establece el orden en ascendente
        this.sortKey = column;
        this.sortOrder = 'asc';
      }
    },
  },
};
</script>

<style scoped>
.table-header {
  cursor: pointer;
}
</style>
