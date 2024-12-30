<template>
  <v-container>
    <v-card>
      <v-card-text class="text-center">
        <v-icon large class="lock-icon">mdi-lock</v-icon>
        <h2 class="recuperar-title">¿Tienes problemas para iniciar sesión?</h2>
        <p class="recuperar-text">
          Comunicate con el administrador del aplicativo para solicitar el cambio de contraseña.
        </p>

        <v-text-field v-model="mail" prepend-inner-icon="mdi-email" readonly :append-inner-icon="'mdi-content-copy'"
          @click:append-inner="copyToClipboard" variant="solo" rounded dense></v-text-field>

        <RouterLink to="/login" class="recuperar-link">Volver al inicio de sesión</RouterLink>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "RecuperarPassword",
  data() {
    return {
      mail: "vwilches@buenosaires.gob.ar",
    };
  },
  methods: {
    copyToClipboard() {
      navigator.clipboard.writeText(this.mail);
    },
  },
};
</script>
