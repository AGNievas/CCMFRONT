import axiosInstance from "@/axios.js";

const URL = "/aplique";

const apliqueService = {
  async getAllAplique() {
    try {
      const response = await axiosInstance.get(URL, { withCredentials: true });
      return response.data.return;
    } catch (error) {
      console.error("Error al obtener Aplique:", error);
      return [];
    }
  },

  async getApliqueById(id) {
    try {
      const response = await axiosInstance.get(`${URL}/${id}`, {
        withCredentials: true,
      });
      return response.data.return;
    } catch (error) {
      console.error("Error al obtener Aplique:", error);
      return [];
    }
  },

  async getApliqueByHistorialId(historialId) {
    try {
      const response = await axiosInstance.get(`${URL}/historial/${historialId}`, {
        withCredentials: true,
      });
      return response.data.return;
    } catch (error) {
      console.error("Error al obtener Aplique:", error);
      return [];
    }
  },

  async getApliqueByDni(dni) {
    try {
      const response = await axiosInstance.get(`${URL}/dni/${dni}`, {
        withCredentials: true,
      });
      return response.data.return;
    } catch (error) {
      console.error("Error al obtener Aplique:", error);
      return [];
    }
  },

  async createAplique(dni, sku, cantidad, aplicante,stockAreaId) {
    try {
      const response = await axiosInstance.post(
        `${URL}`,
        { dni, sku, cantidad, aplicante,stockAreaId },
        { withCredentials: true }
      );

      return response.data.return;
    } catch (error) {
      console.error("Error al obtener Aplique:", error);
      return [];
    }
  },

  async updateAplique(id, dni,
    sku,
    cantidad,
    aplicante,
    fechaAplicacion) {
    try {
      const { data: ApliqueActualizado } = await axiosInstance.put(
        `${URL}/${id}`,
        { dni,
            sku,
            cantidad,
            aplicante,
            fechaAplicacion },
        { withCredentials: true }
      );

      return ApliqueActualizado;
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
      throw error;
    }
  },

  async deleteAplique(id) {
    try {
      const { data: ApliqueEliminado } = await axiosInstance.delete(
        `${URL}/${id}`,
        { withCredentials: true }
      );
      return ApliqueEliminado;
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
      throw error;
    }
  },
};

export default apliqueService;
