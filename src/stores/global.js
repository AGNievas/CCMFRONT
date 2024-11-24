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
        stockAreas:[],
        usuarios: [],
        roles:[],
        usuarioIdYNombre: {},
        ROL_ID_SUPER_ADMIN: 1,
        ROL_ID_ADMIN:2,
        ROL_ID_AUTORIZANTE:3,
        ROL_ID_DATA_ENTRY: 4,
        FARMACIA_ID: 1,

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
            this.esAdmin = this.rolId== this.ROL_ID_SUPER_ADMIN|| this.ROL_ID_ADMIN ? true : false
            this.logueado = logueado
            this.usuarioIdYNombre = {id: this.usuarioId, fullName: this.fullNameUsuario}
        }
        ,
        cargarAreasYUser(areas, usuarios, roles, stockAreas){
            this.areas = areas
            this.usuarios= usuarios
            this.roles= roles
            this.stockAreas= stockAreas
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
        getAreaId: (state) => state.areaId,
        getAreaNombre: (state) => state.areaNombre,
        getFullNameUsuario: (state) => state.fullNameUsuario,
        getRolId: (state) => state.rolId,
        getRolName: (state) => state.rolName,
        getEsAdmin: (state) => state.esAdmin,
        getLogueado: (state) => state.logueado,
        getAreas: (state) => state.areas,
        getStockAreas: (state) => state.stockAreas,
        getUsuarios: (state) => state.usuarios,
        getRoles:(state)=> state.roles,
        getRolSuperAdmin:(state) => state.ROL_ID_SUPER_ADMIN,
        getRolAdmin:(state)=> state.ROL_ID_ADMIN,
        getRolAutorizante:(state) => state.ROL_ID_AUTORIZANTE,
        getRolDataEntry:(state) => state.ROL_ID_DATA_ENTRY,
        getUsuarioIdYNombre:(state) => {state.usuarioId, state.fullNameUsuario} ,
        getFarmaciaId:(state) => state.FARMACIA_ID
      }
})
