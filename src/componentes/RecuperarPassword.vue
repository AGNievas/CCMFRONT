<template>
  <div>
    <!-- Manteniendo la navbar original con el color de fondo personalizado -->
    <v-app-bar :elevation="2" style="background-color: #A3DEC3;">
      <v-app-bar-title class="app-bar-title">Recuperar Contraseña</v-app-bar-title>
    </v-app-bar>

    <!-- Contenido principal modificado -->
    <v-container>
      <v-card class="recuperar-card">
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
            v-model="email"
            prepend-inner-icon="mdi-email"
            outlined
            readonly
            class="email-field"
          ></v-text-field>

          <!-- Enlace para volver al login -->
          <a @click="$router.push('/login')" class="recuperar-link">Volver al inicio de sesión</a>
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
      email: "vwilches@buenosaires.gob.ar", // Correo por defecto
    };
  },
};
</script>

<style scoped>
/* .v-container {
  max-width: 450px;
  margin: 0 auto;
  padding-top: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
} */
.v-container {
  max-width: 500px;
  margin: 0 auto;
  padding-top: 150px; 
}

.recuperar-card {
  padding: 40px 20px;
  border-radius: 16px;
  background-color: white;
  border: 1px solid #d9dcd1;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.lock-icon {
  font-size: 48px;
  color: #333;
  margin-bottom: 20px;
}

.recuperar-title {
  font-weight: bold;
  font-size: 20px;
  color: #333;
  margin-bottom: 10px;
}

.recuperar-text {
  font-size: 16px;
  color: #666;
  margin-bottom: 30px;
}

.email-field {
  background-color: #f5f5f5;
  border-radius: 8px;
  margin-bottom: 20px;
}

.recuperar-link {
  display: block;
  font-size: 14px;
  color: #5c4dff;
  text-decoration: none;
  cursor: pointer;
  margin-top: 20px;
}

.app-bar-title {
  font-weight: bold;
  color: #0E3746;
  font-size: 24px;
}
</style>
