import { defineStore } from 'pinia';

import stockAreaService from '@/componentes/servicios/stockAreaService';


export const stockAreaStore = defineStore('stockAreaStore',{
state:() =>({
    stockAreas: []

}),
actions:{
     setStockAreas(){
        this.stockAreas=  this.fetchStockAreas();
    },

    async fetchStockAreas(){
        try{
            const areas = await stockAreaService.getAllStockArea();
            if(areas){
                this.stockAreas= areas
            }   
        }catch(error){
            return error
        }
    }
}


})