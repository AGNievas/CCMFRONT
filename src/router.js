import { createRouter, createWebHistory } from "vue-router";

import Home from "./componentes/Home.vue";
import ListadoDeMedicamentos from "./componentes/ListadoDeMedicamentos.vue";
import CargaDeMedicamentos from "./componentes/CargaDeMedicamentos.vue";
import RecuperarPassword from "./componentes/RecuperarPassword.vue";
import Login from "./componentes/Login.vue";
import InformacionUsuario from "./componentes/InformacionUsuario.vue";
import ConsultaAltaPacientes from "./componentes/ConsultaAltaPacientes.vue";
import ListarMedicamentos from "./componentes/ListarMedicamentos.vue";
import ListarPacientes from "./componentes/ListarPacientes.vue";
const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", name: "Login", component: Login },
  {
    path: "/recuperarPassword",
    name: "RecuperarPassword",
    component: RecuperarPassword,
  },
  { path: "/home", name: "Home", component: Home },
  {
    path: "/listadoDeMedicamentos",
    name: "ListadoDeMedicamentos",
    component: ListadoDeMedicamentos,
  },
  {
    path: "/cargaDeMedicamentos",
    name: "CargaDeMedicamentos",
    component: CargaDeMedicamentos,
  },
  {
    path: "/informacionUsuario",
    name: "InformacionUsuario",
    component: InformacionUsuario,
  },
  {
    path: "/consultaAltaPacientes",
    name: "ConsultaAltaPacientes",
    component: ConsultaAltaPacientes,
  },
  {
    path: "/listarMedicamentos",
    name: "ListarMedicamentosPrueba",
    component: ListarMedicamentos,
  },
  {
    path: "/listarPacientes",
    name: "ListarPacientes",
    component: ListarPacientes,
  },
  {
    path: "/",
    component: () => import("./componentes/Layout.vue"),
    children: [],
  },

  { path: "/:pathMatch(.*)*", redirect: "/login" }, // Ruta por defecto
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
