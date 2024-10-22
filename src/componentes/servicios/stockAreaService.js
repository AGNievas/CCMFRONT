import axiosInstance from "@/axios.js";

const URL = '/stock-area'; // URL base

const stockAreaService = {

  async getAllStockArea() {
    try {
      // console.log("llega aca?")
      const response = await axiosInstance.get(`${URL}/`, { withCredentials: true });
      // console.log(response.data.message.result)
      return response.data.return;
    } catch (error) {
      console.error("Error al obtener stockArea:", error);
      return [];
    }
  },

  async getStockAreaById(id) {
    try {
      console.log("crearStockAreaPostResponse")
      const response = await axiosInstance.get(`${URL}/id/${id}`, { withCredentials: true });
      console.log(response.data)
      return response.data.message;
    } catch (error) {
      console.error("Error al obtener stockArea:", error);
      return [];
    }
  },

  async getStockAreaByNombre(nombre) {
    try {
      console.log("crearStockAreaPostResponse")
      const response = await axiosInstance.get(`${URL}/nombre/${nombre}`, { withCredentials: true });
      return response.data.return;
    } catch (error) {
      console.error("Error al obtener stockArea:", error);
      return [];
    }
  },

  async createStockArea(nombre) {
    try {
      console.log("crearStockAreaPostResponse")
      const response = await axiosInstance.post(`${URL}`, { nombre }, { withCredentials: true });
      console.log("crearStockAreaPostResponse", response.data.return)
      return response.data.return;
    } catch (error) {
      console.error("Error al obtener stockArea:", error);
      return [];
    }
  },

  async deleteStockArea(id) {
    try {
      console.log("antesDeleteStockArea", id)
      const { data: StockAreaEliminado } = await axiosInstance.delete(`${URL}/${id}`, { withCredentials: true });
      return StockAreaEliminado;
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
      throw error;
    }
  }

}

export default stockAreaService;