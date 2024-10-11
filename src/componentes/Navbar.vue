<template>
  <div>
    <v-app-bar :elevation="2" class="navbar">
      <template v-slot:prepend>
        <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      </template>

      <v-app-bar-title class="navbar-title">Control y Carga de Medicamentos</v-app-bar-title>

      <template v-slot:append>
        <RouterLink v-if="isSessionActive" :to="{ name: 'InformacionUsuario' }">
          <v-btn icon="mdi-account-circle" class="navbar-icon"></v-btn>
        </RouterLink>
        <v-btn icon @click="logout" class="navbar-icon">
          <v-icon v-if="isSessionActive">mdi-export</v-icon>
          <v-icon v-else>mdi-account</v-icon>
        </v-btn>
      </template>
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      :location="$vuetify.display.mobile ? 'bottom' : undefined"
      temporary
      class="drawer"
    >
      <v-list>
        <v-list-item>
          <RouterLink to="/home" class="drawer-item-title">Inicio</RouterLink>
        </v-list-item>
        <v-list-item>
          <RouterLink to="/cargaDeMedicamentos" class="drawer-item-title">Carga De Medicamentos</RouterLink>
        </v-list-item>
        <v-list-item>
          <RouterLink to="/listadoDeMedicamentos" class="drawer-item-title">Listado De Medicamentos</RouterLink>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    
    <br>

  </div>
</template>

<script>
export default {
  name: 'src-componentes-navbar',
  data() {
    return {
      drawer: false,
      isSessionActive: false,
    };
  },
  methods: {
    logout() {
      if (this.isSessionActive) {
        localStorage.removeItem('session');
        this.isSessionActive = false;
      }
      this.$router.push('/login');
    },
  },
  mounted() {
    this.isSessionActive = !!localStorage.getItem('session');
  },
};
</script>

<style scoped>
.navbar {
  background-color: #A3DEC3;
  height: 64px; /* Ajusta esto según la altura que necesites */
}

.navbar-icon {
  color: #0E3746;
}

.navbar-title {
  color: #0E3746;
  font-weight: bold;
}

.drawer {
  background-color: #A3DEC3;
}

.drawer-item-title {
  color: #0E3746;
  text-decoration: none;
}
</style>
