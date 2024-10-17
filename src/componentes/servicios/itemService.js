
import axiosInstance from '@/axios';
const API_URL = "/item";


const itemService = { 

    async getAllItems() {
        try {
          const response = await axiosInstance.get(API_URL);
          return response.data;
        } catch (error) {
          console.error("Error al obtener Items:", error);
          return [];
        }
      },

      async  getItemById(id) {
        try {
          const response = await axiosInstance.get(`${API_URL}/${id}`);
          return response.data;
        } catch (error) {
          console.error(`Error al obtener el item id: ${id} `, error);
          throw error;
        }
      },
      
      async  getItemsBySku(sku) {
        try {
          const response = await axiosInstance.get(`${API_URL}/medicamento/${sku}`);
          return response.data;
        } catch (error) {
          console.error(`Error al obtener el item con sku: ${sku} `, error);
          throw error;
        }
      },



      async  getItemsYDescripcionByStockAreaId(stockAreaId) {
        try {
          const response = await axiosInstance.get(`${API_URL}/listado-items/${stockAreaId}`);
          return response.data;
        } catch (error) {
          console.error(`Error al obtener el items del Stock Area id : ${stockAreaId} `, error);
          throw error;
        }
      },
      
       async  updateMedicamento(id, medicamentoActualizado) {
        try {
          const {data} = await axiosInstance.put(`${URL}/${id}`, medicamentoActualizado);
          return data;
        } catch (error) {
          console.error("Error al actualizar el usuario:", error);
          throw error;
        }
      },
      
      // Función para eliminar un medicamento usando el id de MockAPI
       async  deleteMedicamento(id) {
        try {
          const url = `${URL}/${id}`;
          console.log(`Eliminando medicamento en: ${url}`); // Verificar URL
          await axiosInstance.delete(url);
        } catch (error) {
          console.error("Error al eliminar medicamento:", error.response ? error.response.data : error.message);
          throw error;
        }
      }
}


export default itemService;

 



