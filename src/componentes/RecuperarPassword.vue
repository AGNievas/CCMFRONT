<template>
  <div>
    <!-- Manteniendo la navbar original con el color de fondo personalizado -->
    <v-app-bar :elevation="2" style="background-color: #A3DEC3;">
      <v-app-bar-title class="headline">Recuperar Contraseña</v-app-bar-title>
    </v-app-bar>

    <!-- Contenido principal modificado -->
    <v-container>
      <v-card class="v-card">
        <v-card-text class="text-center">
          <!-- Icono del candado -->
          <v-icon large class="lock-icon">mdi-lock</v-icon>

          <!-- Título y subtítulo -->
          <h2 class="recuperar-title">¿Tienes problemas para iniciar sesión?</h2>
          <p class="recuperar-text">
            Comunicate con el administrador del aplicativo para solicitar el cambio de contraseña.
          </p>

          <!-- Campo de correo electrónico -->
          <v-text-field
            v-model="mail"
            prepend-inner-icon="mdi-email"
            outlined
            readonly
            class="mail-field"
          ></v-text-field>

          <!-- Enlace para volver al login -->
          <RouterLink to="/login" class="recuperar-link">Volver al inicio de sesión</RouterLink>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "RecuperarPassword",
  data() {
    return {
      mail: "vwilches@buenosaires.gob.ar", // Correo por defecto
    };
  },
};
</script>

<style scoped>
</style>
