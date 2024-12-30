import { createRouter, createWebHistory } from "vue-router";
import Home from "./componentes/Home.vue";
import ListadoDeMedicamentos from "./componentes/ListadoDeMedicamentos.vue";
import CargaDeMedicamentos from "./componentes/CargaDeMedicamentos.vue";
import RecuperarPassword from "./componentes/RecuperarPassword.vue";
import Login from "./componentes/Login.vue";
import InformacionUsuario from "./componentes/InformacionUsuario.vue";
import ConsultaAltaPacientes from "./componentes/ConsultaAltaPacientes.vue";
import ListadoDeUsuarios from "./componentes/ListadoDeUsuarios.vue";
import Reportes from "./componentes/Reportes.vue";
import ListadoOrdenTransferencia from "./componentes/ListadoOrdenTransferencia.vue";
import HojaInternacion from "./componentes/HojaInternacion.vue";
import { useGlobalStore } from "./stores/global";

const routes = [
  { path: "/", redirect: "/login" },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: { title: "Iniciar Sesión" },
  },

  {
    path: "/recuperarPassword",
    name: "RecuperarPassword",
    component: RecuperarPassword,
    meta: { title: "Recuperar Contraseña" },
  },

  { path: "/home", name: "Home", component: Home },

  {
    path: "/listadoDeMedicamentos",
    name: "ListadoDeMedicamentos",
    component: ListadoDeMedicamentos,
    meta: { title: "Listado de Medicamentos", areasPermitidas: ["Farmacia"] },
  },

  {
    path: "/cargaDeMedicamentos",
    name: "CargaDeMedicamentos",
    component: CargaDeMedicamentos,
    meta: {
      title: "Importación Masiva",
      rolesPermitidos: ["Super Admin", "Admin"],
      areasPermitidas: ["Farmacia"],
    },
  },

  {
    path: "/informacionUsuario",
    name: "InformacionUsuario",
    component: InformacionUsuario,
    meta: { title: "Información del Usuario" },
  },

  {
    path: "/consultaAltaPacientes",
    name: "ConsultaAltaPacientes",
    component: ConsultaAltaPacientes,
    meta: { title: "Consultar Paciente" },
  },

  {
    path: "/listadoDeUsuarios",
    name: "ListadoDeUsuarios",
    component: ListadoDeUsuarios,
    meta: {
      title: "Listado de Usuarios",
      rolesPermitidos: ["Super Admin", "Admin"],
    },
  },

  {
    path: "/listadoDeOrdenesTransferencias",
    name: "ListadoDeOrdenesTransferencias",
    component: ListadoOrdenTransferencia,
    meta: {
      title: "Listado de Ordenes de Transferencias",
      areasPermitidas: ["Farmacia"],
    },
  },
  {
    path: "/reportes",
    name: "Reportes",
    component: Reportes,
    meta: {
      title: "Reportes de Apliques por fechas",
      rolesPermitidos: ["Super Admin"],
    },
  },

  {
    path: "/hojaInternacion",
    name: "HojaInternacion",
    component: HojaInternacion,
    meta: { title: "Hoja de Internacion" },
  },

  { path: "/:pathMatch(.)", redirect: "/login" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const globalStore = useGlobalStore();

  document.title = to.meta.title || "CCM - Control y Consumo de Medicamentos";

  if (!to.meta.rolesPermitidos && !to.meta.areasPermitidas) {
    return next();
  }

  const userRol = globalStore.getRolName;
  const userArea = globalStore.getAreaNombre;

  if (to.meta.rolesPermitidos && !to.meta.rolesPermitidos.includes(userRol)) {
    console.warn("Acceso denegado: rol no permitido para esta ruta");
    return next("/home");
  }
  if (to.meta.areasPermitidas && !to.meta.areasPermitidas.includes(userArea)) {
    console.warn("Acceso denegado: área no permitida para esta ruta");
    return next("/home");
  }

  next();
});

export default router;
