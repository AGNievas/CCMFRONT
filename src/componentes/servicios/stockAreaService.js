import axiosInstance from "@/axios.js";

const URL = '/stock-area'; // URL base

const stockAreaService = {

  async getAllStockArea() {
    try {
      
      const response = await axiosInstance.get(`${URL}/`, { withCredentials: true });
      
      return response.data.return;
    } catch (error) {
      console.error("Error al obtener stockArea:", error);
      return [];
    }
  },

  async getStockAreaById(id) {
    try {
     
      const response = await axiosInstance.get(`${URL}/id/${id}`, { withCredentials: true });
      
      return response.data.return;
    } catch (error) {
      console.error("Error al obtener stockArea:", error);
      return [];
    }
  },

  async getStockAreaByNombre(nombre) {
    try {
      const response = await axiosInstance.get(`${URL}/nombre/${nombre}`, { withCredentials: true });
      return response.data.return;
    } catch (error) {
      console.error("Error al obtener stockArea:", error);
      return [];
    }
  },

  async createStockArea(nombre) {
    try {
      const response = await axiosInstance.post(`${URL}`, { nombre }, { withCredentials: true });
      return response.data.return;
    } catch (error) {
      console.error("Error al obtener stockArea:", error);
      return [];
    }
  },

  async deleteStockArea(id) {
    try {
      const { data: StockAreaEliminado } = await axiosInstance.delete(`${URL}/${id}`, { withCredentials: true });
      return StockAreaEliminado;
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
      throw error;
    }
  }

}

export default stockAreaService;