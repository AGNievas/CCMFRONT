<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="data"
      hide-default-header
    >
      <template v-slot:thead>
          <thead>
            <tr>
              <th class="table-header text-start" v-for="(value, key) in headers" :key="key">{{ value.text }}</th>
            </tr>
          </thead>
        </template>
      <!-- Filas de la tabla -->
      <template v-slot:item="{ item }">
        <tr>
          <td class="text-start" v-for="(value, key) in visibleColumns(item)" :key="key">{{ value }}</td>
          <td class="text-start acciones-cell">
            <!-- Botón de editar -->
            <v-btn icon small color="#0E3746" @click="$emit('edit', item)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <!-- Botón de eliminar -->
            <v-btn icon small color="red" @click="$emit('delete', item.id ? item.id : item.sku)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
            <!-- Botón de restaurar contraseña solo si es admin y es listado de usuarios -->
            <v-btn
              v-if="canRestorePassword"
              icon
              small
              color="blue"
              @click="$emit('restorePassword', item)"
            >
              <v-icon>mdi-cached</v-icon>
            </v-btn>
          </td>
        </tr>
      </template>
    </v-data-table>
  </div>
</template>

<script>
// Importar el store global (ejemplo usando Vuex o Pinia, ajusta según tu implementación)
import { useGlobalStore } from '@/stores/global'; // Ajusta según tu estructura

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
      required: true, // Se necesita saber si el listado es de usuarios
    },
  },
  computed: {
    canRestorePassword() {
      const globalStore = useGlobalStore();
      return this.isListadoUsuarios && globalStore.getEsAdmin == true; // Solo admin y listado de usuarios
    },
  },
  methods: {
    visibleColumns(item) {
      const visibleData = {};
      Object.keys(item).forEach(key => {
        if (key !== 'id') {
          visibleData[key] = item[key];
        }
      });
      return visibleData;
    },
  },
};
</script>
