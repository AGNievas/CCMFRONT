// src/services/medicamentos.js

import axiosInstance from "@/axios.js";

const URL = '/medicamento'; // URL base



const medicamentosService = {

  async getAllMedicamento() {
    try {
      const response = await axiosInstance.get(URL,{withCredentials:true}) ;
      return response.data.return;
    } catch (error) {
      console.error("Error al obtener medicamentos:", error);
      return [];
    }
  },


  async  getMedicamentoBySku(sku) {
    try {
      console.log("crearMedicamentoPostResponse")
      const response = await axiosInstance.get(`${URL}/${sku}`,{withCredentials:true});
      return response.data.return;
    } catch (error) {
      console.error("Error al obtener medicamentos:", error);
      return [];
    }
  },

  async  createMedicamento(sku, descripcion, tipoInsumo) {
    try {
      console.log("crearMedicamentoPostResponse")
      const response = await axiosInstance.post(`${URL}`,{sku,descripcion, tipoInsumo},{withCredentials:true});
      console.log("crearMedicamentoPostResponse",response.data.return)
      return response.data.return;
    } catch (error) {
      console.error("Error al obtener medicamentos:", error);
      return [];
    }
  },

  async  cargaMasivaMedicamento(filePath) {
    try {
      console.log("cargaMasivaAntesResponse")
      const response = await axiosInstance.post(`${URL}`,{filePath},{withCredentials:true});
      console.log("cargaMasivaPostResponse",response.data.return)
      return response.data.return;
    } catch (error) {
      console.error("Error al obtener medicamentos:", error);
      return [];
    }
  },



  async  updateMedicamento(sku, descripcion, tipoInsumo) {
    try {
      console.log("antesUpdateMedicamento", sku,descripcion,tipoInsumo)
      const {data: medicamentoActualizado} = await axiosInstance.put(`${URL}/${sku}`, {descripcion, tipoInsumo},{withCredentials:true});
      console.log("despuesUpdateMedicamento", medicamentoActualizado)
      return medicamentoActualizado;
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
      throw error;
    }
  },

  async  deleteMedicamento(sku) {
    try {
      console.log("antesDeleteMedicamento", sku)
      const {data: medicamentoEliminado} = await axiosInstance.delete(`${URL}/${sku}`,{withCredentials:true});
      return medicamentoEliminado;
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
      throw error;
    }
  }

}



export default medicamentosService;