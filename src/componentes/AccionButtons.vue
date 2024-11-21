<template>
  <div class="df jcc">
    <v-btn title="Editar" class="btn-icon" v-if="canVerEdit && editable" icon dense x-small color="#0E3746" @click="$emit('edit', item)">
      <v-icon>mdi-pencil</v-icon>
    </v-btn>
    <v-btn title="Eliminar" class="btn-icon" v-if="canVerDelete && eliminable" icon small color="red" @click="$emit('delete', item.id ? item.id : item.sku ? item.sku : index)">
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

    <v-btn title="Ver Visitas" class="btn-icon" v-if="canVerVisitas" icon @click="$emit('ver-visitas', item)">
      <v-icon>mdi-history</v-icon>
    </v-btn>

    <v-btn title="Dar Alta" class="btn-icon" v-if="puedeDarAlta" :disabled="!puedeMostrarAlta" icon @click="$emit('dar-alta', item)">
      <v-icon>mdi-arrow-up</v-icon>
    </v-btn>

  </div>
</template>

<script>
export default {
  name: 'AccionButtons',
  props: {
    item: {
      type: Object,
      required: true
    },
    editable: Boolean,
    eliminable: Boolean,
    canVerEdit: Boolean,
    canVerDelete: Boolean,
    canRestorePassword: Boolean,
    canCreateAplique: Boolean,
    canVerHistorial: Boolean,
    canVerDetail: Boolean,
    canVerVisitas: Boolean,
    puedeDarAlta: Boolean
  },
emits:['edit', 'delete', 'restorePassword','ver-historial','crear-aplique','ver-items', 'ver-visitas', 'dar-alta'],
  
computed:{

    puedeMostrarAlta(){
      console.log(this.puedeDarAlta,"puedeDARALTA")
      console.log(this.item.fechaAlta, "FECHA ALTA ITEM")
      return !this.item.fechaAlta && this.puedeDarAlta
    }
  }
};
</script>
