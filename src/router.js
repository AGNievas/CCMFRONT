import { createRouter, createWebHistory } from "vue-router";
import Home from "./componentes/Home.vue";
import ListadoDeMedicamentos from "./componentes/ListadoDeMedicamentos.vue";
import CargaDeMedicamentos from "./componentes/CargaDeMedicamentos.vue";
import RecuperarPassword from "./componentes/RecuperarPassword.vue";
import Login from "./componentes/Login.vue";
import InformacionUsuario from "./componentes/InformacionUsuario.vue";
import ConsultaAltaPacientes from "./componentes/ConsultaAltaPacientes.vue";
import ListadoDeUsuarios from "./componentes/ListadoDeUsuarios.vue";
import ListadoApliques from "./componentes/ListadoApliques.vue";

import ListadoOrdenTransferencia from "./componentes/ListadoOrdenTransferencia.vue";
const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", name: "Login", component: Login , meta: { title: "Iniciar Sesión"} },
  { path: "/recuperarPassword", name: "RecuperarPassword", component: RecuperarPassword , meta: { title: "Recuperar Contraseña"}  },
  { path: "/home", name: "Home", component: Home },
  { path: "/listadoDeMedicamentos", name: "ListadoDeMedicamentos", component: ListadoDeMedicamentos,  meta: { title: "Listado de Medicamentos"} },
  { path: "/cargaDeMedicamentos", name: "CargaDeMedicamentos", component: CargaDeMedicamentos, meta: { title: "Importación Masiva"}  },
  { path: "/informacionUsuario", name: "InformacionUsuario", component: InformacionUsuario , meta: { title: "Información del Usuario"} },
  { path: "/consultaAltaPacientes", name: "ConsultaAltaPacientes", component: ConsultaAltaPacientes, meta: { title: "Consultar Paciente"} },
  { path: "/listadoDeUsuarios", name: "ListadoDeUsuarios", component: ListadoDeUsuarios , meta: { title: "Listado de Usuarios"} },
  
  { path: "/listadoDeOrdenesTransferencias", name: "ListadoDeOrdenesTransferencias", component: ListadoOrdenTransferencia , meta: { title: "Listado de Ordenes de Transferencias"} },
  {
    path: '/apliques/:pacienteId',
    name: 'ListadoDeApliques',
    component: ListadoApliques, 
    props: true, 
  },
 

  { path: "/:pathMatch(.)", redirect: "/login" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  document.title = 
  to.meta.title || "CCM - Control y Consumo de Medicamentos";
  next();
});

export default router;
