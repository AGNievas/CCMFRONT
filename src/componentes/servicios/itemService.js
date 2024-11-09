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

  async  getItemsYDescripcionByStockAreaId(areaId) {
    try {
      console.log(areaId)
      const response = await axiosInstance.get(`${API_URL}/listado-items/${areaId}`, {withCredentials:true});
      
      return response.data;
    } catch (error) {
      console.error(`Error al obtener el items del Stock Area id : ${areaId} `, error);
      throw error;
    }
  },

  async  createItem(sku, descripcion, tipo_insumo, stock) {
    try {
      const stockAreaId = DEPOSITO_GENERAL;
      
      const response = await axiosInstance.post(API_URL ,{sku, descripcion, tipo_insumo, stock, stockAreaId},{withCredentials:true});
      
      return response.data.return;
    } catch (error) {
      console.error("Error al crear Items:", error);
      return [];
    }
  },
    
  async  updateItem(id,sku,stock) {
    try {
      
      const { data: itemActualizado } = await axiosInstance.put(`${API_URL}/${id}`, {sku,stock}, {withCredentials:true});
      
      return itemActualizado;
    } catch (error) {
      console.error("Error al actualizar el item:", error);
      throw error;
    }
  },
    
  async  deleteItem(id) {
    try {
      
      const {data: ItemEliminado} = await axiosInstance.delete(`${API_URL}/${id}`,{withCredentials:true});
      return ItemEliminado;
    } catch (error) {
      console.error("Error al eliminar el Item:", error);
      throw error;
    }
  },

  async  deleteItemsBySku(sku) {
    try {
      
      const {data: ItemEliminado} = await axiosInstance.delete(`${API_URL}/items/${sku}`,{withCredentials:true});
      return ItemEliminado;
    } catch (error) {
      console.error("Error al eliminar el Item:", error);
      throw error;
    }
  }
}


export default itemService;

 



