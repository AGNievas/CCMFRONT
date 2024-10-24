
import axiosInstance from '@/axios';
const API_URL = "/item";

  const DEPOSITO_GENERAL = 1;

const itemService = { 
     
    async getAllItem() {
        try {
          const response = await axiosInstance.get(API_URL, {withCredentials:true});
          return response.data.return;
        } catch (error) {
          console.error("Error al obtener Items:", error);
          return [];
        }
      },

      async  getItemById(id) {
        try {
          const response = await axiosInstance.get(`${API_URL}/${id}`, {withCredentials:true});
          return response.data;
        } catch (error) {
          console.error(`Error al obtener el item id: ${id} `, error);
          throw error;
        }
      },
      
      async  getItemsBySku(sku) {
        try {
          const response = await axiosInstance.get(`${API_URL}/Item/${sku}`, {withCredentials:true});
          return response.data;
        } catch (error) {
          console.error(`Error al obtener el item con sku: ${sku} `, error);
          throw error;
        }
      },



      async  getItemsYDescripcionByStockAreaId(stockAreaId) {
        try {
          const response = await axiosInstance.get(`${API_URL}/listado-items/${stockAreaId}`, {withCredentials:true});
          return response.data;
        } catch (error) {
          console.error(`Error al obtener el items del Stock Area id : ${stockAreaId} `, error);
          throw error;
        }
      },

     

      async  createItem(sku, descripcion, tipo_insumo, stock) {
        try {
          const stockAreaId = DEPOSITO_GENERAL;
          console.log(sku, descripcion, tipo_insumo, stock, "crear item front")
          const response = await axiosInstance.post(API_URL ,{sku, descripcion, tipo_insumo, stock, stockAreaId},{withCredentials:true});
          console.log("DespcrearItemPostResponse",response)
          return response.data.return;
        } catch (error) {
          console.error("Error al obtener Items:", error);
          return [];
        }
      },
      
      async  updateItem(id,sku,stock) {
        try {
          const { data: itemActualizado } = await axiosInstance.put(`${API_URL}/${id}`, {sku,stock}, {withCredentials:true});
          console.log("DespuesItemPuttResponse")
          return itemActualizado;
        } catch (error) {
          console.error("Error al actualizar el item:", error);
          throw error;
        }
      },
      
      
      async  deleteItem(id) {
        try {
          console.log("antesDeleteItem", id)
          const {data: ItemEliminado} = await axiosInstance.delete(`${URL}/${id}`,{withCredentials:true});
          return ItemEliminado;
        } catch (error) {
          console.error("Error al actualizar el usuario:", error);
          throw error;
        }
      }
}


export default itemService;

 



