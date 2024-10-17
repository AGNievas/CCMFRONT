import { defineStore } from 'pinia'

export const useGlobalStore = defineStore('global', {
    state: () => ({
        cuil: null,
        usuarioId: null,
        stockAreaId: null,
        fullNameUsuario: null,
        rolId:null,
        esAdmin: false,
        logueado: false,
    }),
    actions:{
        setUsuario(cuil,usuarioId, stockAreaId, fullNameUsuario, rolId,esAdmin,logueado){
            this.cuil= cuil
            this.usuarioId = usuarioId
            this.stockAreaId = stockAreaId
            this.fullNameUsuario = fullNameUsuario
            this.rolId = rolId
            this.esAdmin = esAdmin
            this.logueado = logueado
        }       
    },
    getters:{
        getUsuarioCuil: state => state.cuil,
        getUsuarioId: state => state.usuarioId,
        getStockAreaId: state => state.stockAreaId,
        getfullNameUsuario: state => state.fullNameUsuario,
        getRolId: state => state.rolId,
        getEsAdmin: state => state.esAdmin,
        getLogueado: state => state.logueado
    }
})