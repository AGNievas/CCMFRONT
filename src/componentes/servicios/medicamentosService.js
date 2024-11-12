import axiosInstance from "@/axios.js";

const URL = '/medicamento';

const medicamentosService = {

  async getAllMedicamento() {
    try {
      const response = await axiosInstance.get(`${URL}/stock`, { withCredentials: true });
      return response.data.message;
    } catch (error) {
      console.error("Error al obtener medicamentos:", error);
      return [];
    }
  },

  async getMedicamentosByAreaId(id) {
    try {
      const response = await axiosInstance.get(`${URL}/stock?areaId=${id}`, { withCredentials: true });
      return response.data.message;
    } catch (error) {
      console.error("Error al obtener medicamentos:", error);
      return [];
    }
  },

  async getAllMedicamentoByStockAreaId(areaId, stockAreaId) {
    try {
      const response = await axiosInstance.get(`${URL}/stock?areaId=${areaId}&stockAreaId=${stockAreaId}`, { withCredentials: true });
      return response.data.message;
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

  async createMedicamento(sku, descripcion, tipo_medicamento) {
    try {
      const response = await axiosInstance.post(`${URL}`,{sku,descripcion, tipo_medicamento}, { withCredentials: true });
      return response.data.return;
    } catch (error) {
      console.error("Error al crear medicamentos:", error);
      return [];
    }
  },

  async cargaMasivaMedicamento(filePath) {
    try {
      const response = await axiosInstance.post(`${URL}/carga-masiva`,{filePath}, { withCredentials: true });
      return response.data;
    } catch (error) {
      console.error("Error en carga masiva:", error);
      return [];
    }
  },

  async updateMedicamento(sku, descripcion, tipo_medicamento) {
    try {
      console.log("ASDASDAS ", sku, descripcion, tipo_medicamento)
      const { data: medicamentoActualizado } = await axiosInstance.put(`${URL}/${sku}`, { descripcion, tipo_medicamento }, { withCredentials: true });
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
      console.error("Error al eliminar el Medicamento:", error);
      throw error;
    }
  }
}

export default medicamentosService;