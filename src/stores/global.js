import { defineStore } from 'pinia'

export const useGlobalStore = defineStore('global', {
    state: () => ({
        cuil: null,
        usuarioId: null,
        stockAreaId: null,
        stockAreaName: null,
        fullNameUsuario: null,
        rolId: null,
        esAdmin: false,
        logueado: false,
    }),
    actions: {
        setUsuario(cuil, usuarioId, stockAreaId, fullNameUsuario, rolId, esAdmin, logueado) {
            this.cuil = cuil
            this.usuarioId = usuarioId
            this.stockAreaId = stockAreaId
            this.stockAreaName= null,
            this.fullNameUsuario = fullNameUsuario
            this.rolId = rolId
            this.esAdmin = esAdmin
            this.logueado = logueado
        }
        ,
        logout() {
            this.cuil = null
            this.usuarioId = null
            this.stockAreaId = null
            this.stockAreaName= null
            this.fullNameUsuario = null
            this.rolId = null
            this.esAdmin = false
            this.logueado = false
        }
    },
    getters: {
        getUsuarioCuil: state => state.cuil,
        getUsuarioId: state => state.usuarioId,
        getStockAreaId: state => state.stockAreaId,
        getStockAreaName: state=> state.stockAreaName,
        getfullNameUsuario: state => state.fullNameUsuario,
        getRolId: state => state.rolId,
        getEsAdmin: state => state.esAdmin,
        getLogueado: state => state.logueado
    }
})