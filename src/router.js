import { createRouter, createWebHistory } from 'vue-router';

import Home from './componentes/Home.vue';
import ListadoDeMedicamentos from './componentes/ListadoDeMedicamentos.vue';
import CargaDeMedicamentos from './componentes/CargaDeMedicamentos.vue';
import RecuperarPassword from './componentes/RecuperarPassword.vue';
import Login from './componentes/Login.vue';
import Navbar from './componentes/Navbar.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/recuperar-password', component: RecuperarPassword },
  { path: '/navbar', component: Navbar },
  { path: '/home', component: Home },
  { path: '/listadoDeMedicamentos', component: ListadoDeMedicamentos },
  { path: '/cargaDeMedicamentos', component: CargaDeMedicamentos },
  { path: '/:pathMatch(.*)*', redirect: '/home' }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;


