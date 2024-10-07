<template>
  <div>
    <v-app-bar :elevation="2" class="navbar">
      <template v-slot:prepend>
        <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      </template>

      <v-app-bar-title class="navbar-title">Control y Carga de Medicamentos</v-app-bar-title>

      <template v-slot:append>
        <v-btn
          v-if="isSessionActive"
          icon="mdi-account-circle"
          @click="changeView('listadoDeMedicamentos')"
          class="navbar-icon"
        ></v-btn>
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
        <v-list-item
          v-for="item in items"
          :key="item.value"
          @click="changeView(item.value)"
        >
          <v-list-item-title class="drawer-item-title">
            {{ item.title }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    
    <br>
    <component :is="currentViewComponent" />
  </div>
</template>

<script>
import Home from './Home.vue';
import ListadoDeMedicamentos from './ListadoDeMedicamentos.vue';
import CargaDeMedicamentos from './CargaDeMedicamentos.vue';

export default {
  name: 'src-componentes-navbar',
  components: {
    Home,
    ListadoDeMedicamentos,
    CargaDeMedicamentos,
  },
  data() {
    return {
      drawer: false,
      currentView: 'inicio',
      isSessionActive: false,
      items: [
        {
          title: 'Inicio',
          value: 'inicio',
        },
        {
          title: 'Carga De Medicamentos',
          value: 'cargaDeMedicamentos',
        },
        {
          title: 'Listado De Medicamentos',
          value: 'listadoDeMedicamentos',
        },

      ],
    };
  },
  computed: {
    currentViewComponent() {
      switch (this.currentView) {
        case 'listadoDeMedicamentos':
          return 'ListadoDeMedicamentos';
        case 'cargaDeMedicamentos':
          return 'CargaDeMedicamentos';
        default:
          return 'Home';
      }
    },
  },
  methods: {
    changeView(view) {
      this.currentView = view;
      this.drawer = false;
    },
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
}


</style>
