import { defineStore } from 'pinia'

export const useGlobalStore = defineStore('global', {
    state: () => ({
        cuil: null,
        usuarioId: null,
        areaId: null,
        areaNombre: null,
        fullNameUsuario: null,
        rolId: null,
        rolName:null,
        esAdmin: false,
        logueado: false,
        areas: [],
        usuarios: [],
    }),
    actions: {
        setUsuario(cuil, usuarioId, areaId, areaNombre, fullNameUsuario, rolId,rolName, esAdmin, logueado) {
            this.cuil = cuil
            this.usuarioId = usuarioId
            this.areaId = areaId
            this.areaNombre= areaNombre,
            this.fullNameUsuario = fullNameUsuario
            this.rolId = rolId
            this.rolName = rolName
            this.esAdmin = esAdmin
            this.logueado = logueado
        }
        ,
        cargarAreasYUser(areas, usuarios){
            this.areas = areas
            this.usuarios= usuarios
            },

        logout() {
            this.cuil = null
            this.usuarioId = null
            this.areaId = null
            this.areaNombre= null
            this.fullNameUsuario = null
            this.rolId = null
            this.rolName=null
            this.esAdmin = false
            this.logueado = false
        }
    },
    getters: {
        getUsuarioCuil: (state) => state.cuil,
        getUsuarioId: (state) => state.usuarioId,
        getareaId: (state) => state.areaId,
        getAreaNombre: (state) => state.areaNombre,
        getFullNameUsuario: (state) => state.fullNameUsuario,
        getRolId: (state) => state.rolId,
        getRolName: (state) => state.rolName,
        getEsAdmin: (state) => state.esAdmin,
        getLogueado: (state) => state.logueado,
        getAreas: (state) => state.areas,
        getUsuarios: (state) => state.usuarios,
      }
})
