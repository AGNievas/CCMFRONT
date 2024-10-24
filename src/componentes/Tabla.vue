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
      
      <template v-slot:item="{ item }">
        <tr>
          <td class="text-start" v-for="(value, key) in visibleColumns(item)" :key="key">{{ value }}</td>
          <td class="text-start acciones-cell">
            <v-btn v-if="canVerEdit" icon small color="#0E3746" @click="$emit('edit', item)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn v-if="canVerDelete" icon small color="red" @click="$emit('delete', item.id ? item.id : item.sku)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
            <!-- Botón "Ver Historial Apliques" solo cuando NO es listado de apliques -->
           
            <v-btn
              v-if="canRestorePassword"
              icon
              small
              color="blue"
              @click="$emit('restorePassword', item)"
            >
              <v-icon>mdi-cached</v-icon>
            </v-btn>

            <v-btn
              v-if="canVerHistorial"
              icon
              small
              color="blue"
              @click="$emit('ver-historial', item)"
            >
            
              <v-icon>mdi-history</v-icon>
            </v-btn>
          </td>
        </tr>
      </template>
    </v-data-table>
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
  },

  mounted(){
    console.log(this.isListadoPacientes,"es apliqe")
  },

  computed: {
    canRestorePassword() {
      const globalStore = useGlobalStore();
      return this.isListadoUsuarios && globalStore.getEsAdmin == true; // Solo admin y listado de usuarios
    },

    canVerHistorial() {
      
      return this.isListadoPacientes; 
    },

    canVerEdit(){
      const globalStore = useGlobalStore();
      return this.isListadoUsuarios && globalStore.getEsAdmin == true || this.isListadoMedicamentos || this.isListadoPacientes || this.isListadoApliques
    },
    canVerDelete(){
      const globalStore = useGlobalStore();
      return this.isListadoUsuarios && globalStore.getEsAdmin == true || this.isListadoMedicamentos || this.isListadoPacientes || this.isListadoApliques
    }
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
