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
            <v-btn icon small color="#0E3746" @click="$emit('edit', item)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon small color="red" @click="$emit('delete', item.id ? item.id : item.sku)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
            <!-- Botón "Ver Historial Apliques" solo cuando NO es listado de apliques -->
            <v-btn
              v-if="!isListadoApliques"
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
      default: false, // Nueva propiedad para manejar el listado de apliques
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
