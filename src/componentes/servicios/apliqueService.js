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

  async getApliquesByPacienteId(pacienteId) {
    try {
      const response = await axiosInstance.get(
        `${URL}/paciente/${pacienteId}`,
        {
          withCredentials: true,
        }
      );

      return response.data.message;
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

  async createAplique(pacienteId, nuevoAplique) {
    try {
      const { sku, cantidad, aplicante, stockAreaId, fechaAplicacion } =
        nuevoAplique;

      const response = await axiosInstance.post(
        `${URL}`,
        { pacienteId, sku, cantidad, aplicante, stockAreaId, fechaAplicacion },
        { withCredentials: true }
      );

      return response.data.message;
    } catch (error) {
      console.error("Error al obtener Aplique:", error);
      return [];
    }
  },

  async updateAplique(pacienteId, aplique) {
    try {
      const { sku, aplicante, stockAreaId, fechaAplicacion, id } = aplique;

      const response = await axiosInstance.put(
        `${URL}/${id}`,
        {
          pacienteId,
          sku,
          aplicante,
          stockAreaId,
          fechaAplicacion,
        },
        { withCredentials: true }
      );

      return response.data.message;
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
