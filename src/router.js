import { createRouter, createWebHistory } from 'vue-router';

import Home from './componentes/Home.vue';
import ListadoDeMedicamentos from './componentes/ListadoDeMedicamentos.vue';
import CargaDeMedicamentos from './componentes/CargaDeMedicamentos.vue';
import RecuperarPassword from './componentes/RecuperarPassword.vue';
import Login from './componentes/Login.vue';
import InformacionUsuario from './componentes/InformacionUsuario.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'Login', component: Login },
  { path: '/recuperarPassword', name: 'RecuperarPassword', component: RecuperarPassword },
  
  // Agrupar rutas que necesitan la navbar
  {
    path: '/',
    component: () => import('./componentes/Layout.vue'), // Importa el layout que contiene la navbar
    children: [
      { path: 'home', name: 'Home', component: Home },
      { path: 'listadoDeMedicamentos', name: 'ListadoDeMedicamentos', component: ListadoDeMedicamentos },
      { path: 'cargaDeMedicamentos', name: 'CargaDeMedicamentos', component: CargaDeMedicamentos },
      { path: 'informacionUsuario', name: 'InformacionUsuario', component: InformacionUsuario },
    ]
  },
  
  { path: '/:pathMatch(.*)*', redirect: '/login' } // Ruta por defecto
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
