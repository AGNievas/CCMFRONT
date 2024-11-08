import axiosInstance from "@/axios.js";

const URL = '/medicamento';

const medicamentosService = {

  async getAllMedicamento() {
    try {
      const response = await axiosInstance.get(`${URL}/`, { withCredentials: true });
      return response.data.return;
    } catch (error) {
      console.error("Error al obtener medicamentos:", error);
      return [];
    }
  },

  async getAllMedicamentoByStockAreaId(id) {
    try {
      
      const response = await axiosInstance.get(`/item/listado-items/${id}`, { withCredentials: true });
      
      return response.data.return;
    } catch (error) {
      console.error("Error al obtener medicamentos:", error);
      return [];
    }
  },

  async getMedicamentoBySku(sku) {
    try {
      const response = await axiosInstance.get(`${URL}/${sku}`, { withCredentials: true });
      return response.data.message;
    } catch (error) {
      console.error("Error al obtener medicamentos:", error);
      return [];
    }
  },

  async createMedicamento(sku, descripcion, tipoInsumo) {
    try {
      
      const response = await axiosInstance.post(`${URL}`,{sku,descripcion, tipoInsumo}, { withCredentials: true });
      
      return response.data.return;
    } catch (error) {
      console.error("Error al obtener medicamentos:", error);
      return [];
    }
  },

  async cargaMasivaMedicamento(filePath) {
    try {
      
      const response = await axiosInstance.post(`${URL}/carga-masiva`,{filePath}, { withCredentials: true });
      console.log(response.data)
      return response.data;
    } catch (error) {
      console.error("Error al obtener medicamentos:", error);
      return [];
    }
  },

  async updateMedicamento(sku, descripcion, tipoInsumo) {
    try {
      
      const { data: medicamentoActualizado } = await axiosInstance.put(`${URL}/${sku}`, { descripcion, tipoInsumo }, { withCredentials: true });
      
      return medicamentoActualizado;
    } catch (error) {
      console.error("Error al actualizar el Medicamento:", error);
      throw error;
    }
  },

  async deleteMedicamento(sku) {
    try {
      
      const { data: medicamentoEliminado } = await axiosInstance.delete(`${URL}/${sku}`, { withCredentials: true });
      return medicamentoEliminado;
    } catch (error) {
      console.error("Error al actualizar el Medicamento:", error);
      throw error;
    }
  }

}

export default medicamentosService;